import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Ruler, Info, ArrowRight } from "lucide-react";
import { useState } from "react";
import { getProductBySlug } from "@/lib/collections";
import { whatsappOfferUrl } from "@/lib/sales";

const HOST = "https://nilmobilyatasarim.com";

export const Route = createFileRoute("/urun/$slug")({
  loader: ({ params }) => {
    const result = getProductBySlug(params.slug);
    if (!result) throw notFound();
    return result;
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
  const { product, collection } = Route.useLoaderData();
  const [options, setOptions] = useState<Record<string,string>>({});
  const [size, setSize] = useState("");
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
        <div className="overflow-hidden rounded-2xl border border-[#b59261]/25 bg-[#1a1714]">
          <img src={product.image} alt={`Nil Mobilya ${product.name} ürün fotoğrafı`} className="h-auto max-h-[760px] w-full object-contain" width={1024} height={1280}/>
        </div>
        <div className="rounded-2xl border border-[#b59261]/25 bg-[#181512] p-6 md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#c8a36b]">{product.category}</p>
          <h1 className="mt-4 font-serif text-[clamp(2.4rem,4vw,4rem)] leading-[1.06]">{product.name}</h1>
          <p className="mt-4 text-sm leading-7 text-[#bcada0]">{product.material}</p>
          {product.options?.map((option) => <fieldset key={option.label} className="mt-7 border-t border-white/10 pt-5">
            <legend className="sr-only">{option.label}</legend>
            <h2 className="mb-3 text-sm font-medium text-[#ddc9ab]">{option.label} seçimi</h2>
            <div className="flex flex-wrap gap-2">{option.values.map((v)=><button key={v} type="button" aria-pressed={options[option.label]===v} onClick={()=>setOptions(prev=>({...prev,[option.label]:v}))} className={`rounded-lg border px-4 py-2.5 text-xs transition-colors ${options[option.label]===v?"border-[#d4a76b] bg-[#6e4c2e]/30 text-[#f4d39c]":"border-white/20 text-[#d0c2b1] hover:border-[#b59261]"}`}>{v}</button>)}</div>
          </fieldset>)}
          <section className="mt-8 border-t border-white/10 pt-6"><h2 className="flex items-center gap-2 text-base font-semibold"><Ruler size={17} className="text-[#ce9e60]"/> Standart Ölçüler</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#b9aa9b]">{product.standardDimensions || "Standart ölçü bilgileri yakında eklenecek."}</p></section>
          <section className="mt-6 border-t border-white/10 pt-6"><h2 className="flex items-center gap-2 text-base font-semibold"><Info size={17} className="text-[#ce9e60]"/> Ürün Bilgisi</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#b9aa9b]">{product.productInfo || "Ürün bilgileri yakında eklenecek. Detaylı bilgi için iletişime geçebilirsiniz."}</p></section>
          <label htmlFor="product-size" className="mt-7 block text-sm font-medium">Özel ölçü talebiniz (isteğe bağlı)</label>
          <input id="product-size" maxLength={120} value={size} onChange={e=>setSize(e.target.value)} className="mt-3 w-full rounded-lg border border-[#8d714f]/40 bg-[#100f0d] px-4 py-3 text-sm outline-none focus:border-[#cca16b]" placeholder="Örn. 140 × 60 × 90 cm"/>
          <a href={whatsappOfferUrl([product.name,...Object.entries(options).map(([key,v])=>`${key}: ${v}`),...(size.trim() ? [`Özel ölçü: ${size.trim()}`]:[])].join(" · "))} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-3 rounded-lg border border-[#c39862] bg-[#8d6636]/15 px-5 py-4 text-sm font-semibold text-[#e8bf86] hover:bg-[#8d6636]/25">WhatsApp'tan teklif al <ArrowUpRight size={17}/></a>
          <Link to="/siparis-ve-teslimat" className="mt-5 flex items-center justify-center gap-2 text-xs text-[#bba583] hover:text-white">Sipariş ve teslimat sürecini öğren <ArrowRight size={14}/></Link>
        </div>
      </div>
    </div>
  </main>;
}
