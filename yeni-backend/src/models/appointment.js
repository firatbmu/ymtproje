const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  hasta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doktor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  bolum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  tarih: {
    type: Date,
    required: [true, 'Randevu tarihi zorunludur']
  },
  saat: {
    type: String,
    required: [true, 'Randevu saati zorunludur'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı girin (HH:MM)']
  },
  durum: {
    type: String,
    enum: ['beklemede', 'onaylandı', 'iptal edildi', 'tamamlandı'],
    default: 'beklemede'
  },
  sebep: {
    type: String,
    required: [true, 'Randevu sebebi zorunludur'],
    maxlength: [200, 'Randevu sebebi 200 karakterden uzun olamaz']
  },
  notlar: {
    type: String,
    maxlength: [500, 'Notlar 500 karakterden uzun olamaz']
  },
  ilkZiyaretMi: {
    type: Boolean,
    default: true
  },
  iptalSebebi: {
    type: String,
    maxlength: [200, 'İptal sebebi 200 karakterden uzun olamaz']
  },
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

// Aynı doktor için aynı tarih ve saatte birden fazla randevu oluşturulamaz
AppointmentSchema.index({ doktor: 1, tarih: 1, saat: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', AppointmentSchema); 