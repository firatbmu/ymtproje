const express = require('express');
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getMyAppointments,
  getDoctorAppointments
} = require('../controllers/appointment');

const { protect, authorize } = require('../middleware/auth');
const { validateAppointment, validateRequest } = require('../middleware/validation');
const advancedResults = require('../middleware/advancedResults');
const Appointment = require('../models/appointment');

// Router nesnesi oluştur
const router = express.Router();

// Tüm rotalar için kimlik doğrulama gerekli
router.use(protect);

// Özel rotalar
router.get('/me', getMyAppointments);
router.get('/doctor', authorize('doktor'), getDoctorAppointments);

// Ana randevu rotaları
router
  .route('/')
  .get(
    advancedResults(
      Appointment,
      [
        { path: 'hasta', select: 'adSoyad email telefon' },
        { 
          path: 'doktor',
          populate: {
            path: 'user',
            select: 'adSoyad'
          }
        },
        { path: 'bolum', select: 'ad' }
      ]
    ),
    getAppointments
  )
  .post(validateAppointment, validateRequest, createAppointment);

router
  .route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router; 