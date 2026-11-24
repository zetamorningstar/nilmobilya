import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronDown, Heart, Ruler, Info, Layers3, Expand, MessageCircle, ClipboardList, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SiteMenu } from "@/components/site-menu";
import { SiteSearch } from "@/components/site-search";
import { ALL_SLUG, CATALOG_SLUGS, getCollection, productSlug, type Collection, type CollectionProduct } from "@/lib/collections";
import { cn } from "@/lib/utils";
import { whatsappOfferUrl, whatsappProductOfferUrl } from "@/lib/sales";
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

export function CollectionCatalog({ collection }: { collection: Collection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("oner");
  const [query, setQuery] = useState("");
  const [materialFilter, setMaterialFilter] = useState("all");
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

  const materialOptions = useMemo(() => Array.from(new Set(products.map(p => p.material?.trim()).filter((name): name is string => !!name))).sort((a,b)=>a.localeCompare(b,"tr")), [products]);
  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr-TR");
    const list = products.filter(product =>
      (!term || [product.name,product.category,product.material].some(value=>value?.toLocaleLowerCase("tr-TR").includes(term))) &&
      (materialFilter==="all" || product.material===materialFilter));
    if (sort === "isim") list.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    return list;
  }, [products, sort, query, materialFilter]);
  const categoryCards = useMemo(() => CATALOG_SLUGS.flatMap(slug=>{
    const category=getCollection(slug);
    if(!category) return [];
    return [{...category,count:mergeCatalogProducts(slug,liveProducts,liveCategories).length}];
  }),[liveProducts,liveCategories]);
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
            <Link to="/teklif" className="nil-quote">Teklif Al</Link>
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

      {/* Showroom hero — same composition on all collection routes, no fictitious inventory. */}
      <section className="nil-collection-vitrine relative isolate overflow-hidden border-b border-[#45413a]/40">
        <img src="/Alacakaranl%C4%B1kta%20L%C3%BCks%20Modern%20Salon.webp" alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover object-[56%_center]"/>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,10,12,.98)_0%,rgba(10,11,13,.94)_30%,rgba(10,11,13,.58)_61%,rgba(8,9,11,.24)_100%)]"/>
        <div className="mx-auto flex min-h-[330px] max-w-[1800px] flex-col justify-center px-[clamp(1.25rem,4.9vw,7rem)] pb-12 pt-[125px] sm:min-h-[390px] sm:pb-14 md:pt-[145px] lg:min-h-[430px]">
          <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-2 text-[11px] tracking-[.04em] text-[#bbb6ae]">
            <Link to="/" className="hover:text-[#d8bd8f]">Ana Sayfa</Link><ArrowRight size={12}/>
            <span className="text-[#d5bb90]">Koleksiyon</span>
            {collection.slug!==ALL_SLUG&&<><ArrowRight size={12}/><span>{collection.title}</span></>}
          </nav>
          <h1 className="mt-6 max-w-[780px] font-display text-[clamp(42px,4.8vw,72px)] font-normal leading-[1.02] tracking-[-.025em] text-[#f0ebe5]">{collection.slug===ALL_SLUG?"Koleksiyon":collection.pageTitle}</h1>
          <p className="mt-5 max-w-[550px] text-[13px] leading-[1.85] text-[#cec9c2] md:text-[15px]">{collection.slug===ALL_SLUG?"Ölçülerinize ve yaşam alanınıza göre şekillenen mobilya koleksiyonumuzu keşfedin. Tasarımı birlikte, ihtiyaçlarınıza göre planlayalım.":collection.lead}</p>
          <span className="mt-6 h-px w-20 bg-[#b49b73]"/>
        </div>
      </section>

      <div className="nil-collection-content relative mx-auto max-w-[1800px] px-[clamp(1.25rem,4.9vw,7rem)] pb-16">
        {/* Real filters and an integrated quote entry, not a separate billboard. */}
        <div className="nil-collection-filters relative z-10 -mt-7 mb-9 grid items-center gap-3 rounded-2xl border border-[#50545a] bg-[#191b1e]/95 p-3 shadow-[0_18px_55px_rgba(0,0,0,.32)] backdrop-blur-lg lg:grid-cols-[minmax(0,1fr)_auto] lg:p-4">
          <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-[1.05fr_1.1fr_1.1fr]">
            <div className="relative">
              <label htmlFor="nil-category" className="sr-only">Ürün kategorisi</label>
              <select id="nil-category" value={collection.slug} onChange={e=>{const slug=e.target.value;window.location.assign("/koleksiyon/"+encodeURIComponent(slug));}} className="nil-filter-control w-full appearance-none pr-9">
                <option value={ALL_SLUG}>Tüm Kategoriler</option>
                {sideLinks.filter(x=>x.slug!==ALL_SLUG).map(x=><option key={x.slug} value={x.slug}>{x.label}</option>)}
              </select>
              <ChevronDown aria-hidden="true" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#c7b086]"/>
            </div>
            <div className="relative">
              <label htmlFor="nil-material" className="sr-only">Malzeme filtresi</label>
              <select id="nil-material" value={materialFilter} onChange={e=>setMaterialFilter(e.target.value)} className="nil-filter-control w-full appearance-none pr-9">
                <option value="all">Tüm Malzemeler</option>
                {materialOptions.map(name=><option key={name} value={name}>{name}</option>)}
              </select>
              <ChevronDown aria-hidden="true" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#c7b086]"/>
            </div>
            <div className="relative sm:col-span-2 xl:col-span-1">
              <label htmlFor="nil-product-search" className="sr-only">Ürün ara</label>
              <Search aria-hidden="true" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#c7b086]"/>
              <input id="nil-product-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ürün ara…" className="nil-filter-control w-full pl-10 placeholder:text-[#a7a19a]"/>
            </div>
          </div>
          <Link to="/teklif" className="nil-collection-quote group flex min-h-[55px] items-center justify-between gap-5 rounded-xl border border-[#947a51] bg-[#25231f] px-5 py-2.5 text-left transition-colors hover:border-[#c5a577] hover:bg-[#302b24]">
            <div className="flex min-w-0 items-center gap-3"><ClipboardList size={22} className="shrink-0 text-[#c9a771]"/><span><strong className="block text-[14px] font-semibold text-[#d7b884]">Akıllı Teklif Oluştur</strong><small className="mt-0.5 block text-[11px] text-[#b7afa4]">Ürün ve ölçülerini birlikte belirleyelim</small></span></div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#bd9e6b] text-[#171614] transition-transform group-hover:translate-x-1"><ArrowRight size={17}/></span>
          </Link>
        </div>

        {collection.slug===ALL_SLUG && !query && materialFilter==="all" &&
        <section aria-label="Koleksiyon kategorileri" className="mb-11">
          <div className="mb-5 flex items-baseline justify-between gap-3"><h2 className="font-display text-2xl text-[#e8e1d7] md:text-3xl">Kategorileri Keşfedin</h2><span className="text-[11px] text-[#b4aea4]">{categoryCards.length} kategori</span></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categoryCards.map(category=><Link key={category.slug} to="/koleksiyon/$slug" params={{slug:category.slug}} className="nil-category-tile group relative isolate min-h-[190px] overflow-hidden rounded-[15px] border border-[#4d4640] bg-[#191a1c] sm:min-h-[225px]">
              <img src={category.hero} alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" style={{objectPosition:category.heroFocus}}/>
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/25 to-transparent"/>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5"><div><h3 className="font-display text-[25px] leading-none text-[#f2ece5]">{category.pageTitle}</h3><p className="mt-2 text-[12px] text-[#ddd0bb]">{category.count} ürün</p></div><span className="grid size-9 place-items-center rounded-full border border-[#bca077] text-[#ead6b5] transition-colors group-hover:bg-[#bca077] group-hover:text-[#111]"><ArrowRight size={16}/></span></div>
            </Link>)}
          </div>
        </section>}
        <section aria-label={`${collection.pageTitle} ürünleri`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[13px] text-[#d4c8b4]"><strong className="text-[19px] text-[#c5a371]">{visible.length}</strong> ürün</p>
            <div className="flex items-center gap-3"><label htmlFor="siralama" className="text-xs text-[#aaa39b]">Sıralama</label><div className="relative">
              <select id="siralama" value={sort} onChange={e=>setSort(e.target.value as Sort)} className="nil-filter-control min-w-[165px] appearance-none pr-9"><option value="oner">Öne Çıkanlar</option><option value="isim">İsim (A–Z)</option></select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#bda277]"/>
            </div></div>
          </div>
          {visible.length===0&&<div className="rounded-xl border border-[#464a50] bg-[#191b1f] px-6 py-10 text-center text-sm text-[#bfc0c2]">Bu filtrelere uygun ürün bulunamadı. Arama veya malzeme filtresini değiştirebilirsin.</div>}
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
                  href={whatsappProductOfferUrl({product:quick.name,choices:selectedOptions,dimensions:customDimensions,productUrl:typeof window!=="undefined"?window.location.origin+"/urun/"+("slug" in quick&&typeof quick.slug==="string"?quick.slug:productSlug(quick.name)):undefined})}
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
