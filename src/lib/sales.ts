/** Nil Mobilya — WhatsApp üzerinden ürün / ölçü / teklif görüşmesi. */
export const WHATSAPP_NUMBER = "905360236146"; // Kullanıcı tarafından doğrulandı.

export function whatsappOfferUrl(productName?: string): string {
  const product = productName ? ` ${productName} ürünü için` : "";
  const message = `Merhaba, Nil Mobilya'dan${product} fiyat teklifi almak istiyorum. Ürünün ölçülerini, malzeme ve renk seçeneklerini ve teslimat koşullarını görüşebilir miyiz?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
