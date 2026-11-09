import { useState, type FormEvent } from "react";
import { ArrowRight, ChevronDown, ChevronRight, Instagram, Mail, MapPin, Phone } from "lucide-react";

import contactHero from "@/assets/nil-hero.jpg";

// ---- İletişim bilgileri: burayı kendi bilgilerinle güncelle ----
const ILETISIM = {
  adres: ["Örnek Mah. Mobilya Bulvarı No:12", "Kadıköy / İstanbul"], // TODO: gerçek adres
  telefon: "0 (536) 023 61 46",
  telefonHref: "tel:+905360236146",
  saatler: "Hafta içi 09:00 - 19:00", // TODO: gerçek çalışma saatleri
  eposta: "nillmobilya@gmail.com",
  yanit: "24 saat içinde yanıt veriyoruz.",
  instagram: "https://www.instagram.com/nill.mobilya/",
} as const;

const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ILETISIM.adres.join(" "))}`;

const KONULAR = ["Genel bilgi", "Koleksiyonlar", "Özel üretim talebi", "Teklif almak istiyorum", "Diğer"] as const;

function NLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M6 26V6l20 20V6" />
      <path d="M3 29V3M29 29V3" opacity="0.45" />
    </svg>
  );
}

export function ContactSection() {
  const [form, setForm] = useState({ ad: "", eposta: "", konu: "", mesaj: "" });
  const [durum, setDurum] = useState<"" | "hazir">("");
  const set = (key: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  // Sunucu olmadığı için mesaj, kullanıcının e-posta uygulamasında hazır açılır
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const subject = `${form.konu} · ${form.ad}`;
    const body = `Ad Soyad: ${form.ad}\nE-posta: ${form.eposta}\nKonu: ${form.konu}\n\n${form.mesaj}`;
    window.location.href = `mailto:${ILETISIM.eposta}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDurum("hazir");
  };

  return (
    <section id="iletisim" aria-label="İletişim" lang="tr" className="nil-scene nil-scene--ct">
      <div className="nil-scene__body ct">
        {/* ============ Üst bant ============ */}
        <div className="ct-banner">
          <div data-s="frame" aria-hidden="true" className="ct-banner__photo">
            <img src={contactHero} alt="" width={1920} height={1280} decoding="async" />
          </div>

                    <div data-s="fade" aria-hidden="true" className="ct-mark">
            <b>N</b>
            <i>Contact</i>
            <u />
          </div>

          <div className="ct-banner__text">
            <nav data-s="fade" aria-label="Sayfa yolu" className="ct-crumb">
              <a href="#top">Ana sayfa</a>
              <ChevronRight className="ct-crumb__sep" strokeWidth={1.4} aria-hidden="true" />
              <span aria-current="page">İletişim</span>
            </nav>
            <h2 data-s="text" className="ct-title">İletişim</h2>
            <p data-s="text" className="ct-sub">Sorularınız, önerileriniz ve tüm talepleriniz için bizimle iletişime geçebilirsiniz.</p>
            <span data-s="rule" aria-hidden="true" className="ct-deco" />
          </div>
        </div>

                {/* ============ Orta bölüm ============ */}
        <div className="ct-body">
          {/* Bilgiler */}
          <div className="ct-info">
            <div data-s="fade" className="ct-item">
              <span className="ct-item__ico"><MapPin strokeWidth={1.5} /></span>
              <div>
                <p className="ct-item__t">Mağaza Adresi</p>
                <p className="ct-item__l">{ILETISIM.adres[0]}<br />{ILETISIM.adres[1]}</p>
              </div>
            </div>
            <div data-s="fade" className="ct-item">
              <span className="ct-item__ico"><Phone strokeWidth={1.5} /></span>
              <div>
                <p className="ct-item__t">Telefon</p>
                <p className="ct-item__l"><a href={ILETISIM.telefonHref}>{ILETISIM.telefon}</a><br />{ILETISIM.saatler}</p>
              </div>
            </div>
            <div data-s="fade" className="ct-item">
              <span className="ct-item__ico"><Mail strokeWidth={1.5} /></span>
              <div>
                <p className="ct-item__t">E-posta</p>
                <p className="ct-item__l"><a href={`mailto:${ILETISIM.eposta}`}>{ILETISIM.eposta}</a></p>
                <p className="ct-item__s">{ILETISIM.yanit}</p>
              </div>
            </div>
            <div data-s="fade" className="ct-item">
              <span className="ct-item__ico"><Instagram strokeWidth={1.5} /></span>
              <div>
                <p className="ct-item__t">Sosyal Medya</p>
                <p className="ct-item__l">
                  <a href={ILETISIM.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="ct-social"><Instagram strokeWidth={1.4} /></a>
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="ct-form-cell">
            <h3 data-s="text" className="ct-form__title">Bize Yazın</h3>
            <p data-s="text" className="ct-form__sub">Görüş, öneri veya taleplerinizi formu doldurarak bizimle iletişime geçebilirsiniz.</p>
            <form data-s="fade" onSubmit={onSubmit} className="ct-form">
              <input required type="text" value={form.ad} onChange={set("ad")} placeholder="Adınız Soyadınız *" autoComplete="name" aria-label="Adınız soyadınız" className="ct-field" />
              <input required type="email" value={form.eposta} onChange={set("eposta")} placeholder="E-posta Adresiniz *" autoComplete="email" aria-label="E-posta adresiniz" className="ct-field" />
              <div className="ct-select ct-span">
                <select required value={form.konu} onChange={set("konu")} aria-label="Konu" className="ct-field">
                  <option value="" disabled>Konu *</option>
                  {KONULAR.map((konu) => <option key={konu} value={konu}>{konu}</option>)}
                </select>
                <ChevronDown aria-hidden="true" strokeWidth={1.4} />
              </div>
              <textarea required value={form.mesaj} onChange={set("mesaj")} placeholder="Mesajınız *" aria-label="Mesajınız" className="ct-field ct-span ct-area" />
              <div className="ct-span ct-send">
                <button type="submit" className="ct-btn">
                  <span>Mesaj gönder</span>
                  <ArrowRight strokeWidth={1.4} aria-hidden="true" />
                </button>
                {durum === "hazir" && <p role="status" className="ct-status">E-posta uygulamanızda mesajınız hazırlandı, göndermeniz yeterli.</p>}
              </div>
            </form>
          </div>

          {/* Harita */}
          <div className="ct-side">
            <a data-s="fade" href={MAP_URL} target="_blank" rel="noopener noreferrer" aria-label="Haritada göster" className="ct-map">
              <svg viewBox="0 0 315 192" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" aria-hidden="true">
                <g strokeWidth="1" opacity="0.35">
                  <path d="M-10 40 L120 70 L330 20" />
                  <path d="M20 192 L90 100 L200 120 L340 90" />
                  <path d="M60 -10 L110 80 L100 200" />
                  <path d="M180 -10 L170 110 L230 200" />
                  <path d="M260 -10 L250 70 L320 140" />
                  <path d="M-10 130 L100 120 L180 150 L330 170" />
                </g>
                <g strokeWidth="2.2" opacity="0.5">
                  <path d="M-10 160 L150 95 L330 60" />
                  <path d="M130 -10 L150 95 L140 200" />
                </g>
              </svg>
              <span className="ct-map__pin"><MapPin fill="currentColor" strokeWidth={1} /></span>
              <span className="ct-map__tag">Nil Mobilya</span>
            </a>
            <h3 data-s="text" className="ct-side__t">Mağazamız</h3>
            <p data-s="text" className="ct-side__a">{ILETISIM.adres[0]}<br />{ILETISIM.adres[1]}</p>
            <a data-s="fade" href={MAP_URL} target="_blank" rel="noopener noreferrer" className="ct-side__link">
              <span>Haritada Göster</span>
              <ArrowRight strokeWidth={1.4} aria-hidden="true" />
            </a>
          </div>
        </div>
        {/* ============ Alt çubuk ============ */}
        <div data-s="fade" className="ct-foot">
          <div className="ct-foot__l">
            <NLogo className="ct-foot__logo" />
            <span className="ct-foot__brand">Nil Mobilya</span>
            <i aria-hidden="true" />
            <span className="ct-foot__tag">Tasarım <em>/</em> Kalite <em>/</em> Zarafet</span>
          </div>
          <div className="ct-foot__r">
            <span>Gizlilik Politikası</span>
            <i aria-hidden="true" />
            <span>Kullanım Şartları</span>
            <NLogo className="ct-foot__logo ct-foot__logo--r" />
          </div>
        </div>
      </div>
    </section>
  );
}