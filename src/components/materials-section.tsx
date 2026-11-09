import { Fragment, useState } from "react";

import { materials } from "@/lib/materials";
import type { useHoverPreview } from "@/components/hover-preview";

const KATEGORILER = [
  ["tumu", "Tümü"],
  ["tas", "Taş"],
  ["ahsap", "Ahşap"],
  ["kumas", "Kumaş"],
  ["deri", "Deri"],
  ["metal", "Metal"],
] as const;

// materials.ts'e dokunmadan: hangi malzeme hangi sekmeye girer
const MALZEME_KAT: Record<string, string> = {
  "Carrara Mermeri": "tas",
  "Masif Ceviz": "ahsap",
  "Yün Bouclé": "kumas",
  "Pamuk Kadife": "kumas",
  "Tam Tabaka Deri": "deri",
  "Dövme Pirinç": "metal",
};

export function MaterialsSection({
  preview,
}: {
  preview: ReturnType<typeof useHoverPreview>;
}) {
  const [kat, setKat] = useState<string>("tumu");
  const katIdx = KATEGORILER.findIndex(([slug]) => slug === kat);

  return (
    <section id="malzeme" aria-label="Malzeme ve doku" lang="tr" className="nil-scene nil-scene--mat">
      <div className="nil-scene__body mat">
        {/* Başlık bölümü */}
        <div className="mat-head">
         
                       <div className="mat-eyebrow">
              <span aria-hidden="true" className="mat-eyebrow__line" />
              <p data-s="text">Malzeme künyesi</p>
            </div>

          <div data-s="fade" className="mat-tabs" role="tablist" aria-label="Malzeme türleri">
            {KATEGORILER.map(([slug, label], i) => (
              <Fragment key={slug}>
                {i > 0 && <i aria-hidden="true" className="mat-tabs__dot" />}
                <button
                  type="button"
                  role="tab"
                  aria-selected={kat === slug}
                  onClick={() => setKat(slug)}
                  className="mat-tab"
                >
                  {label}
                </button>
              </Fragment>
            ))}
          </div>
        </div>

        {/* 6 malzeme kartı */}
        <div className="mat-grid">
          {materials.map((material) => {
            const dim = kat !== "tumu" && MALZEME_KAT[material.name] !== kat;
            return (
              <article key={material.name} className="mat-card group" data-dim={dim ? "true" : undefined}>
                <div className="mat-card__box">
                  <div
                    data-s="frame"
                    className="mat-frame"
                    onPointerEnter={(event) => {
                      if (event.pointerType === "touch") return;
                      // Ayrıntılar (neden seçildi, nereden geliyor) üzerine gelince açılır
                      preview.open(
                        {
                          src: material.image,
                          alt: `${material.name} dokusu yakın çekim`,
                          title: `${material.name} · ${material.origin}`,
                          lines: [material.why, material.source],
                        },
                        event.currentTarget,
                      );
                    }}
                    onPointerLeave={() => preview.close()}
                  >
                    <img
                      src={material.image}
                      alt={`${material.name} dokusu yakın çekim`}
                      width={1280}
                      height={960}
                      decoding="async"
                    />
                    <span aria-hidden="true" className="mat-card__shade" />
                  </div>
                  <div className="mat-card__cap">
                    <h3 data-s="text" className="mat-card__name">{material.name}</h3>
                    <span data-s="rule" aria-hidden="true" className="mat-card__rule" />
                    <p data-s="text" className="mat-card__origin">{material.origin}</p>
                    {/* Dar ekranda kartın içinde görünür; geniş ekranda üzerine gelince açılır */}
                    <p data-s="text" className="mat-card__why">{material.why}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Alt şerit */}
           <div className="mat-foot">
          <div data-s="fade" aria-hidden="true" className="mat-prog">
            <span className="mat-prog__fill" style={{ left: `calc((100% - 48px) * ${katIdx / (KATEGORILER.length - 1)})` }} />
          </div>
          <p data-s="fade" className="nil-hint">Ayrıntılar için fotoğrafın üzerinde birkaç saniye bekleyin</p>
          <div className="mat-quote">
            <p data-s="text" className="mat-quote__text">Doğal malzemeler. Zamansız karakter.</p>
            <span data-s="text" className="mat-quote__name">Nil Mobilya</span>
          </div>
        </div>
      </div>
    </section>
  );
}