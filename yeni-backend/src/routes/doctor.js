const express = require('express');
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDepartmentDoctors
} = require('../controllers/doctor');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Doctor = require('../models/doctor');

// Parametre olarak departmentId alabilir
const router = express.Router({ mergeParams: true });

// Doktor rotaları
router
  .route('/')
  .get(
    advancedResults(
      Doctor,
      [
        { path: 'user', select: 'adSoyad email telefon' },
        { path: 'bolum', select: 'ad aciklama' }
      ]
    ),
    getDepartmentDoctors.length > 0 ? getDepartmentDoctors : getDoctors
  )
  .post(protect, authorize('admin'), createDoctor);

router
  .route('/:id')
  .get(getDoctor)
  .put(protect, authorize('admin', 'doktor'), updateDoctor)
  .delete(protect, authorize('admin'), deleteDoctor);

module.exports = router; 