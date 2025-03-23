const app = require('./src/app');
const connectDB = require('./src/config/db');
const config = require('./src/config/config');

// Uncaught exception hatalarını yakala
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Uygulama kapatılıyor...');
  console.error(err.name, err.message);
  process.exit(1);
});

// MongoDB bağlantısı
connectDB();

const server = app.listen(config.port, () => {
  console.log(`Sunucu ${config.port} portunda ${config.env} modunda çalışıyor`);
});

// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Uygulama kapatılıyor...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
}); 