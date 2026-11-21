/** Nil Mobilya — WhatsApp üzerinden ürün/ölçü/teklif görüşmesi. */
export const WHATSAPP_NUMBER = "905360236146";

export type OfferDetails = {
  product: string;
  choices?: Record<string, string>;
  dimensions?: string;
  city?: string;
  note?: string;
  productUrl?: string;
};
export function whatsappProductOfferUrl(details: OfferDetails): string {
  const lines = [
    "Merhaba, Nil Mobilya'dan ürün için fiyat teklifi almak istiyorum.",
    "Ürün: " + details.product.trim(),
    ...Object.entries(details.choices ?? {}).filter(([,value])=>value.trim()).map(([key,value])=>key + ": " + value),
    ...(details.dimensions?.trim()?["Özel ölçü talebi: "+details.dimensions.trim()]:[]),
    ...(details.city?.trim()?["Teslimat ili/ilçesi: "+details.city.trim()]:[]),
    ...(details.note?.trim()?["Ek not: "+details.note.trim()]:[]),
    ...(details.productUrl?.trim()?["Ürün bağlantısı: "+details.productUrl.trim()]:[]),
    "Fiyat, üretim süresi ve teslimat koşulları hakkında bilgi alabilir miyim?",
  ];
  return "https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(lines.join("\n"));
}

/** Existing calls elsewhere in the site remain backward compatible. */
export function whatsappOfferUrl(productName?: string): string {
  const product = productName ? " " + productName + " ürünü için" : "";
  const message = "Merhaba, Nil Mobilya'dan" + product + " fiyat teklifi almak istiyorum. Ürünün ölçülerini, malzeme ve renk seçeneklerini ve teslimat koşullarını görüşebilir miyiz?";
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}
