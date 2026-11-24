import { ArrowUpRight, Building2, Hammer, Layers3, Ruler, ShieldCheck, Handshake } from "lucide-react";

const services = [
  { icon: Hammer, title: "Özel üretim mobilya", description: "Projeye ve ölçüye özel mobilya, sabit donatı ve ahşap detayların üretimi." },
  { icon: Layers3, title: "Mimari ahşap uygulamalar", description: "Duvar kaplamaları, dekoratif paneller ve mekâna uygun ahşap çözümler." },
  { icon: Ruler, title: "Proje bazlı üretim", description: "Mimari çizim, ölçü, malzeme ve uygulama koşullarına göre birlikte planlama." },
  { icon: ShieldCheck, title: "Kapsamlı uygulama seçenekleri", description: "Proje ve ekip uygunluğuna göre montaj veya anahtar teslim çözümleri değerlendirebiliriz." },
] as const;

export function CorporatePartnershipSection() {
  const whatsapp = "https://wa.me/905360236146?text=" + encodeURIComponent("Merhaba Nil Mobilya, mimari ahşap işlerimiz ve özel üretim projemiz için bir görüşme yapmak istiyoruz.");

  return (
    <section id="kurumsal-is-ortakligi" lang="tr" aria-label="Ahşap işleri ve kurumsal proje görüşmeleri"
      className="nil-scene relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-[#090a0a] text-[#e8e2d9]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_20%,rgba(129,95,53,0.12),transparent_46%),radial-gradient(ellipse_at_12%_84%,rgba(99,77,44,0.1),transparent_48%),linear-gradient(150deg,#11100e,#080909_55%,#11100e)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(circle,rgba(202,166,107,0.4)_0.7px,transparent_1px)] [background-size:97px_91px]" />
      <div className="mx-auto flex w-full max-w-[1620px] flex-col gap-7 px-5 pb-9 pt-28 sm:px-10 md:gap-10 md:px-14 lg:px-[5.2vw] lg:pb-12 lg:pt-[120px]">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(310px,0.75fr)] lg:gap-[5vw]">
          <div className="min-w-0 max-w-[770px]">
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c5a074]">
              <span className="h-px w-9 shrink-0 bg-[#a58458]" aria-hidden="true"/> ÖZEL ÜRETİM / KURUMSAL GÖRÜŞME
            </p>
            <h2 className="mt-5 font-display text-[clamp(30px,3vw,49px)] font-normal leading-[1.15] tracking-[-0.012em] text-[#eee7dc]">
              Ahşap İşleriniz ve<br/><span className="text-[#c7a176]">Özel Üretim Projeleriniz</span><br/>İçin Görüşelim.
            </h2>
            <p className="mt-5 max-w-[660px] text-[clamp(13px,0.95vw,16px)] leading-[1.75] text-[#c5bdb1]">
              Mimarlar, iç mimarlar, müteahhitler ve proje sahipleriyle; özel ölçü mobilya, mimari ahşap uygulamalar ve proje bazlı üretim konularında iş birliği fırsatlarını değerlendiriyoruz.
            </p>
            <p className="mt-3 max-w-[620px] text-[13px] leading-7 text-[#a39b91]">
              Projenizin çizimlerini, ihtiyaçlarını ve hedeflerinizi paylaşın. Uygun üretim ve uygulama kapsamını birlikte belirleyelim.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-3 rounded-lg border border-[#c7a16c] bg-[#bb9666] px-5 py-3 text-xs font-semibold text-[#100d09] transition-colors hover:bg-[#dfb982]">
                Proje görüşmesi başlat <ArrowUpRight size={16}/>
              </a>
              <a href="#iletisim" className="inline-flex min-h-11 items-center justify-center gap-3 rounded-lg border border-[#715638] bg-[#141310]/90 px-5 py-3 text-xs font-medium text-[#d7b58d] transition-colors hover:bg-[#33271d]">
                İletişime geç <ArrowUpRight size={15}/>
              </a>
            </div>
          </div>
          <aside className="min-w-0 rounded-2xl border border-[#725737]/65 bg-[linear-gradient(145deg,rgba(28,26,22,0.96),rgba(13,14,13,0.94))] p-5 shadow-[0_14px_44px_rgba(0,0,0,0.22)] sm:p-7" aria-label="İş ortaklığı yaklaşımımız">
            <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.14em] text-[#bf9b70]"><Building2 size={19}/> İŞ ORTAKLIĞI YAKLAŞIMIMIZ</div>
            <p className="mt-5 font-display text-[clamp(21px,1.85vw,29px)] leading-[1.32] text-[#e0cfb9]">“Önce projenizi dinler,<br/>sonra üretimi birlikte planlarız.”</p>
            <div className="mt-5">
              {[
                ["01","Ön görüşme","Proje ve beklentilerin paylaşılması"],
                ["02","Teknik değerlendirme","Ölçü, malzeme ve üretim kapsamı"],
                ["03","Teklif ve planlama","Projeye özel çalışma ve süreç görüşmesi"],
              ].map(([number,title,detail])=><div key={number} className="flex gap-4 border-t border-[#8a673d]/25 py-3">
                <span className="w-6 shrink-0 text-xs text-[#b48c5c]">{number}</span>
                <div><strong className="block text-[13px] font-semibold text-[#e0d5c6]">{title}</strong><small className="mt-1 block text-[11px] leading-5 text-[#a69b8d]">{detail}</small></div>
              </div>)}
            </div>
            <p className="flex items-center gap-3 border-t border-[#8a673d]/25 pt-4 text-[11px] leading-5 text-[#c1a985]">
              <Handshake size={18} className="shrink-0"/> Tek bir ürün için de büyük ölçekli işler için de görüşebiliriz.
            </p>
          </aside>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {services.map(({icon:Icon,title,description})=><article key={title} className="min-w-0 rounded-xl border border-[#735838]/55 bg-[linear-gradient(145deg,rgba(37,31,24,0.62),rgba(15,15,14,0.82))] p-4 sm:p-5">
            <Icon size={22} strokeWidth={1.4} className="text-[#c09a69]" aria-hidden="true"/>
            <h3 className="mt-3 font-display text-[clamp(16px,1.3vw,21px)] leading-[1.3] text-[#e9dbc9]">{title}</h3>
            <p className="mt-2 text-[11px] leading-[1.65] text-[#afa59a]">{description}</p>
          </article>)}
        </div>
      </div>
    </section>
  );
}
