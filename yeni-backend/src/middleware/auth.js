const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');
const config = require('../config/config');

// Korumalı rotalar için middleware
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Token kontrolü
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Bearer token'dan ayıkla
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // Cookie'den al
    token = req.cookies.token;
  }

  // Token yoksa
  if (!token) {
    return next(new ErrorResponse('Bu kaynağa erişim için yetkiniz yok', 401));
  }

  try {
    // Token doğrulama
    const decoded = jwt.verify(token, config.jwtSecret);

    // Kullanıcıyı bul
    req.user = await User.findById(decoded.id);

    // Kullanıcı bulunamadıysa
    if (!req.user) {
      return next(new ErrorResponse('Kullanıcı bulunamadı', 401));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Bu kaynağa erişim için yetkiniz yok', 401));
  }
});

// Rol bazlı erişim kontrolü
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Kullanıcı rolünü kontrol et
    if (!roles.includes(req.user.rol)) {
      return next(
        new ErrorResponse(
          `${req.user.rol} rolü bu işlemi gerçekleştirmek için yetkili değil`,
          403
        )
      );
    }
    next();
  };
}; 