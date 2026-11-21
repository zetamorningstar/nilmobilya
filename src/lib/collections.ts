// GEÇİCİ GÖRSELLER: kendi fotoğraflarını src/assets/ içine koyup aşağıdaki dosya adlarını değiştir.
import tv1 from "@/assets/tasduvar.jpg";
import tv2 from "@/assets/ceviztvunite.jpg";
import tv3 from "@/assets/tvunitesarıambiyans.jpg";
import banko1 from "@/assets/banko1.jpg";
import banko2 from "@/assets/banko2.jpg";
import banko3 from "@/assets/banko3.jpg";
import dolap1 from "@/assets/dolap1unite.jpg";
import dolap2 from "@/assets/unitevedolapofis.jpg";
import dolap3 from "@/assets/dolapsiyah.jpg";
import dolap4 from "@/assets/dolap4.jpg";
import dolap5 from "@/assets/ahsapkosedolap.jpg";

// Fotoğrafı henüz olmayan ürünlerde görünen geçici görsel (public/urunler/yakinda.svg)
const YAKINDA = "/urunler/yakinda.svg";

export interface CollectionProduct {
  name: string;
  material: string;
  image: string;
  /** Soldaki kategori listesinde görünür. Aynı yazıyı yazan ürünler aynı kategoride toplanır. */
  category: string;
  /** İsteğe bağlı. Kart fotoğrafı kırpılırken hangi kısım kalsın: "center", "50% 30%" gibi. */
  focus?: string;
  /** Varyantlar tek ürün kartında seçilir; ayrı fotoğraf gerekmez. */
  options?: { label: string; values: string[] }[];
  /** Daha sonra gerçek ölçüler girildiğinde gösterilir. */
  standardDimensions?: string;
  /** Daha sonra doldurulacak gerçek ürün açıklaması. */
  productInfo?: string;
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
    slug: "tv-uniteleri",
    number: "01",
    title: "TV Üniteleri",
    pageTitle: "TV Üniteleri",
    lead: "Doğal ahşap dokusunu sade çizgilerle buluşturan, ölçünüze özel üretilen TV üniteleri.",
    note: "Doğal ahşabın sıcaklığı",
    description:
      "TV üniteleri; geniş depolama alanı, sade formlar ve doğal ahşap dokusuyla yaşam alanınıza dengeli ve şık bir görünüm kazandırır. Ölçü ve renk seçenekleri size göre belirlenir.",
    hero: tv1,
    heroAlt: "Nil Mobilya TV üniteleri koleksiyonu",
    heroFocus: "50% center",
    products: [
      { name: "Çekmeceli TV Ünitesi", material: "Doğal ahşap kaplama", image: tv1, category: "TV Üniteleri" },
      { name: "Kapaklı TV Ünitesi", material: "Masif ahşap", image: tv2, category: "TV Üniteleri" },
      { name: "Asma TV Ünitesi", material: "Ahşap kaplama · Gizli bağlantı", image: tv3, category: "TV Üniteleri" },
    ],
  },
  {
    slug: "etajerler",
    number: "05",
    title: "Etajerler",
    pageTitle: "Etajerler",
    lead: "Ölçünüze ve renk tercihinize göre üretilen etajerler için bizimle iletişime geçin.",
    note: "Size özel üretim",
    description: "Etajerlerimiz sipariş üzerine üretilir. Detay ve fiyat için bizimle iletişime geçebilirsiniz.",
    hero: "/01_iki_cekmeceli_etajer.jpg",
    heroAlt: "Nil Mobilya etajerler",
    heroFocus: "center",
    products: [
      { name: "İki Çekmeceli Etajer", material: "Ölçü ve renk seçenekleri için teklif alın", image: "/01_iki_cekmeceli_etajer.jpg", category: "Etajerler", options: [{ label: "Ayak / Gövde", values: ["Demirli", "Demirsiz"] }, { label: "Renk", values: ["Beyaz", "Renkli"] }] },
      { name: "Üç Çekmeceli Etajer", material: "Ölçü ve renk seçenekleri için teklif alın", image: "/02_uc_cekmeceli_etajer.jpg", category: "Etajerler", options: [{ label: "Ayak / Gövde", values: ["Demirli", "Demirsiz"] }, { label: "Renk", values: ["Beyaz", "Renkli"] }] },
    ],
  },
  {
    slug: "masalar",
    number: "06",
    title: "Masalar",
    pageTitle: "Masalar",
    lead: "Makyaj ve manikür masaları ile komodin için ölçüye özel üretim.",
    note: "Size özel üretim",
    description: "Masalarımız sipariş üzerine üretilir. Detay ve fiyat için bizimle iletişime geçebilirsiniz.",
    hero: "/04_makyaj_masasi_kahverengi.jpg",
    heroAlt: "Nil Mobilya masalar",
    heroFocus: "center",
    products: [
      { name: "Makyaj Masası", material: "Ölçü ve renk seçenekleri için teklif alın", image: "/04_makyaj_masasi_kahverengi.jpg", category: "Masalar", options: [{ label: "Renk", values: ["Kahverengi (fotoğraftaki)", "Beyaz", "Diğer renkler"] }] },
      { name: "Tek Çekmeceli Makyaj Masası", material: "Ölçü ve renk seçenekleri için teklif alın", image: "/05_tek_cekmeceli_makyaj_masasi.jpg", category: "Masalar", options: [{ label: "Renk", values: ["Beyaz", "Renkli"] }] },
      { name: "Manikür Masası", material: "Ölçü ve renk seçenekleri için teklif alın", image: "/06_manikur_masasi.jpg", category: "Masalar", options: [{ label: "Model", values: ["Demirli", "Demirsiz"] }, { label: "Renk", values: ["Beyaz", "Renkli"] }] },
    ],
  },
  {
    slug: "platformlar",
    number: "07",
    title: "Platformlar",
    pageTitle: "Platformlar",
    lead: "Platform ve banko modelleri için bizimle iletişime geçin.",
    note: "Size özel üretim",
    description: "Platform ve bankolarımız sipariş üzerine üretilir. Detay ve fiyat için bizimle iletişime geçebilirsiniz.",
    hero: YAKINDA,
    heroAlt: "Nil Mobilya platformlar",
    heroFocus: "center",
    products: [
    ],
  },
  {
    slug: "banko",
    number: "02",
    title: "Banko",
    pageTitle: "Banko ve Servis Üniteleri",
    lead: "Mağaza, ofis ve karşılama alanları için özel ölçüde üretilen ahşap bankolar.",
    note: "Karşılamanın zarafeti",
    description:
      "Banko koleksiyonu; mekânın ölçüsüne ve kullanımına göre tasarlanır. Doğal ahşap detaylar ve ince işçilikle ilk izlenimi güçlendirir.",
    hero: banko1,
    heroAlt: "Nil Mobilya banko koleksiyonu",
    heroFocus: "50% center",
    products: [
      { name: "Antrasit Banko", material: "Özel ölçü üretim", image: "/03_antrasit_banko.jpg", category: "Bankolar", options: [{ label: "Model", values: ["Yanlı", "Yansız"] }, { label: "Renk", values: ["Antrasit (fotoğraftaki)", "Diğer renkler"] }] },
      { name: "Karşılama Bankosu", material: "Ahşap kaplama · Ledli detay", image: banko1, category: "Bankolar" },
      { name: "Servis Bankosu", material: "Masif ahşap", image: banko2, category: "Bankolar" },
      { name: "Servis Çekmecesi", material: "Ahşap · Metal detay", image: banko3, category: "Çekmeceler" },
    ],
  },
  {
    slug: "dolap",
    number: "03",
    title: "Dolap",
    pageTitle: "Dolap Sistemleri",
    lead: "Mekâna göre ölçülen, ahşap işçiliğiyle üretilen dolap ve depolama sistemleri.",
    note: "Mekâna özel çözümler",
    description:
      "Dolap sistemleri; duvardan duvara ölçü, iç düzen ve kapak detayları kişiye özel planlanarak üretilir.",
    hero: dolap1,
    heroAlt: "Nil Mobilya dolap sistemleri",
    heroFocus: "50% center",
    products: [
      { name: "Safir Meşe Portmanto ve Ayakkabılık", material: "Ölçüye özel üretim", image: "/07_portmanto_ayakkabilik_safir_mese.jpg", category: "Dolap Sistemleri" },
    ],
  },
];

export function getCollection(slug: string | undefined): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

// Sol menüde görünen sayfalar (sıra burada belirlenir)
export const CATALOG_SLUGS = ["tv-uniteleri", "etajerler", "masalar", "banko", "dolap"] as const;
export const ALL_SLUG = "tum-urunler";

// "Tüm ürünler" sayfası: yukarıdaki koleksiyonların ürünlerini birleştirir
export function getCatalogCollection(slug: string | undefined): Collection | undefined {
  if (slug !== ALL_SLUG) return getCollection(slug);
  const products = CATALOG_SLUGS.flatMap((s) => getCollection(s)?.products ?? []);
  return {
    slug: ALL_SLUG,
    number: "00",
    title: "Tüm ürünler",
    pageTitle: "Tüm Ürünler",
    lead: "Nil Mobilya'nın tüm özel üretim ürünleri.",
    note: "Tüm ürünler",
    description: "Tüm ürünlerimiz.",
    hero: products[0]?.image ?? "",
    heroAlt: "Nil Mobilya tüm ürünler",
    heroFocus: "center",
    products,
  };
}