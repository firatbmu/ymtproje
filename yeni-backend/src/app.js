const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');

// Ortam değişkenlerini yükle
dotenv.config();

// Route dosyalarını içe aktar
const auth = require('./routes/auth');
const department = require('./routes/department');
const doctor = require('./routes/doctor');
const appointment = require('./routes/appointment');

// Express uygulaması
const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Güvenlik başlıkları (helmet)
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Loglama (sadece development ortamında)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 dakika
  max: 100, // IP başına 100 istek
  message: {
    success: false,
    error: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.'
  }
});
app.use('/api', limiter);

// Ana rota
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Hastane Randevu Sistemi API Çalışıyor',
    data: {
      apiVersion: '1.0.0',
      endpoints: ['/api/auth', '/api/users', '/api/departments', '/api/doctors', '/api/appointments']
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API testi başarılı',
    data: {
      name: 'Hastane Randevu Sistemi API',
      version: '1.0.0',
      date: new Date().toISOString()
    }
  });
});

// API rotalarını bağla
app.use('/api/auth', auth);
app.use('/api/departments', department);
app.use('/api/doctors', doctor);
app.use('/api/appointments', appointment);

// 404 - Bulunamadı
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Sayfa bulunamadı'
  });
});

// Hata işleme middleware'i
app.use(errorHandler);

module.exports = app; 