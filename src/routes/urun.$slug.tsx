import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Ruler, Info, ArrowRight, Layers3, MessageCircle, Palette, ClipboardList, Check, Clock3 } from "lucide-react";
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
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [height, setHeight] = useState("");
  const [dimensionsNote, setDimensionsNote] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const typedSize = [width.trim() && "Genişlik: "+width.trim()+" cm",depth.trim() && "Derinlik: "+depth.trim()+" cm",height.trim() && "Yükseklik: "+height.trim()+" cm"].filter(Boolean).join(" · ");
  const size = [typedSize,dimensionsNote.trim()].filter(Boolean).join(" | ");
  const selectedChoices = {
    ...options,
    ...(material.trim()?{"Malzeme tercihi":material.trim()} : {}),
    ...(color.trim()?{"Renk / kaplama tercihi":color.trim()} : {}),
  };
  const offerUrl=whatsappProductOfferUrl({
    product:product.name,
    choices:selectedChoices,
    dimensions:size,
    city,
    note,
    productUrl:typeof window!=="undefined"?window.location.href:undefined,
  });
  const inputClass="w-full rounded-xl border border-[#5b4532]/65 bg-[#100e0e] px-4 py-3 text-sm text-[#f1e7da] outline-none transition-colors placeholder:text-[#81776e] focus:border-[#c59b67]";
  const labelClass="mb-2 block text-sm font-medium text-[#dfcfba]";
  const numberedOptions=Object.entries(options).filter(([,value])=>value);
  const hasPreferences=!!(width||depth||height||dimensionsNote||material||color||city||note||numberedOptions.length);
  return <main lang="tr" className="min-h-screen bg-[#0d0b0a] text-[#ede5db]">
    <header className="border-b border-[#b59261]/20 bg-[#100e0c]">
      <div className="mx-auto flex max-w-[1390px] flex-wrap items-center justify-between gap-4 px-5 py-6 md:px-10">
        <Link to="/" className="font-serif text-2xl tracking-[.13em] text-[#dbbd8d]">NİL MOBİLYA</Link>
        <Link to="/koleksiyon/$slug" params={{slug:collection.slug}} className="inline-flex items-center gap-2 text-sm text-[#c7b8a4] hover:text-[#e6c38e]"><ArrowLeft size={15}/> Koleksiyona dön</Link>
      </div>
    </header>
    <div className="mx-auto max-w-[1390px] px-5 py-8 md:px-10 md:py-12">
      <nav aria-label="Sayfa yolu" className="mb-7 flex flex-wrap items-center gap-2 text-xs text-[#baa581]"><Link to="/">Ana Sayfa</Link><span>/</span><Link to="/koleksiyon/$slug" params={{slug:collection.slug}}>{collection.pageTitle}</Link><span>/</span><span aria-current="page" className="text-[#e6dacb]">{product.name}</span></nav>
      <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-9">
        <div className="min-w-0 lg:sticky lg:top-6">
          <ProductPhotoGallery product={product}/>
          <section aria-label="Talebinizin canlı özeti" className="mt-5 rounded-[22px] border border-[#6a5238]/50 bg-[#1b1715] p-5 shadow-[0_10px_38px_rgba(0,0,0,.12)] md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-serif text-2xl text-[#f0dfc5]"><ClipboardList size={19} className="text-[#b9976c]"/> Talebinizin Özeti</h2>
              <span className="rounded-full border border-[#665138] px-3 py-1 text-[11px] text-[#c6ad89]">Canlı önizleme</span>
            </div>
            <p className="mt-2 text-xs leading-6 text-[#a99c8d]">Seçtiğiniz bilgiler burada güncellenir. Ürün fotoğrafı temsili/model görselidir; renk ve malzeme değişimi fotoğrafa uygulanmaz.</p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#49392e] bg-[#120f0e] p-3"><dt className="text-[11px] text-[#a99a85]">Ürün</dt><dd className="mt-1 text-sm font-medium text-[#f0e1cf]">{product.name}</dd></div>
              <div className="rounded-xl border border-[#49392e] bg-[#120f0e] p-3"><dt className="text-[11px] text-[#a99a85]">Ölçü</dt><dd className="mt-1 break-words text-sm text-[#f0e1cf]">{size||"Görüşmede belirlenecek"}</dd></div>
              <div className="rounded-xl border border-[#49392e] bg-[#120f0e] p-3"><dt className="text-[11px] text-[#a99a85]">Malzeme</dt><dd className="mt-1 break-words text-sm text-[#f0e1cf]">{material||"Teklif aşamasında görüşülecek"}</dd></div>
              <div className="rounded-xl border border-[#49392e] bg-[#120f0e] p-3"><dt className="text-[11px] text-[#a99a85]">Renk / kaplama</dt><dd className="mt-1 break-words text-sm text-[#f0e1cf]">{color||"Teklif aşamasında görüşülecek"}</dd></div>
              {numberedOptions.map(([key,value])=><div key={key} className="rounded-xl border border-[#49392e] bg-[#120f0e] p-3"><dt className="text-[11px] text-[#a99a85]">{key}</dt><dd className="mt-1 text-sm text-[#f0e1cf]">{value}</dd></div>)}
              {city&&<div className="rounded-xl border border-[#49392e] bg-[#120f0e] p-3"><dt className="text-[11px] text-[#a99a85]">Teslimat bölgesi</dt><dd className="mt-1 text-sm text-[#f0e1cf]">{city}</dd></div>}
            </dl>
            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#c1ac90]"><Check size={15} className="mt-0.5 shrink-0"/> {hasPreferences?"Seçimleriniz WhatsApp teklif mesajınıza eklenecek.":"Tercihlerinizi yazmadan da doğrudan teklif isteyebilirsiniz."}</div>
          </section>
        </div>
        <div className="min-w-0 space-y-5">
          <section className="rounded-[22px] border border-[#6c5438]/45 bg-[#1b1715] p-5 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#c8a36b]">{product.category} / Size özel</p>
            <h1 className="mt-3 font-serif text-[clamp(2.3rem,3.5vw,3.9rem)] leading-[1.08]">{product.name}</h1>
            <p className="mt-4 text-sm leading-7 text-[#bba99a]">{product.productInfo||collection.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#634c34]/50 bg-[#130f0e] px-4 py-3"><div className="flex items-center gap-2 text-sm text-[#e3cda9]"><Ruler size={17}/> Özel ölçü üretim</div><p className="mt-1 text-xs leading-5 text-[#afa092]">Standart ölçü zorunlu değil.</p></div>
              <div className="rounded-xl border border-[#634c34]/50 bg-[#130f0e] px-4 py-3"><div className="flex items-center gap-2 text-sm text-[#e3cda9]"><Clock3 size={17}/> Yaklaşık 1 hafta</div><p className="mt-1 text-xs leading-5 text-[#afa092]">Ürün, tedarik ve siparişe göre teyit edilir.</p></div>
            </div>
            <div className="mt-5 flex items-start gap-2 text-xs leading-6 text-[#bba892]"><Info size={17} className="mt-0.5 shrink-0 text-[#c8a36b]"/> Fiyat sabit değildir. Ölçü, malzeme, uygulama ve usta/tedarikçi teklifine göre netleşir.</div>
          </section>
          <section className="rounded-[22px] border border-[#6c5438]/45 bg-[#1b1715] p-5 md:p-8">
            <h2 className="flex items-center gap-2 font-serif text-2xl text-[#f0dfc5]"><Ruler size={20} className="text-[#c8a36b]"/> 01 · İstediğiniz Ölçü</h2>
            <p className="mt-2 text-xs leading-6 text-[#afa094]">Aklınızdaki ölçüleri santimetre olarak yazın. Emin değilseniz boş bırakabilirsiniz.</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {([{label:"Genişlik (cm)",value:width,set:setWidth},{label:"Derinlik (cm)",value:depth,set:setDepth},{label:"Yükseklik (cm)",value:height,set:setHeight}]).map(item=><label key={item.label} className="min-w-0 text-[11px] text-[#dbc5a7]">{item.label}<input inputMode="decimal" maxLength={12} value={item.value} onChange={e=>item.set(e.target.value)} placeholder="Ölçü" className={inputClass+" mt-2 !px-3"}/></label>)}
            </div>
            <label htmlFor="nm-size-notes" className={labelClass+" mt-5"}>Ek ölçü / özel istek (isteğe bağlı)</label>
            <input id="nm-size-notes" maxLength={180} value={dimensionsNote} onChange={e=>setDimensionsNote(e.target.value)} placeholder="Örn. Çekmece sayısı, raf aralığı, L biçimi" className={inputClass}/>
          </section>
          <section className="rounded-[22px] border border-[#6c5438]/45 bg-[#1b1715] p-5 md:p-8">
            <h2 className="flex items-center gap-2 font-serif text-2xl text-[#f0dfc5]"><Palette size={20} className="text-[#c8a36b]"/> 02 · Malzeme ve Renk</h2>
            <p className="mt-2 text-xs leading-6 text-[#afa094]">İstediğiniz malzeme veya renkleri serbestçe yazın. Tedarik edilebilirliği teklif sırasında teyit edeceğiz.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>İstediğiniz malzeme<input maxLength={120} value={material} onChange={e=>setMaterial(e.target.value)} placeholder="Örn. Ceviz dokulu kaplama" className={inputClass+" mt-2"}/></label>
              <label className={labelClass}>Renk / kaplama<input maxLength={120} value={color} onChange={e=>setColor(e.target.value)} placeholder="Örn. Antrasit mat" className={inputClass+" mt-2"}/></label>
            </div>
            {product.options?.map(option=><fieldset key={option.label} className="mt-6 border-t border-[#66503a]/50 pt-5">
              <legend className="sr-only">{option.label}</legend>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h3 className="text-sm font-medium text-[#ddc9ab]">{option.label} (isteğe bağlı)</h3><select aria-label={option.label+" seçimi"} className="max-w-full rounded-lg border border-[#68513b] bg-[#100e0e] px-3 py-2 text-xs text-[#dbc9b3]" value={options[option.label]||""} onChange={e=>setOptions(prev=>({...prev,[option.label]:e.target.value}))}><option value="">Seçim yapın</option>{option.values.map(value=><option value={value} key={value}>{value}</option>)}</select></div>
              <div className="flex flex-wrap gap-2">{option.values.map(value=><button type="button" key={value} aria-pressed={options[option.label]===value} onClick={()=>setOptions(prev=>({...prev,[option.label]:prev[option.label]===value?"":value}))} className={"rounded-xl border px-4 py-2.5 text-xs transition-all "+(options[option.label]===value?"border-[#d2a46e] bg-[#7e5a36]/35 text-[#f3d9b7]":"border-[#604b3a] bg-[#110f0e] text-[#c2b3a3] hover:border-[#b58b58]")}>{value}</button>)}</div>
            </fieldset>)}
          </section>
          <section className="rounded-[22px] border border-[#6c5438]/45 bg-[#1b1715] p-5 md:p-8">
            <h2 className="font-serif text-2xl text-[#f0dfc5]">03 · Teklifinizi Oluşturalım</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>Teslimat ili / ilçesi<input maxLength={100} value={city} onChange={e=>setCity(e.target.value)} placeholder="Örn. İstanbul / Beşiktaş" className={inputClass+" mt-2"}/></label>
              <label className={labelClass}>Ek istek<input maxLength={240} value={note} onChange={e=>setNote(e.target.value)} placeholder="İstediğiniz ürünü tarif edebilirsiniz" className={inputClass+" mt-2"}/></label>
            </div>
            <a href={offerUrl} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-[#c09a69] px-5 py-4 text-sm font-semibold text-[#17110d] transition-colors hover:bg-[#d4b080]"><MessageCircle size={19}/> WhatsApp'tan Kişiye Özel Teklif Al <ArrowUpRight size={17}/></a>
            <p className="mt-3 text-center text-xs leading-6 text-[#ab9b8b]">Ürün adı, ölçü, malzeme, renk ve seçili tercihler otomatik olarak mesajda yer alır. Mesajı göndermeden önce düzenleyebilirsiniz.</p>
          </section>
        </div>
      </div>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-[20px] border border-[#564331]/50 bg-[#171412] p-6">
          <h2 className="flex items-center gap-2 font-serif text-xl text-[#e9d7bd]"><Layers3 size={19} className="text-[#ce9e60]"/> Malzeme ve ürün bilgileri</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#b9aa9b]">{product.material}</p>
          {!!product.details?.length&&<dl className="mt-4 space-y-3">{product.details.map(item=><div key={item.label} className="flex justify-between gap-3 border-t border-white/10 pt-2 text-sm"><dt className="text-[#a89a89]">{item.label}</dt><dd className="text-right text-[#ead8bf]">{item.value}</dd></div>)}</dl>}
        </div>
        <div className="rounded-[20px] border border-[#564331]/50 bg-[#171412] p-6">
          <h2 className="flex items-center gap-2 font-serif text-xl text-[#e9d7bd]"><Info size={19} className="text-[#ce9e60]"/> Sipariş ve teslimat</h2>
          <p className="mt-3 text-sm leading-7 text-[#b9aa9b]">Ürünler talebe göre hazırlanır veya tedarik edilir. Genel hedefimiz yaklaşık 1 hafta olsa da üretim ve teslimat süresi ürünün detaylarına, iş yoğunluğuna ve tedarik koşullarına göre teklif aşamasında kesinleştirilir.</p>
          <Link to="/siparis-ve-teslimat" className="mt-4 inline-flex items-center gap-2 text-sm text-[#d7b48a] hover:text-white">Sipariş ve teslimat hakkında <ArrowRight size={15}/></Link>
        </div>
      </section>
    </div>
  </main>;
}
