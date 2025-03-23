const express = require('express');
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/department');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Department = require('../models/department');

// Router nesnesi oluştur
const router = express.Router();

// Doktor rotalarını dahil et
const doctorRouter = require('./doctor');
router.use('/:departmentId/doctors', doctorRouter);

// Bölüm rotaları
router
  .route('/')
  .get(advancedResults(Department, 'doktorlar'), getDepartments)
  .post(protect, authorize('admin'), createDepartment);

router
  .route('/:id')
  .get(getDepartment)
  .put(protect, authorize('admin'), updateDepartment)
  .delete(protect, authorize('admin'), deleteDepartment);

module.exports = router; 