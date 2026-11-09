import chairImage from "@/assets/nil-chair.jpg";
import chairImageB from "@/assets/nil-chair-2.jpg";
import chairImageC from "@/assets/nil-chair-3.jpg";
import diningImage from "@/assets/nil-dining.jpg";
import diningImageB from "@/assets/nil-dining-2.jpg";
import diningImageC from "@/assets/nil-dining-3.jpg";
import sofaImage from "@/assets/nil-sofa.jpg";
import sofaImageB from "@/assets/nil-sofa-2.jpg";
import sofaImageC from "@/assets/nil-sofa-3.jpg";

export interface CollectionProduct {
  name: string;
  material: string;
  image: string;
  /** Soldaki kategori listesinde görünür. Aynı yazıyı yazan ürünler aynı kategoride toplanır. */
  category: string;
  /** İsteğe bağlı. Örn. 48900 yaz, sayfada ₺48.900 görünür. Boşsa "Fiyat için teklif alın" yazar. */
  price?: number;
  /** İsteğe bağlı. Kart fotoğrafı kırpılırken hangi kısım kalsın: "center", "50% 30%" gibi. */
  focus?: string;
}

export interface Collection {
  slug: string;
  number: string;
  title: string;
  /** Koleksiyon sayfasının büyük başlığı */
  pageTitle: string;
  /** Koleksiyon sayfasında başlığın altındaki kısa açıklama */
  lead: string;
  note: string;
  description: string;
  hero: string;
  heroAlt: string;
  heroFocus: string;
  products: CollectionProduct[];
}

export const collections: Collection[] = [
  {
    slug: "oturma",
    number: "01",
    title: "Oturma",
    pageTitle: "Oturma Grubu",
    lead: "Konforu, zamansız tasarım ve özenli işçilikle buluşturan seçkin oturma koleksiyonumuz.",
    note: "Rahatlığın yalın formu",
    description:
      "Oturma koleksiyonu, günün her anında dokunulmak için tasarlanan derin otururlar ve yumuşak hatlarla salonun merkezine yerleşen sakin bir zarafet sunar.",
    hero: sofaImage,
    heroAlt: "Nil Mobilya oturma koleksiyonu — modern oturma grubu",
    heroFocus: "62% center",
    products: [
      { name: "Bulut Oturma Grubu", material: "Bouclé kumaş · Ceviz ayak", image: sofaImage, category: "Koltuk Takımları", price: 89500 }, // GEÇİCİ
{ name: "Modüler Köşe Takımı", material: "Yumuşak dokulu kumaş", image: sofaImageB, category: "Köşe Koltuklar", price: 72000 }, // GEÇİCİ
{ name: "Kavisli Kadife Sofa", material: "Kadife · Pirinç detay", image: sofaImageC, category: "Üçlü Koltuklar", price: 48900 }, // GEÇİCİ
    ],
  },
  {
    slug: "berjer",
    number: "02",
    title: "Berjer",
    pageTitle: "Berjer Koleksiyonu",
    lead: "Rahatlığı ve şıklığı bir araya getiren özel tasarım berjerler.",
    note: "İmza niteliğinde detaylar",
    description:
      "Berjer koleksiyonu; köşeyi, okuma ışığını ve sessiz anları düşünerek tasarlandı. Her parça, mekânda bağımsız bir obje gibi durur.",
    hero: chairImage,
    heroAlt: "Nil Mobilya berjer koleksiyonu — okuma köşesi berjeri",
    heroFocus: "55% center",
    products: [
      { name: "Kadife Berjer", material: "Kadife döşeme · Ahşap ayak", image: chairImage, category: "Kadife Berjerler", price: 24750 }, // GEÇİCİ
{ name: "Okuma Köşesi Berjeri", material: "Kadife · Pirinç lamba uyumu", image: chairImageB, category: "Okuma Berjerleri", price: 26900 }, // GEÇİCİ
{ name: "Heykelsi Bouclé Berjer", material: "Bouclé · Döner taban", image: chairImageC, category: "Bouclé Berjerler", price: 19800 }, // GEÇİCİ
    ],
  },
  {
    slug: "yemek",
    number: "03",
    title: "Yemek",
    pageTitle: "Yemek Odası",
    lead: "Davetkar atmosferler için özel tasarım yemek odaları.",
    note: "Bir araya gelmenin zarafeti",
    description:
      "Yemek koleksiyonu; uzun sofralar ve paylaşılan anlar için dengeli oranlar, doğal ahşap ve incelikli döşemelerle üretilir.",
    hero: diningImage,
    heroAlt: "Nil Mobilya yemek koleksiyonu — ceviz yemek masası",
    heroFocus: "50% center",
    products: [
      { name: "Ceviz Yemek Masası", material: "Masif ceviz", image: diningImage, category: "Masalar", price: 64500 }, // GEÇİCİ
{ name: "Zemin Ayaklı Yemek Takımı", material: "Ceviz · Döşemeli sandalyeler", image: diningImageB, category: "Yemek Takımları", price: 98000 }, // GEÇİCİ
{ name: "Deri Kaplama Sandalye", material: "Deri · Ceviz iskelet", image: diningImageC, category: "Sandalyeler", price: 6900 }, // GEÇİCİ
    ],
  },
];

export function getCollection(slug: string | undefined): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}
