import { ArrowUpRight, Building2, Hammer, Layers3, Ruler, ShieldCheck, Handshake } from "lucide-react";

const services = [
  { icon: Hammer, title: "Özel üretim mobilya", description: "Projeye ve ölçüye özel mobilya, sabit donatı ve ahşap detayların üretimi." },
  { icon: Layers3, title: "Mimari ahşap uygulamalar", description: "Duvar kaplamaları, dekoratif paneller ve mekâna uygun ahşap çözümler." },
  { icon: Ruler, title: "Proje bazlı üretim", description: "Mimari çizim, ölçü, malzeme ve uygulama koşullarına göre birlikte planlama." },
  { icon: ShieldCheck, title: "Uygun projelerde kapsamlı uygulama", description: "Gerekli ekip ve iş kapsamı değerlendirilerek montaj ve anahtar teslim seçenekleri." },
] as const;

export function CorporatePartnershipSection() {
  const whatsapp = "https://wa.me/905360236146?text=" + encodeURIComponent("Merhaba Nil Mobilya, mimari ahşap işlerimiz ve özel üretim projemiz için bir görüşme yapmak istiyoruz.");
  return (
    <section id="kurumsal-is-ortakligi" aria-label="Ahşap işleri ve kurumsal proje görüşmeleri" className="nil-scene nil-scene--partnership">
      <div className="nil-partnership__grain" aria-hidden="true" />
      <div className="nil-partnership__inner">
        <div className="nil-partnership__top">
          <div className="nil-partnership__intro">
            <p className="nil-partnership__eyebrow"><span/> ÖZEL ÜRETİM / KURUMSAL GÖRÜŞME</p>
            <h2>Ahşap İşleriniz ve<br/><em>Özel Üretim Projeleriniz</em><br/>İçin Görüşelim.</h2>
            <p className="nil-partnership__lead">Mimarlar, iç mimarlar, müteahhitler ve proje sahipleriyle; özel ölçü mobilya, mimari ahşap uygulamalar ve proje bazlı üretim konularında iş birliği fırsatlarını değerlendiriyoruz.</p>
            <p className="nil-partnership__sub">Projenizin çizimlerini, ihtiyaçlarını ve hedeflerinizi paylaşın. Uygun üretim ve uygulama kapsamını birlikte belirleyelim.</p>
            <div className="nil-partnership__actions">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="nil-partnership__primary">Proje görüşmesi başlat <ArrowUpRight size={16} /></a>
              <a href="#iletisim" className="nil-partnership__secondary">İletişime geç <ArrowUpRight size={15}/></a>
            </div>
          </div>
          <aside className="nil-partnership__side" aria-label="İş ortaklığı yaklaşımımız">
            <div className="nil-partnership__side-head"><Building2 size={19}/><span>İŞ ORTAKLIĞI YAKLAŞIMIMIZ</span></div>
            <p className="nil-partnership__quote">“Önce projenizi dinler,<br/>sonra üretimi birlikte planlarız.”</p>
            <div className="nil-partnership__steps">
              <div><span>01</span><p><strong>Ön görüşme</strong><small>Proje ve beklentilerin paylaşılması</small></p></div>
              <div><span>02</span><p><strong>Teknik değerlendirme</strong><small>Ölçü, malzeme ve üretim kapsamı</small></p></div>
              <div><span>03</span><p><strong>Teklif ve planlama</strong><small>Projeye özel çalışma ve süreç görüşmesi</small></p></div>
            </div>
            <div className="nil-partnership__side-note"><Handshake size={18}/><span>Tek bir ürün için de büyük ölçekli işlerde de görüşebiliriz.</span></div>
          </aside>
        </div>
        <div className="nil-partnership__services">
          {services.map(({icon:Icon,title,description}) => <article className="nil-partnership__service" key={title}>
            <Icon aria-hidden="true" size={22} strokeWidth={1.4}/>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>)}
        </div>
      </div>
    </section>
  );
}
