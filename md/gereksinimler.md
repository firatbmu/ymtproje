# Sağlık Merkezi Uygulaması Backend Gereksinimleri

## Hasta Giriş Ekranı Düzenlemesi

Hasta giriş ekranı için backend gereksinimleri:

1. **Kullanıcı Veritabanı**: 
   - Hastaların bilgilerini saklayacak bir tablo (MongoDB, MySQL vb.)
   - Saklanacak veriler: TC kimlik no, ad soyad, telefon, email, doğum tarihi, şifre (şifrelenmiş)

2. **Kimlik Doğrulama API'leri**:
   - `/api/auth/register` - Yeni hasta kaydı
   - `/api/auth/login` - Hasta girişi
   - `/api/auth/logout` - Çıkış işlemi
   - `/api/auth/verify` - Token doğrulama

3. **JWT veya Session Yönetimi**: 
   - Oturum güvenliği için güvenli token oluşturma
   - Token süre sınırlaması
   - Token yenileme mekanizması

## Randevu Kontrolü

Randevu işlemleri için backend gereksinimleri:

1. **Randevu Veritabanı**: 
   - Randevuların saklanacağı tablo
   - Saklanacak veriler: Randevu kodu, hasta ID, doktor ID, bölüm, tarih, saat, şikayet, durum

2. **Randevu API'leri**:
   - `/api/randevu/create` - Yeni randevu oluşturma
   - `/api/randevu/list` - Hasta randevularını listeleme
   - `/api/randevu/cancel` - Randevu iptali
   - `/api/randevu/update` - Randevu güncelleme
   - `/api/randevu/check` - Randevu sorgusu (kod ile)

3. **Randevu Doğrulama**: 
   - Çakışan randevular için kontrol mekanizması
   - Geçmiş tarih kontrolü
   - Doktor müsaitlik kontrolü
   - TC ve diğer bilgilerin doğrulanması

## Doktor Ekranından Randevu Seçme

Doktorların randevu yönetimi için gereksinimleri:

1. **Doktor Paneli API'leri**:
   - `/api/doktor/randevular` - Doktorun randevularını listeleme
   - `/api/doktor/musaitlik` - Doktor müsaitlik ayarları
   - `/api/doktor/randevu/onayla` - Randevu onaylama
   - `/api/doktor/randevu/iptal` - Randevu iptali
   - `/api/doktor/randevu/guncelle` - Randevu notları ve durum güncelleme

2. **Takvim Sistemi**: 
   - Doktorun çalışma saatlerini ayarlama
   - Dolu/boş zaman aralıklarını görüntüleme
   - Haftalık/aylık takvim görünümü
   - Tatil günleri ve özel durumlar için ayarlamalar

3. **Bildirim Sistemi**:
   - SMS/Email gönderimi için servis
   - Hasta ve doktor için bildirim mekanizması
   - Randevu hatırlatmaları
   - İptal bildirimleri

## Backend Teknoloji Önerileri

1. **Node.js + Express.js**: 
   - API'ler için modern ve hızlı backend çözümü
   - Asenkron işlemler için uygun
   - Geniş paket ekosistemi

2. **Veritabanı Seçenekleri**:
   - **MongoDB**: NoSQL, esnek schema 
   - **MySQL/PostgreSQL**: İlişkisel veritabanı, güçlü veri bütünlüğü

3. **Güvenlik Araçları**:
   - **JWT (JSON Web Token)**: Kimlik doğrulama için
   - **bcrypt**: Şifre şifreleme
   - **helmet**: HTTP güvenlik başlıkları
   - **cors**: Cross-Origin Resource Sharing kontrolü

4. **İletişim Araçları**:
   - **Nodemailer**: E-posta bildirimleri için 
   - **Twilio**: SMS bildirimleri için
   - **Socket.io**: Gerçek zamanlı bildirimler için (isteğe bağlı)

## Önerilen Backend Klasör Yapısı

```
/backend
  /config
    - db.js                  # Veritabanı yapılandırması
    - auth.js                # Kimlik doğrulama yapılandırması
  /models
    - User.js                # Hasta/kullanıcı modeli
    - Doctor.js              # Doktor modeli
    - Appointment.js         # Randevu modeli
  /controllers
    - authController.js      # Kimlik doğrulama işlemleri
    - appointmentController.js # Randevu işlemleri
    - doctorController.js    # Doktor işlemleri
  /routes
    - auth.js                # Kimlik doğrulama rotaları
    - appointments.js        # Randevu rotaları
    - doctors.js             # Doktor rotaları
  /middleware
    - auth.js                # Token doğrulama
    - validation.js          # Girdi doğrulama
  /utils
    - helpers.js             # Yardımcı fonksiyonlar
    - notification.js        # Bildirim fonksiyonları
  - server.js                # Ana uygulama dosyası
```

## Uygulama Geliştirme Adımları

1. Veritabanı şemasının tasarlanması
2. Backend API'lerinin oluşturulması
3. API test senaryolarının yazılması
4. Frontend ile backend entegrasyonu
5. Güvenlik testleri ve performans optimizasyonu
6. Kullanıcı kabul testleri
7. Deploymant ve canlıya alma işlemleri 