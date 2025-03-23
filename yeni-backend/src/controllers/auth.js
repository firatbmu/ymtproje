const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config/config');

/**
 * Kullanıcı kaydı
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { tcNo, adSoyad, email, telefon, dogumTarihi, sifre } = req.body;

  // Kullanıcı oluştur
  const user = await User.create({
    tcNo,
    adSoyad,
    email,
    telefon,
    dogumTarihi,
    sifre
  });

  // Token oluştur ve yanıt gönder
  sendTokenResponse(user, 201, res);
});

/**
 * Kullanıcı girişi
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, sifre } = req.body;

  // Email ve şifre kontrolü
  if (!email || !sifre) {
    return next(new ErrorResponse('Lütfen email ve şifre girin', 400));
  }

  // Kullanıcıyı bul (+şifre)
  const user = await User.findOne({ email }).select('+sifre');

  if (!user) {
    return next(new ErrorResponse('Geçersiz giriş bilgileri', 401));
  }

  // Şifre doğrulama
  const isMatch = await user.matchPassword(sifre);

  if (!isMatch) {
    return next(new ErrorResponse('Geçersiz giriş bilgileri', 401));
  }

  // Token oluştur ve yanıt gönder
  sendTokenResponse(user, 200, res);
});

/**
 * Kullanıcı çıkışı
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  // Cookie'yi temizle
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 saniye
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * Mevcut kullanıcı bilgilerini getir
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * Kullanıcı bilgilerini güncelle
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    adSoyad: req.body.adSoyad,
    email: req.body.email,
    telefon: req.body.telefon
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * Şifre güncelleme
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+sifre');

  // Mevcut şifreyi kontrol et
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Mevcut şifre yanlış', 401));
  }

  // Şifreyi güncelle
  user.sifre = req.body.newPassword;
  await user.save();

  // Token oluştur ve yanıt gönder
  sendTokenResponse(user, 200, res);
});

/**
 * Şifre sıfırlama isteği
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // Bu kısımda email ile şifre sıfırlama işlemi yapılabilir
  // Şimdilik basit bir yanıt dönüyoruz
  res.status(200).json({
    success: true,
    data: 'Şifre sıfırlama özelliği henüz uygulanmadı'
  });
});

/**
 * Şifre sıfırlama
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Bu kısımda token ile şifre sıfırlama işlemi yapılabilir
  // Şimdilik basit bir yanıt dönüyoruz
  res.status(200).json({
    success: true,
    data: 'Şifre sıfırlama özelliği henüz uygulanmadı'
  });
});

/**
 * Tüm kullanıcıları getir (admin)
 * @route   GET /api/auth/users
 * @access  Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * Tek kullanıcı getir (admin)
 * @route   GET /api/auth/users/:id
 * @access  Private/Admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`${req.params.id} ID'li kullanıcı bulunamadı`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * Kullanıcı oluştur (admin)
 * @route   POST /api/auth/users
 * @access  Private/Admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

/**
 * Kullanıcı güncelle (admin)
 * @route   PUT /api/auth/users/:id
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse(`${req.params.id} ID'li kullanıcı bulunamadı`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * Kullanıcı sil (admin)
 * @route   DELETE /api/auth/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`${req.params.id} ID'li kullanıcı bulunamadı`, 404));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Helper: JWT Token oluşturma ve cookie olarak gönderme
const sendTokenResponse = (user, statusCode, res) => {
  // Token oluştur
  const token = user.getSignedJwtToken();

  // Cookie ayarları
  const options = {
    expires: new Date(
      Date.now() + config.jwtCookieExpire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Production modunda güvenli cookie
  if (config.env === 'production') {
    options.secure = true;
  }

  // Cookie olarak token gönder
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
}; 