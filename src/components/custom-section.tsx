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
      <style>{"/* Özel üretim — onaylanan kompakt, fotoğraf odaklı sahne */\n.nil-scene--ou { background:radial-gradient(ellipse at 0% 48%,#342115 0%,transparent 39%),radial-gradient(ellipse at 100% 100%,#302014 0%,transparent 36%),#100c0a; }\n.ou-v2 { width:100%; flex:1; min-height:0; display:flex; flex-direction:column; justify-content:center; gap:clamp(22px,4.4svh,52px); padding:clamp(14px,2.8svh,30px) clamp(28px,6vw,110px) clamp(20px,4svh,44px); }\n.ou-v2__main { display:grid; grid-template-columns:minmax(0,41fr) minmax(0,59fr); align-items:center; gap:clamp(18px,3.3vw,60px); min-height:0; }\n.ou-v2__copy { min-width:0; }\n.ou-v2__eyebrow { color:#cba36f; font-size:clamp(9px,.75vw,12px); letter-spacing:.3em; margin-bottom:clamp(14px,2svh,24px); }\n.ou-v2__title { font-family:var(--font-display); font-weight:400; font-size:clamp(44px,min(5.2vw,9svh),92px); line-height:.98; color:#f0dfcb; }\n.ou-v2__title span { color:#c9a16b; }\n.ou-v2__rule { display:block; width:48px; height:1px; margin:clamp(14px,2.5svh,28px) 0; background:#cfa46b; transform-origin:left; }\n.ou-v2__description { max-width:430px; color:#c6b7a9; font-size:clamp(12px,1.05vw,16px); line-height:1.75; }\n.ou-v2__button { display:inline-flex; align-items:center; justify-content:space-between; gap:28px; border:1px solid #ba8e55; padding:clamp(10px,1.3svh,15px) 18px; margin-top:clamp(16px,2.5svh,29px); font-size:clamp(11px,.85vw,14px); color:#e9c38e; transition:background .25s,border-color .25s; }\n.ou-v2__button:hover { background:#bd91551c; border-color:#e4bd83; }\n.ou-v2__journey { margin-top:clamp(16px,2.8svh,30px); color:#aa8a65; font-size:clamp(8px,.68vw,11px); letter-spacing:.12em; }\n.ou-v2__gallery { display:grid; grid-template-columns:minmax(0,1.9fr) minmax(0,.75fr); gap:clamp(8px,.8vw,13px); height:clamp(220px,39svh,440px); min-width:0; }\n.ou-v2__hero,.ou-v2__details figure { position:relative; overflow:hidden; min-height:0; margin:0; border:1px solid #98704665; border-radius:5px; background:#201811; }\n.ou-v2__gallery img { width:100%; height:100%; object-fit:cover; display:block; }\n.ou-v2__hero img { object-position:center; }\n.ou-v2__hero figcaption { position:absolute; inset:auto 0 0; padding:18px 12px 12px; background:linear-gradient(transparent,#0d0909d9); font-size:clamp(8px,.65vw,11px); letter-spacing:.2em; color:#ead4b7; }\n.ou-v2__details { display:grid; grid-template-rows:1fr 1fr; gap:clamp(8px,.8vw,13px); min-height:0; }\n.ou-v2__features { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); border-top:1px solid #b58a503d; padding-top:clamp(16px,2.5svh,30px); }\n.ou-v2__feature { border-left:1px solid #b58a5040; padding:0 clamp(10px,2vw,32px); min-width:0; }\n.ou-v2__feature:first-child { border-left:0; padding-left:0; }\n.ou-v2__feature svg { color:#d4a76b; width:clamp(18px,1.7vw,27px); height:clamp(18px,1.7vw,27px); }\n.ou-v2__feature h3 { color:#eadbc7; margin-top:clamp(6px,.8svh,10px); font-size:clamp(11px,1vw,16px); font-weight:500; }\n.ou-v2__feature p { color:#aa9b8d; margin-top:5px; font-size:clamp(10px,.8vw,13px); line-height:1.5; }\n@media(max-width:1099px) {\n .ou-v2 { padding:26px clamp(22px,5vw,54px); gap:26px; }\n .ou-v2__gallery { height:clamp(230px,34svh,390px); }\n .ou-v2__title { font-size:clamp(44px,6vw,70px); }\n}\n@media(max-width:700px) {\n .ou-v2 { padding:26px 22px 40px; gap:24px; }\n .ou-v2__main { grid-template-columns:1fr; gap:24px; }\n .ou-v2__title { font-size:clamp(48px,12vw,70px); }\n .ou-v2__gallery { height:260px; }\n .ou-v2__features { grid-template-columns:repeat(2,minmax(0,1fr)); row-gap:20px; }\n .ou-v2__feature:nth-child(3) { border-left:0; padding-left:0; }\n .ou-v2__journey { margin-top:18px; }\n}\n@media(max-height:720px) and (min-width:1100px) {\n .ou-v2 { gap:15px; padding-block:10px 16px; }\n .ou-v2__gallery { height:34svh; }\n .ou-v2__title { font-size:clamp(38px,6.5svh,70px); }\n .ou-v2__journey { margin-top:12px; }\n}\n"}</style>
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
