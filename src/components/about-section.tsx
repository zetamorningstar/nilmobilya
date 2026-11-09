import { Armchair, ArrowRight, Gem, Users } from "lucide-react";

import aboutHero from "@/assets/about-hero.jpg";
import aboutDetail from "@/assets/about-detail.jpg";

const STATS = [
  [Gem, "2015", "Kuruluş Yılı"],
  [Armchair, "50+", "Özel Koleksiyon"],
  [Users, "10.000+", "Mutlu Müşteri"],
] as const;

export function AboutSection() {
  return (
    <section id="hikaye" aria-label="Hakkımızda" lang="tr" className="nil-scene nil-scene--hk relative isolate">
      <div className="nil-scene__body hk relative z-10">
        {/* ============ Üst bant ============ */}
        <div className="hk-top">
          <div data-s="frame" aria-hidden="true" className="hk-top__photo">
            <img src={aboutHero} alt="" width={2400} height={1400} decoding="async" />
          </div>

          <div className="hk-top__text">
            <div className="hk-eyebrow">
              <span data-s="rule" aria-hidden="true" className="hk-eyebrow__line" />
              <p data-s="text">Nil Mobilya</p>
            </div>
            <h2 data-s="text" className="hk-title">Zamansız tasarım,<br />kalıcı değer.</h2>
            <p data-s="text" className="hk-lead">
              Nil Mobilya, modern yaşam alanlarını estetik, konfor ve fonksiyonellik ile buluşturan, özgün tasarımlarıyla sektörde fark yaratmayı hedefleyen bir markadır.
            </p>
            <div data-s="fade">
              <a href="#koleksiyon" className="hk-link group">
                <span className="hk-link__t">Markamızı keşfet</span>
                <ArrowRight className="hk-link__arrow" strokeWidth={1.2} />
              </a>
            </div>
          </div>
        </div>

        {/* ============ Alt bant ============ */}
        <div className="hk-bottom">
          <div className="hk-photo">
            <div data-s="frame" aria-hidden="true" className="hk-photo__in">
              <img src={aboutDetail} alt="" width={1600} height={1280} decoding="async" />
            </div>
          </div>

          <div className="hk-story">
            <div className="hk-story__text">
              <div className="hk-eyebrow">
                <span data-s="rule" aria-hidden="true" className="hk-eyebrow__line" />
                <p data-s="text">Hikâyemiz</p>
              </div>
              <h3 data-s="text" className="hk-story__title">Modern yaşamın<br />tasarım ortağı.</h3>
              <p data-s="text" className="hk-story__p">
                Nil Mobilya olarak, her yaşam alanının bir hikâyesi olduğuna inanıyoruz. Bu hikâyeyi, estetik ve fonksiyonelliği bir araya getiren özel tasarımlarımızla yazıyoruz. Doğallıktan ilham alan malzeme seçimimiz ve detaylara verdiğimiz önemle, yaşam alanlarınıza kalıcı bir değer katıyoruz.
              </p>
              <div data-s="fade">
                <a href="#ozel-uretim" className="hk-more group">
                  <span aria-hidden="true" className="hk-more__line" />
                  <span className="hk-more__t">Daha fazlası</span>
                  <ArrowRight className="hk-link__arrow" strokeWidth={1.2} />
                </a>
              </div>
            </div>

            <div data-s="fade" className="hk-stats">
              {STATS.map(([Icon, value, label]) => (
                <div key={label} className="hk-stat">
                  <Icon className="hk-stat__icon" strokeWidth={1} aria-hidden="true" />
                  <div>
                    <p className="hk-stat__n">{value}</p>
                    <p className="hk-stat__l">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div data-s="fade" aria-hidden="true" className="hk-scroll">
              <span className="hk-scroll__dot"><i /></span>
              <span className="hk-scroll__t">Aşağı kaydır</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}