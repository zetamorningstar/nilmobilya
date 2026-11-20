import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Diamond, Layers3, Leaf, Ruler, ShieldCheck, Truck, Headset } from "lucide-react";
import { useState, type PointerEvent } from "react";

import diningImage from "@/assets/nil-dining.jpg";
import { collections } from "@/lib/collections";
import dolapPhoto2 from "@/assets/unitevedolapofis.jpg";
import dolapPhoto3 from "@/assets/dolapsiyah.jpg";
import { Button } from "@/components/ui/button";
import { useHoverPreview } from "@/components/hover-preview";
import { StageScroll } from "@/components/stage-scroll";
import { ReviewsMarquee } from "@/components/reviews-marquee";
import { IntroSequence } from "@/components/intro-sequence";
import { SiteDevelopmentNotice } from "@/components/site-development-notice";
import { SiteMenu } from "@/components/site-menu";
import { SiteSearch } from "@/components/site-search";
import { AboutSection } from "@/components/about-section";
import { CustomSection } from "@/components/custom-section";
import { ContactSection } from "@/components/contact-section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nil Mobilya | Modern ve Yüksek Kaliteli Mobilya" },
      { name: "description", content: "Nil Mobilya ile modern çizgiler, seçkin malzemeler ve yüksek kaliteli işçilik yaşam alanlarınıza değer katsın." },
      { property: "og:title", content: "Nil Mobilya | Zamansız Yaşam Alanları" },
      { property: "og:description", content: "Modern çizgileri yüksek kaliteli işçilikle buluşturan seçkin mobilya koleksiyonu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});
// Üstteki ortalanmış menü (referans tasarımdaki 4 bağlantı)
// Sağdaki çizgi göstergeleri bu listeden üretilir (id'ler sahne id'leriyle aynı olmalı)
const SCENES = [
  ["top", "Ana sayfa"],
  ["koleksiyon", "Koleksiyon"],
  ["ozel-uretim", "Özel üretim"],
  ["yorumlar", "Yorumlar"],
  ["sergimiz", "Sergimiz"],
  ["hikaye", "Hikâyemiz"],
  ["iletisim", "İletişim"],
] as const;
// Üstteki ortalanmış menü (referans tasarımdaki 4 bağlantı)
const NAV = [
  ["Ana sayfa", "#top"],
  ["Koleksiyon", "#koleksiyon"],
  ["Özel üretim", "#ozel-uretim"],
  ["Yorumlar", "#yorumlar"],
  ["Sergimiz", "#sergimiz"],
  ["Hakkımızda", "#hikaye"],
  ["İletişim", "#iletisim"],
] as const;
// Gerçek ürün fotoğrafları: src/lib/collections.ts içindeki mevcut asset'ler.
const collectionBySlug = (slug: string) => collections.find((item) => item.slug === slug);
const productPhotos = (slug: string): string[] => {
  const collection = collectionBySlug(slug);
  if (!collection) return [];
  return collection.products.map((product) => product.image).filter(Boolean);
};
const tvPhotos = productPhotos("tv-uniteleri");
const bankoPhotos = productPhotos("banko");
const dolapPhotos = [collectionBySlug("dolap")?.hero, dolapPhoto2, dolapPhoto3].filter((p): p is string => Boolean(p));
const allPhotos = [tvPhotos[0], bankoPhotos[0], dolapPhotos[0]].filter((photo): photo is string => Boolean(photo));

const COLLECTION_CARDS = [
  { slug: "tum-urunler", title: "Tüm Ürünler", description: "Tüm koleksiyonumuzu\ntek bir yerde keşfedin.", images: allPhotos, fallback: tvPhotos[0] },
  { slug: "tv-uniteleri", title: "TV Üniteleri", description: "Yaşam alanlarınıza estetik ve\\nfonksiyon katan TV üniteleri.", images: tvPhotos, fallback: tvPhotos[0] },
  { slug: "banko", title: "Bankolar", description: "Mekânınıza özel ölçüde üretilen\\nahşap banko ve servis üniteleri.", images: bankoPhotos, fallback: bankoPhotos[0] },
  { slug: "dolap", title: "Dolap Sistemleri", description: "Ölçünüze göre planlanan\\nözel üretim dolap sistemleri.", images: dolapPhotos, fallback: dolapPhotos[0] },
] as const;

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const preview = useHoverPreview();

  const handleDepth = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * -14;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
    const image = event.currentTarget.querySelector<HTMLElement>("[data-depth]");
    image?.style.setProperty("--shift-x", `${x}px`);
    image?.style.setProperty("--shift-y", `${y}px`);
  };

  const resetDepth = (event: PointerEvent<HTMLElement>) => {
    const image = event.currentTarget.querySelector<HTMLElement>("[data-depth]");
    image?.style.setProperty("--shift-x", "0px");
    image?.style.setProperty("--shift-y", "0px");
  };

  return (
    <main className="min-h-screen text-foreground">
      <IntroSequence />
      <StageScroll />
      <SiteDevelopmentNotice />

      {/* Sabit arka plan: koyu villa salonu. Fotoğraf: public/bg-villa.jpg */}
   <div aria-hidden="true" className="nil-bg">
  <div className="nil-bg__marble" />
  <div className="nil-bg__scene nil-bg__scene--1" />
  <div className="nil-bg__scene nil-bg__scene--2" />
  <div className="nil-bg__scene nil-bg__scene--3" />
  <div className="nil-bg__scene nil-bg__scene--4" />
  <div className="nil-bg__scene nil-bg__scene--5" />
  <div className="nil-bg__img" />
  <div className="nil-bg__shade" />
</div>
      {preview.overlay}

            <div lang="tr" className="nil-header fixed inset-x-0 top-0 z-40">
        <header className="nil-nav">
          <a href="#top" aria-label="Nil Mobilya ana sayfa" className="nil-brand">
            <svg className="nil-brand__logo" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
              <path d="M6 26V6l20 20V6" />
              <path d="M3 29V3M29 29V3" opacity="0.45" />
            </svg>
            <span className="nil-brand__name">Nil Mobilya</span>
          </a>

          <nav className="nil-topnav hidden min-[1500px]:flex" aria-label="Sayfa bölümleri">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} data-nav className="nil-topnav__link">{label}</a>
            ))}
          </nav>

          <div className="nil-nav__tools">
            <a href="#iletisim" className="nil-quote">Teklif Al</a>
            <SiteSearch sections={SCENES} />
            <button
              type="button"
              className="nil-icon-btn"
              aria-label="Menüyü aç"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <svg width="26" height="18" viewBox="0 0 26 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                <path d="M1 2h24M9 9h16M1 16h24" />
              </svg>
            </button>
          </div>
        </header>
        <div className="pointer-events-none h-px w-full bg-foreground/15" />
      </div>

      <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} items={SCENES} />

      {/* Sağ kenardaki numaralı sahne göstergesi */}
      <nav className="nil-index" aria-label="Sahneler">
        {SCENES.map(([id, label], index) => (
          <a key={id} href={`#${id}`} data-nav className="nil-index__n" aria-label={label}>
            {String(index + 1).padStart(2, "0")}
          </a>
        ))}
      </nav>
      {/* ============ SAHNELER ============ */}
      <div className="nil-stage">
                {/* 1 · Ana sayfa */}
        <section id="top" aria-label="Ana sayfa" lang="tr" className="nil-scene nil-scene--hero">
          <div aria-hidden="true" className="nil-hero2__veil" />

          <div className="nil-hero2__content">
            <div className="nil-hero2__eyebrow">
              <span data-s="rule" aria-hidden="true" className="nil-hero2__line" />
              <p data-s="text">Modern yaşam alanları</p>
            </div>
            <h1 className="nil-hero2__title">
              <span data-s="text" className="block">Zamansız Tasarımlar,</span>
              <span data-s="text" className="nil-hero2__gold block">Modern Yaşamlar.</span>
            </h1>
            <p data-s="text" className="nil-hero2__text">
              Nil Mobilya, estetik ve konforu bir araya getirerek hayallerinizdeki yaşam alanlarını gerçeğe dönüştürür.
            </p>
            <div data-s="fade" className="nil-hero2__ctawrap">
              <a href="#koleksiyon" className="nil-hero2__cta">
                <span>Koleksiyonu keşfet</span>
                <ArrowRight className="size-4" strokeWidth={1.4} />
              </a>
            </div>
          </div>

          <div data-s="fade" className="nil-hero2__cue">
            <span aria-hidden="true" className="nil-hero2__mouse" />
            <span>Aşağı kaydır</span>
            <span aria-hidden="true" className="nil-hero2__cueline" />
          </div>

          <ul data-s="fade" className="nil-hero2__tags">
            {["Özel üretim", "Modern tasarım", "Üst düzey kalite"].map((item, i) => (
              <li key={item} className="flex items-center gap-[18px]">
                {i > 0 && <span aria-hidden="true" className="text-foreground/40">/</span>}
                {item}
              </li>
            ))}
          </ul>
        </section>
                {/* 2 · Koleksiyon — referansın HTML/CSS karşılığı; görseller projeden gelir */}
        <section id="koleksiyon" aria-label="Yeni koleksiyon" className="nil-scene nil-scene--col">
          <div className="nil-scene__body kc kc-rebuilt">
            <div className="kcr-heading">
              <div className="kcr-heading__left">
                <div className="kcr-eyebrow"><span className="kcr-eyebrow__square" /> KOLEKSİYON <span className="kcr-eyebrow__rule" /></div>
                <h2 data-s="text" className="kcr-title">Yeni Koleksiyon</h2>
              </div>
              <div className="kcr-heading__description" data-s="fade">
                <span aria-hidden="true" className="kcr-heading__divider" />
                <p>Zamansız tasarımlar, modern yaşam alanları için.<br />Nil Mobilya'nın yeni koleksiyonunu keşfedin.</p>
              </div>
              <div className="kcr-mark" aria-hidden="true"><span>02</span><small>COLLECTION</small></div>
            </div>

            <div className="kcr-values" data-s="fade" aria-label="Üretim özellikleri">
              <div><Diamond aria-hidden="true" /><span>Usta İşçilik</span></div>
              <div><Layers3 aria-hidden="true" /><span>Seçkin Malzemeler</span></div>
              <div><Ruler aria-hidden="true" /><span>Özel Ölçü Üretim</span></div>
              <div><Leaf aria-hidden="true" /><span>Zamansız Tasarım</span></div>
            </div>

            <div className="kcr-layout">
              <div className="kcr-cards">
                {COLLECTION_CARDS.map((card, i) => (
                  <Link
                    key={card.slug}
                    to="/koleksiyon/$slug"
                    params={{ slug: card.slug }}
                    className={`kcr-card kcr-card--${i === 0 ? "feature" : "small"} kcr-card--${i}`}
                    aria-label={`${card.title} koleksiyonunu incele`}
                    data-s="frame"
                  >
                    <div className="kcr-card__visual" aria-hidden="true">
                      {i === 0 ? (
                        <div className="kcr-card__triptych">
                          {[0, 1, 2].map((n) => (
                            <div className={`kcr-card__slice kcr-card__slice--${n}`} key={n}>
                              <img src={card.images[n] ?? card.fallback} alt="" loading="lazy" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <img className="kcr-card__hero" src={card.images[0] ?? card.fallback} alt="" loading="lazy" />
                      )}
                      <span className="kcr-card__gradient" />
                    </div>
                    <div className="kcr-card__copy">
                      <span data-s="fade" className="kcr-card__number">0{i + 1}<i /></span>
                      <h3 data-s="text">{card.title}</h3>
                      <p data-s="text">{card.description.split(/\\n|\n/).map((line, lineIndex) => (
                        <span key={lineIndex}>{line}{lineIndex === 0 && <br />}</span>
                      ))}</p>
                      <span data-s="fade" className="kcr-card__button"><ArrowRight aria-hidden="true" strokeWidth={1.35} /></span>
                    </div>
                  </Link>
                ))}
              </div>

              <aside className="kcr-benefits" aria-label="Hizmetlerimiz">
                <div data-s="fade"><ShieldCheck aria-hidden="true" /><span>Güvenli<br />Teslimat</span></div>
                <div data-s="fade"><Truck aria-hidden="true" /><span>Türkiye Geneli<br />Teslimat</span></div>
                <div data-s="fade"><Headset aria-hidden="true" /><span>Satış Sonrası<br />Destek</span></div>
              </aside>
            </div>

            <div className="kcr-footer" data-s="fade">
              <span>NİL MOBİLYA</span><span className="kcr-footer__slash">/</span><span>KOLEKSİYON</span>
              <span className="kcr-footer__line" aria-hidden="true" />
              <Link to="/koleksiyon/$slug" params={{ slug: "tum-urunler" }} aria-label="Tüm ürünleri gör" className="kcr-footer__all">Tüm ürünler <ArrowRight aria-hidden="true" /></Link>
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" aria-label="Nil Mobilya" className="kcr-footer__logo"><path d="M6 26V6l20 20V6" /><path d="M3 29V3M29 29V3" opacity=".45" /></svg>
            </div>
          </div>
        </section>

                {/* 3 · Özel üretim */}
        <CustomSection />

        {/* 4 · Yorumlar */}
        <ReviewsMarquee />

        {/*5 · Sergimiz */}
<section id="sergimiz" aria-label="Sergimiz" className="nil-scene">
  <div className="nil-scene__body nil-split nil-split--wide nil-showcase">
    <div className="nil-showcase__copy">
      <div data-s="fade" className="nil-showcase__eyebrow"><span className="nil-showcase__dot" aria-hidden="true" /> Sergimiz <span className="nil-showcase__line" aria-hidden="true" /></div>
      <h2 data-s="text" className="max-w-2xl font-display text-4xl leading-tight md:text-6xl">Yaptığımız her dönüşümle bir hayata dokunduk.</h2>
      <p data-s="text" className="mt-6 max-w-xl text-sm font-light leading-7 text-ink-soft md:text-base">
        Her proje, bir mekânın hikâyesini yeniden yazdı. Bugüne kadar hayata geçirdiğimiz çalışmaları sergimizde bir araya getirdik.
      </p>
    </div>
    <div className="nil-showcase__action flex flex-col justify-end gap-4">
      <div data-s="fade">
        <Button asChild variant="goldOutline" size="lg" className="h-12 w-full justify-start px-5 text-xs uppercase">
          <Link to="/sergimiz">Sergiyi gez <ArrowUpRight /></Link>
        </Button>
      </div>
    </div>
  </div>
</section>

                {/* 5 · Hikâye */}
        <AboutSection />

                {/* 7 · İletişim */}
        <ContactSection />
      </div>
    </main>
  );
}