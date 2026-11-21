import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronDown, Heart } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SiteMenu } from "@/components/site-menu";
import { SiteSearch } from "@/components/site-search";
import { ALL_SLUG, CATALOG_SLUGS, getCollection, type Collection, type CollectionProduct } from "@/lib/collections";
import { cn } from "@/lib/utils";
import { whatsappOfferUrl } from "@/lib/sales";

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
  const openProduct = (product: CollectionProduct) => { setSelectedOptions({}); setCustomDimensions(""); setQuick(product); };

  const { products } = collection;

    // Soldaki sayfa menüsü
  const sideLinks: { slug: string; label: string; count: number }[] = [
    {
      slug: ALL_SLUG,
      label: "Tüm ürünler",
      count: CATALOG_SLUGS.reduce((total, s) => total + (getCollection(s)?.products.length ?? 0), 0),
    },
    ...CATALOG_SLUGS.flatMap((s) => {
      const item = getCollection(s);
      return item ? [{ slug: s as string, label: item.title, count: item.products.length }] : [];
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

  const altBase = `Nil Mobilya ${collection.title.toLocaleLowerCase("tr-TR")} koleksiyonu`;

  return (
    <main className="relative isolate min-h-screen bg-background text-foreground">
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
      <section className="relative overflow-hidden border-b border-primary/25 px-[clamp(1.25rem,4.9vw,7rem)] pb-12 pt-[calc(83px+3.25rem)] max-lg:pt-[calc(68px+2.5rem)]">
        
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
      <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        {/* Kategoriler */}
                {/* Sayfa menüsü */}
        <aside className="relative overflow-hidden border-foreground/10 px-[clamp(1.25rem,4.9vw,7rem)] py-6 lg:border-r lg:px-8 lg:py-8 lg:pl-[clamp(1.25rem,4.9vw,7rem)]">
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
        <section aria-label={`${collection.pageTitle} ürünleri`} className="px-[clamp(1.25rem,4.9vw,7rem)] py-6 lg:px-10 lg:py-8 lg:pr-[clamp(1.25rem,4.9vw,7rem)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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
            <p className="text-xs text-foreground/60">{visible.length} ürün</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => {
              const liked = favorites.has(product.name);
              return (
                <article key={product.name} className="group border border-foreground/12 bg-card/40 transition-colors duration-500 hover:border-primary/50">
                  <button
                    type="button"
                    onClick={() => openProduct(product)}
                    aria-label={`${product.name} ürününü incele`}
                    className="block w-full overflow-hidden bg-black"
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
                  <div className="flex items-start justify-between gap-3 px-5 pt-4">
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
                  <div className="flex items-end justify-between gap-3 px-5 pb-5 pt-2">
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

      {/* ---- Ürün detayı: görsel, varyant, bilgiler ve özel ölçü talebi ---- */}
      <Dialog open={quick !== null} onOpenChange={(open) => { if (!open) setQuick(null); }}>
        <DialogContent className="flex max-h-[94dvh] w-[calc(100vw-24px)] max-w-[1050px] flex-col gap-0 overflow-hidden rounded-xl border border-primary/30 bg-[#131211] p-0 text-foreground shadow-[0_30px_100px_rgba(0,0,0,.72)] sm:rounded-xl lg:flex-row">
          {quick && (
            <>
              <div className="relative flex min-h-0 shrink-0 items-center justify-center bg-[#090909] lg:w-[52%]">
                <div className="flex h-[min(35dvh,310px)] w-full items-center justify-center overflow-hidden sm:h-[min(42dvh,440px)] lg:h-full lg:max-h-[86dvh]">
                  <img
                    src={quick.image}
                    alt={`${altBase} — ${quick.name}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="pointer-events-none absolute bottom-3 left-4 rounded border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[.16em] text-white/75 backdrop-blur-md">Nil Mobilya · Koleksiyon</span>
              </div>
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-5 pt-8 sm:px-8 sm:pb-8 sm:pt-10 lg:max-h-[86dvh]">
                <p className="text-[10px] font-semibold uppercase tracking-[.23em] text-primary">{quick.category}</p>
                <DialogTitle className="mt-3 pr-5 font-display text-3xl font-normal leading-[1.1] sm:text-4xl">{quick.name}</DialogTitle>
                <DialogDescription className="mt-3 text-sm leading-6 text-foreground/65">{quick.material}</DialogDescription>

                {quick.options && quick.options.length > 0 && (
                  <div className="mt-7 space-y-5 border-t border-white/10 pt-6">
                    {quick.options.map((option) => (
                      <fieldset key={option.label}>
                        <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[.15em] text-primary">{option.label} seçimi</legend>
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => {
                            const active = selectedOptions[option.label] === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                aria-pressed={active}
                                onClick={() => setSelectedOptions((current) => ({ ...current, [option.label]: value }))}
                                className={cn("rounded-lg border px-4 py-2.5 text-xs transition-all duration-200", active ? "border-primary bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_rgba(184,146,96,.3)]" : "border-white/15 bg-white/[.025] text-foreground/75 hover:border-primary/65 hover:text-foreground")}
                              >{value}</button>
                            );
                          })}
                        </div>
                      </fieldset>
                    ))}
                    <p className="text-[11px] leading-5 text-foreground/50">Seçenekler sipariş görüşmesi için tercih belirtir; fotoğraf yalnızca gösterilen modeli temsil eder.</p>
                  </div>
                )}

                <div className="mt-7 space-y-5 border-t border-white/10 pt-6">
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Standart Ölçüler</h3>
                    <p className="mt-2 whitespace-pre-line text-xs leading-6 text-foreground/65">{quick.standardDimensions || "Standart ölçü bilgileri yakında eklenecek."}</p>
                  </section>
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Ürün Bilgisi</h3>
                    <p className="mt-2 whitespace-pre-line text-xs leading-6 text-foreground/65">{quick.productInfo || "Ürün bilgileri yakında eklenecek. Malzeme ve üretim detaylarını WhatsApp üzerinden sorabilirsiniz."}</p>
                  </section>
                </div>

                <label htmlFor="nil-custom-dimensions" className="mt-6 block text-xs font-medium text-foreground/85">Özel ölçü talebiniz <span className="font-normal text-foreground/45">(isteğe bağlı)</span></label>
                <input
                  id="nil-custom-dimensions"
                  value={customDimensions}
                  onChange={(event) => setCustomDimensions(event.target.value)}
                  maxLength={120}
                  placeholder="Örn. 140 × 60 × 90 cm"
                  className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-white/[.04] px-4 text-sm text-foreground outline-none transition focus:border-primary"
                />
                <p className="mt-5 text-xs leading-6 text-foreground/55">Fiyat; ölçü, malzeme ve üretim tercihlerinize göre paylaşılır.</p>
                <Button asChild variant="goldOutline" size="lg" className="mt-4 min-h-12 w-full rounded-lg px-4 text-xs uppercase tracking-[.1em]">
                  <a
                    href={whatsappOfferUrl([quick.name, ...Object.entries(selectedOptions).map(([label, value]) => `${label}: ${value}`), ...(customDimensions.trim() ? [`Özel ölçü talebi: ${customDimensions.trim()}`] : [])].join(" · "))}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setQuick(null)}
                  >WhatsApp'tan teklif al <ArrowUpRight className="size-4" /></a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
