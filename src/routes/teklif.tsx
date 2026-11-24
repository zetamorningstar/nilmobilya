import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, ClipboardList, Clock3, Handshake, Layers3, Ruler, ShieldCheck, Sofa, BedDouble, CookingPot, BriefcaseBusiness, DoorOpen, Grid2X2, Store, Sparkles, MessageCircle, ArrowUpRight } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/sales";

export const Route = createFileRoute("/teklif")({
  head:()=>({meta:[{title:"Projeniz İçin Teklif Alın | Nil Mobilya"},{name:"description",content:"Özel üretim mobilya ve mimari ahşap projeleriniz için birkaç adımda WhatsApp üzerinden teklif görüşmesi başlatın."}]}),
  component: QuoteWizard
});

const rooms=[
  {value:"Mutfak", icon:CookingPot}, {value:"Salon",icon:Sofa},
  {value:"Yatak odası",icon:BedDouble}, {value:"Giyinme odası",icon:DoorOpen},
  {value:"Ofis",icon:BriefcaseBusiness},{value:"Mağaza / İş yeri",icon:Store},
  {value:"Antre / Hol",icon:Grid2X2},{value:"Banyo",icon:Layers3},
  {value:"Çocuk / Genç odası",icon:BedDouble},{value:"Diğer",icon:Sparkles},
];
// These are requestable project/work types, not claims of in-stock or guaranteed services.
const roomProducts:Record<string,string[]>={
 "Mutfak":["Alt mutfak dolabı","Üst mutfak dolabı","Boy dolabı / kiler dolabı","Mutfak adası / yarım ada","Çekmece ve organizer sistemleri","Açık ahşap raf","Mutfak masa ve bankı","Ahşap mutfak paneli","Diğer mutfak ahşap işi"],
 "Salon":["TV ünitesi","Kitaplık / duvar rafı","Konsol / dresuar","Orta sehpa","Yan sehpa","Yemek masası","Ahşap duvar kaplaması","Gömme dolap / depolama","Diğer salon mobilyası"],
 "Yatak odası":["Gardırop","Sürgülü gardırop","Yatak başlığı","Komodin","Şifonyer","Makyaj masası","Yatak altı depolama","Duvar paneli","Diğer yatak odası mobilyası"],
 "Giyinme odası":["Açık gardırop sistemi","Kapaklı dolap","Çekmeceli modül","Ayakkabılık","Çanta / aksesuar rafı","Ada tipi dolap","Aynalı makyaj bölümü","Diğer giyinme odası işi"],
 "Ofis":["Çalışma masası","Toplantı masası","Ofis dolabı","Dosyalama / arşiv dolabı","Kitaplık","Resepsiyon bankosu","Ahşap bölücü / panel","Diğer ofis işi"],
 "Mağaza / İş yeri":["Karşılama / kasa bankosu","Teşhir ünitesi","Duvar raf sistemi","Servis bankosu","Ahşap duvar kaplaması","Depolama dolabı","Oturma / masa grubu","Diğer ticari ahşap işi"],
 "Antre / Hol":["Portmanto","Ayakkabılık","Askılık / bank","Dresuar","Gömme depolama","Aynalı dolap","Ahşap dekoratif panel","Diğer antre işi"],
 "Banyo":["Lavabo altı dolabı","Boy banyo dolabı","Aynalı dolap","Havlu / raf sistemi","Çamaşır dolabı","Ahşap görünümlü panel","Diğer banyo dolabı işi"],
 "Çocuk / Genç odası":["Çalışma masası","Kitaplık","Gardırop","Çekmeceli dolap","Raf sistemi","Karyola / yatak çevresi","Diğer genç odası mobilyası"],
 "Diğer":["Özel ölçü dolap","Masa / konsol","Ahşap raf","Dekoratif panel","Karşılama bankosu","Komple proje ahşap işleri","Diğer özel üretim"]
};
const styles=["Modern","Minimal","Klasik","İskandinav","Endüstriyel","Henüz karar vermedim"];
const materials=["Doğal ahşap","Ahşap kaplama","MDF / Lake","Laminat / Melamin","Kararsızım / Öneri istiyorum"];
const stages=["Proje Türü","Ölçüler","Tasarım","İletişim","Tamamla"] as const;
const field="w-full min-h-[47px] rounded-xl border border-[#5f503e]/65 bg-[#141210]/75 px-4 py-3 text-[13px] text-[#f1e8dc] outline-none transition-colors placeholder:text-[#9f9180] hover:border-[#9e8059]/70 focus:border-[#c4a36b] focus:ring-2 focus:ring-[#c4a36b]/10";
const stepLabel="mb-2 block text-[12px] font-medium text-[#d6c6ae]";
const img="/S%C4%B1cak%20Tonlarda%20Minimalist%20L%C3%BCks%20%C4%B0%C3%A7%20Mek%C3%A2n.webp";

function QuoteWizard(){
  const [step,setStep]=useState(0);
  const [room,setRoom]=useState("");
  const [product,setProduct]=useState("");
  const filteredProducts=roomProducts[room]??[];
  const [width,setWidth]=useState("");
  const [height,setHeight]=useState("");
  const [depth,setDepth]=useState("");
  const [city,setCity]=useState("");
  const [style,setStyle]=useState("");
  const [material,setMaterial]=useState("");
  const [notes,setNotes]=useState("");
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [email,setEmail]=useState("");
  const [consent,setConsent]=useState(false);
  const [reference,setReference]=useState("");
  const [tried,setTried]=useState(false);

  const valid=[Boolean(room&&product),true,true,Boolean(name.trim()&&phone.trim()&&consent),true];
  const next=()=>{setTried(true);if(valid[step]){setStep(s=>Math.min(4,s+1));setTried(false);}};
  const waMessage=[
    "Merhaba Nil Mobilya, akıllı teklif sayfanızdan proje talebi oluşturuyorum.",
    "Proje alanı: "+room, "Ürün / İş: "+product,
    "Ölçüler (cm): "+([width?"En "+width:"",height?"Boy "+height:"",depth?"Derinlik "+depth:""].filter(Boolean).join(" / ")||"Henüz belli değil"),
    "Teslimat şehri: "+(city||"Görüşülecek"),
    "Tasarım tarzı: "+(style||"Görüşülecek"),
    "Malzeme tercihi: "+(material||"Görüşülecek"),
    "Ek detay: "+(notes.trim()||"Belirtilmedi"),
    "Referans bağlantısı: "+(reference.trim()||"Belirtilmedi (varsa görseli WhatsApp'tan ayrıca ileteceğim)"),
    "Ad soyad: "+name.trim(), "İletişim telefonu: "+phone.trim(),
    ...(email.trim()?["E-posta: "+email.trim()]:[]),
    "Bu bilgiler için proje kapsamı, fiyat ve süre hakkında görüşmek istiyorum."
  ].join("\n");
  const waUrl="https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(waMessage);

  return <main lang="tr" className="relative isolate min-h-svh overflow-hidden bg-[#0b0908] text-[#eee5d8]">
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-30" style={{backgroundImage:`url("${img}")`,backgroundSize:"cover",backgroundPosition:"center center"}}/>
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20" style={{background:"linear-gradient(90deg,rgba(10,8,7,.57) 0%,rgba(12,9,7,.43) 38%,rgba(10,8,6,.47) 100%),linear-gradient(0deg,rgba(9,7,6,.73),transparent 42%)"}}/>
    <header className="relative z-20 mx-auto flex min-h-[78px] max-w-[1700px] items-center justify-between gap-5 border-b border-[#b99b70]/20 px-5 md:px-[4.5vw]">
      <Link to="/" className="flex items-center gap-3 font-display text-[21px] tracking-[.12em] text-[#e1cfb6]"><span className="text-[30px] leading-none text-[#c4a36b]">N</span><span>NİL MOBİLYA</span></Link>
      <nav className="hidden items-center gap-8 text-[12px] text-[#d5c8b7] md:flex">
        <Link to="/" className="transition-colors hover:text-[#e7c58f]">Ana Sayfa</Link>
        <Link to="/koleksiyon/$slug" params={{slug:"tum-urunler"}} className="transition-colors hover:text-[#e7c58f]">Koleksiyon</Link>
        <span aria-current="page" className="border-b border-[#c4a36b] py-3 font-semibold text-[#e7c58f]">Akıllı Teklif</span>
      </nav>
      <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-[#987b54]/65 bg-[#211a15]/65 px-4 py-2.5 text-xs text-[#e2c8a0] backdrop-blur transition-colors hover:border-[#d4b580]">Siteye Dön <ArrowUpRight size={14}/></Link>
    </header>

    <div className="relative mx-auto grid min-h-[calc(100svh-78px)] max-w-[1700px] items-center gap-8 px-5 py-12 md:px-[4.5vw] lg:grid-cols-[minmax(0,.84fr)_minmax(0,1.16fr)] lg:gap-[clamp(28px,4vw,76px)] lg:py-10">
      <section className="flex min-w-0 flex-col justify-center py-4 lg:pr-2">
        <div className="mb-9 flex items-center gap-3 text-[10px] uppercase tracking-[.26em] text-[#d2b589]">
          <span className="h-px w-6 bg-[#b99a6e]"/> PROJENİZİ BİRLİKTE PLANLAYALIM <span className="h-px w-6 bg-[#b99a6e]"/>
        </div>
        <h1 className="font-display text-[clamp(48px,5vw,83px)] font-normal leading-[1.08] tracking-[-.03em] text-[#f6eee4]">Akıllı <span className="text-[#d9af73]">Teklif</span></h1>
        <p className="mt-6 max-w-[480px] text-[clamp(13px,1.03vw,16px)] leading-[1.85] text-[#e0d1c0]">İhtiyaçlarınızı birkaç adımda paylaşın, size özel mobilya çözümleri için teklif görüşmesini birlikte başlatalım.</p>
        <div className="mt-10 grid max-w-[480px] grid-cols-2 gap-x-5 gap-y-6 text-[12px] text-[#e5d8c5]">
          <div className="flex items-center gap-3"><Ruler size={20} className="shrink-0 text-[#d3ac73]"/> Ölçüye özel üretim</div>
          <div className="flex items-center gap-3"><Layers3 size={20} className="shrink-0 text-[#d3ac73]"/> Size özel tasarım</div>
          <div className="flex items-center gap-3"><ClipboardList size={20} className="shrink-0 text-[#d3ac73]"/> Projeye özel teklif</div>
          <div className="flex items-center gap-3"><MessageCircle size={20} className="shrink-0 text-[#d3ac73]"/> Doğrudan görüşme</div>
        </div>
        <p className="mt-11 max-w-[450px] border-t border-[#bd9b6c]/30 pt-5 text-[10px] leading-5 text-[#b5a696]">Form otomatik fiyat hesaplamaz. Teklif ölçü, malzeme ve işin kapsamı değerlendirildikten sonra hazırlanır.</p>
      </section>

      <section className="relative min-w-0">
        <div className="mx-auto w-full max-w-[760px] rounded-[26px] border border-[#b4966d]/65 bg-[linear-gradient(145deg,rgba(29,23,19,.95),rgba(24,19,16,.94))] p-5 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-lg sm:p-8 xl:p-9">
          <div className="mb-5 flex items-center justify-between gap-4"><p className="text-[10px] font-semibold tracking-[.20em] text-[#c4a36b]">ADIM {String(step+1).padStart(2,"0")} <span className="text-[#9d8a70]">/ 05</span></p><span className="text-[11px] text-[#b8aa97]">{Math.round(((step+1)/5)*100)} tamamlandı</span></div>
          <div className="mb-7 h-[3px] w-full overflow-hidden rounded-full bg-[#5f4d37]/55"><div className="h-full rounded-full bg-[#c4a36b] transition-all duration-300" style={{width:`${((step+1)/5)*100}%`}}/></div>
          <h2 className="mt-2 font-display text-[clamp(23px,2.1vw,33px)] leading-tight">{["Projenizi tanıyalım","Ölçü ve konum bilgileri","Tasarım tercihleri","İletişim bilgileriniz","Talebiniz hazır"][step]}</h2>
          <p className="mt-2 text-[12px] leading-5 text-[#b6aa98]">{["Hangi alan ve mobilya için çalışmak istediğinizi seçin.","Ölçüleriniz hazır değilse daha sonra paylaşabilirsiniz.","Tarz ve malzeme seçimi sadece başlangıç içindir.","Sizinle iletişime geçebilmemiz için bilgilerinizi ekleyin.","Bilgilerinizi kontrol edip WhatsApp üzerinden iletin."][step]}</p>

          <div className="mt-7 flex items-start gap-1.5 sm:gap-3" aria-label="Teklif aşamaları">
            {stages.map((label,i)=><button type="button" key={label} onClick={()=>{if(i<step){setStep(i);setTried(false);}}} disabled={i>step} className="min-w-0 flex-1 text-center disabled:cursor-default" aria-current={step===i?"step":undefined}>
              <span className={`mx-auto flex size-9 items-center justify-center rounded-xl border text-xs font-semibold transition-colors ${i===step?"border-[#c4a36b] bg-[#bfa074] text-[#18130e]":i<step?"border-[#98784d] bg-[#3b2e20] text-[#e8ca98]":"border-[#62503b] bg-[#1a1714] text-[#9f9180]"}`}>{i<step?<Check size={15}/>:i+1}</span>
              <span className={`mt-2 block text-[9px] sm:text-[11px] ${i===step?"text-[#c4a36b]":"text-[#a89a88]"}`}>{label}</span>
            </button>)}
          </div>

          <div className="mt-7 min-h-[290px]">
            {step===0&&<>
              <p className={stepLabel}>Kullanım alanı <span className="text-[#c4a36b]">*</span></p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {rooms.map(({value,icon:Icon})=><button type="button" key={value} onClick={()=>{setRoom(value);setProduct("");}} aria-pressed={room===value} className={`flex min-h-[86px] flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center text-[10px] leading-4 transition-all duration-200 sm:text-xs ${room===value?"border-[#c4a36b] bg-[#57412a]/55 text-[#f0d7ae] shadow-[inset_0_0_0_1px_rgba(196,163,107,.15)]":"border-[#62523f]/70 bg-[#191613]/70 text-[#d4c6b5] hover:border-[#b3956a] hover:bg-[#2c241c]"}`}><Icon size={23} strokeWidth={1.4}/>{value}</button>)}
              </div>
              <label className={stepLabel+" mt-5"} htmlFor="offer-product">Ürün / proje türü <span className="text-[#c4a36b]">*</span></label>
              <select id="offer-product" disabled={!room} className={field+" disabled:opacity-50"} value={product} onChange={e=>setProduct(e.target.value)}><option value="">{room?"İş türü seçiniz...":"Önce kullanım alanı seçiniz..."}</option>{filteredProducts.map(t=><option value={t} key={t}>{t}</option>)}</select>
              {room&&<p className="mt-2 text-[11px] leading-5 text-[#b8ad9e]">{room} için {filteredProducts.length} farklı iş türü listeleniyor. Seçenekler stok değil, proje talebi kategorileridir.</p>}
            </>}
            {step===1&&<>
              <p className={stepLabel}>Ölçüler (cm) — varsa</p>
              <div className="grid grid-cols-3 gap-3">{[["En",width,setWidth],["Boy / Yükseklik",height,setHeight],["Derinlik",depth,setDepth]].map(([label,value,setter])=><label key={label as string} className="min-w-0 text-[11px] text-[#c5b7a6]">{label as string}<input type="number" min="0" step="0.1" value={value as string} onChange={e=>(setter as (s:string)=>void)(e.target.value)} placeholder="cm" className={field+" mt-2"}/></label>)}</div>
              <label className={stepLabel+" mt-6"} htmlFor="offer-city">İl / ilçe (teslimat yeri)</label><input id="offer-city" className={field} value={city} onChange={e=>setCity(e.target.value)} placeholder="Ör. Gaziosmanpaşa, İstanbul"/>
              <p className="mt-5 text-xs leading-6 text-[#ab9f90]">Kesin ölçüler olmadan da teklif görüşmesine başlayabilirsiniz. Gerekirse sonradan detaylandırırız.</p>
            </>}
            {step===2&&<>
              <label className={stepLabel} htmlFor="offer-style">Tasarım tarzı</label><select id="offer-style" className={field} value={style} onChange={e=>setStyle(e.target.value)}><option value="">Seçiniz...</option>{styles.map(s=><option key={s}>{s}</option>)}</select>
              <label className={stepLabel+" mt-4"} htmlFor="offer-material">Malzeme / kaplama tercihi</label><select id="offer-material" className={field} value={material} onChange={e=>setMaterial(e.target.value)}><option value="">Seçiniz...</option>{materials.map(m=><option key={m}>{m}</option>)}</select>
              <label className={stepLabel+" mt-4"} htmlFor="offer-notes">Proje notlarınız</label><textarea id="offer-notes" rows={3} className={field} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Renk, tasarım, iş kapsamı, özel istekler..."/>
              <label className={stepLabel+" mt-4"} htmlFor="offer-reference">Referans görsel / çizim bağlantısı (isteğe bağlı)</label><input id="offer-reference" type="url" className={field} value={reference} onChange={e=>setReference(e.target.value)} placeholder="https://..."/>
              <p className="mt-2 text-[11px] leading-5 text-[#b6aa98]">Telefonunuzdaki görsel veya PDF dosyasını WhatsApp sohbeti açıldığında ayrıca ekleyebilirsiniz. Dosyalar bu formdan yüklenmez.</p>
            </>}
            {step===3&&<>
              <label className={stepLabel} htmlFor="offer-name">Adınız soyadınız *</label><input id="offer-name" autoComplete="name" className={field} value={name} onChange={e=>setName(e.target.value)} placeholder="Ad Soyad"/>
              <label className={stepLabel+" mt-4"} htmlFor="offer-phone">Telefon numaranız *</label><input id="offer-phone" type="tel" autoComplete="tel" className={field} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05xx xxx xx xx"/>
              <label className={stepLabel+" mt-4"} htmlFor="offer-email">E-posta (isteğe bağlı)</label><input id="offer-email" type="email" autoComplete="email" className={field} value={email} onChange={e=>setEmail(e.target.value)} placeholder="ornek@eposta.com"/>
              <label className="mt-5 flex items-start gap-3 text-[11px] leading-5 text-[#d6c6ae]"><input type="checkbox" className="mt-1 accent-[#a98a59]" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Girdiğim bilgilerle bir WhatsApp teklif görüşmesi başlatılmasını istiyorum. Bilgilerimin WhatsApp'a aktarılacağını anladım.</span></label>
            </>}
            {step===4&&<div className="space-y-3 rounded-xl border border-[#5b4d3c] bg-[#191613] p-4 text-[12px]">
              {[["Kullanım alanı",room],["Ürün / iş",product],["Ölçüler",[width&&"En "+width,height&&"Boy "+height,depth&&"Derinlik "+depth].filter(Boolean).join(" / ")||"Daha sonra"],["Şehir",city||"Belirtilmedi"],["Stil",style||"Görüşülecek"],["Malzeme",material||"Görüşülecek"],["İlgili kişi",name],["Telefon",phone]].map(([label,value])=><div className="flex justify-between gap-4 border-b border-[#5c4b37]/50 pb-2 last:border-0 last:pb-0" key={label}><span className="text-[#c9bba7]">{label}</span><strong className="max-w-[65%] text-right font-medium text-[#e9e2d8]">{value}</strong></div>)}
              <p className="pt-2 text-[11px] leading-5 text-[#bfb09e]">“WhatsApp ile gönder” butonuna basınca WhatsApp açılır. Mesajı orada göndermeniz gerekir; otomatik sipariş oluşturulmaz.</p>
            </div>}
          </div>

          {tried&&!valid[step]&&<p role="alert" className="mt-3 text-[12px] text-[#e9a78e]">{step===0?"Lütfen kullanım alanı ve ürün türü seçin.":"Lütfen ad, telefon ve onay alanını tamamlayın."}</p>}
          <div className="mt-6 flex gap-3">
            {step>0&&<button type="button" onClick={()=>{setStep(s=>s-1);setTried(false)}} className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-[#695640] px-4 text-[13px] text-[#d7c5af]"><ArrowLeft size={16}/> Geri</button>}
            {step<4?<button type="button" onClick={next} className="flex min-h-[50px] flex-1 items-center justify-center gap-3 rounded-xl border border-[#c6a473] bg-[#bda071] px-5 text-[13px] font-semibold text-[#17130f] transition-colors hover:bg-[#e2c28e]">Devam Et <ArrowRight size={17}/></button>:<a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[50px] flex-1 items-center justify-center gap-3 rounded-xl border border-[#c6a473] bg-[#bda071] px-5 text-center text-[13px] font-semibold text-[#17130f] transition-colors hover:bg-[#e2c28e]"><MessageCircle size={18}/> WhatsApp ile Teklif Gönder</a>}
          </div>
        </div>
      </section>
    </div>
    <section className="relative z-10 border-t border-[#544635] bg-[#11100e]/95 px-5 py-10 backdrop-blur-md md:px-[5vw]">
      <p className="text-center text-xs uppercase tracking-[.2em] text-[#c4a36b]">NASIL ÇALIŞIYORUZ?</p>
      <div className="mx-auto mt-8 grid max-w-[1450px] gap-6 text-center md:grid-cols-4">
        {[{icon:MessageCircle,title:"Talebinizi iletin",desc:"İhtiyacınızla ilgili bilgileri paylaşın."},{icon:ClipboardList,title:"Değerlendirelim",desc:"Projenin ölçü ve üretim detaylarını görüşelim."},{icon:Layers3,title:"Teklifimizi sunalım",desc:"Malzeme, kapsam, fiyat ve süreyi netleştirelim."},{icon:Clock3,title:"Planlayıp üretelim",desc:"Onay sonrası üretim ve teslimatı planlayalım."}].map(({icon:Icon,title,desc})=><div key={title}><Icon size={27} strokeWidth={1.4} className="mx-auto text-[#a98a59]"/><h3 className="mt-4 font-display text-xl text-[#e8ded0]">{title}</h3><p className="mx-auto mt-2 max-w-[250px] text-xs leading-6 text-[#b7a99a]">{desc}</p></div>)}
      </div>
    </section>
  </main>
}
