import { createFileRoute } from "@tanstack/react-router";

type Body = {
  room?: string;
  furniture?: string;
  name?: string;
  spot?: { x: number; y: number } | null;
  note?: string;
};

function describeSpot(spot: Body["spot"]) {
  if (!spot) return "in the most natural free area of the room";
  const horizontal = spot.x < 33 ? "left" : spot.x > 66 ? "right" : "horizontally centered";
  const vertical = spot.y < 40 ? "far / background" : spot.y > 72 ? "near / foreground" : "middle-depth";
  return `at roughly ${Math.round(spot.x)}% from the left and ${Math.round(spot.y)}% from the top of the photo (${horizontal} side, ${vertical} part of the room)`;
}

export const Route = createFileRoute("/api/room-compose")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { room, furniture, name = "furniture piece", spot = null, note = "" } =
          (await request.json()) as Body;

        if (!room?.startsWith("data:image/") || !furniture?.startsWith("data:image/")) {
          return new Response(JSON.stringify({ error: "Oda fotoğrafı ve mobilya görseli gerekli" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const prompt = [
          "You are given two images. IMAGE 1 is a photo of a real room. IMAGE 2 is a furniture product photo",
          `("${name}").`,
          "Edit IMAGE 1 so that the furniture piece from IMAGE 2 is placed inside that room",
          `${describeSpot(spot)}.`,
          "Keep the room exactly as it is: same walls, floor, windows, existing objects, camera angle, perspective and lighting.",
          "Only add the furniture piece. Match its scale to the room, align it to the floor plane and perspective,",
          "relight it with the room's own light direction and color temperature, and add a realistic contact shadow.",
          "Keep the furniture's real design, materials and colors from IMAGE 2. Photorealistic interior photograph result, same dimensions as IMAGE 1.",
          note ? `Additional request from the client: ${note}` : "",
        ]
          .filter(Boolean)
          .join(" ");

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: room } },
                  { type: "image_url", image_url: { url: furniture } },
                ],
              },
            ],
            modalities: ["image", "text"],
          }),
        });

        if (!upstream.ok) {
          const text = await upstream.text().catch(() => "");
          return new Response(JSON.stringify({ error: text || "Görsel oluşturulamadı" }), {
            status: upstream.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        const json = (await upstream.json()) as { data?: { b64_json?: string }[] };
        const b64 = json.data?.[0]?.b64_json;
        if (!b64) {
          return new Response(JSON.stringify({ error: "Görsel oluşturulamadı" }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          });
        }

        return Response.json({ image: `data:image/png;base64,${b64}` });
      },
    },
  },
});
