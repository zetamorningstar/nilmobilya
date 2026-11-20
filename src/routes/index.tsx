import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Tv } from "lucide-react";
import { useState, type PointerEvent } from "react";

import diningImage from "@/assets/nil-dining.jpg";
import { collections } from "@/lib/collections";
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
// ---- Koleksiyon sahnesi: tasarımdaki metinler (collections.ts'e dokunmadan) ----
const KOLEKSIYON_METIN: Record<string, { title: string; lines: readonly [string, string] }> = {
  "tv-uniteleri": { title: "TV Üniteleri", lines: ["Doğal ahşap dokusunu sade çizgilerle", "buluşturan, ölçünüze özel TV üniteleri."] },
  banko: { title: "Banko", lines: ["Mağaza, ofis ve karşılama alanları için", "özel ölçüde üretilen ahşap bankolar."] },
  dolap: { title: "Dolap Sistemleri", lines: ["Mekâna göre ölçülen, ahşap işçiliğiyle", "üretilen dolap ve depolama sistemleri."] },
};
// Ana sayfadaki 4 kart (sıra ve metinler buradan değişir)
const heroOf = (slug: string) => collections.find((c) => c.slug === slug)?.hero ?? "";

const HOME_CARDS = [
  { slug: "banko", title: "Banko", image: heroOf("banko"), lines: ["Mekânınıza özel ölçüde üretilen", "ahşap banko ve servis üniteleri."] },
  { slug: "dolap", title: "Dolap Sistemleri", image: heroOf("dolap"), lines: ["Ölçünüze göre planlanan", "özel üretim dolap sistemleri."] },
  { slug: "tv-uniteleri", title: "TV Üniteleri", image: heroOf("tv-uniteleri"), lines: ["Yaşam alanlarınıza estetik ve", "fonksiyon katan TV üniteleri."] },
  { slug: "tum-urunler", title: "Diğer Ürünler", image: diningImage, lines: ["Sandalye, masa ve daha fazlası ile", "yaşam alanlarınızı tamamlayın."] },
] as const;

const KATEGORILER = [
  ["tv-uniteleri", "TV Üniteleri"],
  ["banko", "Banko"],
  ["dolap", "Dolap"],
] as const;


function MasaIkon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h18M5 8v12M19 8v12M8 8v6M16 8v6" />
    </svg>
  );
}

const KAT_ICON = { "tv-uniteleri": Tv, banko: MasaIkon, dolap: Archive } as const;
// Kartın üç dilimli görseli: ortada koleksiyonun ilk ürünü, yanlarda sıradaki ikisi.
// Sıralamayı değiştirmek için collections.ts'deki ürün sırasını değiştir.
const dilimler = (c: (typeof collections)[number]) => {
  const imgs = c.products.map((p) => p.image);
  const a = imgs[0] ?? c.hero;
  const b = imgs[1] ?? a;
  const d = imgs[2] ?? b;
  return [b, a, d];
};
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
                {/* 2 · Koleksiyon */}
        <section id="koleksiyon" aria-label="Yeni koleksiyon" className="nil-scene nil-scene--col">
          <div className="nil-scene__body kc">
            <span aria-hidden="true" data-s="fade" className="kc-mark">
              <b>02</b>
              <i>Collection</i>
            </span>

            <div className="kc-head">
              <div className="kc-head__l">
                <p data-s="text" className="kc-eyebrow"><span aria-hidden="true" className="kc-eyebrow__line" />Koleksiyon</p>
                <h2 data-s="text" className="kc-title">Yeni Koleksiyon</h2>
                <p data-s="text" className="kc-sub">
                  Zamansız tasarımlar, modern yaşam alanları için.<br />
                  Nil Mobilya'nın yeni koleksiyonu ile estetiği ve konforu bir araya getirin.
                </p>
              </div>
            </div>

            {/* Referans görsel masaüstünde birebir gösterilir; kart alanları gerçek bağlantıdır.
                Dosya: public/koleksiyon-referans.webp. Mobilde normal HTML kartlar korunur. */}
            <div className="kc-reference" data-s="frame">
              <img
                className="kc-reference__image"
                src="/koleksiyon-referans.webp"
                alt="Yeni Koleksiyon: Tüm Ürünler, TV Üniteleri, Bankolar ve Dolap Sistemleri"
                width={1684}
                height={934}
                decoding="async"
              />
              <Link to="/koleksiyon/$slug" params={{ slug: "tum-urunler" }} className="kc-reference__hotspot kc-reference__hotspot--all" aria-label="Tüm ürünleri incele" />
              <Link to="/koleksiyon/$slug" params={{ slug: "tv-uniteleri" }} className="kc-reference__hotspot kc-reference__hotspot--tv" aria-label="TV ünitelerini incele" />
              <Link to="/koleksiyon/$slug" params={{ slug: "banko" }} className="kc-reference__hotspot kc-reference__hotspot--banko" aria-label="Bankoları incele" />
              <Link to="/koleksiyon/$slug" params={{ slug: "dolap" }} className="kc-reference__hotspot kc-reference__hotspot--dolap" aria-label="Dolap sistemlerini incele" />
            </div>

            <div className="kc-grid kc-grid--4">
              {HOME_CARDS.map((card, i) => (
                <article key={card.slug} className="kc-card kc-card--q group">
                  <Link
                    to="/koleksiyon/$slug"
                    params={{ slug: card.slug }}
                    className="kc-card__link cursor-pointer"
                    aria-label={`${card.title} ürünlerini görüntüle`}
                  >
                    <div
                      data-s="frame"
                      className="kc-frame"
                      onPointerMove={handleDepth}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "touch") return;
                        preview.open(
                          {
                            src: card.image,
                            alt: `Nil Mobilya ${card.title}`,
                            title: `0${i + 1} · ${card.title}`,
                            lines: [card.lines[0], card.lines[1]],
                          },
                          event.currentTarget,
                        );
                      }}
                      onPointerLeave={(event) => {
                        resetDepth(event);
                        preview.close();
                      }}
                    >
                      <img data-depth src={card.image} alt={`Nil Mobilya ${card.title}`} width={1024} height={1280} decoding="async" className="image-depth [--depth-scale:1.04]" />
                      <span aria-hidden="true" className="kc-card__shade" />
                    </div>
                    <div className="kc-card__cap">
                      <p data-s="fade" className="kc-card__no">{String(i + 1).padStart(2, "0")}</p>
                      <h3 data-s="text" className="kc-card__title">{card.title}</h3>
                      <p data-s="text" className="kc-card__text">{card.lines[0]}<br />{card.lines[1]}</p>
                      <span data-s="fade" className="kc-card__arrow"><ArrowRight className="size-5" strokeWidth={1.3} /></span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            <div data-s="fade" className="kc-foot">
              <p className="kc-foot__path"><span>Nil Mobilya</span><i>/</i><span>Koleksiyon</span><em aria-hidden="true" /></p>
              <span aria-hidden="true" className="kc-foot__line" />
              <Link to="/koleksiyon/$slug" params={{ slug: "tum-urunler" }} className="kc-more__link">
                <span>Diğer ürünleri görmek için</span>
                <b>Tüm Ürünleri Kontrol Edin <ArrowRight className="size-4" strokeWidth={1.4} /></b>
              </Link>
              <svg className="kc-foot__logo" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                <path d="M6 26V6l20 20V6" />
                <path d="M3 29V3M29 29V3" opacity="0.45" />
              </svg>
            </div>
          </div>
        </section>

                {/* 3 · Özel üretim */}
        <CustomSection />

        {/* 4 · Yorumlar */}
        <ReviewsMarquee />

        {/*5 · Sergimiz */}
<section id="sergimiz" aria-label="Sergimiz" className="nil-scene">
  <div className="nil-scene__body nil-split nil-split--wide">
    <div>
      <p data-s="text" className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Sergimiz</p>
      <h2 data-s="text" className="max-w-2xl font-display text-4xl leading-tight md:text-6xl">Yaptığımız her dönüşümle bir hayata dokunduk.</h2>
      <p data-s="text" className="mt-6 max-w-xl text-sm font-light leading-7 text-ink-soft md:text-base">
        Her proje, bir mekânın hikâyesini yeniden yazdı. Bugüne kadar hayata geçirdiğimiz çalışmaları sergimizde bir araya getirdik.
      </p>
    </div>
    <div className="flex flex-col justify-end gap-4">
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