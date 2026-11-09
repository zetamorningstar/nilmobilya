import { createFileRoute, Link } from "@tanstack/react-router";
import { Armchair, ArrowRight, ArrowUpRight, BedDouble, ChevronLeft, ChevronRight, Instagram, Mail, Phone, Sofa } from "lucide-react";
import { useState, type PointerEvent } from "react";

import { collections } from "@/lib/collections";
import { Button } from "@/components/ui/button";
import { useHoverPreview } from "@/components/hover-preview";
import { StageScroll } from "@/components/stage-scroll";
import { ReviewsMarquee } from "@/components/reviews-marquee";
import { MaterialsSection } from "@/components/materials-section";
import { IntroSequence } from "@/components/intro-sequence";
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
  ["koleksiyon", "Mobilyalar"],
  ["malzeme", "Malzemeler"],
  ["yorumlar", "Yorumlar"],
  ["sergimiz", "Sergimiz"],
  ["hikaye", "Hikâyemiz"],
  ["ozel-uretim", "Özel üretim"],
  ["iletisim", "İletişim"],
] as const;
// Üstteki ortalanmış menü (referans tasarımdaki 4 bağlantı)
const NAV = [
  ["Ana sayfa", "#top"],
  ["Koleksiyon", "#koleksiyon"],
  ["Malzeme", "#malzeme"],
  ["Yorumlar", "#yorumlar"],
  ["Sergimiz", "#sergimiz"],
  ["Hakkımızda", "#hikaye"],
  ["Özel üretim", "#ozel-uretim"],
  ["İletişim", "#iletisim"],
] as const;
// ---- Koleksiyon sahnesi: tasarımdaki metinler (collections.ts'e dokunmadan) ----
const KOLEKSIYON_METIN: Record<string, { title: string; lines: readonly [string, string] }> = {
  oturma: { title: "Oturma Grubu", lines: ["Modern çizgilerle tasarlanan oturma grupları,", "yaşam alanlarınıza zarafet katar."] },
  berjer: { title: "Berjer Koleksiyonu", lines: ["Rahatlığı ve şıklığı bir araya getiren", "özel tasarım berjerler."] },
  yemek: { title: "Yemek Odası", lines: ["Davetkar atmosferler için", "özel tasarım yemek odaları."] },
};

const KATEGORILER = [
  ["oturma", "Oturma"],
  ["berjer", "Berjer"],
  ["yemek", "Yemek"],
  ["yatak", "Yatak Odası"],
] as const;

function MasaIkon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h18M5 8v12M19 8v12M8 8v6M16 8v6" />
    </svg>
  );
}

const KAT_ICON = { oturma: Sofa, berjer: Armchair, yemek: MasaIkon, yatak: BedDouble } as const;
function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
    const [kat, setKat] = useState<string>("tumu");
  const slugs = collections.map((c) => c.slug);
  const orderedCollections = slugs.includes(kat)
    ? [collections.find((c) => c.slug === kat)!, ...collections.filter((c) => c.slug !== kat)]
    : collections;
  const pageNo = kat === "tumu" ? 1 : KATEGORILER.findIndex(([s]) => s === kat) + 1;
  const stepKat = (dir: 1 | -1) => {
    const i = slugs.indexOf(kat);
    const n = i < 0 ? (dir > 0 ? 0 : slugs.length - 1) : (i + dir + slugs.length) % slugs.length;
    setKat(slugs[n]!);
  };
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
                {/* 2 · Koleksiyon */}
        <section id="koleksiyon" aria-label="Yeni koleksiyon" className="nil-scene nil-scene--col">
          <div className="nil-scene__body kc">
            {/* Sağ üstte dev numara */}
            <span aria-hidden="true" data-s="fade" className="kc-mark">
              <b>{String(pageNo).padStart(2, "0")}</b>
              <i>Collection</i>
            </span>

            {/* Başlık bölümü */}
            <div className="kc-head">
              <div className="kc-head__l">
                <p data-s="text" className="kc-eyebrow"><span aria-hidden="true" className="kc-eyebrow__line" />Koleksiyon</p>
                <h2 data-s="text" className="kc-title">Yeni Koleksiyon</h2>
                <p data-s="text" className="kc-sub">
                  Zamansız tasarımlar, modern yaşam alanları için.<br />
                  Nil Mobilya'nın yeni koleksiyonu ile estetiği ve konforu bir araya getirin.
                </p>
              </div>

              <div data-s="fade" className="kc-tabs" role="tablist" aria-label="Koleksiyon kategorileri">
                {[["tumu", "Tümü"], ...KATEGORILER].map(([slug, label]) => (
                  <button
                    key={slug}
                    type="button"
                    role="tab"
                    aria-selected={kat === slug}
                    disabled={slug === "yatak"}
                    title={slug === "yatak" ? "Yakında" : undefined}
                    onClick={() => setKat(slug)}
                    className="kc-tab"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div data-s="fade" className="kc-pager">
                <button type="button" aria-label="Önceki" onClick={() => stepKat(-1)}><ChevronLeft className="size-4" strokeWidth={1.4} /></button>
                <span><b>{String(pageNo).padStart(2, "0")}</b> / {String(KATEGORILER.length).padStart(2, "0")}</span>
                <button type="button" aria-label="Sonraki" onClick={() => stepKat(1)}><ChevronRight className="size-4" strokeWidth={1.4} /></button>
              </div>
            </div>

            {/* Kartlar + sağ kategori listesi */}
            <div className="kc-grid">
              {orderedCollections.map((item, i) => {
                const ui = KOLEKSIYON_METIN[item.slug]!;
                return (
                  <article key={item.slug} className={`kc-card kc-card--${i} group`}>
                    <Link
                      to="/koleksiyon/$slug"
                      params={{ slug: item.slug }}
                      className="kc-card__link cursor-pointer"
                      aria-label={`${ui.title} koleksiyonunu görüntüle`}
                    >
                      <div
                        data-s="frame"
                        className="kc-frame"
                        onPointerMove={handleDepth}
                        onPointerEnter={(event) => {
                          if (event.pointerType === "touch") return;
                          preview.open(
                            {
                              src: item.hero,
                              alt: `Nil Mobilya ${item.title.toLocaleLowerCase("tr-TR")} koleksiyonu`,
                              title: `${item.number} · ${item.title}`,
                              lines: [item.note, item.description],
                            },
                            event.currentTarget,
                          );
                        }}
                        onPointerLeave={(event) => {
                          resetDepth(event);
                          preview.close();
                        }}
                      >
                        <img data-depth src={item.hero} alt={`Nil Mobilya ${item.title.toLocaleLowerCase("tr-TR")} koleksiyonu`} width={1024} height={1280} decoding="async" className="image-depth [--depth-scale:1.04]" />
                        <span aria-hidden="true" className="kc-card__shade" />
                      </div>
                      <div className="kc-card__cap">
                        <p data-s="fade" className="kc-card__no">{String(i + 1).padStart(2, "0")}</p>
                        <h3 data-s="text" className="kc-card__title">{ui.title}</h3>
                        <p data-s="text" className="kc-card__text"><span>{ui.lines[0]}</span><br />{ui.lines[1]}</p>
                        {i === 0 && <span data-s="rule" aria-hidden="true" className="kc-card__rule" />}
                        <span data-s="fade" className="kc-card__arrow"><ArrowRight className="size-5" strokeWidth={1.3} /></span>
                      </div>
                    </Link>
                  </article>
                );
              })}

              <aside data-s="fade" className="kc-side" aria-label="Kategoriler">
                <ul>
                  {KATEGORILER.map(([slug, label]) => {
                    const Icon = KAT_ICON[slug];
                    const disabled = slug === "yatak";
                    return (
                      <li key={slug}>
                        <button
                          type="button"
                          disabled={disabled}
                          title={disabled ? "Yakında" : undefined}
                          aria-current={kat === slug}
                          onClick={() => setKat(slug)}
                          className="kc-side__item"
                        >
                          <Icon className="kc-side__icon" />
                          <span>{label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p className="kc-side__note">
                  <span aria-hidden="true" className="kc-side__rule" />
                  Her detayda<br />yaşam alanlarınıza değer<br />katan tasarımlar...
                </p>
              </aside>
            </div>

            {/* Alt şerit */}
            <div data-s="fade" className="kc-foot">
              <p className="kc-foot__path"><span>Nil Mobilya</span><i>/</i><span>Koleksiyon</span><em aria-hidden="true" /></p>
              <span aria-hidden="true" className="kc-foot__line" />
              <div className="kc-foot__arrows">
                <button type="button" aria-label="Önceki" onClick={() => stepKat(-1)}><ChevronLeft className="size-4" strokeWidth={1.4} /></button>
                <button type="button" aria-label="Sonraki" onClick={() => stepKat(1)}><ChevronRight className="size-4" strokeWidth={1.4} /></button>
              </div>
              <svg className="kc-foot__logo" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                <path d="M6 26V6l20 20V6" />
                <path d="M3 29V3M29 29V3" opacity="0.45" />
              </svg>
            </div>
          </div>
        </section>

        {/* 3 · Malzeme */}
        <MaterialsSection preview={preview} />

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

                {/* 6 · Özel üretim */}
        <CustomSection />
        

                {/* 7 · İletişim */}
        <ContactSection />
      </div>
    </main>
  );
}