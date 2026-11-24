// Sergimizde görünecek işler. Yeni iş eklemek için aşağıdaki listeye bir satır ekle.
//
// 1) Fotoğrafı projedeki  public/sergi/  klasörüne koy (klasör yoksa oluştur).
// 2) Aşağıya şu şekilde bir satır ekle:
//    { title: "TV Ünitesi", place: "İstanbul", year: "2025", image: "/sergi/tv-1.jpg", alt: "Aydınlatmalı TV ünitesi", category: "tv" },
//
// category (filtre butonları için): "tv" | "banko" | "dolap" | "yatak" | "diger"  (boş bırakırsan "diger")
// ratio (isteğe bağlı): genişlik / yükseklik, örn. 1.5. Boş bırakırsan fotoğraftan otomatik okunur.
//
// Fotoğraflar kırpılmadan, kendi oranlarıyla gösterilir. Hiç iş yoksa "çok yakında" yazısı çıkar.

export type WorkCategory = "tv" | "banko" | "dolap" | "yatak" | "diger";

export interface Work {
  title: string; // İşin adı
  place: string; // Şehir / semt
  year: string; // Yıl (sıralama için kullanılır)
  image: string; // "/sergi/dosya-adi.jpg"
  alt: string; // Fotoğrafın kısa tarifi (erişilebilirlik ve Google için)
  category?: WorkCategory;
  ratio?: number;
}

export const works: Work[] = [
  // Buraya işlerini ekleyeceksin.
  // Gerçek proje fotoğrafları yönetici panelinden yayınlandığında burada gösterilir.
];