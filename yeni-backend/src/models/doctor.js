const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bolum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  uzmanlik: {
    type: String,
    required: [true, 'Uzmanlık alanı zorunludur'],
    trim: true
  },
  biyografi: {
    type: String,
    required: [true, 'Biyografi zorunludur'],
    maxlength: [1000, 'Biyografi 1000 karakterden uzun olamaz']
  },
  fotograf: {
    type: String,
    default: 'no-photo.jpg'
  },
  deneyimYili: {
    type: Number,
    required: [true, 'Deneyim yılı zorunludur']
  },
  egitim: [{
    okul: {
      type: String,
      required: true
    },
    derece: {
      type: String,
      required: true
    },
    alan: {
      type: String,
      required: true
    },
    baslangicYili: {
      type: Number,
      required: true
    },
    bitisYili: {
      type: Number,
      required: true
    }
  }],
  calismaSaatleri: [{
    gun: {
      type: String,
      enum: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
      required: true
    },
    baslangic: {
      type: String,
      required: true
    },
    bitis: {
      type: String,
      required: true
    },
    aktifMi: {
      type: Boolean,
      default: true
    }
  }],
  musaitMi: {
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

// Sanal alan: İlişkili randevular
DoctorSchema.virtual('randevular', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'doktor',
  justOne: false
});

// Doktor silindiğinde ilişkili tüm randevuları kaldır
DoctorSchema.pre('remove', async function(next) {
  await this.model('Appointment').deleteMany({ doktor: this._id });
  next();
});

module.exports = mongoose.model('Doctor', DoctorSchema); 