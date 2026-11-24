import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Diamond, Layers3, Leaf, Ruler, ShieldCheck, Truck, Headset, Building2, Handshake, KeyRound, Sofa, DraftingCompass, Gem } from "lucide-react";
import { useEffect, useState, type PointerEvent } from "react";

import diningImage from "@/assets/nil-dining.jpg";
import { collections } from "@/lib/collections";
import dolapPhoto2 from "@/assets/unitevedolapofis.jpg";
import dolapPhoto3 from "@/assets/dolapsiyah.jpg";
import { Button } from "@/components/ui/button";
import { useHoverPreview } from "@/components/hover-preview";
import { StageScroll } from "@/components/stage-scroll";
import { ReviewsMarquee } from "@/components/reviews-marquee";
import { SiteDevelopmentNotice } from "@/components/site-development-notice";
import { SiteMenu } from "@/components/site-menu";
import { SiteSearch } from "@/components/site-search";
import { GraphiteCinema } from "@/components/graphite-cinema";
import { AboutSection } from "@/components/about-section";
import { CustomSection } from "@/components/custom-section";
import { ContactSection } from "@/components/contact-section";
import { CorporatePartnershipSection } from "@/components/corporate-partnership-section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nil Mobilya | Özel Ölçü Mobilya ve Ahşap Tasarım" },
      { name: "description", content: "Nil Mobilya ile özel ölçü mobilya, TV ünitesi, banko, etajer ve dolap modellerini keşfedin. Ölçü ve üretim tercihlerinize göre WhatsApp üzerinden teklif alın." },
      { property: "og:title", content: "Nil Mobilya | Zamansız Yaşam Alanları" },
      { property: "og:description", content: "Modern çizgileri yüksek kaliteli işçilikle buluşturan seçkin mobilya koleksiyonu." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nilmobilyatasarim.com/" },
      { property: "og:image", content: "https://nilmobilyatasarim.com/images/anasayfa/hero3.webp" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://nilmobilyatasarim.com/" }],
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
  ["kurumsal-is-ortakligi", "İş ortaklığı"],
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
  ["İş Ortaklığı", "#kurumsal-is-ortakligi"],
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
  { slug: "tum-urunler", title: "Tüm Ürünler", description: "Tüm koleksiyonumuzu\\ntek bir yerde keşfedin.", image: "/images/koleksiyon/tum-urunler.webp" },
  { slug: "tv-uniteleri", title: "TV Üniteleri", description: "Yaşam alanlarınıza estetik ve\\nfonksiyon katan TV üniteleri.", image: "/images/koleksiyon/tv-unitesi.webp" },
  { slug: "banko", title: "Bankolar", description: "Mekânınıza özel ölçüde üretilen\\nahşap banko ve servis üniteleri.", image: "/images/koleksiyon/banko.webp" },
  { slug: "dolap", title: "Dolap Sistemleri", description: "Ölçünüze göre planlanan\\nözel üretim dolap sistemleri.", image: "/images/koleksiyon/dolap.webp" },
] as const;

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const preview = useHoverPreview();

  // On mobile the page scrolls naturally, so the desktop stage controller
  // no longer updates --nil-p. Keep the existing background crossfades in sync.
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1099px), (pointer: coarse)");
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!media.matches) return;
      const scenes = Array.from(document.querySelectorAll<HTMLElement>(".nil-stage > .nil-scene"));
      if (!scenes.length) return;
      const center = window.innerHeight * 0.48;
      let closest = 0;
      let distance = Infinity;
      scenes.forEach((scene, index) => {
        const rect = scene.getBoundingClientRect();
        const delta = center < rect.top ? rect.top - center : center > rect.bottom ? center - rect.bottom : 0;
        if (delta < distance) { distance = delta; closest = index; }
      });
      // There are five photographic layers; later sections retain the final photo.
      root.style.setProperty("--nil-p", String(Math.min(closest, 5)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onMediaChange = () => { if (media.matches) schedule(); else root.style.removeProperty("--nil-p"); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", onMediaChange);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", onMediaChange);
      if (frame) cancelAnimationFrame(frame);
      if (media.matches) root.style.removeProperty("--nil-p");
    };
  }, []);


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
      <GraphiteCinema />
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
  <div className="nil-bg__scene nil-bg__scene--6" />
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
            <Link to="/teklif" className="nil-quote">Teklif Al</Link>
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
        <section id="top" aria-label="Ana sayfa" lang="tr" className="nil-scene nil-scene--hero nil-project-hero">
          <div className="nil-project-hero__photo" aria-hidden="true"/>
          <div className="nil-project-hero__shade" aria-hidden="true"/>
          <div className="nil-project-hero__shell">
            <div className="nil-project-hero__main">
              <div className="nil-project-hero__copy">
                <p className="nil-project-hero__eyebrow"><span>MİMARLIK · GAYRİMENKUL · PROJE ORTAKLIĞI</span><i aria-hidden="true"/></p>
                <h1>Büyük Projelerinizde<br/><em>Birlikte İmza Atalım.</em></h1>
                <p className="nil-project-hero__lead">Mimarlık ofisleri, müteahhitler ve gayrimenkul projeleri için özel üretim ve uygulama çözümleri. Projenizin kapsamına göre anahtar teslim seçeneklerini birlikte değerlendirelim.</p>
                <div className="nil-project-hero__actions">
                  <a className="nil-project-hero__primary" href="https://wa.me/905360236146?text=Merhaba%2C%20Nil%20Mobilya%20ile%20b%C3%BCy%C3%BCk%20projemizde%20i%C5%9F%20ortakl%C4%B1%C4%9F%C4%B1%20hakk%C4%B1nda%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyoruz." target="_blank" rel="noopener noreferrer">Projenizi değerlendirelim <ArrowUpRight size={17}/></a>
                  <a className="nil-project-hero__secondary" href="#koleksiyon">Koleksiyonu incele <ArrowRight size={17}/></a>
                </div>
              </div>
              <aside className="nil-project-hero__services" aria-label="Proje çözümlerimiz">
                <div><Layers3 aria-hidden="true"/><span><strong>Anahtar Teslim Seçenekleri</strong><small>Proje kapsamına göre planlama</small></span></div>
                <div><Ruler aria-hidden="true"/><span><strong>Projeye Özel Üretim</strong><small>Ölçünüze ve tasarımınıza uygun</small></span></div>
                <div><ShieldCheck aria-hidden="true"/><span><strong>Uzun Vadeli İş Ortaklığı</strong><small>Birlikte sürdürülebilir çözümler</small></span></div>
                <div><Diamond aria-hidden="true"/><span><strong>Özenli İşçilik</strong><small>Malzemede ve detayda kalite</small></span></div>
              </aside>
            </div>
            <div className="nil-project-hero__footer" aria-label="Çalışma alanlarımız">
              <div><Layers3 aria-hidden="true"/><span><strong>Özel Üretim Mobilya</strong><small>Mekâna özel, özgün tasarımlar</small></span></div>
              <div><Ruler aria-hidden="true"/><span><strong>Ticari Proje Desteği</strong><small>Ofis, konut ve işletmeler</small></span></div>
              <div><Truck aria-hidden="true"/><span><strong>Uygulama Çözümleri</strong><small>Üretim ve montaj planlaması</small></span></div>
              <div><Headset aria-hidden="true"/><span><strong>Kurumsal İş Ortaklığı</strong><small>Büyük projelerde birlikte</small></span></div>
            </div>
          </div>
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
                      <img className="kcr-card__hero" src={card.image} alt="" loading="lazy" />
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

            <p className="kcr-reference-note" data-s="fade">Görseller referans amaçlıdır, ürünlerin gerçek görünümünü yansıtmayabilir.</p>

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
  {/* Mevcut Sergimiz arka planı aynen korunur; yalnızca ön plandaki içerik yenilenmiştir. */}
  <div className="nil-scene__body relative z-10 mx-auto flex h-full w-full max-w-[1660px] flex-col justify-center gap-7 px-5 py-9 md:px-8 lg:px-12">
    <div className="grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr]">
      <div className="max-w-[620px]">
        <p data-s="fade" className="mb-5 text-[11px] uppercase tracking-[.32em] text-[#aaa29a]">NİL MOBİLYA / SERGİMİZ</p>
        <h2 data-s="text" className="font-display text-[clamp(3.3rem,6vw,6rem)] leading-[1.03] text-[#e8e3df]">Sergimiz</h2>
        <p data-s="text" className="mt-6 max-w-[510px] text-base leading-8 text-[#b5ada6]">Üretim ve tasarım çalışmalarımızı Sergimiz sayfasında keşfedin. Yeni projeler eklendikçe galeri güncellenir.</p>
        <Link to="/sergimiz" data-s="fade" className="mt-7 inline-flex items-center gap-3 rounded-xl border border-[#a58b6a]/40 bg-[#161411]/75 px-5 py-3 text-sm text-[#c9b294] hover:border-[#d1a66c] hover:text-white">
          Sergimizi incele <ArrowRight size={17}/>
        </Link>
      </div>
      <div data-s="frame" className="flex min-h-[220px] items-center justify-center rounded-[24px] border border-white/10 bg-[#141414]/35 p-7 backdrop-blur-[2px] lg:min-h-[330px]">
        <div className="max-w-[430px] text-center">
          <Layers3 className="mx-auto size-12 text-[#aa9785]" strokeWidth={.9}/>
          <p className="mt-6 font-display text-[clamp(1.5rem,2.4vw,2.3rem)] leading-snug text-[#ded6cf]">Tamamlanan projelerimiz</p>
          <p className="mt-4 text-sm leading-7 text-[#9e958d]">Atölye üretimlerimiz ve seçili uygulamalarımızdan fotoğraflar için galeriye göz atın.</p>
        </div>
      </div>
    </div>
    <div className="grid gap-3 md:grid-cols-3 md:gap-4">
      {[
        {icon: Layers3, title:"Yeni Projeler", detail:"Yeni tasarım ve uygulamalar."},
        {icon: Ruler, title:"Özel Üretimler", detail:"Projeye özel çözümler ve detaylar."},
        {icon: Diamond, title:"Koleksiyon Gelişimleri", detail:"Yakında eklenecek yeni parçalar."}
      ].map(({icon:Icon,title,detail})=>(
        <div data-s="fade" key={title} className="flex min-h-[115px] items-center gap-4 rounded-[20px] border border-white/10 bg-[#151515]/75 px-5 py-5">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/10"><Icon className="size-6 text-[#b19a83]" strokeWidth={1.2}/></div>
          <div><h3 className="font-display text-xl text-[#e2dcd6]">{title}</h3><p className="mt-1 text-xs leading-6 text-[#a69c93]">{detail}</p></div>
        </div>
      ))}
    </div>
  </div>
</section>

                {/* 5 · Hikâye */}
        <AboutSection />

                {/* Ahşap işleri ve proje ortaklığı · İletişimden önce */}
        <CorporatePartnershipSection />

                {/* 7 · İletişim */}
        <ContactSection />
      </div>
    </main>
  );
}