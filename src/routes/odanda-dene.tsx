import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Sparkles, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { collections } from "@/lib/collections";
import { fileToDataUrl, toDataUrl } from "@/lib/image-data";

type Search = { parca?: string | undefined };

export const Route = createFileRoute("/odanda-dene")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    parca: typeof search["parca"] === "string" ? (search["parca"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Odanızda Deneyin | Nil Mobilya" },
      {
        name: "description",
        content:
          "Odanızın fotoğrafını yükleyin, beğendiğiniz Nil Mobilya parçasını seçin ve yapay zekâ ile evinizde nasıl duracağını görün.",
      },
      { property: "og:title", content: "Odanızda Deneyin | Nil Mobilya" },
      {
        property: "og:description",
        content: "Yapay zekâ ile mobilyayı kendi odanızın fotoğrafında görün.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TryAtHome,
});

type Piece = {
  key: string;
  name: string;
  material: string;
  image: string;
  collection: string;
};

const pieces: Piece[] = collections.flatMap((collection) =>
  collection.products.map((product) => ({
    key: `${collection.slug}-${product.name}`,
    name: product.name,
    material: product.material,
    image: product.image,
    collection: collection.title,
  })),
);

function TryAtHome() {
  const { parca } = Route.useSearch();
  const initial = useMemo(
    () => (pieces.find((piece) => piece.name === parca) ?? pieces[0]) as Piece,
    [parca],
  );

  const [selected, setSelected] = useState(initial);
  const [room, setRoom] = useState<string | null>(null);
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);
  const [note, setNote] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setResult(null);
    setSpot(null);
    try {
      setRoom(await fileToDataUrl(file));
    } catch {
      setError("Fotoğraf okunamadı. Lütfen başka bir görsel deneyin.");
    }
  }

  async function generate() {
    if (!room) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const furniture = await toDataUrl(selected.image);
      const response = await fetch("/api/room-compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, furniture, name: selected.name, spot, note }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(
          response.status === 402
            ? "AI kredisi tükendi. Devam etmek için kredi ekleyin."
            : body.error || "Görsel oluşturulamadı.",
        );
      }
      const data = (await response.json()) as { image: string };
      setResult(data.image);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex h-20 items-center justify-between border-b border-foreground/15 px-5 md:h-24 md:px-12 lg:px-20">
        <Link to="/" className="font-display text-2xl font-medium uppercase md:text-3xl">
          Nil <span className="text-primary">Mobilya</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-medium uppercase text-foreground/80 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3" /> Ana sayfa
        </Link>
      </header>

      <section className="px-5 pb-10 pt-14 md:px-12 lg:px-20">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
          Yapay zekâ ile deneyin
        </p>
        <h1 className="max-w-3xl font-display text-5xl leading-[0.95] md:text-7xl">
          Beğendiğiniz parça evinizde nasıl durur?
        </h1>
        <p className="mt-5 max-w-xl text-sm font-light leading-7 text-foreground/75">
          Odanızın fotoğrafını yükleyin, parçayı seçin ve yerleşmesini istediğiniz noktaya
          dokunun. Gerisini yapay zekâ hallediyor.
        </p>
      </section>

      <section className="grid gap-10 px-5 pb-24 md:px-12 lg:grid-cols-2 lg:px-20">
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-xs uppercase text-primary">01 · Oda fotoğrafınız</p>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => onFile(event.target.files?.[0])}
            />
            {!room ? (
              <button
                onClick={() => fileInput.current?.click()}
                className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 border border-dashed border-primary/40 bg-surface-raised text-sm text-ink-soft transition-colors hover:border-primary"
              >
                <Upload className="size-6 text-primary" />
                Odanızın fotoğrafını yükleyin
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  className="relative block w-full cursor-crosshair overflow-hidden border border-border"
                  onClick={(event) => {
                    const bounds = event.currentTarget.getBoundingClientRect();
                    setSpot({
                      x: ((event.clientX - bounds.left) / bounds.width) * 100,
                      y: ((event.clientY - bounds.top) / bounds.height) * 100,
                    });
                  }}
                >
                  <img src={room} alt="Yüklenen oda fotoğrafı" className="w-full" />
                  {spot && (
                    <span
                      className="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-primary/25"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    />
                  )}
                </button>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{spot ? "Yerleşim noktası seçildi." : "Fotoğrafta bir nokta seçin."}</span>
                  <button
                    onClick={() => fileInput.current?.click()}
                    className="uppercase text-primary hover:underline"
                  >
                    Değiştir
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="mb-3 text-xs uppercase text-primary">02 · Parça seçimi</p>
            <div className="grid grid-cols-3 gap-3">
              {pieces.map((piece) => (
                <button
                  key={piece.key}
                  onClick={() => setSelected(piece)}
                  className="group text-left"
                  aria-pressed={piece.key === selected.key}
                >
                  <span
                    className="block aspect-[4/5] overflow-hidden border"
                    style={{
                      borderColor:
                        piece.key === selected.key ? "var(--color-primary)" : "var(--color-border)",
                    }}
                  >
                    <img src={piece.image} alt={piece.name} className="h-full w-full object-contain" />
                  </span>
                  <span className="mt-2 block text-[11px] leading-4 text-foreground/80">
                    {piece.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase text-primary">03 · Notunuz (opsiyonel)</p>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Örn. pencereye dönük dursun, halının üstünde olsun"
              className="w-full resize-none border border-border bg-surface-raised p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <Button
            variant="gold"
            size="lg"
            className="h-12 w-full px-6 text-xs uppercase"
            disabled={!room || loading}
            onClick={generate}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {loading ? "Odanız hazırlanıyor" : "Odamda göster"}
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="lg:sticky lg:top-10 lg:self-start">
          <p className="mb-3 text-xs uppercase text-primary">Sonuç</p>
          <div className="flex min-h-[320px] items-center justify-center border border-border bg-surface-raised p-4">
            {result ? (
              <img src={result} alt={`${selected.name} odanızda`} className="w-full" />
            ) : (
              <p className="max-w-xs text-center text-xs font-light leading-6 text-muted-foreground">
                {loading
                  ? "Yapay zekâ parçayı odanızın ışığına ve perspektifine yerleştiriyor…"
                  : "Oluşturduğunuz görsel burada belirecek."}
              </p>
            )}
          </div>
          {result && (
            <a
              href={result}
              download={`nil-mobilya-${selected.name}.png`}
              className="mt-4 inline-block text-xs uppercase text-primary hover:underline"
            >
              Görseli indir
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
