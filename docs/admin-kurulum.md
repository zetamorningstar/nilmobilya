# Nil Mobilya — yönetim paneli kurulum sırası

1. /admin başlangıç ekranı hazır; şu anda gerçek oturum açma veya veri düzenleme işlevi yoktur.
2. Supabase'de yeni proje oluşturun. Proje URL'si ve publishable/anon anahtarı kullanılacak; **service_role / secret anahtarını asla frontend'e veya GitHub'a koymayın**.
3. supabase/schema.sql dosyasını SQL Editor'de çalıştırın. Mevcut ürünler henüz taşınmadı.
4. Supabase Authentication ile yönetici kullanıcısını oluşturun. Yönetici UID'sini admin_users tablosuna sadece güvenilir SQL Editor üzerinden ekleyin.
5. Sunucu tarafında oturum doğrulama ve RLS yazma politikalarını ekleyin; /admin erişimini güvenli hâle getirin.
6. Ürün, kategori ve proje CRUD ekranlarını veritabanına bağlayın. Fotoğraflar için Storage bucket ve uygun RLS politikaları tanımlayın.
7. GA4 ölçüm kimliği ve Clarity proje kimliğini alın. KVKK/çerez rızası akışı olmadan isteğe bağlı izleme kodlarını çalıştırmayın.
8. WhatsApp bağlantı tıklamalarını analytics olayları olarak kaydedin. Tıklama, gerçek sipariş değildir.
9. Gerçek trafik raporlarını /admin içinde göstermek için sunucu tarafında güvenli Analytics Data API entegrasyonu gerekir.
10. Yayına almadan önce güvenlik, mobil görünüm, giriş ve veri değişikliği testlerini tamamlayın.
