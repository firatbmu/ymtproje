const Department = require('../models/department');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Tüm bölümleri getir
 * @route   GET /api/departments
 * @access  Public
 */
exports.getDepartments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * Tek bölüm getir
 * @route   GET /api/departments/:id
 * @access  Public
 */
exports.getDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.findById(req.params.id).populate('doktorlar');

  if (!department) {
    return next(
      new ErrorResponse(`${req.params.id} ID'li bölüm bulunamadı`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: department
  });
});

/**
 * Bölüm oluştur
 * @route   POST /api/departments
 * @access  Private/Admin
 */
exports.createDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.create(req.body);

  res.status(201).json({
    success: true,
    data: department
  });
});

/**
 * Bölüm güncelle
 * @route   PUT /api/departments/:id
 * @access  Private/Admin
 */
exports.updateDepartment = asyncHandler(async (req, res, next) => {
  let department = await Department.findById(req.params.id);

  if (!department) {
    return next(
      new ErrorResponse(`${req.params.id} ID'li bölüm bulunamadı`, 404)
    );
  }

  department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: department
  });
});

/**
 * Bölüm sil
 * @route   DELETE /api/departments/:id
 * @access  Private/Admin
 */
exports.deleteDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    return next(
      new ErrorResponse(`${req.params.id} ID'li bölüm bulunamadı`, 404)
    );
  }

  await department.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 