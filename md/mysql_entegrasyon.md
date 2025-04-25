 # Sağlık Merkezi Uygulaması MySQL Veritabanı Entegrasyonu

## Uygulama Geliştirme Yol Haritası

### 1. Veritabanı Kurulumu ve Yapılandırması
- [x] MySQL veritabanının kurulumu
- [x] Veritabanı bağlantı yapılandırması
- [x] Gerekli tabloların oluşturulması
  - [x] Kullanıcılar tablosu (hastalar)
  - [x] Doktorlar tablosu
  - [x] Bölümler tablosu
  - [x] Randevular tablosu

### 2. Backend Altyapısı
- [x] Node.js ve Express.js kurulumu
- [x] MySQL bağlantı kütüphanesi (mysql2) kurulumu
- [x] Temel klasör yapısının oluşturulması
- [x] Veritabanı bağlantı modülünün yazılması

### 3. Kimlik Doğrulama Sistemi
- [ ] Kullanıcı kayıt API'si (`/api/auth/register`)
- [ ] Kullanıcı giriş API'si (`/api/auth/login`)
- [ ] JWT token oluşturma ve doğrulama
- [ ] Oturum yönetimi
- [ ] Şifre şifreleme (bcrypt)

### 4. Randevu Sistemi
- [ ] Randevu oluşturma API'si (`/api/randevu/create`)
- [ ] Randevu listeleme API'si (`/api/randevu/list`)
- [ ] Randevu güncelleme API'si (`/api/randevu/update`)
- [ ] Randevu iptal API'si (`/api/randevu/cancel`)
- [ ] Randevu sorgulama API'si (`/api/randevu/check`)

### 5. Doktor Yönetim Sistemi
- [ ] Doktor randevuları listeleme API'si (`/api/doktor/randevular`)
- [ ] Doktor müsaitlik ayarları API'si (`/api/doktor/musaitlik`)
- [ ] Randevu onaylama API'si (`/api/doktor/randevu/onayla`)
- [ ] Randevu iptal API'si (`/api/doktor/randevu/iptal`)
- [ ] Randevu güncelleme API'si (`/api/doktor/randevu/guncelle`)

### 6. Frontend-Backend Entegrasyonu
- [ ] Frontend HTTP istek kütüphanesinin kurulumu (axios)
- [ ] Giriş/kayıt sayfalarının backend'e bağlanması
- [ ] Randevu oluşturma sayfasının backend'e bağlanması
- [ ] Randevu listeleme sayfasının backend'e bağlanması
- [ ] Doktor panelinin backend'e bağlanması

### 7. Bildirim Sistemi
- [ ] E-posta bildirim modülü (Nodemailer)
- [ ] SMS bildirim modülü
- [ ] Randevu onay bildirimleri
- [ ] Randevu hatırlatma bildirimleri
- [ ] İptal bildirimleri

### 8. Test ve Güvenlik
- [ ] API test senaryolarının yazılması
- [ ] Güvenlik testleri
- [ ] Hata yakalama ve loglama sistemi
- [ ] Performans optimizasyonu

### 9. Deployment
- [ ] Veritabanı sunucusu kurulumu
- [ ] Backend sunucusu kurulumu
- [ ] Frontend dağıtımı
- [ ] Sunucu güvenlik yapılandırması

## MySQL Veritabanı Şeması

```sql
-- Kullanıcılar tablosu
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tc_kimlik VARCHAR(11) UNIQUE NOT NULL,
    ad_soyad VARCHAR(100) NOT NULL,
    telefon VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    dogum_tarihi DATE NOT NULL,
    sifre VARCHAR(255) NOT NULL,
    rol ENUM('hasta', 'doktor', 'admin') DEFAULT 'hasta',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bölümler tablosu
CREATE TABLE bolumler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    aciklama TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doktorlar tablosu
CREATE TABLE doktorlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bolum_id INT NOT NULL,
    uzmanlik VARCHAR(100) NOT NULL,
    deneyim INT,
    calisma_gunleri VARCHAR(100),
    calisma_saatleri VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bolum_id) REFERENCES bolumler(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Randevular tablosu
CREATE TABLE randevular (
    id INT AUTO_INCREMENT PRIMARY KEY,
    randevu_kodu VARCHAR(20) UNIQUE NOT NULL,
    hasta_id INT NOT NULL,
    doktor_id INT NOT NULL,
    bolum_id INT NOT NULL,
    tarih DATE NOT NULL,
    saat TIME NOT NULL,
    sikayet TEXT,
    durum ENUM('beklemede', 'onaylandı', 'iptal edildi', 'tamamlandı') DEFAULT 'beklemede',
    notlar TEXT,
    FOREIGN KEY (hasta_id) REFERENCES users(id),
    FOREIGN KEY (doktor_id) REFERENCES doktorlar(id),
    FOREIGN KEY (bolum_id) REFERENCES bolumler(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doktor müsaitlik tablosu
CREATE TABLE musaitlik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doktor_id INT NOT NULL,
    gun DATE NOT NULL,
    baslangic_saat TIME NOT NULL,
    bitis_saat TIME NOT NULL,
    durum ENUM('müsait', 'izinli', 'dolu') DEFAULT 'müsait',
    FOREIGN KEY (doktor_id) REFERENCES doktorlar(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Backend İçin Örnek Node.js Dosya Yapısı

```
/backend
  /config
    - db.js                  # MySQL bağlantı yapılandırması
    - auth.js                # JWT yapılandırması
  /models
    - userModel.js           # Kullanıcı/hasta model fonksiyonları
    - doctorModel.js         # Doktor model fonksiyonları
    - appointmentModel.js    # Randevu model fonksiyonları
    - departmentModel.js     # Bölüm model fonksiyonları
  /controllers
    - authController.js      # Kimlik doğrulama işleyicileri
    - appointmentController.js # Randevu işleyicileri
    - doctorController.js    # Doktor işleyicileri
  /routes
    - authRoutes.js          # Kimlik doğrulama rotaları
    - appointmentRoutes.js   # Randevu rotaları
    - doctorRoutes.js        # Doktor rotaları
  /middleware
    - authMiddleware.js      # Token doğrulama
    - validationMiddleware.js # Girdi doğrulama
  /utils
    - helpers.js             # Yardımcı fonksiyonlar
    - emailService.js        # E-posta gönderme servisi
    - smsService.js          # SMS gönderme servisi
  - server.js                # Ana uygulama dosyası
  - package.json             # Bağımlılıklar ve komutlar
```

## Temel Backend Bağımlılıkları

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.0.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "helmet": "^6.0.1",
    "express-validator": "^6.14.3",
    "nodemailer": "^6.9.1",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

## Örnek Veritabanı Bağlantı Kodu (db.js)

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

// Veritabanı bağlantı havuzu oluşturma
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'saglik_merkezi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Bağlantıyı test etme fonksiyonu
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL veritabanına başarıyla bağlandı!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
```

## Frontend-Backend Entegrasyonu İçin Örnek API Çağrısı

```javascript
// API isteği için axios kurulumu
// npm install axios

import axios from 'axios';

// API baz URL'i
const API_URL = 'http://localhost:5000/api';

// Token alma ve ayarlama
const token = localStorage.getItem('token');
const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

// Randevu oluşturma örneği
async function randevuOlustur(randevuData) {
  try {
    const response = await axios.post(`${API_URL}/randevu/create`, randevuData, {
      headers: {
        ...authHeader,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Randevu oluşturma hatası:', error.response?.data || error.message);
    throw error;
  }
}
```