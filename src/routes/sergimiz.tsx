import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { CSSProperties } from "react";

import { works } from "@/lib/works";

export const Route = createFileRoute("/sergimiz")({
  head: () => ({
    meta: [
      { title: "Sergimiz | Nil Mobilya" },
      { name: "description", content: "Nil Mobilya'nın bugüne kadar hayata geçirdiği çalışmalar." },
      { property: "og:title", content: "Sergimiz | Nil Mobilya" },
      { property: "og:description", content: "Nil Mobilya'nın bugüne kadar hayata geçirdiği çalışmalar." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Sergimiz,
});

function Sergimiz() {
  return (
    <main className="min-h-screen text-foreground">
      {/* Arka plan: ana sayfadaki mermer */}
      <div aria-hidden="true" className="nil-bg" style={{ "--nil-p": 1 } as CSSProperties}>
        <div className="nil-bg__marble" />
        <div className="nil-bg__shade" />
      </div>

      <div className="fixed inset-x-0 top-0 z-40">
        <header className="relative z-20 flex h-20 items-center justify-between px-5 md:h-24 md:px-12 lg:px-20">
          <Link to="/" aria-label="Nil Mobilya ana sayfa" className="font-display text-2xl font-medium uppercase text-foreground md:text-3xl">
            Nil <span className="text-primary">Mobilya</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-xs font-medium uppercase text-foreground/80 transition-colors hover:text-primary">
            <ArrowLeft className="size-3" /> Ana sayfa
          </Link>
        </header>
        <div className="pointer-events-none h-px w-full bg-foreground/15" />
      </div>

      <div className="px-5 pb-24 pt-32 md:px-12 md:pt-44 lg:px-20">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Sergimiz</p>
        <h1 className="max-w-3xl font-display text-4xl leading-tight md:text-6xl">
          Yaptığımız her dönüşümle bir hayata dokunduk.
        </h1>
        <p className="mt-6 max-w-xl text-sm font-light leading-7 text-foreground/80 md:text-base">
          Bugüne kadar hayata geçirdiğimiz çalışmalardan bir seçki.
        </p>

        <span className="mt-10 block h-px w-full bg-foreground/18" />

        {works.length === 0 ? (
          <p className="mt-16 text-center text-sm font-light uppercase tracking-[0.2em] text-foreground/60">
            Sergimiz çok yakında burada.
          </p>
        ) : (
          <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {works.map((work) => (
              <figure key={work.image} className="group mb-6 break-inside-avoid">
                <img
                  src={work.image}
                  alt={work.alt}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full border border-primary/50 shadow-[0_18px_40px_rgb(0_0_0/0.55)] transition-colors duration-500 group-hover:border-primary"
                />
                <figcaption className="pt-4">
                  <h2 className="font-display text-2xl">{work.title}</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/60">
                    {work.place} · {work.year}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-between gap-4 text-[9px] uppercase tracking-[0.1em] text-foreground/60">
          <p>© 2026 Nil Mobilya</p>
          <p>Modern · Nitelikli · Zamansız</p>
        </div>
      </div>
    </main>
  );
}
