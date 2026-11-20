import { ArrowUpRight, DraftingCompass, Layers3, PencilRuler, Settings2 } from "lucide-react";
import customHero from "@/assets/custom-hero.jpg";
import customCraft from "@/assets/custom-craft.jpg";
import woodImage from "@/assets/material-ceviz.jpg";

const features = [
  { Icon: DraftingCompass, title: "Özel Ölçü", detail: "Mekânınıza tam uyum" },
  { Icon: Layers3, title: "Malzeme Seçimi", detail: "Ahşap ve yüzey alternatifleri" },
  { Icon: PencilRuler, title: "Tasarım Desteği", detail: "İhtiyacınıza özel çözümler" },
  { Icon: Settings2, title: "Usta İşçilik", detail: "Özenle hazırlanan detaylar" },
];

export function CustomSection() {
  return (
    <section id="ozel-uretim" aria-label="Özel üretim" lang="tr" className="nil-scene nil-scene--ou">
      <div className="nil-scene__body ou-v2">
        <div className="ou-v2__main">
          <div className="ou-v2__copy">
            <p data-s="text" className="ou-v2__eyebrow">NİL MOBİLYA / ATÖLYEMİZDEN</p>
            <h2 data-s="text" className="ou-v2__title">Özel<br />Üretim<span>.</span></h2>
            <span data-s="rule" className="ou-v2__rule" aria-hidden="true" />
            <p data-s="text" className="ou-v2__description">
              Ölçünüze, zevkinize ve yaşam alanınıza özel mobilyalar. Her detay, sizin için düşünülür.
            </p>
            <div data-s="fade">
              <a href="#iletisim" className="ou-v2__button">
                Özel Tasarım Talebi <ArrowUpRight size={17} strokeWidth={1.3} aria-hidden="true" />
              </a>
            </div>
            <p data-s="fade" className="ou-v2__journey">01 — TASARIM &nbsp; / &nbsp; 02 — ÜRETİM &nbsp; / &nbsp; 03 — TESLİM</p>
          </div>
          <div className="ou-v2__gallery">
            <figure data-s="frame" className="ou-v2__hero">
              <img src={customHero} alt="Özel üretim mobilya tasarımından bir görünüm" decoding="async" />
              <figcaption>SİZE ÖZEL, ZAMANSIZ TASARIM</figcaption>
            </figure>
            <div className="ou-v2__details">
              <figure data-s="frame"><img src={customCraft} alt="Mobilya işçiliği detayı" decoding="async" /></figure>
              <figure data-s="frame"><img src={woodImage} alt="Ceviz ahşap malzeme detayı" decoding="async" /></figure>
            </div>
          </div>
        </div>
        <div className="ou-v2__features" data-s="fade">
          {features.map(({ Icon, title, detail }) => (
            <div className="ou-v2__feature" key={title}>
              <Icon size={24} strokeWidth={1.25} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
