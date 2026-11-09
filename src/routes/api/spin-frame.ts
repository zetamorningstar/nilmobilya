import { createFileRoute } from "@tanstack/react-router";

type Body = {
  image?: string;
  angle?: number;
  name?: string;
};

export const Route = createFileRoute("/api/spin-frame")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { image, angle = 0, name = "furniture piece" } = (await request.json()) as Body;
        if (!image || !image.startsWith("data:image/")) {
          return new Response(JSON.stringify({ error: "Geçersiz görsel" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const prompt = [
          `Render the exact same furniture piece shown in the image ("${name}"), rotated ${angle} degrees around its vertical axis,`,
          "as if photographed on a turntable. Keep the identical design, proportions, materials, upholstery texture, colors, stitching and legs.",
          "Do not redesign or replace the piece. Studio product photograph, dark charcoal seamless background, soft warm key light from the upper left,",
          "the piece centered, full piece visible, same camera height and distance, same framing and image dimensions as the reference.",
        ].join(" ");

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3.1-flash-image",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: image } },
                ],
              },
            ],
            modalities: ["image", "text"],
          }),
        });

        if (!upstream.ok) {
          const text = await upstream.text().catch(() => "");
          return new Response(JSON.stringify({ error: text || "Görsel üretilemedi" }), {
            status: upstream.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        const json = (await upstream.json()) as { data?: { b64_json?: string }[] };
        const b64 = json.data?.[0]?.b64_json;
        if (!b64) {
          return new Response(JSON.stringify({ error: "Görsel üretilemedi" }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          });
        }

        return Response.json({ image: `data:image/png;base64,${b64}` });
      },
    },
  },
});
