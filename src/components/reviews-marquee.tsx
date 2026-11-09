import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import heroImage from "@/assets/nil-hero.jpg";
import sofaImage from "@/assets/nil-sofa.jpg";
import diningImage from "@/assets/nil-dining.jpg";
import chairImage from "@/assets/nil-chair.jpg";

interface Review {
  name: string;
  city: string;
  text: string;
}

// Öne çıkan yorumlar (sağdaki fotoğrafla birlikte değişir)
const featured: (Review & { image: string })[] = [
  {
    name: "Mert K.",
    city: "İstanbul",
    image: heroImage,
    text: "Nil Mobilya ile çalışmak gerçekten çok keyifliydi. Hem tasarım sürecinde hem de teslimatta her adımda profesyonel ve ilgili bir ekip vardı. Evimiz şimdi tam olarak hayal ettiğimiz gibi.",
  },
  {
    name: "Elif A.",
    city: "İstanbul",
    image: sofaImage,
    text: "Salonumuzun tamamını Nil Mobilya ile yeniledik. Oranlar ve kumaş dokusu beklediğimizin çok üzerinde çıktı.",
  },
  {
    name: "Kaan D.",
    city: "Bursa",
    image: diningImage,
    text: "Ofisimiz için adetli üretim yaptılar. Teslim süresi ve renk tutarlılığı kusursuzdu.",
  },
  {
    name: "Ahmet K.",
    city: "Antalya",
    image: chairImage,
    text: "Kadife döşemenin tonu evdeki ışıkla birebir uyumlu geldi. Sessiz ama güçlü bir duruşu var.",
  },
];

// Alttaki üç yorum
const reviews: Review[] = [
  {
    name: "Ayşe D.",
    city: "Ankara",
    text: "Kaliteyi gerçekten hissediyorsunuz. Özellikle malzeme seçimi ve işçilik konusunda çok titizler. Kesinlikle tavsiye ederim.”",
  },
  {
    name: "Emre T.",
    city: "İzmir",
    text: "Hayal ettiğimizden çok daha fazlasını sundular. Hem estetik hem de konfor açısından beklentimizin üzerinde bir sonuç aldık.”",
  },
  {
    name: "Selin Y.",
    city: "Bursa",
    text: "Evimdeki her köşede Nil Mobilya'nın imzası var. Modern tasarımları ve kaliteli malzemeleri için teşekkür ederim.”",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function ReviewsMarquee() {
  const [index, setIndex] = useState(0);
  const current = featured[index]!;
  const step = (dir: 1 | -1) => setIndex((v) => (v + dir + featured.length) % featured.length);

  return (
    <section id="yorumlar" aria-label="Müşteri yorumları" lang="tr" className="nil-scene nil-scene--rev">
      <div className="nil-scene__body rev">
        {/* Başlık */}
        <div className="rev-head">
          <div className="rev-eyebrow">
            <span aria-hidden="true" className="rev-eyebrow__line" />
            <p data-s="text">Müşteri deneyimleri</p>
          </div>
          <h2 data-s="text" className="rev-title">Her detayda memnuniyet.</h2>
          <p data-s="text" className="rev-sub">Tasarımlarımızı yaşam alanlarına taşıyanların deneyimleri.</p>
        </div>

        {/* Öne çıkan yorum + fotoğraf + sayfalama */}
        <div className="rev-feature">
          <div data-s="fade" className="rev-quote">
            <div key={index} className="rev-quote__in rev-swap">
              <span aria-hidden="true" className="rev-mark">“</span>
              <div>
                <blockquote className="rev-quote__text">
                  {current.text}
                  <span className="rev-quote__end">”</span>
                </blockquote>
                <p className="rev-by">
                  <span aria-hidden="true" className="rev-by__dash" />
                  <b className="rev-by__name">{current.name}</b>
                  <em aria-hidden="true" className="rev-by__sep">|</em>
                  <span className="rev-by__city">{current.city}</span>
                </p>
              </div>
            </div>
          </div>

          <div data-s="frame" className="rev-photo">
            <img
              key={current.image}
              src={current.image}
              alt="Nil Mobilya ile yenilenen bir yaşam alanı"
              width={1280}
              height={720}
              decoding="async"
              className="rev-swap"
            />
          </div>

          <div data-s="fade" className="rev-ctrl">
            <p className="rev-count"><b>{pad(index + 1)}</b> / <span>{pad(featured.length)}</span></p>
            <div className="rev-arrows">
              <button type="button" aria-label="Önceki yorum" onClick={() => step(-1)}><ArrowLeft className="size-7" strokeWidth={1} /></button>
              <button type="button" aria-label="Sonraki yorum" onClick={() => step(1)}><ArrowRight className="size-7" strokeWidth={1} /></button>
            </div>
          </div>
        </div>

        <span data-s="rule" aria-hidden="true" className="rev-divider" />

        {/* Üç yorum */}
        <div className="rev-cols">
          {reviews.map((review) => (
            <figure key={review.name} className="rev-col">
              <div data-s="fade" className="rev-stars" role="img" aria-label="5 yıldız">★★★★★</div>
              <blockquote data-s="text" className="rev-col__text">{review.text}</blockquote>
              <span data-s="rule" aria-hidden="true" className="rev-col__dash" />
              <figcaption data-s="fade" className="rev-col__by">
                <b className="rev-by__name">{review.name}</b>
                <em aria-hidden="true" className="rev-by__sep">|</em>
                <span className="rev-by__city">{review.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Alt yazı */}
        <div data-s="fade" className="rev-tag">
          <i aria-hidden="true" />
          <p>Gerçek mekânlar, gerçek deneyimler.</p>
          <i aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}