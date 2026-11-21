import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ClipboardList, Ruler, MessageCircle, Truck, CircleHelp } from "lucide-react";
import { whatsappOfferUrl } from "@/lib/sales";

const url = "https://nilmobilyatasarim.com/siparis-ve-teslimat";

export const Route = createFileRoute("/siparis-ve-teslimat")({
  head: () => ({
    meta: [
      { title: "Sipariş ve Teslimat Süreci | Nil Mobilya" },
      { name: "description", content: "Nil Mobilya'da WhatsApp üzerinden teklif, model ve ölçü onayı, üretim ve teslimat sürecinin nasıl ilerlediğini öğrenin." },
      { property: "og:title", content: "Sipariş ve Teslimat Süreci | Nil Mobilya" },
      { property: "og:description", content: "Özel ölçü mobilyalar için teklif, onay, üretim ve teslimat hakkında bilgilendirme." },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: OrderDeliveryPage,
});

const steps = [
  { icon: MessageCircle, title: "Ürünü ve tercihlerinizi paylaşın", copy: "Koleksiyondan bir ürün seçin veya özel üretim isteğinizi WhatsApp üzerinden iletin. Model, renk ve varsa özel ölçü talebinizi belirtin." },
  { icon: Ruler, title: "Ölçü ve detayları netleştirelim", copy: "Ürünün ölçüsü, malzemesi, rengi ve yapılabilir seçenekleri görüşme sırasında netleştirilir. Gerekirse ek ölçü veya fotoğraf istenir." },
  { icon: ClipboardList, title: "Teklif ve sipariş onayı", copy: "Fiyatlandırma, ödeme koşulları ve tahmini üretim süresi size özel olarak paylaşılır. Sipariş, karşılıklı onaydan sonra ilerler." },
  { icon: Truck, title: "Üretim ve teslimat", copy: "Üretim tamamlandıktan sonra teslimat adresi, taşıma koşulları ve varsa montaj detayları sipariş özelinde kararlaştırılır." },
];

const faqs = [
  { question: "Ürünler için standart fiyat var mı?", answer: "Fiyat; ölçü, malzeme, renk ve üretim tercihine göre değişebilir. Kesin teklif için WhatsApp üzerinden iletişime geçebilirsiniz." },
  { question: "Özel ölçü ürün yaptırabilir miyim?", answer: "Özel ölçü talebinizi paylaşabilirsiniz. Üretim uygunluğu ve detaylar görüşme sırasında değerlendirilir." },
  { question: "Teslimat ne kadar sürer?", answer: "Üretim ve teslimat süresi her siparişte farklı olabilir. Net zamanlama sipariş öncesi tarafınıza bildirilir." },
  { question: "İade ve iptal koşulları nelerdir?", answer: "Koşullar ürünün niteliğine ve yürürlükteki mevzuata göre değişebilir. Ayrıntıları Teslimat ve İade sayfamızdan inceleyebilir, sipariş öncesi yazılı olarak sorabilirsiniz." },
];

function OrderDeliveryPage() {
  return <main lang="tr" className="min-h-screen bg-[#0d0b0a] text-[#eee6dc]">
    <header className="border-b border-[#ae8b5d]/20 bg-[#110f0e]">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-5 px-6 py-6 md:px-10">
        <Link to="/" className="font-serif text-2xl tracking-[.12em] text-[#dbbd8d]">NİL MOBİLYA</Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#c8b7a2] hover:text-[#edcca0]"><ArrowLeft size={16}/> Ana sayfaya dön</Link>
      </div>
    </header>
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-14 md:px-10 md:pt-20">
      <p className="text-[11px] uppercase tracking-[.28em] text-[#c6a16a]">NİL MOBİLYA / BİLGİLENDİRME</p>
      <h1 className="mt-5 max-w-[850px] font-serif text-[clamp(2.7rem,5vw,5rem)] leading-[1.08]">Sipariş ve Teslimat Süreci</h1>
      <p className="mt-6 max-w-[780px] text-base leading-8 text-[#bcb0a3]">Özel üretim mobilyanız için ilk görüşmeden teslimata kadar sürecin nasıl ilerlediğini burada bulabilirsiniz. Nihai koşullar her siparişte ayrıca netleştirilir.</p>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {steps.map(({icon: Icon,title,copy},index) => <section key={title} className="rounded-[18px] border border-[#aa8656]/25 bg-[#1a1715] px-6 py-7 md:px-8">
          <div className="mb-6 flex items-center justify-between"><Icon size={23} strokeWidth={1.4} className="text-[#d3ac77]"/><span className="text-xs tracking-[.2em] text-[#9f8360]">0{index+1}</span></div>
          <h2 className="font-serif text-2xl text-[#efe5d7]">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-[#b4a99d]">{copy}</p>
        </section>)}
      </div>
      <section className="mt-14">
        <div className="flex items-center gap-3 text-[#d9b788]"><CircleHelp size={22}/><h2 className="font-serif text-3xl">Sık Sorulan Sorular</h2></div>
        <div className="mt-6 space-y-3">{faqs.map(({question,answer})=><details key={question} className="group rounded-xl border border-white/10 bg-[#191613] px-6 py-5">
          <summary className="cursor-pointer list-none font-medium text-[#efe1d0]">{question} <span className="float-right text-[#c6a16a] group-open:rotate-45">+</span></summary>
          <p className="mt-4 max-w-[850px] text-sm leading-7 text-[#b7aca0]">{answer}</p>
        </details>)}</div>
      </section>
      <section className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-[18px] border border-[#bf955d]/40 bg-[linear-gradient(115deg,#2a2119,#171310)] px-6 py-8 md:px-9">
        <div><h2 className="font-serif text-3xl">Aklınızda bir ürün mü var?</h2><p className="mt-2 max-w-[500px] text-sm leading-7 text-[#bfb0a0]">Ölçü ve model bilgilerini paylaşın, size uygun seçenekleri birlikte değerlendirelim.</p></div>
        <a href={whatsappOfferUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#cb9f62] px-6 py-3 text-sm font-semibold text-[#e6c28f] hover:bg-[#c69d63]/15">WhatsApp'tan teklif al <ArrowRight size={16}/></a>
      </section>
      <div className="mt-9 flex flex-wrap gap-6 text-sm text-[#bc9c73]"><Link to="/koleksiyon/$slug" params={{slug:"tum-urunler"}} className="hover:text-white">Tüm ürünleri incele</Link><Link to="/yasal/$slug" params={{slug:"teslimat-iade"}} className="hover:text-white">Teslimat ve İade koşulları</Link><Link to="/" hash="iletisim" className="hover:text-white">İletişim</Link></div>
    </div>
  </main>;
}
