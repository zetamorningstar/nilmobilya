import { legalInfo as s } from "./legal-info";

export type LegalSection = { heading: string; text: string[]; bullets?: string[] };
export type LegalDocument = { title: string; description: string; sections: LegalSection[] };

export const legalLinks = [
  { slug: "kurumsal-bilgiler", label: "Satıcı Bilgileri" },
  { slug: "kvkk-aydinlatma", label: "KVKK Aydınlatma" },
  { slug: "gizlilik-politikasi", label: "Gizlilik Politikası" },
  { slug: "cerez-politikasi", label: "Çerez Politikası" },
  { slug: "teslimat-iade", label: "Teslimat ve İade" },
  { slug: "on-bilgilendirme", label: "Ön Bilgilendirme" },
  { slug: "mesafeli-satis", label: "Mesafeli Satış" },
  { slug: "kullanim-kosullari", label: "Kullanım Koşulları" },
] as const;

export const legalDocuments: Record<string, LegalDocument> = {
  "kurumsal-bilgiler": {
    title: "Satıcı ve İletişim Bilgileri",
    description: "Nil Mobilya web sitesinin işleteni ve sözleşmede satıcı sıfatını taşıyan gerçek kişi veya tüzel kişiye dair bilgiler.",
    sections: [
      { heading: "Resmî işletme kimliği", text: [`Marka: ${s.brand}`, `Satıcı unvanı: ${s.sellerName}`, `Resmî işletme adresi: ${s.sellerAddress}`, `Mağaza/atölye adresi: ${s.showroomAddress}`, `Resmî kayıt bilgileri: ${s.businessRegistration}`] },
      { heading: "İletişim", text: [`E-posta: ${s.email}`, `Telefon: ${s.phone}`, `İkinci telefon: ${s.additionalPhone}`] },
      { heading: "Satış yöntemi", text: ["Web sitemiz ürünlerin tanıtımı ve teklif talepleri içindir; sabit ürün fiyatı gösterilmez. Müşteriler WhatsApp üzerinden ürün, ölçü, malzeme, renk ve teslimat taleplerini paylaşır. Satıcı işletme, vergi dâhil fiyatı ve diğer koşulları yazılı teklif olarak iletir. Gerekli ön bilgilendirme ve sözleşme onaylarından sonra üretim ve teslimat planlanır."] },
    ],
  },
  "kvkk-aydinlatma": {
    title: "KVKK Aydınlatma Metni",
    description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, gerçek veri işleme faaliyetleri doğrulanarak tamamlanacak taslak.",
    sections: [
      { heading: "Veri sorumlusu", text: [`Veri sorumlusu: ${s.sellerName}. Başvuru ve iletişim adresi: ${s.kvkkChannel}. İşletme adresi: ${s.sellerAddress}.`] },
      { heading: "Veri kategorileri ve toplama yöntemi", text: ["Tarafınızca iletilmesi hâlinde ad-soyad, iletişim bilgileri, mesajlar, ürün ve ölçü tercihleri, teklif, sipariş, teslimat ve fatura bilgileri gibi veriler; web sitesi ve başlattığınız iletişim kanallarından elde edilebilir. Somut veri alanları ayrıca doğrulanmalıdır."] },
      { heading: "İşleme amaçları ve hukuki sebepler", text: ["Talepleri yanıtlamak, teklif hazırlamak, sözleşmenin kurulması veya ifası, sipariş/teslimat, muhasebe ve yasal yükümlülükler kapsamında veriler işlenebilir. Her veri işleme amacı bakımından 6698 sayılı Kanun'un 5. maddesindeki uygun hukuki şart ayrı ayrı belirlenmelidir. Kampanya amaçlı iletişim için gereken izinler bağımsız olarak değerlendirilir."] },
      { heading: "Aktarımlar ve yurt dışı", text: [`Gerçek alıcı grupları ve varsa sınır ötesi aktarımlar: ${s.realDataRecipients}. WhatsApp, Cloudflare, e-posta, kargo ve diğer hizmetlerin fiilî kullanımı incelenmelidir.`] },
      { heading: "İlgili kişinin hakları", text: [`KVKK m.11 kapsamındaki haklarınız için kimliğinizi doğrulayarak ${s.kvkkChannel} üzerinden başvurabilirsiniz. Talepler, yürürlükteki mevzuat kapsamında değerlendirilir.`] },
    ],
  },
  "gizlilik-politikasi": {
    title: "Gizlilik Politikası",
    description: "İletişim, sipariş ve site kullanımına ilişkin kişisel verilerin nasıl ele alınabileceğine dair genel bilgilendirme.",
    sections: [
      { heading: "Site işletmecisi", text: [`${s.website} sitesi ${s.sellerName} tarafından işletilmektedir. İletişim: ${s.email}.`] },
      { heading: "Toplanan bilgiler", text: ["İletişim ve teklif taleplerinizde sağladığınız bilgiler, başvuru ve sipariş süreçlerinin yürütülmesi amacıyla işlenebilir. Sunucuların teknik günlükleri ve varsa üçüncü taraf araçların topladığı bilgiler ayrıca envantere alınmalıdır."] },
      { heading: "Üçüncü taraf hizmetler", text: [`Fiilen kullanılan hizmetler ve veri alıcıları: ${s.realDataRecipients}. Yurt dışına veri aktarımı ve saklama süreleri gerçek duruma göre ayrıca bildirilmelidir.`] },
      { heading: "Güvenlik ve haklar", text: ["Verilerin amaçla bağlantılı ve ölçülü işlenmesi, gerekli idari/teknik tedbirlerin alınması ve mevzuata uygun saklanması hedeflenir. Ayrıntılı haklar için KVKK Aydınlatma sayfasına bakabilirsiniz."] },
    ],
  },
  "cerez-politikasi": {
    title: "Çerez Politikası",
    description: "Sitedeki çerezler ve benzer teknolojilere ilişkin metin. Yayın öncesinde gerçek tarayıcı/sağlayıcı incelemesi gerekir.",
    sections: [
      { heading: "Çerezler ve kategoriler", text: ["Çerezler, internet sitesinin çalışmasına yardımcı olan küçük veri dosyalarıdır. Zorunlu olmayan analiz, işlevsellik veya pazarlama çerezleri için ilgili mevzuattaki şartlar değerlendirilmelidir."] },
      { heading: "Çerez envanteri", text: [`Doğrulanmış çerez ve benzeri teknoloji listesi: ${s.actualCookies}. Çerez adı, sağlayıcısı, amacı ve saklama süresi bu sayfada belirtilmelidir.`] },
      { heading: "Tercihler ve rıza", text: ["Zorunlu olmayan, açık rıza gerektiren çerezler rıza verilmeden önce çalıştırılmamalıdır. Kabul, ret ve sonradan rızayı geri alma seçenekleri erişilebilir olmalıdır. Yalnızca bir uyarı penceresi eklemek yeterli değildir."] },
    ],
  },
  "teslimat-iade": {
    title: "Teslimat, İade ve Cayma Hakkı",
    description: "Standart ürünler ile alıcının talebine göre özel hazırlanan mobilyalarda farklı kurallar uygulanabilir.",
    sections: [
      { heading: "Teslimat", text: ["Ölçü ve tasarım bilgileri WhatsApp üzerinden netleştirildikten sonra ürün özellikleri, vergiler dâhil toplam bedel, nakliye/montaj ücretleri ve taahhüt edilen teslim süresi her sipariş için önceden yazılı olarak bildirilir. Onaydan sonra ürün üretilir ve teslim edilir."] },
      { heading: "Cayma hakkı", text: ["Mesafeli satışlarda kural olarak tüketicinin 14 günlük cayma hakkı vardır. Cayma bildirimi, iade süreci, nakliye ve geri ödeme koşulları sipariş öncesinde açıklanır."] },
      { heading: "Kişiye özel üretim istisnası", text: ["Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallarda cayma hakkı istisnası uygulanabilir. Her mobilya otomatik olarak istisna kapsamında değildir; somut siparişin kişiye özel niteliği değerlendirilmelidir."] },
      { heading: "Ayıplı ürünler", text: ["Cayma hakkına ilişkin bir istisna bulunması, 6502 sayılı Kanun kapsamında ayıplı mal için tanınan tüketici haklarını kaldırmaz."] },
      { heading: "İletişim", text: [`Talep kanalı: ${s.email}, ${s.phone} veya ${s.additionalPhone}. Satıcı adresi: ${s.sellerAddress}.`] },
    ],
  },
  "on-bilgilendirme": {
    title: "Ön Bilgilendirme",
    description: "Bu genel web sayfası tek başına yeterli değildir; her alıcıya siparişinden ÖNCE somut siparişe özel ön bilgilendirme verilmelidir.",
    sections: [
      { heading: "Siparişin temel bilgileri", text: ["Müşterinin WhatsApp üzerinden seçtiği ürün modeli, ölçüler, malzeme, renk, adet ve varsa kişiye özel üretim ayrıntıları sipariş öncesinde yazılı olarak kaydedilir."], bullets: ["Satıcının gerçek kimliği ve iletişim bilgileri", "Vergi dâhil toplam fiyat ve varsa nakliye/montaj ücretleri", "Ödeme yöntemi, teslimat adresi ve teslimat zamanı", "Cayma hakkı ve uygulanacak somut istisnalar", "Başvuru, şikâyet ve hak arama yolları"] },
      { heading: "Siparişin kesinleşmesi", text: ["Ön bilgilendirme, siparişin ödeme yükümlülüğü doğurduğu hususu ve müşterinin sipariş onayı kalıcı biçimde kayıt altına alınmalıdır. WhatsApp üzerinden gelen talep de somut koşullara göre mesafeli satış niteliğinde olabilir."] },
    ],
  },
  "mesafeli-satis": {
    title: "Mesafeli Satış Sözleşmesi",
    description: "Bu sayfa sözleşme koşullarının genel çerçevesidir; satışta kullanılacak sözleşme müşteri ve siparişe göre ayrıca doldurulmalıdır.",
    sections: [
      { heading: "Taraflar", text: [`Satıcı: ${s.sellerName}, adres: ${s.sellerAddress}, iletişim: ${s.email}. Alıcı bilgileri her sipariş için tamamlanır.`] },
      { heading: "Konu ve bedel", text: ["Ürün, özel ölçüler, malzeme, miktar, bedel, vergiler, nakliye/montaj, ödeme, teslimat tarihi ve adresi müşterinin kabul ettiği sipariş özelinde yazılır."] },
      { heading: "Cayma ve ayıplı mal", text: ["Yasal cayma hakkı, somut kişiye özel üretim istisnası ve ayıplı mala ilişkin tüketici hakları yürürlükteki mevzuata göre belirlenir."] },
      { heading: "Yazılı kayıt", text: ["Siparişin ön bilgilendirmesi ve sözleşmesi alıcıya kalıcı veri saklayıcısıyla iletilir. Sipariş ve kabul kayıtları korunur."] },
    ],
  },
  "kullanim-kosullari": {
    title: "Kullanım Koşulları",
    description: "Nil Mobilya web sitesinin genel kullanım ilkeleri.",
    sections: [
      { heading: "Bilgi ve ürün görselleri", text: ["Ürün fotoğrafları ve açıklamalar tanıtım amaçlıdır; gerçek üretim seçenekleri, özellikler, fiyat ve teslimat koşulları siparişten önce teyit edilir. Bu ifade tüketicinin yanıltıcı tanıtıma karşı haklarını sınırlandırmaz."] },
      { heading: "İçerik hakları", text: ["Fotoğraf, metin, marka ve tasarım gibi içerikler ilgili hak sahiplerinin izinleri ve mevzuata uygun kullanılmalıdır."] },
      { heading: "İletişim", text: [`Site işletmecisi: ${s.sellerName}. E-posta: ${s.email}.`] },
    ],
  },
};
