import boucleImage from "@/assets/material-boucle.jpg";
import cevizImage from "@/assets/material-ceviz.jpg";
import deriImage from "@/assets/material-deri.jpg";
import kadifeImage from "@/assets/material-kadife.jpg";
import mermerImage from "@/assets/material-mermer.jpg";
import pirincImage from "@/assets/material-pirinc.jpg";

export interface Material {
  name: string;
  origin: string;
  image: string;
  why: string;
  source: string;
}

export const materials: Material[] = [
  {
    name: "Carrara Mermeri",
    origin: "Toskana, İtalya",
    image: mermerImage,
    why: "Yoğun kristal yapısı sayesinde ince damarlı, soğuk ve berrak bir yüzey verir; sehpa ve konsol tablalarında yıllar içinde çizilse bile karakterini kaybetmez.",
    source: "Apuan Alpleri ocaklarından blok halinde alınır, İstanbul atölyemizde kesilip elde mat cilalanır.",
  },
  {
    name: "Masif Ceviz",
    origin: "Kuzey Amerika",
    image: cevizImage,
    why: "Sert ama işlenebilir yapısı, derin kahve tonu ve canlı damar deseniyle masalarda hem dayanıklılık hem de doğal bir sıcaklık sağlar.",
    source: "FSC sertifikalı ormanlardan gelen kereste, 18 ay doğal kurutma sonrası doğal yağ ile bitirilir.",
  },
  {
    name: "Yün Bouclé",
    origin: "Belçika",
    image: boucleImage,
    why: "İlmekli dokusu ışığı yumuşatır, oturma gruplarına hacim kazandırır; yün içeriği nefes aldığı için uzun oturmalarda konfor kaybolmaz.",
    source: "Belçikalı bir aile dokuma fabrikasından, 60.000 Martindale aşınma testli toplarla temin edilir.",
  },
  {
    name: "Pamuk Kadife",
    origin: "Bursa, Türkiye",
    image: kadifeImage,
    why: "Kısa ve yoğun hav, rengi derinleştirir; berjer gibi heykelsi formlarda kavisleri kırışmadan sarar.",
    source: "Bursa'nın köklü kadife dokumacılarıyla çalışıyoruz; renkler bizim paletimize göre parti parti boyanır.",
  },
  {
    name: "Tam Tabaka Deri",
    origin: "Toskana, İtalya",
    image: deriImage,
    why: "Yüzeyi inceltilmediği için kullandıkça patine olur, yırtılmaya karşı en dayanıklı deri sınıfıdır.",
    source: "Bitkisel tabaklama yapan Toskana tabakhanelerinden, krom içermeyen tabaka halinde alınır.",
  },
  {
    name: "Dövme Pirinç",
    origin: "İstanbul, Türkiye",
    image: pirincImage,
    why: "Sıcak sarı tonu ceviz ve kadifeyle dengelenir; zamanla oksitlenip yumuşayan yüzeyi altın vurgularımızın kaynağıdır.",
    source: "Ayak, kulp ve bağlantı detayları yerel bir döküm atölyesinde üretilip elde fırçalanır.",
  },
];
