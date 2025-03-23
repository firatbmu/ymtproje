const Doctor = require('../models/doctor');
const Department = require('../models/department');
const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Tüm doktorları getir
 * @route   GET /api/doctors
 * @access  Public
 */
exports.getDoctors = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * Tek doktor getir
 * @route   GET /api/doctors/:id
 * @access  Public
 */
exports.getDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'adSoyad email telefon'
    })
    .populate('bolum');

  if (!doctor) {
    return next(
      new ErrorResponse(`${req.params.id} ID'li doktor bulunamadı`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: doctor
  });
});

/**
 * Bölüme göre doktorları getir
 * @route   GET /api/departments/:departmentId/doctors
 * @access  Public
 */
exports.getDepartmentDoctors = asyncHandler(async (req, res, next) => {
  const department = await Department.findById(req.params.departmentId);

  if (!department) {
    return next(
      new ErrorResponse(`${req.params.departmentId} ID'li bölüm bulunamadı`, 404)
    );
  }

  const doctors = await Doctor.find({ bolum: req.params.departmentId })
    .populate({
      path: 'user',
      select: 'adSoyad email telefon'
    });

  res.status(200).json({
    success: true,
    count: doctors.length,
    data: doctors
  });
});

/**
 * Doktor oluştur
 * @route   POST /api/doctors
 * @access  Private/Admin
 */
exports.createDoctor = asyncHandler(async (req, res, next) => {
  // Kullanıcı ve bölüm ID'lerini kontrol et
  const user = await User.findById(req.body.user);
  if (!user) {
    return next(
      new ErrorResponse(`${req.body.user} ID'li kullanıcı bulunamadı`, 404)
    );
  }

  const department = await Department.findById(req.body.bolum);
  if (!department) {
    return next(
      new ErrorResponse(`${req.body.bolum} ID'li bölüm bulunamadı`, 404)
    );
  }

  // Kullanıcı rolünü doktor olarak güncelle
  await User.findByIdAndUpdate(req.body.user, { rol: 'doktor' });

  // Doktor oluştur
  const doctor = await Doctor.create(req.body);

  res.status(201).json({
    success: true,
    data: doctor
  });
});

/**
 * Doktor güncelle
 * @route   PUT /api/doctors/:id
 * @access  Private/Admin
 */
exports.updateDoctor = asyncHandler(async (req, res, next) => {
  let doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return next(
      new ErrorResponse(`${req.params.id} ID'li doktor bulunamadı`, 404)
    );
  }

  doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: doctor
  });
});

/**
 * Doktor sil
 * @route   DELETE /api/doctors/:id
 * @access  Private/Admin
 */
exports.deleteDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return next(
      new ErrorResponse(`${req.params.id} ID'li doktor bulunamadı`, 404)
    );
  }

  // Kullanıcı rolünü hasta olarak güncelle
  await User.findByIdAndUpdate(doctor.user, { rol: 'hasta' });

  await doctor.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 