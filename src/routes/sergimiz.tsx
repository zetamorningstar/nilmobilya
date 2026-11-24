import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ChevronRight, Instagram, ArrowUpRight, Layers3, Camera, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { SiteMenu } from "@/components/site-menu";
import { SiteSearch } from "@/components/site-search";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { works, type Work, type WorkCategory } from "@/lib/works";
import { getSupabaseClient } from "@/lib/supabase-client";
import showcaseHero from "@/assets/custom-hero.jpg";

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
type InstagramEntry={url:string;title:string};
function safeInstagramPost(url:string):string|null {
 try{
  const parsed=new URL(url.trim());
  if(parsed.protocol!=="https:"||!["instagram.com","www.instagram.com","m.instagram.com"].includes(parsed.hostname))return null;
  const parts=parsed.pathname.split("/").filter(Boolean);
  // Common public post/reel forms, including copied mobile links.
  if(parts.length===2&&["p","reel","reels","tv"].includes(parts[0])&&/^[A-Za-z0-9_-]+$/.test(parts[1])){
   const kind=parts[0]==="reels"?"reel":parts[0];
   return "https://www.instagram.com/"+kind+"/"+parts[1]+"/";
  }
  return null;
 }catch{return null}
}
function InstagramPost({entry,index}:{entry:InstagramEntry;index:number}){
 const embed=entry.url.replace(/\/$/,"")+"/embed/";
 return <article className="group min-w-0 overflow-hidden rounded-[22px] border border-[#75583d]/40 bg-[#181411] shadow-[0_18px_45px_rgba(0,0,0,.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b38b57]/70">
  <div className="flex items-center justify-between gap-3 border-b border-[#604630]/45 px-4 py-3.5">
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#8f6c40]/50 bg-[#352719]"><Instagram size={17} className="text-[#d6aa74]"/></span>
      <div className="min-w-0"><span className="block truncate text-[11px] text-[#bfa27c]">@nill.mobilya</span><h3 className="truncate font-display text-lg text-[#f0dec8]">{entry.title}</h3></div>
    </div>
    <span className="shrink-0 rounded-full border border-[#71563a]/50 px-2.5 py-1 text-[10px] text-[#ac8e69]">#{String(index+1).padStart(2,"0")}</span>
  </div>
  <iframe title={entry.title+" Instagram gönderisi"} src={embed} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" className="block h-[430px] w-full bg-white sm:h-[475px]"/>
  <a href={entry.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 border-t border-[#604630]/45 px-5 py-4 text-sm text-[#d2ac7b] transition-colors hover:bg-[#2a2018]"><span>Gönderiyi Instagram'da incele</span><ArrowUpRight size={17}/></a>
 </article>;
}

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
  const [instagramEntries,setInstagramEntries]=useState<InstagramEntry[]>([]);
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
        const instagramEntries:InstagramEntry[]=(data??[]).flatMap(project=>(project.image_urls??[]).flatMap((url:string)=>{const link=safeInstagramPost(url);return link?[{url:link,title:project.title}]:[]}));
        setInstagramEntries(instagramEntries);
        setRemoteWorks(decoded.filter(item=>!safeInstagramPost(item.image)));
        setRemoteReady(true);
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

      {/* ---- Editoryal giriş: doğal ahşap ve sıcak ışık ---- */}
      <section className="relative isolate overflow-hidden border-b border-[#59432d]/40 bg-[#16120f] pt-[calc(78px+3.5rem)] pb-10 max-lg:pt-[calc(68px+3rem)] md:pb-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{backgroundImage:`linear-gradient(90deg,rgba(10,9,8,.98) 0%,rgba(10,9,8,.91) 36%,rgba(10,9,8,.46) 69%,rgba(10,9,8,.24) 100%),url("${showcaseHero}")`,backgroundSize:"cover",backgroundPosition:"center 45%"}}/>
        <div className="relative mx-auto grid max-w-[1500px] gap-10 px-[clamp(1.25rem,4.9vw,6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,.7fr)] lg:items-center">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.24em] text-[#cf9f63]">SERGİMİZ <span className="h-px w-12 bg-[#b38a5a]"/></p>
            <h1 className="mt-5 max-w-[810px] font-display text-[clamp(3.2rem,5.2vw,6.2rem)] font-medium leading-[.98] tracking-[-.028em] text-[#f0e4d7]">Tasarımlarımızı<br/><span className="text-[#d4af83]">Sergiliyoruz.</span></h1>
            <p className="mt-6 max-w-[620px] text-sm leading-7 text-[#d5c8b9] md:text-base md:leading-8">Özel üretim mobilyalarımızı, tamamlanan uygulamalarımızı ve atölyemizden gerçek paylaşımları keşfedin. İlham veren detayları bir araya getirdik.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#instagram-calismalar" className="inline-flex items-center gap-2 rounded-xl bg-[#b68d5c] px-5 py-3.5 text-sm font-semibold text-[#17110c] transition hover:bg-[#d1a879]"><Instagram size={17}/> Çalışmalarımıza göz at</a>
              <a href="https://www.instagram.com/nill.mobilya/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#a78152]/60 bg-black/25 px-5 py-3.5 text-sm text-[#e2c29b] transition hover:bg-[#34281d]">Instagram profilimiz <ArrowUpRight size={16}/></a>
            </div>
          </div>
          <div className="hidden lg:flex min-h-[280px] items-end justify-end">
            <div className="max-w-[300px] rounded-2xl border border-[#8f6c45]/40 bg-[#0d0b09]/60 p-6 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[.2em] text-[#c69c68]">NİL MOBİLYA</p>
              <p className="mt-3 font-display text-3xl text-[#f0dfc9]">Her mekâna özel bir dokunuş.</p>
              <p className="mt-3 text-xs leading-6 text-[#c2b4a4]">Ölçüye özel üretim, seçilmiş malzemeler ve kişisel tasarım yaklaşımı.</p>
            </div>
          </div>
        </div>
      </section>
      <section aria-label="Çalışma yaklaşımımız" className="border-b border-[#49392b]/55 bg-[#141110] px-[clamp(1.25rem,4.9vw,6rem)]">
        <div className="mx-auto grid max-w-[1500px] gap-4 py-5 md:grid-cols-3 md:divide-x md:divide-[#4d3c2d]/70">
          <div className="flex items-center gap-3 md:px-5"><Layers3 size={22} className="shrink-0 text-[#c09a6e]"/><div><strong className="block text-sm text-[#e5d6c4]">Özel Üretim Projeler</strong><span className="text-xs text-[#a99a8b]">Mekânınıza göre tasarım</span></div></div>
          <div className="flex items-center gap-3 md:px-5"><Camera size={22} className="shrink-0 text-[#c09a6e]"/><div><strong className="block text-sm text-[#e5d6c4]">Gerçek Uygulamalar</strong><span className="text-xs text-[#a99a8b]">Atölyeden paylaşımlar</span></div></div>
          <div className="flex items-center gap-3 md:px-5"><Sparkles size={22} className="shrink-0 text-[#c09a6e]"/><div><strong className="block text-sm text-[#e5d6c4]">İlham Veren Çözümler</strong><span className="text-xs text-[#a99a8b]">Farklı mekânlar için fikirler</span></div></div>
        </div>
      </section>
      {/* ---- Instagram gönderilerinden oluşan kart galerisi ---- */}
      <section id="instagram-calismalar" className="scroll-mt-24 bg-[radial-gradient(ellipse_at_top,#2b2119_0%,#12100e_48%,#0b0a09_100%)] px-[clamp(1.25rem,4.9vw,6rem)] py-12 md:py-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-[#c49c6b]">INSTAGRAM / ÇALIŞMALAR</p><h2 className="mt-3 font-display text-[clamp(2.5rem,3.5vw,4.3rem)] leading-[1.04] text-[#f0dec9]">Atölyeden Yeni Paylaşımlar</h2><p className="mt-4 max-w-[680px] text-sm leading-7 text-[#b8a898]">Üretim süreçlerimiz, tamamlanan işlerimiz ve atölyemizden en yeni kareler. Her gönderi gerçek Instagram paylaşımına bağlıdır.</p></div>
            <a href="https://www.instagram.com/nill.mobilya/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#96734b]/60 px-4 py-3 text-sm text-[#e1bc8b] hover:bg-[#35271b]"><Instagram size={16}/> Instagram'da tümünü gör <ArrowUpRight size={15}/></a>
          </div>
          {instagramEntries.length>0 ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{instagramEntries.map((entry,index)=><InstagramPost key={entry.url+index} entry={entry} index={index}/>)}</div> : <div className="rounded-2xl border border-[#6b543b]/50 bg-[#1a1512] p-8 text-center"><p className="text-sm text-[#c5b19a]">Paylaşımlarımızı Instagram profilimizden inceleyebilirsiniz.</p><a href="https://www.instagram.com/nill.mobilya/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-[#deb887]">Instagram'a git <ArrowUpRight size={15}/></a></div>}
          <p className="mt-5 text-xs leading-6 text-[#978777]">Gönderiler doğrudan Instagram üzerinden yüklenir. Bazı gönderiler, Instagram veya tarayıcı ayarlarına bağlı olarak görüntülenmeyebilir.</p>
          {items.length>0&&<div className="mt-14 border-t border-[#53402e]/55 pt-9">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h3 className="font-display text-3xl text-[#ead6c1]">Proje Fotoğrafları</h3><div className="flex flex-wrap gap-2" role="group" aria-label="Proje kategorisi">{[["all","Tümü"] as const,...chips].map(([key,label])=><button type="button" key={key} onClick={()=>setCategory(key)} aria-pressed={category===key} className={cn("rounded-full border px-4 py-2 text-xs",category===key?"border-[#c7a06b] bg-[#5a3d20] text-[#f3e4cd]":"border-[#56412e] text-[#b5a18d] hover:border-[#b48a5d]")}>{label}</button>)}</div></div>
            {visible.length>0?<ul className="flex flex-wrap gap-[10px] after:grow-[10000] after:content-['']" style={{"--row-h":"clamp(170px,14.1vw,300px)"} as CSSProperties}>{visible.map((item,index)=><Tile key={item.image} item={item} index={index} onOpen={()=>setOpen(index)}/>)}</ul>:<p className="text-sm text-[#b4a28f]">Bu kategoride henüz fotoğraf bulunmuyor.</p>}
          </div>}
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-[#765536]/50 bg-[linear-gradient(120deg,#211710,#39291c,#171310)] px-6 py-7 md:px-9">
            <div className="flex items-center gap-4"><Instagram size={33} className="shrink-0 text-[#d5a165]"/><div><h3 className="font-display text-2xl text-[#f0dfc9] md:text-3xl">Bizi Instagram'da Takip Edin</h3><p className="mt-1 text-xs leading-6 text-[#bcaa95] md:text-sm">Yeni projeler, özel üretimler ve atölyeden güncel paylaşımlar için @nill.mobilya.</p></div></div>
            <a href="https://www.instagram.com/nill.mobilya/" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#c29964] px-6 py-3 text-sm font-semibold text-[#21150e] hover:bg-[#d8ae77]">@nill.mobilya ↗</a>
          </div>
          <div className="mt-12 flex justify-between gap-4 text-[10px] uppercase tracking-[.1em] text-[#9b8875]"><span>© 2026 Nil Mobilya</span><span>Modern · Nitelikli · Zamansız</span></div>
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