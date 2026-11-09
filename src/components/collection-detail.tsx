import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { PointerEvent } from "react";

import { collections, type Collection } from "@/lib/collections";
import { Button } from "@/components/ui/button";
import { useHoverPreview } from "@/components/hover-preview";
import { StageScroll } from "@/components/stage-scroll";

// Sağdaki çizgi göstergeleri (id'ler sahne id'leriyle aynı olmalı)
const SCENES = [
  ["baslik", "Koleksiyon"],
  ["aciklama", "Hakkında"],
  ["parcalar", "Parçalar"],
  ["diger", "Diğer koleksiyonlar"],
] as const;

function handleDepth(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * -14;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
  const image = event.currentTarget.querySelector<HTMLElement>("[data-depth]");
  image?.style.setProperty("--shift-x", `${x}px`);
  image?.style.setProperty("--shift-y", `${y}px`);
}

function resetDepth(event: PointerEvent<HTMLElement>) {
  const image = event.currentTarget.querySelector<HTMLElement>("[data-depth]");
  image?.style.setProperty("--shift-x", "0px");
  image?.style.setProperty("--shift-y", "0px");
}

export function CollectionDetail({ collection }: { collection: Collection }) {
  const preview = useHoverPreview();
  const others = collections.filter((item) => item.slug !== collection.slug);
  const altBase = `Nil Mobilya ${collection.title.toLocaleLowerCase("tr-TR")} koleksiyonu`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Anasayfadaki aynı sahne geçişi. Bu sayfada kayıtlı sahne hatırlanmaz (persist=false) */}
      <StageScroll persist={false} />
      {preview.overlay}

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

      <nav className="nil-dots" aria-label="Sahneler">
        {SCENES.map(([id, label]) => (
          <a key={id} href={`#${id}`} data-nav className="nil-dot" aria-label={label} />
        ))}
      </nav>

      <div className="nil-stage nil-stage--sub">
        {/* 1 · Başlık */}
        <section id="baslik" aria-label={`${collection.title} koleksiyonu`} className="nil-scene">
          <div className="nil-scene__body nil-detail-hero">
            <div>
              <p data-s="text" className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary md:text-xs">
                Koleksiyon {collection.number}
              </p>
              <h1 data-s="text" className="font-display text-6xl font-medium leading-[0.95] text-foreground md:text-8xl">
                {collection.title}
              </h1>
              <p data-s="text" className="mt-5 text-sm font-light text-foreground/75 md:text-base">{collection.note}</p>
            </div>
            <div
              data-s="frame"
              className="nil-frame"
              onPointerMove={handleDepth}
              onPointerLeave={resetDepth}
            >
              <img
                data-depth
                src={collection.hero}
                alt={collection.heroAlt}
                width={1024}
                height={1280}
                className="image-depth [--depth-scale:1]"
                style={{ objectPosition: collection.heroFocus }}
              />
            </div>
          </div>
        </section>

        {/* 2 · Açıklama */}
        <section id="aciklama" aria-label="Koleksiyon hakkında" className="nil-scene">
          <div className="nil-scene__body nil-split nil-split--wide">
            <p data-s="text" className="max-w-3xl font-display text-3xl leading-snug text-foreground md:text-5xl">
              {collection.description}
            </p>
            <div className="flex items-end justify-start md:justify-end">
              <div data-s="fade">
                <Button asChild variant="goldOutline" size="lg" className="h-12 px-6 text-xs uppercase">
                  <Link to="/" hash="iletisim">Bu koleksiyonu yerinizde görün <ArrowUpRight /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3 · Parçalar */}
        <section id="parcalar" aria-label="Parçalar" className="nil-scene">
          <div className="nil-scene__body">
            <div className="nil-head">
              <h2 data-s="text" className="font-display text-4xl md:text-6xl">Parçalar</h2>
              <p data-s="text" className="hidden text-xs text-muted-foreground md:block">{collection.title} / 2026</p>
            </div>
            <span data-s="rule" className="nil-rule" />
            <div className="nil-cards nil-cards--3">
              {collection.products.map((product, index) => (
                <article key={product.name} className="nil-card group">
                  <div className="nil-card__link">
                    <div
                      data-s="frame"
                      className="nil-frame"
                      onPointerMove={handleDepth}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "touch") return;
                        preview.open(
                          {
                            src: product.image,
                            alt: `${altBase} — ${product.name}`,
                            title: `0${index + 1} · ${product.name}`,
                            lines: [product.material, `${collection.title} koleksiyonu · 2026`],
                          },
                          event.currentTarget,
                        );
                      }}
                      onPointerLeave={(event) => {
                        resetDepth(event);
                        preview.close();
                      }}
                    >
                      <img
                        data-depth
                        src={product.image}
                        alt={`${altBase} — ${product.name}`}
                        width={1024}
                        height={1280}
                        decoding="async"
                        className="image-depth [--depth-scale:1] saturate-[.8] group-hover:saturate-100"
                      />
                    </div>
                    <div className="nil-card__cap">
                      <div>
                        <p data-s="text" className="text-[10px] text-primary">0{index + 1}</p>
                        <h3 data-s="text" className="mt-1 font-display text-2xl md:text-3xl">{product.name}</h3>
                        <p data-s="text" className="mt-1 text-xs text-muted-foreground">{product.material}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4 · Diğer koleksiyonlar */}
        <section id="diger" aria-label="Diğer koleksiyonlar" className="nil-scene">
          <div className="nil-scene__body nil-contact">
            <div>
              <p data-s="text" className="mb-5 text-xs uppercase text-primary">Diğer koleksiyonlar</p>
              <div className="flex flex-col gap-3">
                {others.map((item) => (
                  <div key={item.slug} data-s="text">
                    <Link
                      to="/koleksiyon/$slug"
                      params={{ slug: item.slug }}
                      className="font-display text-5xl text-foreground/70 transition-colors hover:text-primary md:text-7xl"
                    >
                      {item.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div data-s="fade">
              <Button asChild variant="gold" size="lg" className="h-12 px-6 text-xs uppercase">
                <Link to="/" hash="koleksiyon">Tüm koleksiyon <ArrowUpRight /></Link>
              </Button>
            </div>
          </div>
          <div className="nil-scene__foot">
            <span data-s="rule" className="nil-rule" />
            <div className="nil-foot-row">
              <p data-s="text">© 2026 Nil Mobilya</p>
              <p data-s="text">Form · Doku · Denge</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}