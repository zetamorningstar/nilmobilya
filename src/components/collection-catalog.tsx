import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronDown, Heart, Ruler, Info, Layers3, Expand, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SiteMenu } from "@/components/site-menu";
import { SiteSearch } from "@/components/site-search";
import { ALL_SLUG, CATALOG_SLUGS, getCollection, productSlug, type Collection, type CollectionProduct } from "@/lib/collections";
import { cn } from "@/lib/utils";
import { whatsappOfferUrl } from "@/lib/sales";
import { fetchPublishedProducts, mergeCatalogProducts, type CategoryRow } from "@/lib/live-catalog";
import "@/styles/collection-showroom.css";

// Menü ve arama: ana sayfadaki bölümlerle aynı (id'ler ana sayfa sahneleriyle aynı olmalı)
const SECTIONS = [
  ["top", "Ana sayfa"],
  ["koleksiyon", "Koleksiyon"],
  ["ozel-uretim", "Özel üretim"],
  ["yorumlar", "Yorumlar"],
  ["sergimiz", "Sergimiz"],
  ["hikaye", "Hikâyemiz"],
  ["iletisim", "İletişim"],
] as const;

const NAV = [
  ["Ana sayfa", "top"],
  ["Koleksiyon", "koleksiyon"],
  ["Özel üretim", "ozel-uretim"],
  ["Yorumlar", "yorumlar"],
  ["Sergimiz", "sergimiz"],
  ["Hakkımızda", "hikaye"],
  ["İletişim", "iletisim"],
] as const;

type Sort = "oner" | "isim";

const SORT_OPTIONS: readonly (readonly [Sort, string])[] = [
  ["oner", "Sıralama: Öne Çıkanlar"],
  ["isim", "Sıralama: İsim (A-Z)"],
];

// Dekoratif mermer: public/bg-blocks.webp (ana sayfadaki mermerle aynı)
const marbleStyle = (position: string, direction: string) => ({
  backgroundImage: 'url("/bg-koleksiyon.webp")',
  backgroundSize: "cover",
  backgroundPosition: position,
  maskImage: `linear-gradient(${direction}, transparent, #000 65%)`,
  WebkitMaskImage: `linear-gradient(${direction}, transparent, #000 65%)`,
});

export function CollectionCatalog({ collection }: { collection: Collection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("oner");
  const [favorites, setFavorites] = useState<ReadonlySet<string>>(new Set());
  const [quick, setQuick] = useState<CollectionProduct | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [customDimensions, setCustomDimensions] = useState("");
  const [activeInfoTab, setActiveInfoTab] = useState<"measure" | "info" | "material">("measure");
  const [zoomed, setZoomed] = useState(false);
  const openProduct = (product: CollectionProduct) => { setSelectedOptions({}); setCustomDimensions(""); setActiveInfoTab("measure"); setZoomed(false); setQuick(product); };

  const [liveProducts, setLiveProducts] = useState<Awaited<ReturnType<typeof fetchPublishedProducts>>["products"]>([]);
  const [liveCategories, setLiveCategories] = useState<CategoryRow[]>([]);
  useEffect(() => {
    let active = true;
    fetchPublishedProducts().then(({ products, categories }) => {
      if (active) { setLiveProducts(products); setLiveCategories(categories); }
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  const products = useMemo(() => mergeCatalogProducts(collection.slug, liveProducts, liveCategories), [collection.slug, liveProducts, liveCategories]);

    // Soldaki sayfa menüsü
  const sideLinks: { slug: string; label: string; count: number }[] = [
    {
      slug: ALL_SLUG,
      label: "Tüm ürünler",
      count: mergeCatalogProducts(ALL_SLUG, liveProducts, liveCategories).length,
    },
    ...CATALOG_SLUGS.flatMap((s) => {
      const item = getCollection(s);
      return item ? [{ slug: s as string, label: item.title, count: mergeCatalogProducts(s, liveProducts, liveCategories).length }] : [];
    }),
  ];

  const visible = useMemo(() => {
    const list = [...products];
    if (sort === "isim") list.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    return list;
  }, [products, sort]);
  const toggleFavorite = (name: string) =>
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  // Recommend only other real products from the same category, with no placeholders.
  const relatedProducts = quick
    ? products
        .filter((product) => product.category === quick.category && product.name !== quick.name && product.image !== "/urunler/yakinda.svg")
        .slice(0, 3)
    : [];

  const altBase = `Nil Mobilya ${collection.title.toLocaleLowerCase("tr-TR")} koleksiyonu`;

  return (
    <main className="nil-catalog relative isolate min-h-screen bg-background text-foreground">
    {/* Tam sayfa arka plan: dosya adını ve parlaklığı (opacity) buradan değiştir */}
<div
  aria-hidden="true"
  className="pointer-events-none fixed inset-0 -z-10 opacity-20"
  style={{ backgroundImage: 'url("/bg-koleksiyon.webp")', backgroundSize: "100% 100%", backgroundRepeat: "no-repeat" }}
/>
      {/* ---- Üst menü (ana sayfadakiyle aynı) ---- */}
      <div lang="tr" className="nil-header fixed inset-x-0 top-0 z-40">
        <header className="nil-nav">
          <Link to="/" aria-label="Nil Mobilya ana sayfa" className="nil-brand">
            <svg className="nil-brand__logo" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
              <path d="M6 26V6l20 20V6" />
              <path d="M3 29V3M29 29V3" opacity="0.45" />
            </svg>
            <span className="nil-brand__name">Nil Mobilya</span>
          </Link>

          <nav className="nil-topnav hidden min-[1500px]:flex" aria-label="Sayfa bölümleri">
            {NAV.map(([label, hash]) => (
              <Link
                key={hash}
                to="/"
                hash={hash}
                className="nil-topnav__link"
                aria-current={hash === "koleksiyon" ? "true" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="nil-nav__tools">
            <a href={whatsappOfferUrl()} target="_blank" rel="noopener noreferrer" className="nil-quote">Teklif Al</a>
            <SiteSearch sections={SECTIONS} base="/" />
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
      <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} items={SECTIONS} base="/" />

      {/* ---- Başlık alanı ---- */}
      <section className="nil-catalog__heading relative overflow-hidden border-b border-primary/25 px-[clamp(1.25rem,4.9vw,7rem)] pb-12 pt-[calc(83px+3.25rem)] max-lg:pt-[calc(68px+2.5rem)]">
        
        <span aria-hidden="true" className="absolute bottom-10 right-[clamp(1.25rem,4.9vw,7rem)] hidden h-24 w-px bg-primary/50 lg:block" />

        <div className="relative">
          <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-x-2 text-[10px] font-medium uppercase tracking-[0.2em]">
            <Link to="/" className="text-primary transition-colors hover:text-foreground">Ana sayfa</Link>
            <span aria-hidden="true" className="text-foreground/40">/</span>
            <Link to="/" hash="koleksiyon" className="text-primary transition-colors hover:text-foreground">Koleksiyon</Link>
            <span aria-hidden="true" className="text-foreground/40">/</span>
            <span className="text-foreground/70" aria-current="page">{collection.title}</span>
          </nav>
          <h1 className="mt-5 font-display text-5xl font-medium leading-[1.02] text-foreground md:text-6xl lg:text-7xl">
            {collection.pageTitle}
          </h1>
          <p className="mt-5 max-w-lg text-sm font-light leading-7 text-foreground/75 md:text-base">{collection.lead}</p>
          <span aria-hidden="true" className="mt-6 block h-px w-16 bg-primary" />
        </div>
      </section>

      {/* ---- Katalog: kategoriler + ürünler ---- */}
      <div className="nil-catalog__layout grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        {/* Kategoriler */}
                {/* Sayfa menüsü */}
        <aside className="nil-catalog__sidebar relative overflow-hidden border-foreground/10 px-[clamp(1.25rem,4.9vw,7rem)] py-6 lg:border-r lg:px-8 lg:py-8 lg:pl-[clamp(1.25rem,4.9vw,7rem)]">
          <ul className="relative flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0" aria-label="Ürün sayfaları">
            {sideLinks.map(({ slug, label, count }) => {
              const active = collection.slug === slug;
              return (
                <li key={slug} className="shrink-0">
                  <Link
                    to="/koleksiyon/$slug"
                    params={{ slug }}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center justify-between gap-6 border border-foreground/15 px-4 py-2.5 text-left text-sm transition-colors lg:border-0 lg:border-b lg:border-l-2 lg:border-b-foreground/10 lg:px-4 lg:py-3.5",
                      active
                        ? "border-primary/60 bg-primary/5 text-primary lg:border-l-primary"
                        : "text-foreground/80 hover:text-primary lg:border-l-transparent",
                    )}
                  >
                    <span>{label}</span>
                    <span className="text-xs tabular-nums text-foreground/60">({count})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Ürünler */}
        <section aria-label={`${collection.pageTitle} ürünleri`} className="nil-catalog__products px-[clamp(1.25rem,4.9vw,7rem)] py-6 lg:px-10 lg:py-8 lg:pr-[clamp(1.25rem,4.9vw,7rem)]">
          <div className="nil-catalog__toolbar mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <label htmlFor="siralama" className="sr-only">Sıralama</label>
              <select
                id="siralama"
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="h-10 min-w-[15rem] cursor-pointer appearance-none border border-primary/40 bg-transparent pl-4 pr-10 text-xs text-foreground/85 outline-none transition-colors hover:border-primary focus-visible:border-primary"
              >
                {SORT_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value} className="bg-background text-foreground">{label}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary" strokeWidth={1.4} />
            </div>
            <div className="flex flex-wrap items-center gap-4"><p className="text-xs text-foreground/60">{visible.length} ürün</p><Link to="/siparis-ve-teslimat" className="text-xs text-[#d3ad79] underline-offset-4 hover:underline">Sipariş ve Teslimat <ArrowRight className="inline size-3"/></Link></div>
          </div>

          <div className="nil-catalog__grid grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => {
              const liked = favorites.has(product.name);
              return (
                <article key={product.name} className="nil-product-card group border border-foreground/12 bg-card/40 transition-colors duration-500 hover:border-primary/50">
                  <button
                    type="button"
                    onClick={() => openProduct(product)}
                    aria-label={`${product.name} ürününü incele`}
                    className="nil-product-card__visual block w-full overflow-hidden bg-black"
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={product.image}
                        alt={`${altBase} — ${product.name}`}
                        width={1024}
                        height={1280}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        style={{ objectPosition: product.focus ?? "center" }}
                      />
                    </div>
                  </button>
                  <div className="nil-product-card__title flex items-start justify-between gap-3 px-5 pt-4">
                    <h2 className="font-display text-xl leading-tight text-foreground md:text-2xl">{product.name}</h2>
                    <button
                      type="button"
                      aria-pressed={liked}
                      aria-label={liked ? `${product.name} favorilerden çıkar` : `${product.name} favorilere ekle`}
                      onClick={() => toggleFavorite(product.name)}
                      className="mt-1 text-foreground/70 transition-colors hover:text-primary"
                    >
                      <Heart className={cn("size-[18px]", liked && "fill-primary text-primary")} strokeWidth={1.4} />
                    </button>
                  </div>
                  <div className="nil-product-card__bottom flex items-end justify-between gap-3 px-5 pb-5 pt-2">
                    <p className="text-sm text-foreground/90">
                      <span className="text-xs text-foreground/60">Ölçüye özel teklif · WhatsApp</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => openProduct(product)}
                      className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-primary transition-colors hover:text-foreground"
                    >
                      Ürünü incele <ArrowRight className="size-3" />
                    </button>
                  </div>
                  <div className="border-t border-white/10 px-5 pb-4 pt-3">
                    <Link to="/urun/$slug" params={{ slug: "slug" in product && typeof product.slug === "string" ? product.slug : productSlug(product.name) }} className="inline-flex items-center gap-2 text-[11px] text-[#c6a16d] hover:text-white">
                      Ürün sayfası ve detaylar <ArrowRight className="size-3"/>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-14 flex justify-between gap-4 border-t border-foreground/10 pt-6 text-[9px] uppercase tracking-[0.1em] text-foreground/60">
            <p>© 2026 Nil Mobilya</p>
            <p>Form · Doku · Denge</p>
          </div>
        </section>
      </div>

      {/* Shared product detail design: same experience for every catalogue product. */}
      <Dialog open={quick !== null} onOpenChange={(open) => { if (!open) { setQuick(null); setZoomed(false); } }}>
        <DialogContent className="nil-showroom-dialog max-h-[94dvh] w-[calc(100vw-24px)] max-w-[1120px] gap-0 overflow-y-auto border border-primary/35 bg-[#131211] p-0 text-foreground shadow-[0_30px_100px_rgba(0,0,0,.75)] sm:rounded-[22px] lg:overflow-hidden">
          {quick && (
            <div className="nil-showroom">
              <div className="nil-showroom__gallery">
                <div className="nil-showroom__photo">
                  <img
                    src={quick.image}
                    alt={`${quick.name} ürün fotoğrafı`}
                    className="nil-showroom__photo-image"
                    style={{ objectPosition: quick.focus ?? "center" }}
                  />
                  <button type="button" className="nil-showroom__expand" aria-label="Ürün fotoğrafını büyüt" onClick={() => setZoomed(true)}><Expand size={17} /></button>
                  <span className="nil-showroom__stamp">NİL MOBİLYA · KOLEKSİYON</span>
                </div>
              </div>
              <div className="nil-showroom__panel" key={quick.name}>
                <div className="nil-showroom__header">
                  <span className="nil-showroom__eyebrow">{quick.category}</span>
                  <DialogTitle className="nil-showroom__title">{quick.name}</DialogTitle>
                  <DialogDescription className="nil-showroom__subtitle">{quick.material}</DialogDescription>
                </div>

                {quick.options && quick.options.length > 0 && (
                  <div className="nil-showroom__options">
                    {quick.options.map((option) => (
                      <fieldset className="nil-showroom__option" key={option.label}>
                        <legend className="nil-showroom__label">{option.label} Seçimi</legend>
                        <div className="nil-showroom__chips">
                          {option.values.map((value) => (
                            <button
                              key={value}
                              type="button"
                              aria-pressed={selectedOptions[option.label] === value}
                              className={cn("nil-showroom__chip", selectedOptions[option.label] === value && "is-selected")}
                              onClick={() => setSelectedOptions((current) => ({ ...current, [option.label]: value }))}
                            >{value}</button>
                          ))}
                        </div>
                      </fieldset>
                    ))}
                    <p className="nil-showroom__option-note">Seçimler teklif içindir; görseldeki ürün değişmez.</p>
                  </div>
                )}

                <div className="nil-showroom__tabs" role="tablist" aria-label="Ürün detayları">
                  <button type="button" role="tab" aria-selected={activeInfoTab === "measure"} className={cn("nil-showroom__tab", activeInfoTab === "measure" && "is-active")} onClick={() => setActiveInfoTab("measure")}><Ruler size={16} /> Ölçüler</button>
                  <button type="button" role="tab" aria-selected={activeInfoTab === "info"} className={cn("nil-showroom__tab", activeInfoTab === "info" && "is-active")} onClick={() => setActiveInfoTab("info")}><Info size={16} /> Ürün Bilgisi</button>
                  <button type="button" role="tab" aria-selected={activeInfoTab === "material"} className={cn("nil-showroom__tab", activeInfoTab === "material" && "is-active")} onClick={() => setActiveInfoTab("material")}><Layers3 size={16} /> Malzeme</button>
                </div>
                <section role="tabpanel" className="nil-showroom__infobox">
                  {activeInfoTab === "measure" && <>
                    <Ruler size={23} className="nil-showroom__infoicon" />
                    <div><h3>Standart Ölçüler</h3><p className="whitespace-pre-line">{quick.standardDimensions || "Standart ölçü bilgileri yakında eklenecek. Özel ölçü ile üretim için teklif alabilirsiniz."}</p></div>
                  </>}
                  {activeInfoTab === "info" && <>
                    <Info size={23} className="nil-showroom__infoicon" />
                    <div><h3>Ürün Bilgisi</h3><p className="whitespace-pre-line">{quick.productInfo || "Ürün bilgileri yakında eklenecek. Detaylı bilgi için bize ulaşabilirsiniz."}</p></div>
                  </>}
                  {activeInfoTab === "material" && <>
                    <Layers3 size={23} className="nil-showroom__infoicon" />
                    <div><h3>Malzeme ve Yüzey</h3><p>{quick.material || "Malzeme detayları için iletişime geçebilirsiniz."}</p></div>
                  </>}
                </section>

                <label className="nil-showroom__label nil-showroom__size-label" htmlFor="nil-custom-dimensions">Özel Ölçü Talebiniz <span>(İsteğe bağlı)</span></label>
                <input id="nil-custom-dimensions" className="nil-showroom__input" maxLength={120} value={customDimensions} onChange={(event) => setCustomDimensions(event.target.value)} placeholder="Örn. 140 × 60 × 90 cm" />
                <a
                  className="nil-showroom__cta"
                  href={whatsappOfferUrl([quick.name, ...Object.entries(selectedOptions).map(([label, value]) => `${label}: ${value}`), ...(customDimensions.trim() ? [`Özel ölçü talebi: ${customDimensions.trim()}`] : [])].join(" · "))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setQuick(null)}
                ><MessageCircle size={18} /> WHATSAPP'TAN TEKLİF AL <ArrowUpRight size={17} /></a>
                <Link to="/urun/$slug" params={{ slug: "slug" in quick && typeof quick.slug === "string" ? quick.slug : productSlug(quick.name) }} onClick={() => setQuick(null)} className="mt-4 inline-flex items-center gap-2 text-xs text-[#c5a579] hover:text-white">Ürünün detay sayfası <ArrowRight size={14}/></Link>
                <Link to="/siparis-ve-teslimat" onClick={() => setQuick(null)} className="mt-3 text-xs text-[#aaa095] hover:text-[#e6c493]">Sipariş ve teslimat süreci hakkında bilgi</Link>
                {relatedProducts.length > 0 && (
                  <section className="nil-showroom__related" aria-label="Benzer ürünler">
                    <h3>Benzer Ürünler</h3>
                    <div className="nil-showroom__related-grid">
                      {relatedProducts.map((product) => (
                        <button key={product.name} type="button" onClick={() => openProduct(product)} aria-label={`${product.name} ürününü incele`} className="nil-showroom__related-item">
                          <img src={product.image} alt="" loading="lazy" />
                          <span>{product.name}</span><ArrowRight size={14} />
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {zoomed && quick && (
        <div className="nil-showroom-zoom" role="dialog" aria-modal="true" aria-label={`${quick.name} büyütülmüş fotoğrafı`} onClick={() => setZoomed(false)}>
          <button className="nil-showroom-zoom__close" type="button" aria-label="Büyütülmüş fotoğrafı kapat" onClick={() => setZoomed(false)}>Kapat ×</button>
          <img src={quick.image} alt={`${quick.name} büyük ürün fotoğrafı`} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
