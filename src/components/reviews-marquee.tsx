import { useState } from "react";
import { MessageCircle, Pencil, ImagePlus, Send, Star, ShieldCheck, PackageCheck } from "lucide-react";
import heroImage from "@/assets/nil-hero.jpg";

type Review = { id: number; name: string; product: string; rating: number; text: string };
const STORAGE_KEY = "nil-reviews-preview";

export function ReviewsMarquee() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [notice, setNotice] = useState("");
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !product || !rating || !message.trim()) {
      setNotice("Lütfen adınızı, ürününüzü, puanınızı ve yorumunuzu doldurun.");
      return;
    }
    // Üyelik ve sipariş doğrulama altyapısı kurulana kadar yorumlar sunucuya gönderilmez.
    const review = { id: Date.now(), name: name.trim(), product, rating, text: message.trim() };
    setReviews((old) => [review, ...old]);
    setMessage("");
    setRating(0);
    setPhotoName("");
    setNotice("Yorumunuz yalnızca bu sayfada önizleme olarak görünüyor. Henüz kaydedilmiyor veya yayınlanmıyor.");
  };
  return (
    <section id="yorumlar" aria-label="Müşteri yorumları" lang="tr" className="nil-scene nil-scene--rev nil-review-page">
      <div className="nil-review-page__backdrop" style={{ backgroundImage: `linear-gradient(90deg,rgba(9,7,6,.46),rgba(9,7,6,.58)),url(${heroImage})` }} />
      <div className="nil-review-page__layout">
        <div className="nil-review-page__intro" data-s="fade">
          <p className="nil-review-page__eyebrow">NİL MOBİLYA · MÜŞTERİ DENEYİMLERİ</p>
          <h2>Yorumlar <span aria-hidden="true">—</span></h2>
          <p>Nil Mobilya'dan alışveriş yapanların deneyimlerini keşfedin ve siz de deneyiminizi paylaşın.</p><div className="nil-review-page__trust"><span><ShieldCheck size={20}/> Doğrulanmış alışveriş</span><span><PackageCheck size={20}/> Gerçek deneyimler</span><span><Star size={20}/> Sizin yorumunuz</span></div>
        </div>
        <form className="nil-review-page__form" data-s="frame" onSubmit={submit}>
          <div className="nil-review-page__formhead"><Pencil size={23}/><div><h3>Yorum Yaz</h3><p>Satın aldığınız ürünle ilgili deneyiminizi paylaşın.</p></div></div>
          <div className="nil-review-page__fields">
            <label className="nil-review-page__field"><span>Adınız</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Adınız ve soyadınız" maxLength={80}/></label>
            <label className="nil-review-page__field"><span>Ürün seçin</span><select value={product} onChange={e=>setProduct(e.target.value)}><option value="">Ürün seçin</option><option>TV ünitesi</option><option>Dolap sistemi</option><option>Masa</option><option>Sandalye</option><option>Konsol</option><option>Özel üretim</option><option>Diğer</option></select></label>
          </div>
          <div className="nil-review-page__rating"><span>Puanınız</span><div role="group" aria-label="Yıldız puanı">{[1,2,3,4,5].map(n=><button key={n} type="button" aria-label={`${n} yıldız`} aria-pressed={rating===n} onClick={()=>setRating(n)}><Star size={23} fill={n<=rating?"currentColor":"none"}/></button>)}</div></div>
          <label className="nil-review-page__field"><span>Yorumunuz</span><textarea rows={3} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Deneyiminizi yazın..." maxLength={1200}/></label>
          <div className="nil-review-page__actions"><label className="nil-review-page__upload"><ImagePlus size={18}/><span>{photoName || "Fotoğraf ekle (yakında)"}</span><input type="file" accept="image/*" disabled aria-label="Fotoğraf yükleme yakında" /></label><button className="nil-review-page__submit" type="submit"><Send size={17}/> Yorumu Önizle</button></div>
          {notice && <p className="nil-review-page__notice" role="status">{notice}</p>}
          <p className="nil-review-page__disclaimer">Üyelik, sipariş doğrulama ve yorumların kalıcı kaydı henüz aktif değil. Bu form şimdilik tasarım önizlemesidir.</p>
        </form>
        <div className="nil-review-page__results" data-s="fade">
          <h3>Yorumlarınız</h3>
          {reviews.length===0 ? <div className="nil-review-page__empty"><MessageCircle size={32}/><strong>Henüz yorum bulunmuyor.</strong><p>İlk yorumu siz yazın, deneyiminizi paylaşın.</p><button type="button" className="nil-review-page__first" onClick={() => document.querySelector<HTMLInputElement>(".nil-review-page__field input")?.focus()}><Pencil size={15}/> İlk Yorumu Yaz</button></div> :
          <div className="nil-review-page__cards">{reviews.map(review=><article key={review.id}><div className="nil-review-page__cardtop"><b>{review.name}</b><span>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span></div><small>{review.product} · Önizleme</small><p>{review.text}</p></article>)}</div>}
        </div>
      </div>
    </section>
  );
}
