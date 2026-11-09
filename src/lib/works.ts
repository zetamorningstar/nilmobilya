// Sergimizde görünecek işler. Yeni iş eklemek için aşağıdaki listeye bir satır ekle.
//
// 1) Fotoğrafı projedeki  public/sergi/  klasörüne koy (klasör yoksa oluştur).
// 2) Aşağıya şu şekilde bir satır ekle:
//    { title: "Salon Yenileme", place: "İstanbul", year: "2025", image: "/sergi/salon-1.jpg", alt: "Yenilenen salon" },
//
// Fotoğraflar kırpılmadan, kendi oranlarıyla gösterilir.

export interface Work {
  title: string; // İşin adı
  place: string; // Şehir / semt
  year: string; // Yıl
  image: string; // "/sergi/dosya-adi.jpg"
  alt: string; // Fotoğrafın kısa tarifi (erişilebilirlik ve Google için)
}

export const works: Work[] = [
  // Buraya işlerini ekleyeceksin.
  { title: "Salon Yenileme", place: "İstanbul", year: "2025", image: "/sergi/salon-1.jpg", alt: "Yenilenen salon" },
];
