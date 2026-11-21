import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Ruler, Info, ArrowRight, Layers3, MessageCircle } from "lucide-react";
import { ProductPhotoGallery } from "@/components/product-photo-gallery";
import { useEffect, useState } from "react";
import { fetchPublishedProducts } from "@/lib/live-catalog";
import type { Collection, CollectionProduct } from "@/lib/collections";
import { getProductBySlug } from "@/lib/collections";
import { whatsappProductOfferUrl } from "@/lib/sales";

const HOST = "https://nilmobilyatasarim.com";

export const Route = createFileRoute("/urun/$slug")({
  loader: ({ params }) => {
    const result = getProductBySlug(params.slug);
    return result ?? null;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Ürün bulunamadı | Nil Mobilya" }, { name: "robots", content: "noindex" }] };
    const { product, collection } = loaderData;
    // Resolve the canonical solely from the product's stable URL slug.
    const canonical = `${HOST}/urun/${product.name.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    const description = `${product.name} — ${collection.pageTitle}. ${product.productInfo || "Nil Mobilya özel ölçü ve renk seçenekleri için WhatsApp üzerinden teklif alabilirsiniz."}`;
    return {
      meta: [
        { title: `${product.name} | Nil Mobilya` },
        { name: "description", content: description },
        { property: "og:title", content: `${product.name} | Nil Mobilya` },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "product" },
        { property: "og:image", content: product.image.startsWith("http") ? product.image : `${HOST}${product.image}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const initial = Route.useLoaderData();
  const { slug } = Route.useParams();
  const [remote, setRemote] = useState<{product: CollectionProduct; collection: Collection} | null>(null);
  const [checking, setChecking] = useState(true);
  const [catalogReady, setCatalogReady] = useState(false);
  useEffect(() => {
    let active = true;
    setChecking(true);
    setCatalogReady(false);
    fetchPublishedProducts().then(({products,categories}) => {
      if (!active) return;
      setCatalogReady(categories.length > 0);
      const item = products.find(p => p.slug === slug);
      if (item) {
        const category = categories.find(c => c.name === item.category);
        const match = initial?.collection.slug === category?.slug
          ? initial.collection
          : ({
            slug: category?.slug || "tum-urunler",
            title: item.category, pageTitle: item.category,
            number: "", lead: "", note: "", description: item.productInfo || "",
            hero: item.image, heroAlt: item.name, heroFocus: "center", products: [],
          } as Collection);
        setRemote({product:item, collection:match});
      } else setRemote(null);
      setChecking(false);
    }).catch(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [slug]);
  const selected = catalogReady ? remote : initial;
  if (!selected) return <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#0d0b0a] px-5 text-[#ede5db]"><h1 className="font-serif text-3xl">{checking ? "Ürün yükleniyor…" : "Ürün bulunamadı"}</h1><Link to="/koleksiyon/$slug" params={{slug:"tum-urunler"}} className="text-[#d4ad77]">Tüm ürünlere dön</Link></main>;
  return <ProductPageContent key={slug} product={selected.product} collection={selected.collection} />;
}

function ProductPageContent({product, collection}: {product:CollectionProduct;collection:Collection}) {
  const [options, setOptions] = useState<Record<string,string>>({});
  const [size, setSize] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  return <main lang="tr" className="min-h-screen bg-[#0d0b0a] text-[#ede5db]">
    <header className="border-b border-[#b59261]/20 bg-[#100e0c]">
      <div className="mx-auto flex max-w-[1350px] flex-wrap items-center justify-between gap-4 px-5 py-6 md:px-10">
        <Link to="/" className="font-serif text-2xl tracking-[.13em] text-[#dbbd8d]">NİL MOBİLYA</Link>
        <Link to="/koleksiyon/$slug" params={{ slug: collection.slug }} className="inline-flex items-center gap-2 text-sm text-[#c7b8a4] hover:text-[#e6c38e]"><ArrowLeft size={15}/> {collection.pageTitle} sayfasına dön</Link>
      </div>
    </header>
    <div className="mx-auto max-w-[1350px] px-5 py-12 md:px-10 md:py-16">
      <nav aria-label="Sayfa yolu" className="mb-7 flex flex-wrap items-center gap-2 text-xs text-[#baa581]"><Link to="/">Ana Sayfa</Link><span>/</span><Link to="/koleksiyon/$slug" params={{slug:collection.slug}}>{collection.pageTitle}</Link><span>/</span><span aria-current="page" className="text-[#e6dacb]">{product.name}</span></nav>
      <div className="grid gap-7 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
        <ProductPhotoGallery product={product} />
        <div className="rounded-2xl border border-[#b59261]/25 bg-[#181512] p-6 md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#c8a36b]">{product.category}</p>
          <h1 className="mt-4 font-serif text-[clamp(2.4rem,4vw,4rem)] leading-[1.06]">{product.name}</h1>
          <p className="mt-4 text-sm leading-7 text-[#bcada0]">{product.material}</p>
          {product.options?.map((option) => <fieldset key={option.label} className="mt-7 border-t border-white/10 pt-5">
            <legend className="sr-only">{option.label}</legend>
            <h2 className="mb-3 text-sm font-medium text-[#ddc9ab]">{option.label} seçimi</h2>
            <div className="flex flex-wrap gap-2">{option.values.map((v)=><button key={v} type="button" aria-pressed={options[option.label]===v} onClick={()=>setOptions(prev=>({...prev,[option.label]:v}))} className={`rounded-lg border px-4 py-2.5 text-xs transition-colors ${options[option.label]===v?"border-[#d4a76b] bg-[#6e4c2e]/30 text-[#f4d39c]":"border-white/20 text-[#d0c2b1] hover:border-[#b59261]"}`}>{v}</button>)}</div>
          </fieldset>)}
          <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
            <section className="rounded-xl border border-[#ae8d60]/25 bg-[#110f0d] p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#e9d7bd]"><Ruler size={18} className="text-[#ce9e60]"/> Ölçü Bilgileri</h2>
              {product.dimensions?.length ? <dl className="mt-4 space-y-3">{product.dimensions.map(item => <div key={item.label} className="flex justify-between gap-4 border-b border-white/10 pb-2 text-xs"><dt className="text-[#a89a89]">{item.label}</dt><dd className="text-right font-medium text-[#ead8bf]">{item.value}</dd></div>)}</dl> : <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#b9aa9b]">{product.standardDimensions || "Kesin ölçüler üretim tercihine göre teklif aşamasında netleştirilir."}</p>}
            </section>
            <section className="rounded-xl border border-[#ae8d60]/25 bg-[#110f0d] p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#e9d7bd]"><Layers3 size={18} className="text-[#ce9e60]"/> Malzeme ve Özellikler</h2>
              <p className="mt-4 text-sm leading-6 text-[#b9aa9b]">{product.material}</p>
              {product.details?.length ? <dl className="mt-4 space-y-3">{product.details.map(item => <div key={item.label} className="flex justify-between gap-3 border-t border-white/10 pt-2 text-xs"><dt className="text-[#a89a89]">{item.label}</dt><dd className="text-right text-[#ead8bf]">{item.value}</dd></div>)}</dl> : <p className="mt-3 text-xs leading-6 text-[#998c7e]">Ek malzeme ve uygulama detayları teklif sırasında paylaşılır.</p>}
            </section>
          </div>
          <section className="mt-6 rounded-xl border border-[#ae8d60]/25 bg-[#110f0d] p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[#e9d7bd]"><Info size={18} className="text-[#ce9e60]"/> Ürün Hakkında</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#b9aa9b]">{product.productInfo || collection.description}</p>
          </section>
          <label htmlFor="product-size" className="mt-7 block text-sm font-medium">Özel ölçü talebiniz (isteğe bağlı)</label>
          <p className="mt-1 text-xs text-[#a79988]">Genişlik × derinlik × yükseklik yazabilirsiniz; kesin ölçü görüşmede onaylanır.</p>
          <input id="product-size" maxLength={120} value={size} onChange={e=>setSize(e.target.value)} className="mt-3 w-full rounded-lg border border-[#8d714f]/40 bg-[#100f0d] px-4 py-3 text-sm outline-none focus:border-[#cca16b]" placeholder="Örn. 140 × 60 × 90 cm"/>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs text-[#d3c1a7]">Teslimat ili / ilçesi (isteğe bağlı)<input value={city} onChange={event=>setCity(event.target.value)} maxLength={100} placeholder="Örn. İstanbul / Kadıköy" className="mt-2 w-full rounded-lg border border-[#8d714f]/40 bg-[#100f0d] px-4 py-3 text-sm text-[#ede5db] outline-none focus:border-[#cca16b]"/></label>
            <label className="block text-xs text-[#d3c1a7]">Ek not (isteğe bağlı)<input value={note} onChange={event=>setNote(event.target.value)} maxLength={240} placeholder="Örn. Renk, montaj, kullanım detayı" className="mt-2 w-full rounded-lg border border-[#8d714f]/40 bg-[#100f0d] px-4 py-3 text-sm text-[#ede5db] outline-none focus:border-[#cca16b]"/></label>
          </div>
          <a href={whatsappProductOfferUrl({product:product.name,choices:options,dimensions:size,city,note,productUrl:typeof window!=="undefined"?window.location.href:undefined})} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-3 rounded-lg border border-[#c39862] bg-[#8d6636]/15 px-5 py-4 text-sm font-semibold text-[#e8bf86] hover:bg-[#8d6636]/25">WhatsApp'tan teklif al <ArrowUpRight size={17}/></a>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#a99b88]"><MessageCircle size={15} className="mt-0.5 shrink-0 text-[#c39862]"/> Ürün adı, seçilen seçenekler ve özel ölçü notu teklif mesajına eklenir.</p>
          <Link to="/siparis-ve-teslimat" className="mt-5 flex items-center justify-center gap-2 text-xs text-[#bba583] hover:text-white">Sipariş ve teslimat sürecini öğren <ArrowRight size={14}/></Link>
        </div>
      </div>
    </div>
  </main>;
}
