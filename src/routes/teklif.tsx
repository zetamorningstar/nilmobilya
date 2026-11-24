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
const field="w-full rounded-lg border border-[#695640] bg-[#191714]/90 px-4 py-3 text-[13px] text-[#e9e2d8] outline-none placeholder:text-[#9f9281] focus:border-[#b4976c]";
const stepLabel="mb-2 block text-[12px] font-medium text-[#d6c6ae]";
const img="/Alacakaranl%C4%B1kta%20L%C3%BCks%20Modern%20Salon.webp";

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

  return <main lang="tr" className="relative min-h-svh overflow-hidden bg-[#0c0b0b] text-[#e9e2d8]">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_5%,rgba(117,85,45,0.12),transparent_45%),linear-gradient(115deg,#0c0b0b,#1b1714_64%,#0c0b0b)]"/>
    <header className="relative z-10 flex min-h-[78px] items-center justify-between gap-5 border-b border-[#66543c]/25 bg-[#100e0d]/90 px-5 md:px-[5vw]">
      <Link to="/" className="flex items-center gap-3 font-display text-[24px] tracking-[.1em] text-[#c4a36b]"><span className="text-[29px]">N</span><span>Nil Mobilya</span></Link>
      <nav className="hidden items-center gap-8 text-xs text-[#c8bbaa] md:flex"><Link to="/" className="hover:text-[#f4ebdf]">Ana Sayfa</Link><Link to="/sergimiz" className="hover:text-[#f4ebdf]">Projelerimiz</Link><a href="/#kurumsal-is-ortakligi" className="hover:text-[#f4ebdf]">İş Ortaklığı</a></nav>
      <Link to="/" className="rounded-lg border border-[#89704c] px-4 py-2.5 text-xs text-[#e0d6c7]">Siteye Dön <ArrowUpRight size={14} className="ml-1 inline"/></Link>
    </header>

    <div className="relative z-10 mx-auto grid max-w-[1660px] lg:min-h-[calc(100svh-78px)] lg:grid-cols-[minmax(0,0.97fr)_minmax(0,1.03fr)]">
      <section className="relative isolate flex min-h-[390px] flex-col justify-between overflow-hidden px-6 pb-9 pt-10 md:px-[5vw] lg:min-h-[690px] lg:py-16">
        {/* The approved warm, cinematic design language; actual Nil Mobilya image, no invented projects. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20" style={{backgroundImage:`url("${img}")`,backgroundPosition:"61% center",backgroundSize:"cover"}}/>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{background:"linear-gradient(90deg,rgba(8,7,7,.96) 0%,rgba(10,8,7,.83) 45%,rgba(12,10,9,.43) 100%),linear-gradient(0deg,rgba(8,7,6,.94) 0%,transparent 45%),linear-gradient(180deg,rgba(8,7,7,.43) 0%,transparent 38%)"}}/>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-70" style={{background:"radial-gradient(ellipse at 86% 60%,rgba(173,123,64,.17),transparent 43%)"}}/>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-8 h-px bg-gradient-to-r from-[#bc9a63]/55 via-[#bc9a63]/10 to-transparent md:inset-x-[5vw] lg:top-11"/>
        <div aria-hidden="true" className="pointer-events-none absolute right-[5%] top-[22%] hidden h-[280px] w-[190px] rounded-t-full border border-[#b99b72]/20 lg:block"/>
        <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-[26%] hidden h-[250px] w-[150px] rounded-t-full border border-[#b99b72]/10 lg:block"/>
        <div className="relative z-10">
          <div className="mb-9 flex items-center gap-3 text-[10px] uppercase tracking-[.24em] text-[#baa17d]"><span className="h-px w-8 bg-[#ae8d5e]"/> NİL MOBİLYA <span className="text-[#827464]">/</span> ÖZEL ÜRETİM</div>
          <p className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[.24em] text-[#c4a36b]">AKILLI TEKLİF SİSTEMİ <span className="h-px w-12 bg-[#ad8a59]"/></p>
          <h1 className="mt-7 max-w-[650px] font-display text-[clamp(35px,3.5vw,56px)] leading-[1.08] font-normal">Projeniz için<br/>hızlı ve doğru <span className="text-[#c4a36b]">teklif görüşmesi.</span></h1>
          <p className="mt-6 max-w-[475px] text-sm leading-7 text-[#d5c8b8]">İhtiyaçlarınızı, ölçü ve malzeme tercihlerinizi birkaç adımda paylaşın. Projenizi değerlendirerek size özel fiyat ve üretim seçeneklerini görüşelim.</p>
          <div className="mt-9 grid max-w-[500px] grid-cols-2 gap-x-6 gap-y-4 border-t border-[#a88b62]/30 pt-6 text-[12px] leading-5 text-[#e2d7c6]">
            <div className="flex items-center gap-3"><Ruler size={20} className="shrink-0 text-[#c4a36b]"/> Özel ölçü üretim</div>
            <div className="flex items-center gap-3"><Layers3 size={20} className="shrink-0 text-[#c4a36b]"/> Malzeme seçenekleri</div>
            <div className="flex items-center gap-3"><ClipboardList size={20} className="shrink-0 text-[#c4a36b]"/> Proje bazlı teklif</div>
            <div className="flex items-center gap-3"><Handshake size={20} className="shrink-0 text-[#c4a36b]"/> WhatsApp görüşmesi</div>
          </div>
        </div>
        <div className="relative z-10 mt-12 flex items-end justify-between gap-5 border-t border-[#bba078]/30 pt-6">
          <p className="max-w-[375px] text-[11px] leading-6 text-[#c8baa7]">Fiyatlar ölçü, malzeme ve iş kapsamı belirlendikten sonra sunulur. Bu sayfa otomatik fiyat hesaplamaz.</p>
          <div aria-hidden="true" className="hidden shrink-0 flex-col items-end gap-1 text-right sm:flex"><span className="font-display text-[31px] leading-none text-[#c7a573]/80">N.</span><span className="text-[9px] uppercase tracking-[.25em] text-[#af9b7e]">Form · Doku · Denge</span></div>
        </div>
      </section>

      <section className="relative isolate flex flex-col justify-center overflow-hidden bg-[#100e0d]/95 px-4 py-9 sm:px-8 lg:px-[4vw]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(145deg,#181410,#0e0d0c_52%,#17120e)]"/>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{background:"radial-gradient(ellipse at 78% 20%,rgba(196,163,107,.085),transparent 54%),repeating-linear-gradient(0deg,transparent 0 95px,rgba(196,163,107,.025) 96px 97px),repeating-linear-gradient(90deg,transparent 0 95px,rgba(196,163,107,.025) 96px 97px)"}}/>
        <div aria-hidden="true" className="pointer-events-none absolute right-[5%] top-[7%] hidden h-48 w-48 rounded-full border border-[#c4a36b]/10 lg:block"/>
        <div className="relative mx-auto w-full max-w-[670px]">
          <div className="mb-5 flex items-center justify-between gap-4 px-1">
            <span className="text-[10px] uppercase tracking-[.24em] text-[#bea37e]">PROJENİZE ÖZEL</span>
            <span className="flex items-center gap-3 text-[10px] text-[#bca88b]"><span className="h-px w-9 bg-[#a98a59]/65"/> 05 ADIMDA BAŞLANGIÇ</span>
          </div>
          <div className="rounded-[18px] border border-[#786044]/65 bg-[linear-gradient(150deg,rgba(37,30,24,.96),rgba(18,16,14,.98))] p-5 shadow-[0_30px_80px_rgba(0,0,0,.35)] sm:p-8">
          <p className="text-[10px] tracking-[.2em] text-[#c4a36b]">ADIM {step+1} / 5</p>
          <h2 className="mt-2 font-display text-[clamp(24px,2.3vw,36px)] leading-tight">{["Projenizi tanıyalım","Ölçü ve konum bilgileri","Tasarım tercihleri","İletişim bilgileriniz","Talebiniz hazır"][step]}</h2>
          <p className="mt-2 text-[12px] leading-5 text-[#b6aa98]">{["Hangi alan ve mobilya için çalışmak istediğinizi seçin.","Ölçüleriniz hazır değilse daha sonra paylaşabilirsiniz.","Tarz ve malzeme seçimi sadece başlangıç içindir.","Sizinle iletişime geçebilmemiz için bilgilerinizi ekleyin.","Bilgilerinizi kontrol edip WhatsApp üzerinden iletin."][step]}</p>

          <div className="mt-6 flex items-start gap-1.5 sm:gap-3" aria-label="Teklif aşamaları">
            {stages.map((label,i)=><button type="button" key={label} onClick={()=>{if(i<step){setStep(i);setTried(false);}}} disabled={i>step} className="min-w-0 flex-1 text-center disabled:cursor-default" aria-current={step===i?"step":undefined}>
              <span className={`mx-auto flex size-8 items-center justify-center rounded-full border text-xs ${i<=step?"border-[#a98a59] bg-[#413427] text-white":"border-[#64543e] text-[#b6aa98]"}`}>{i<step?<Check size={15}/>:i+1}</span>
              <span className={`mt-2 block text-[9px] sm:text-[11px] ${i===step?"text-[#c4a36b]":"text-[#a89a88]"}`}>{label}</span>
            </button>)}
          </div>

          <div className="mt-7 min-h-[270px]">
            {step===0&&<>
              <p className={stepLabel}>Kullanım alanı <span className="text-[#c4a36b]">*</span></p>
              <div className="grid grid-cols-4 gap-2">
                {rooms.map(({value,icon:Icon})=><button type="button" key={value} onClick={()=>{setRoom(value);setProduct("");}} aria-pressed={room===value} className={`flex min-h-[87px] flex-col items-center justify-center gap-2 rounded-lg border p-2 text-center text-[10px] leading-4 transition-colors sm:text-xs ${room===value?"border-[#a98a59] bg-[#33291f] text-[#e4c99d]":"border-[#55483a] bg-[#1d1a17] text-[#d2c4b2] hover:border-[#a98a59]"}`}><Icon size={23} strokeWidth={1.4}/>{value}</button>)}
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
            {step<4?<button type="button" onClick={next} className="flex min-h-[48px] flex-1 items-center justify-center gap-3 rounded-lg bg-[#2b251f] px-5 text-[13px] font-semibold text-[#d5b782] hover:bg-[#373026]">Devam Et <ArrowRight size={17}/></button>:<a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[48px] flex-1 items-center justify-center gap-3 rounded-lg bg-[#2b251f] px-5 text-center text-[13px] font-semibold text-[#d5b782] hover:bg-[#373026]"><MessageCircle size={18}/> WhatsApp ile Teklif Gönder</a>}
          </div>
          </div>
        </div>
      </section>
    </div>
    <section className="relative z-10 border-t border-[#544635] bg-[#11100e] px-5 py-10 md:px-[5vw]">
      <p className="text-center text-xs uppercase tracking-[.2em] text-[#c4a36b]">NASIL ÇALIŞIYORUZ?</p>
      <div className="mx-auto mt-8 grid max-w-[1450px] gap-6 text-center md:grid-cols-4">
        {[{icon:MessageCircle,title:"Talebinizi iletin",desc:"İhtiyacınızla ilgili bilgileri paylaşın."},{icon:ClipboardList,title:"Değerlendirelim",desc:"Projenin ölçü ve üretim detaylarını görüşelim."},{icon:Layers3,title:"Teklifimizi sunalım",desc:"Malzeme, kapsam, fiyat ve süreyi netleştirelim."},{icon:Clock3,title:"Planlayıp üretelim",desc:"Onay sonrası üretim ve teslimatı planlayalım."}].map(({icon:Icon,title,desc})=><div key={title}><Icon size={27} strokeWidth={1.4} className="mx-auto text-[#a98a59]"/><h3 className="mt-4 font-display text-xl text-[#e8ded0]">{title}</h3><p className="mx-auto mt-2 max-w-[250px] text-xs leading-6 text-[#b7a99a]">{desc}</p></div>)}
      </div>
    </section>
  </main>
}
