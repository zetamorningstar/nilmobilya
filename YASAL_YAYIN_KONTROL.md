# NİL MOBİLYA — Yasal içerik entegrasyonu / kontrol listesi

**Bu dal yayına hazır değildir. Hukuki kimlik ve süreç bilgileri olmadan main'e birleştirmeyin.**

## Yapılanlar
- Ana sayfada, oturumda bir kez görünen sade geliştiriliyor bildirimi.
- Koleksiyon ve sahne animasyonlarını değiştirmeden yeni yasal route altyapısı.
- İletişim bölümündeki "Gizlilik" ve "Kullanım Şartları" yazıları artık gerçek bağlantı.
- Menüden "Yasal bilgiler" bağlantısı.
- 8 belge taslağı. Gerektiğinde güncellenebilmesi için tek bir legal-documents.ts dosyasında.
- Türkçe sayfa dili.

## Yayın engelleri / gerçek bilgiler
1. src/legal/legal-info.ts içinde tüm köşeli parantezli alanlar eksiksiz ve doğru doldurulmalı.
2. Gerçek satıcı: resmî unvan, adres, vergi/ticaret/oda/KEP bilgileri duruma göre teyit edilmeli.
3. Mevcut src/components/contact-section.tsx içinde hâlen **"Örnek Mah. Mobilya Bulvarı No:12, Kadıköy / İstanbul"** adlı örnek adres ve çalışma saati yer alıyor. Gerçek adres ve saatlerle değiştirilmeli veya doğrulanana kadar harita bağlantısı gizlenmeli.
4. src/lib/collections.ts içinde fiyatların bir kısmı **// GEÇİCİ** olarak etiketli; gerçek olmayan fiyatlar kaldırılmalı veya teyit edilmeli.
5. KVKK: formlar, iletişim, WhatsApp, Cloudflare, dışa veri aktarımı, sipariş kayıtları ve saklama süreleri incelenmeli; gerçek veri alıcıları yazılmalı.
6. Çerez envanteri tarayıcı geliştirici araçlarından kontrol edilmeli. Gerekiyorsa zorunlu olmayan scriptler rıza alınana kadar engellenmeli ve kabul/ret/geri alma tercih arayüzü oluşturulmalı.
7. WhatsApp siparişlerinde her alıcıya özel **ön bilgilendirme formu + mesafeli satış sözleşmesi** hazırlanıp onay öncesi iletilmeli ve kayıt saklanmalı. Genel web sayfası bunun yerine geçmez.
8. Standart ürünlerde genel 14 günlük cayma hakkı ile gerçekten kişiselleştirilmiş ürün istisnası birbirine karıştırılmamalı; ayıplı mal hakları saklıdır.
9. ETBİS, ticari elektronik ileti (İYS), fatura/vergilendirme gereklilikleri gerçek faaliyet ve ödeme/sipariş sürecine göre muhasebeci ve hukuk danışmanıyla kontrol edilmeli.
10. Siteye eklenen bilgiler test edilip bir hukuk uzmanı tarafından gözden geçirildikten sonra PR birleştirilmeli.

## Teknik notlar
- Route dosyası: src/routes/yasal.$slug.tsx — TanStack dosya tabanlı route. src/routeTree.gen.ts otomatik üretilir, elle değiştirilmez.
- Ana sayfada StageScroll kullanıldığı için ortak Root footer eklenmedi; mevcut iletişim sahnesi ve açılır menüye bağlantılar kondu.
- Bu PR'da **çerez onay kutusu** eklenmedi: önce gerçek envanter çıkarılmalı, göstermelik bir onay hukuki koruma sağlamaz.
- Yerelde build: bun install --frozen-lockfile && bun run build
- Yeni rota ve formlar hem masaüstü hem mobilde test edilmeli.
