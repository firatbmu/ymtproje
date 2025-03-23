const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

// Validation sonuçlarını kontrol eden middleware
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new ErrorResponse(errorMessages, 400));
  }
  next();
};

// Kullanıcı kaydı validasyonu
exports.validateRegister = [
  body('tcNo')
    .notEmpty().withMessage('TC Kimlik numarası zorunludur')
    .isLength({ min: 11, max: 11 }).withMessage('TC Kimlik numarası 11 haneli olmalıdır')
    .isNumeric().withMessage('TC Kimlik numarası sadece rakamlardan oluşmalıdır'),
  
  body('adSoyad')
    .notEmpty().withMessage('Ad Soyad zorunludur')
    .trim()
    .isLength({ max: 50 }).withMessage('Ad Soyad 50 karakterden uzun olamaz'),
  
  body('email')
    .notEmpty().withMessage('E-posta adresi zorunludur')
    .isEmail().withMessage('Geçerli bir e-posta adresi girin'),
  
  body('telefon')
    .notEmpty().withMessage('Telefon numarası zorunludur')
    .matches(/^[0-9]{10}$/).withMessage('Telefon numarası 10 haneli olmalıdır (Başında 0 olmadan)'),
  
  body('dogumTarihi')
    .notEmpty().withMessage('Doğum tarihi zorunludur')
    .isISO8601().toDate().withMessage('Geçerli bir tarih formatı girin'),
  
  body('sifre')
    .notEmpty().withMessage('Şifre zorunludur')
    .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
  
  body('sifreTekrar')
    .notEmpty().withMessage('Şifre tekrarı zorunludur')
    .custom((value, { req }) => {
      if (value !== req.body.sifre) {
        throw new Error('Şifreler eşleşmiyor');
      }
      return true;
    })
];

// Kullanıcı girişi validasyonu
exports.validateLogin = [
  body('email')
    .notEmpty().withMessage('E-posta adresi zorunludur')
    .isEmail().withMessage('Geçerli bir e-posta adresi girin'),
  
  body('sifre')
    .notEmpty().withMessage('Şifre zorunludur')
];

// Randevu oluşturma validasyonu
exports.validateAppointment = [
  body('doktor')
    .notEmpty().withMessage('Doktor seçimi zorunludur')
    .isMongoId().withMessage('Geçersiz doktor ID'),
  
  body('bolum')
    .notEmpty().withMessage('Bölüm seçimi zorunludur')
    .isMongoId().withMessage('Geçersiz bölüm ID'),
  
  body('tarih')
    .notEmpty().withMessage('Tarih seçimi zorunludur')
    .isISO8601().toDate().withMessage('Geçerli bir tarih formatı girin')
    .custom(value => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        throw new Error('Geçmiş bir tarih seçemezsiniz');
      }
      return true;
    }),
  
  body('saat')
    .notEmpty().withMessage('Saat seçimi zorunludur')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Geçerli bir saat formatı girin (HH:MM)'),
  
  body('sebep')
    .notEmpty().withMessage('Randevu sebebi zorunludur')
    .isLength({ max: 200 }).withMessage('Randevu sebebi 200 karakterden uzun olamaz')
]; 