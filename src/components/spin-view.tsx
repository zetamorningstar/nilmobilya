import { Link } from "@tanstack/react-router";
import { Loader2, RotateCw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { toDataUrl } from "@/lib/image-data";

export type SpinTarget = {
  src: string;
  name: string;
  detail: string;
};

const ANGLES = [60, 120, 180, 240, 300];

export function SpinView({ target, onClose }: { target: SpinTarget | null; onClose: () => void }) {
  const [frames, setFrames] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSpin, setAutoSpin] = useState(true);
  const drag = useRef<{ x: number; index: number } | null>(null);

  const src = target?.src;
  const name = target?.name;

  useEffect(() => {
    if (!src || !name) return;
    let cancelled = false;

    setFrames([src]);
    setIndex(0);
    setError(null);
    setLoading(true);
    setAutoSpin(true);

    (async () => {
      try {
        const base = await toDataUrl(src);
        for (const angle of ANGLES) {
          if (cancelled) return;
          const response = await fetch("/api/spin-frame", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base, angle, name }),
          });
          if (!response.ok) {
            const body = (await response.json().catch(() => ({}))) as { error?: string };
            throw new Error(
              response.status === 402
                ? "AI kredisi tükendi. Devam etmek için kredi ekleyin."
                : body.error || "Açılar oluşturulamadı.",
            );
          }
          const data = (await response.json()) as { image: string };
          if (cancelled) return;
          setFrames((current) => [...current, data.image]);
        }
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : "Bir sorun oluştu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src, name]);

  useEffect(() => {
    if (!target || !autoSpin || frames.length < 2) return;
    const id = setInterval(() => setIndex((value) => (value + 1) % frames.length), 700);
    return () => clearInterval(id);
  }, [target, autoSpin, frames.length]);

  useEffect(() => {
    if (!target) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [target, onClose]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      setAutoSpin(false);
      drag.current = { x: event.clientX, index };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [index],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const state = drag.current;
      if (!state || frames.length < 2) return;
      const steps = Math.round((event.clientX - state.x) / 40);
      const next = (((state.index + steps) % frames.length) + frames.length) % frames.length;
      setIndex(next);
    },
    [frames.length],
  );

  if (!target) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl border border-primary/25 bg-surface-raised">
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center bg-black/70 text-primary transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <div
            className="relative aspect-[4/5] cursor-grab touch-none select-none overflow-hidden bg-black active:cursor-grabbing md:aspect-auto md:min-h-[520px]"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
          >
            {frames.map((frame, frameIndex) => (
              <img
                key={frameIndex}
                src={frame}
                alt={`${target.name} — ${frameIndex === 0 ? 0 : ANGLES[frameIndex - 1]} derece görünüm`}
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain transition-opacity duration-200"
                style={{ opacity: frameIndex === index ? 1 : 0 }}
              />
            ))}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/80 to-transparent pb-4 pt-10">
              {frames.map((_, dot) => (
                <span
                  key={dot}
                  className="h-[3px] w-6 transition-colors"
                  style={{ background: dot === index ? "var(--color-primary)" : "oklch(1 0 0 / 22%)" }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                360° Görünüm
              </p>
              <h3 className="mt-3 font-display text-3xl md:text-4xl">{target.name}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{target.detail}</p>
              <p className="mt-6 flex items-center gap-2 text-xs font-light leading-6 text-ink-soft">
                <RotateCw className="size-3.5 text-primary" />
                Parçayı çevirmek için sürükleyin.
              </p>

              {loading && (
                <p className="mt-4 flex items-center gap-2 text-xs text-primary">
                  <Loader2 className="size-3.5 animate-spin" />
                  Açılar hazırlanıyor · {frames.length}/{ANGLES.length + 1}
                </p>
              )}
              {error && <p className="mt-4 text-xs text-destructive">{error}</p>}
            </div>

            <Button asChild variant="gold" size="lg" className="h-12 px-6 text-xs uppercase">
              <Link to="/odanda-dene" search={{ parca: target.name }}>
                Odanızda deneyin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
