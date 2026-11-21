import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { SiteMenu } from "@/components/site-menu";
import { SiteSearch } from "@/components/site-search";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { works, type Work, type WorkCategory } from "@/lib/works";
import { getSupabaseClient } from "@/lib/supabase-client";

export const Route = createFileRoute("/sergimiz")({
  head: () => ({
    meta: [
      { title: "Sergimiz | Nil Mobilya" },
      { name: "description", content: "Nil Mobilya'nın bugüne kadar hayata geçirdiği çalışmalar." },
      { property: "og:title", content: "Sergimiz | Nil Mobilya" },
      { property: "og:description", content: "Nil Mobilya'nın bugüne kadar hayata geçirdiği çalışmalar." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Sergimiz,
});

// Menü ve arama: ana sayfadaki bölümlerle aynı
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

const CATEGORIES: readonly (readonly [WorkCategory, string])[] = [
  ["tv", "TV Üniteleri"],
  ["banko", "Banko"],
  ["dolap", "Dolap Sistemleri"],
  ["yatak", "Yatak Odası"],
  ["diger", "Diğer"],
];

type Sort = "yeni" | "eski";
const SORTS: readonly (readonly [Sort, string])[] = [
  ["yeni", "Sıralama: En Yeni"],
  ["eski", "Sıralama: En Eski"],
];

type Item = Work & { category: WorkCategory; order: number };

const DEFAULT_RATIO = 1.9; // fotoğraf yüklenene kadar kullanılan en/boy oranı

function Placeholder() {
  return (
    <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#16130f] to-[#0a0908]">
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" className="size-14 text-primary/30">
        <path d="M6 26V6l20 20V6" />
        <path d="M3 29V3M29 29V3" opacity="0.45" />
      </svg>
    </span>
  );
}

function Tile({ item, index, onOpen }: { item: Item; index: number; onOpen: () => void }) {
  const liRef = useRef<HTMLLIElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [shown, setShown] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ratio, setRatio] = useState(item.ratio ?? DEFAULT_RATIO);

  // Ekrana girince aşağıdan yükselerek belirir
  useEffect(() => {
    const el = liRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Fotoğraf sayfa yüklenmeden önce bittiyse oranı buradan al
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    if (img.naturalWidth === 0) setFailed(true);
    else if (!item.ratio) setRatio(img.naturalWidth / img.naturalHeight);
  }, [item.ratio]);

  return (
    <li
      ref={liRef}
      style={{
        flexGrow: ratio * 100,
        flexBasis: `calc(var(--row-h) * ${ratio})`,
        transitionDelay: `${(index % 3) * 90}ms`,
      }}
      className={cn(
        "min-w-0 transition duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${item.title} fotoğrafını büyüt`}
        className="group relative block w-full overflow-hidden rounded-lg border border-foreground/15 bg-card transition-colors duration-500 hover:border-primary/60 focus-visible:border-primary focus-visible:outline-none"
      >
        <span className="block" style={{ paddingBottom: `${100 / ratio}%` }} />
        {failed ? (
          <Placeholder />
        ) : (
          <img
            ref={imgRef}
            src={item.image}
            alt={item.alt}
            loading={index < 6 ? "eager" : "lazy"}
            decoding="async"
            onLoad={(event) => {
              const { naturalWidth, naturalHeight } = event.currentTarget;
              if (!item.ratio && naturalWidth > 0 && naturalHeight > 0) setRatio(naturalWidth / naturalHeight);
            }}
            onError={() => setFailed(true)}
            className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        )}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3.5 pt-10 text-left opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="block font-display text-xl leading-tight text-foreground">{item.title}</span>
          <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-foreground/70">
            {item.place} · {item.year}
          </span>
        </span>
      </button>
    </li>
  );
}

function Sergimiz() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState<"all" | WorkCategory>("all");
  const [sort, setSort] = useState<Sort>("yeni");
  const [open, setOpen] = useState<number | null>(null);
  const [remoteWorks, setRemoteWorks] = useState<Work[]>([]);
  const [remoteReady, setRemoteReady] = useState(false);
  useEffect(() => {
    const db = getSupabaseClient();
    if (!db) return;
    let active = true;
    db.from("projects").select("id,title,description,image_urls,published,sort_order")
      .eq("published", true).order("sort_order").then(({data,error}) => {
        if (!active || error) return;
        const decoded: Work[] = (data ?? []).flatMap(project => {
          let meta: {place?:string;year?:string;category?:string} = {};
          if (project.description?.startsWith("NIL_PROJECT_V1:")) {
            try { meta=JSON.parse(project.description.slice("NIL_PROJECT_V1:".length)); } catch {}
          }
          const category: WorkCategory = (["tv","banko","dolap","yatak","diger"].includes(meta.category??"") ? meta.category : "diger") as WorkCategory;
          return (project.image_urls ?? []).filter((url:string)=>Boolean(url)).map((image:string)=>({
            title:project.title,place:meta.place||"",year:meta.year||"",category,
            image,alt:project.title+" ürün veya proje fotoğrafı",
          }));
        });
        setRemoteWorks(decoded);setRemoteReady(true);
      });
    return () => { active=false; };
  }, []);


  const items = useMemo<Item[]>(
    () => (remoteReady ? remoteWorks : works).map((work, order) => ({ ...work, category: work.category ?? "diger", order })),
    [remoteReady, remoteWorks],
  );

  // Yalnızca en az bir işi olan kategoriler gösterilir
  const chips = useMemo(
    () => CATEGORIES.filter(([key]) => items.some((item) => item.category === key)),
    [items],
  );

  const visible = useMemo(() => {
    const list = category === "all" ? [...items] : items.filter((item) => item.category === category);
    list.sort((a, b) => {
      const diff = (Number(b.year) || 0) - (Number(a.year) || 0);
      return (sort === "yeni" ? diff : -diff) || a.order - b.order;
    });
    return list;
  }, [items, category, sort]);

  const current = open === null ? null : (visible[open] ?? null);
  const go = (step: number) =>
    setOpen((index) => (index === null ? index : (index + step + visible.length) % visible.length));

  return (
    <main lang="tr" className="relative isolate min-h-screen bg-background text-foreground">
      {/* ---- Üst menü (ana sayfadakiyle aynı) ---- */}
      <div className="nil-header fixed inset-x-0 top-0 z-40">
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
                aria-current={hash === "sergimiz" ? "true" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="nil-nav__tools">
            <Link to="/" hash="iletisim" className="nil-quote">Teklif Al</Link>
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

      {/* ---- Başlık alanı: mermer zemin + filtreler ---- */}
      <section className="relative overflow-hidden px-[clamp(1.25rem,4.9vw,7rem)] pb-10 pt-[calc(83px+3.2rem)] max-lg:pt-[calc(68px+2.5rem)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'url("/bg-blocks.webp")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            WebkitMaskImage: "linear-gradient(to bottom, #000 70%, transparent)",
            maskImage: "linear-gradient(to bottom, #000 70%, transparent)",
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/85 via-background/35 to-transparent" />

        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Sergimiz</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,3vw,4.4rem)] font-medium leading-[1.06] text-foreground">
            Müşterilerimizin
            <br />
            Yaşam Alanları
          </h1>
          <p className="mt-5 max-w-[28rem] text-sm font-light leading-6 text-foreground/80 md:text-base md:leading-7">
            Nil Mobilya tasarımlarının, gerçek yaşam alanlarındaki uygulamalarını keşfedin. Her biri, müşterilerimizin tarzına ve ihtiyacına özel olarak hayata geçirildi.
          </p>
          <span aria-hidden="true" className="mt-6 block h-px w-14 bg-primary" />
        </div>

        <div className="relative mt-10 flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label="Kategoriler" className="flex flex-wrap items-center gap-y-2">
            {[["all", "Tümü"] as const, ...chips].map(([key, label]) => {
              const active = category === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(key)}
                  className={cn(
                    "h-[34px] rounded-md border px-6 text-base transition-colors",
                    active ? "border-primary text-primary" : "border-transparent text-foreground/85 hover:text-primary",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <label htmlFor="sergi-siralama" className="sr-only">Sıralama</label>
            <select
              id="sergi-siralama"
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              className="h-[30px] min-w-[12.5rem] cursor-pointer appearance-none rounded-md border border-foreground/20 bg-background/40 pl-4 pr-9 text-sm text-foreground/85 outline-none transition-colors hover:border-primary focus-visible:border-primary"
            >
              {SORTS.map(([value, label]) => (
                <option key={value} value={value} className="bg-background text-foreground">{label}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground/70" strokeWidth={1.4} />
          </div>
        </div>
      </section>

      {/* ---- Galeri ---- */}
      <section aria-label="Çalışmalar" className="px-[clamp(1.25rem,4.9vw,7rem)] pb-16">
        {items.length === 0 ? (
          <p className="py-16 text-center text-sm font-light uppercase tracking-[0.2em] text-foreground/60">
            Sergimiz çok yakında burada.
          </p>
        ) : visible.length === 0 ? (
          <p className="py-16 text-center text-sm font-light text-foreground/60">Bu kategoride henüz çalışma yok.</p>
        ) : (
          <ul
            className="flex flex-wrap gap-[10px] after:grow-[10000] after:content-['']"
            style={{ "--row-h": "clamp(170px, 14.1vw, 300px)" } as CSSProperties}
          >
            {visible.map((item, index) => (
              <Tile key={item.image} item={item} index={index} onOpen={() => setOpen(index)} />
            ))}
          </ul>
        )}

        <div className="mt-16 flex justify-between gap-4 text-[9px] uppercase tracking-[0.1em] text-foreground/60">
          <p>© 2026 Nil Mobilya</p>
          <p>Modern · Nitelikli · Zamansız</p>
        </div>
      </section>

      {/* ---- Büyük görünüm ---- */}
      <Dialog open={current !== null} onOpenChange={(isOpen) => { if (!isOpen) setOpen(null); }}>
        <DialogContent
          className="w-[min(94vw,1280px)] max-w-none gap-0 overflow-hidden border-primary/30 bg-background p-0 sm:rounded-none"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") go(1);
            if (event.key === "ArrowLeft") go(-1);
          }}
        >
          {current && (
            <>
              <div className="relative bg-black">
                <img src={current.image} alt={current.alt} className="mx-auto max-h-[80svh] w-auto max-w-full object-contain" />
                {visible.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Önceki"
                      onClick={() => go(-1)}
                      className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center border border-foreground/20 bg-black/50 text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
                    >
                      <ChevronLeft className="size-5" strokeWidth={1.4} />
                    </button>
                    <button
                      type="button"
                      aria-label="Sonraki"
                      onClick={() => go(1)}
                      className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center border border-foreground/20 bg-black/50 text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
                    >
                      <ChevronRight className="size-5" strokeWidth={1.4} />
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-end justify-between gap-6 px-6 py-4">
                <div>
                  <DialogTitle className="font-display text-2xl font-normal leading-tight">{current.title}</DialogTitle>
                  <DialogDescription className="mt-1 text-[10px] uppercase tracking-[0.18em] text-foreground/60">
                    {current.place} · {current.year}
                  </DialogDescription>
                </div>
                <p className="text-xs tabular-nums text-foreground/50">{(open ?? 0) + 1} / {visible.length}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}