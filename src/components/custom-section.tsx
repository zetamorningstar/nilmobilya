import { useState } from "react";
import { ArrowRight, Box, Palette, Ruler } from "lucide-react";

import customHero from "@/assets/custom-hero.jpg";
import customCraft from "@/assets/custom-craft.jpg";
import woodImage from "@/assets/material-ceviz.jpg";
import fabricImage from "@/assets/material-boucle.jpg";
import marbleImage from "@/assets/about-detail.jpg";

const STEPS = [
  "Kişiye özel tasarım",
  "Premium malzeme seçimi",
  "Usta işçiliği",
  "Zamansız estetik",
] as const;

const FEATURES = [
  [Ruler, "Özel ölçü", "uygulamaları"],
  [Palette, "Renk ve malzeme", "seçenekleri"],
  [Box, "3D tasarım", "görselleştirme"],
] as const;

export function CustomSection() {
  const [step, setStep] = useState(0);

  return (
    <section id="ozel-uretim" aria-label="Özel üretim" lang="tr" className="nil-scene nil-scene--ou">
      <div className="nil-scene__body ou">
        {/* ============ Üst bant ============ */}
        <div className="ou-top">
          <div data-s="frame" aria-hidden="true" className="ou-top__photo">
            <img src={customHero} alt="" width={2400} height={1400} decoding="async" />
          </div>

          <div className="ou-top__text">
            <div className="ou-eyebrow">
              <span data-s="rule" aria-hidden="true" className="ou-eyebrow__line" />
              <p data-s="text">Özel üretim</p>
            </div>
            <h2 className="ou-title">
              <span data-s="text" className="block">Hayalinizdeki yaşam alanı,</span>
              <span data-s="text" className="block">bizim ustalığımızla <em className="ou-gold">gerçeğe dönüşür.</em></span>
            </h2>
            <p data-s="text" className="ou-lead">
              Nil Mobilya olarak, standartların ötesinde, tamamen size özel tasarım ve üretim hizmeti sunuyoruz. Mekânınızın ölçüsüne, tarzınıza ve ihtiyaçlarınıza göre şekillenen mobilyalarla, hayalinizdeki yaşam alanını birlikte tasarlıyoruz.
            </p>
            <div data-s="fade">
              <a href="#iletisim" className="ou-btn group">
                <span>Özel tasarım talebi</span>
                <ArrowRight className="ou-arrow" strokeWidth={1.2} />
              </a>
            </div>
          </div>

          <div data-s="fade" className="ou-steps" role="tablist" aria-label="Özel üretim ilkeleri">
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={step === i}
                onClick={() => setStep(i)}
                className="ou-step"
              >
                <span className="ou-step__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="ou-step__t">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ============ Alt bant ============ */}
        <div className="ou-bottom">
          {/* Kolaj */}
          <div className="ou-collage-cell">
            <div className="ou-collage">
              <div data-s="frame" aria-hidden="true" className="ou-collage__main">
                <img src={customCraft} alt="" width={1200} height={1400} decoding="async" />
              </div>
              <div className="ou-collage__side" aria-hidden="true">
                <div data-s="frame" className="ou-tile"><img src={woodImage} alt="" width={800} height={600} decoding="async" /></div>
                <div data-s="frame" className="ou-tile"><img src={fabricImage} alt="" width={800} height={600} decoding="async" /></div>
                <div data-s="frame" className="ou-tile"><img src={marbleImage} alt="" width={800} height={600} decoding="async" className="ou-tile__marble" /></div>
              </div>
              <div data-s="fade" className="ou-caption">
                <span>Tasarımdan üretime</span>
                <i aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Süreç */}
          <div className="ou-process">
            <p data-s="text" className="ou-eyebrow2">Süreç</p>
            <h3 data-s="text" className="ou-process__title">Nasıl çalışıyoruz?</h3>
            <p data-s="text" className="ou-process__p">
              Özel üretim sürecimiz, sizinle yapacağımız detaylı bir görüşme ile başlar. İhtiyaçlarınızı, tarzınızı ve mekânınızın özelliklerini analiz ederek size özel bir tasarım önerisi sunuyoruz. Onayınızın ardından, alanında uzman ekibimiz, en kaliteli malzemelerle üretim sürecini başlatır. Her aşamada sizinle iletişimde kalarak, hayalinizdeki mobilyayı titizlikle hayata geçiriyoruz.
            </p>
            <div data-s="fade">
              <a href="#iletisim" className="ou-more group">
                <span>Detaylı bilgi</span>
                <ArrowRight className="ou-arrow" strokeWidth={1.2} />
              </a>
            </div>
          </div>

          {/* İmza + özellikler */}
          <div className="ou-sign">
            <p data-s="text" className="ou-sign__t">Her detayda<br /><em className="ou-gold">sizin imzanız.</em></p>
            <span data-s="rule" aria-hidden="true" className="ou-sign__rule" />
            <div data-s="fade" className="ou-feats">
              {FEATURES.map(([Icon, line1, line2]) => (
                <div key={line1} className="ou-feat">
                  <Icon className="ou-feat__icon" strokeWidth={1.1} aria-hidden="true" />
                  <p className="ou-feat__a">{line1}</p>
                  <p className="ou-feat__b">{line2}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}