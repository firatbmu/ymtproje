# Hastane Randevu Sistemi Backend - PRD (Product Requirements Document)

## Ürün Açıklaması

Hastane Randevu Sistemi, hastaların online olarak doktor randevusu alabileceği, doktorların ve kliniklerin yönetilebileceği kapsamlı bir web uygulamasıdır. Bu doküman, sistemin backend bileşenlerinin gereksinimlerini ve teknik detaylarını tanımlamaktadır.

## Teknik Gereksinimler

### 1. Kurulum ve Altyapı

#### 1.1 Proje Yapısı
- [x] Backend için temel klasör yapısını oluştur (`yeni-backend`)
- [x] package.json dosyasını oluştur (`npm init -y`)
- [x] .gitignore dosyası ekle
- [x] .env dosyası oluştur ve örnek env dosyası (.env.example) ekle

#### 1.2 Paketler ve Bağımlılıklar
- [x] **Temel Paketler**
  - [x] Express.js: `npm install express`
  - [x] Mongoose: `npm install mongoose`
  - [x] CORS: `npm install cors`
  - [x] Dotenv: `npm install dotenv`
  - [x] JWT: `npm install jsonwebtoken`
  - [x] Bcrypt: `npm install bcryptjs`
  - [x] Helmet: `npm install helmet`
  - [x] Express Validator: `npm install express-validator`
  - [x] Morgan (Loglama): `npm install morgan`
  - [x] Express Rate Limit: `npm install express-rate-limit`

- [x] **Geliştirme Paketleri**
  - [x] Nodemon: `npm install nodemon --save-dev`
  - [x] Jest (Test): `npm install jest --save-dev`
  - [x] Supertest (API Test): `npm install supertest --save-dev`

### 2. Sistem Mimarisi

#### 2.1 Klasör Yapısı
- [x] `/src` ana kaynak kod klasörü
- [x] `/src/config` yapılandırma dosyaları
- [x] `/src/controllers` controller fonksiyonları
- [x] `/src/middleware` middleware fonksiyonları
- [x] `/src/models` veritabanı modelleri
- [x] `/src/routes` API rotaları
- [x] `/src/utils` yardımcı fonksiyonlar
- [x] `/src/services` iş mantığı servisleri
- [x] `/tests` test dosyaları

#### 2.2 Temel Dosyalar
- [x] **Yapılandırma Dosyaları**
  - [x] `src/config/db.js` - MongoDB bağlantısı
  - [x] `src/config/config.js` - Ortam değişkenleri yapılandırması

- [x] **Ana Uygulama Dosyaları**
  - [x] `server.js` - Sunucu başlatma
  - [x] `app.js` - Express uygulaması ve middleware'ler

### 3. Veritabanı Modelleri

#### 3.1 User Model
- [x] TC Kimlik numarası (gerekli, benzersiz)
- [x] Ad Soyad (gerekli)
- [x] E-posta (gerekli, benzersiz)
- [x] Telefon (gerekli)
- [x] Doğum tarihi (gerekli)
- [x] Şifre (gerekli, hash'lenmiş)
- [x] Rol (hasta, doktor, admin)
- [x] Hesap durumu
- [x] Oluşturma/Güncelleme tarihleri
- [x] JWT token oluşturma methodu
- [x] Şifre eşleştirme methodu

#### 3.2 Department Model
- [x] Bölüm adı (gerekli)
- [x] Açıklama
- [x] Resim URL
- [x] Aktif durumu
- [x] Doktor ilişkisi (Virtual)

#### 3.3 Doctor Model
- [x] Kullanıcı ilişkisi (User referansı)
- [x] Bölüm ilişkisi (Department referansı)
- [x] Uzmanlık alanı
- [x] Biyografi
- [x] Fotoğraf
- [x] Deneyim yılları
- [x] Eğitim bilgileri
- [x] Çalışma günleri/saatleri
- [x] Randevu ilişkisi (Virtual)

#### 3.4 Appointment Model
- [x] Hasta ilişkisi (User referansı)
- [x] Doktor ilişkisi (Doctor referansı)
- [x] Bölüm ilişkisi (Department referansı)
- [x] Randevu tarihi ve saati
- [x] Randevu durumu (beklemede, onaylandı, iptal edildi, tamamlandı)
- [x] Randevu sebebi
- [x] Notlar
- [x] İlk ziyaret mi?
- [x] İptal nedeni (varsa)

### 4. API Endpointleri

#### 4.1 Auth Rotaları
- [x] `POST /api/auth/register` - Kullanıcı kaydı
- [x] `POST /api/auth/login` - Kullanıcı girişi
- [x] `GET /api/auth/logout` - Çıkış
- [x] `GET /api/auth/me` - Kullanıcı bilgilerini getir
- [x] `PUT /api/auth/updatedetails` - Kullanıcı bilgilerini güncelle
- [x] `PUT /api/auth/updatepassword` - Şifre güncelle
- [x] `POST /api/auth/forgotpassword` - Şifre sıfırlama isteği
- [x] `PUT /api/auth/resetpassword/:resettoken` - Şifre sıfırlama

#### 4.2 User Rotaları (Admin)
- [x] `GET /api/users` - Tüm kullanıcıları listeleme
- [x] `GET /api/users/:id` - Tek kullanıcı bilgisi getirme
- [x] `PUT /api/users/:id` - Kullanıcı bilgilerini güncelleme
- [x] `DELETE /api/users/:id` - Kullanıcı silme

#### 4.3 Department Rotaları
- [x] `GET /api/departments` - Tüm bölümleri listeleme
- [x] `POST /api/departments` - Yeni bölüm ekleme (admin)
- [x] `GET /api/departments/:id` - Bölüm detayı getirme
- [x] `PUT /api/departments/:id` - Bölüm güncelleme (admin)
- [x] `DELETE /api/departments/:id` - Bölüm silme (admin)

#### 4.4 Doctor Rotaları
- [x] `GET /api/doctors` - Tüm doktorları listeleme
- [x] `POST /api/doctors` - Yeni doktor ekleme (admin)
- [x] `GET /api/doctors/:id` - Doktor detayı getirme
- [x] `PUT /api/doctors/:id` - Doktor bilgilerini güncelleme (admin/doktor)
- [x] `DELETE /api/doctors/:id` - Doktor silme (admin)
- [x] `GET /api/departments/:departmentId/doctors` - Bölüme göre doktorları listeleme

#### 4.5 Appointment Rotaları
- [x] `GET /api/appointments` - Randevuları listeleme (rol bazlı)
- [x] `POST /api/appointments` - Yeni randevu oluşturma
- [x] `GET /api/appointments/:id` - Randevu detayı getirme
- [x] `PUT /api/appointments/:id` - Randevu güncelleme
- [x] `DELETE /api/appointments/:id` - Randevu silme/iptal etme
- [x] `GET /api/appointments/user` - Kullanıcının randevularını listeleme
- [x] `GET /api/appointments/doctor/:doctorId` - Doktora göre randevuları listeleme

### 5. Middleware & Yardımcı İşlevler

#### 5.1 Middleware İşlevleri
- [x] `error.js` - Merkezi hata işleme middleware'i
  - [x] Mongoose validation hataları
  - [x] JWT hataları
  - [x] Genel hataları yakalama

- [x] `auth.js` - Kimlik doğrulama middleware'i
  - [x] Token kontrolü (protect)
  - [x] Rol bazlı erişim kontrolü (authorize)

- [x] `validation.js` - Veri validasyon middleware'i
  - [x] Giriş verilerinin doğrulanması
  - [x] Sanitizasyon

- [x] `advancedResults.js` - Gelişmiş sorgu sonuçları
  - [x] Sayfalama
  - [x] Filtreleme
  - [x] Sıralama
  - [x] Seçme

#### 5.2 Yardımcı İşlevler
- [x] `errorResponse.js` - Standart hata yanıtları
- [x] `asyncHandler.js` - Async fonksiyonlar için try-catch sarmalayıcısı
- [ ] `sendEmail.js` - E-posta gönderme fonksiyonu

### 6. Güvenlik Gereksinimleri

- [x] JWT tabanlı kimlik doğrulama sistemi (yapılandırma yapıldı)
- [x] Şifrelerin bcrypt ile hashlenmesi
- [x] Rate limiting (aşırı istek koruması)
- [x] Helmet ile HTTP header güvenliği
- [x] XSS koruması
- [x] NoSQL enjeksiyon koruması
- [x] CORS yapılandırması
- [x] Giriş doğrulama ve sanitizasyon

### 7. Entegrasyon Gereksinimleri

- [ ] Frontend ile API entegrasyonu
- [ ] JWT token paylaşımı ve yenileme mekanizması
- [ ] E-posta servisi entegrasyonu

### 8. Performans Gereksinimleri

- [ ] Veritabanı indeksleri
- [ ] Cache mekanizması
- [ ] Response compression
- [ ] Pagination ile büyük veri setlerini yönetme

### 9. Dağıtım (Deployment) Gereksinimleri

- [x] Ortam değişkenleri ayarları
- [x] Production ve development mod yapılandırması
- [x] Loglama mekanizmaları
- [x] Error handling ve monitoring

### 10. Test Gereksinimleri

- [ ] Unit testler
- [ ] Integration testler
- [ ] API endpoint testleri
- [ ] Yük testleri

### 11. Dokümantasyon

- [ ] API dokümantasyonu
- [ ] Kod dokümantasyonu
- [ ] Kurulum ve dağıtım talimatları

## Frontend-Backend Entegrasyon Planı

1. **Kimlik Doğrulama Entegrasyonu**
   - Frontend'de login/register formları
   - Token saklama ve gönderme mekanizması
   - Oturum yönetimi

2. **Randevu İşlemleri Entegrasyonu**
   - Randevu oluşturma formu
   - Randevu listesi görüntüleme
   - Randevu iptal etme/güncelleme

3. **Admin Paneli Entegrasyonu**
   - Kullanıcı yönetimi
   - Doktor ve bölüm yönetimi
   - Randevu yönetimi

4. **Doktor Paneli Entegrasyonu**
   - Randevu takvimi görüntüleme
   - Hasta bilgileri erişimi
   - Randevu durumu güncelleme 