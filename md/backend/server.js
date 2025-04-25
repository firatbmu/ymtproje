const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
require('dotenv').config({ path: __dirname + '/.env' });
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Veritabanı bağlantısını test et
testConnection();

// Basit bir endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Sağlık Merkezi API çalışıyor!' });
});

// API rotaları buraya eklenecek
// örneğin: app.use('/api/auth', require('./routes/authRoutes'));

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});