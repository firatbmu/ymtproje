const mysql = require('mysql2/promise');
require('dotenv').config();

// Veritabanı bağlantı havuzu oluşturma
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'GRSThq9U',
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