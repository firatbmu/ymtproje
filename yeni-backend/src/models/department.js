const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  ad: {
    type: String,
    required: [true, 'Bölüm adı zorunludur'],
    unique: true,
    trim: true,
    maxlength: [50, 'Bölüm adı 50 karakterden uzun olamaz']
  },
  aciklama: {
    type: String,
    required: [true, 'Bölüm açıklaması zorunludur'],
    maxlength: [500, 'Açıklama 500 karakterden uzun olamaz']
  },
  resimUrl: {
    type: String,
    default: 'no-photo.jpg'
  },
  aktifMi: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Sanal alan: İlişkili doktorlar
DepartmentSchema.virtual('doktorlar', {
  ref: 'Doctor',
  localField: '_id',
  foreignField: 'bolum',
  justOne: false
});

// Bölüm silindiğinde ilişkili tüm doktorları kaldır
DepartmentSchema.pre('remove', async function(next) {
  await this.model('Doctor').deleteMany({ bolum: this._id });
  next();
});

module.exports = mongoose.model('Department', DepartmentSchema); 