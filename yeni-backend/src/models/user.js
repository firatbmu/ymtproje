const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const UserSchema = new mongoose.Schema({
  tcNo: {
    type: String,
    required: [true, 'TC Kimlik numarası zorunludur'],
    unique: true,
    match: [/^[0-9]{11}$/, 'TC Kimlik numarası 11 haneli olmalıdır']
  },
  adSoyad: {
    type: String,
    required: [true, 'Ad Soyad zorunludur'],
    trim: true,
    maxlength: [50, 'Ad Soyad 50 karakterden uzun olamaz']
  },
  email: {
    type: String,
    required: [true, 'E-posta adresi zorunludur'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Lütfen geçerli bir e-posta adresi girin'
    ]
  },
  telefon: {
    type: String,
    required: [true, 'Telefon numarası zorunludur'],
    match: [/^[0-9]{10}$/, 'Telefon numarası 10 haneli olmalıdır (Başında 0 olmadan)']
  },
  dogumTarihi: {
    type: Date,
    required: [true, 'Doğum tarihi zorunludur']
  },
  sifre: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    select: false // Şifre, sorgu sonuçlarında dönmeyecek
  },
  rol: {
    type: String,
    enum: ['hasta', 'doktor', 'admin'],
    default: 'hasta'
  },
  hesapDurumu: {
    type: String,
    enum: ['aktif', 'pasif', 'askıda'],
    default: 'aktif'
  },
  sifreResetToken: String,
  sifreResetExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Şifreleri hashleme
UserSchema.pre('save', async function(next) {
  // Şifre değiştirilmediyse hash işlemi yapılmasın
  if (!this.isModified('sifre')) {
    return next();
  }

  try {
    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    this.sifre = await bcrypt.hash(this.sifre, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// JWT token oluşturma metodu
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, rol: this.rol },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

// Şifre eşleştirme metodu
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.sifre);
};

module.exports = mongoose.model('User', UserSchema); 