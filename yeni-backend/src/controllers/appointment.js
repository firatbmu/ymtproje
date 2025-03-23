const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Tüm randevuları getir (Rol bazlı)
 * @route   GET /api/appointments
 * @access  Private
 */
exports.getAppointments = asyncHandler(async (req, res, next) => {
  // Rol bazlı filtreleme
  if (req.user.rol === 'admin') {
    // Admin tüm randevuları görebilir
    return res.status(200).json(res.advancedResults);
  } else if (req.user.rol === 'doktor') {
    // Doktor kendi randevularını görebilir
    const doctor = await Doctor.findOne({ user: req.user.id });
    
    if (!doctor) {
      return next(new ErrorResponse('Doktor profili bulunamadı', 404));
    }
    
    const appointments = await Appointment.find({ doktor: doctor._id })
      .populate({
        path: 'hasta',
        select: 'adSoyad email telefon'
      })
      .populate({
        path: 'bolum',
        select: 'ad'
      });
      
    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } else {
    // Hasta kendi randevularını görebilir
    const appointments = await Appointment.find({ hasta: req.user.id })
      .populate({
        path: 'doktor',
        select: 'uzmanlik',
        populate: {
          path: 'user',
          select: 'adSoyad'
        }
      })
      .populate({
        path: 'bolum',
        select: 'ad'
      });
      
    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  }
});

/**
 * Tek randevu getir
 * @route   GET /api/appointments/:id
 * @access  Private
 */
exports.getAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate({
      path: 'hasta',
      select: 'adSoyad email telefon'
    })
    .populate({
      path: 'doktor',
      populate: {
        path: 'user',
        select: 'adSoyad'
      }
    })
    .populate('bolum');

  if (!appointment) {
    return next(
      new ErrorResponse(`${req.params.id} ID'li randevu bulunamadı`, 404)
    );
  }

  // Yetki kontrolü
  if (
    req.user.rol !== 'admin' && 
    appointment.hasta.toString() !== req.user.id &&
    !(req.user.rol === 'doktor' && appointment.doktor.user.toString() === req.user.id)
  ) {
    return next(
      new ErrorResponse('Bu randevuyu görüntüleme yetkiniz yok', 403)
    );
  }

  res.status(200).json({
    success: true,
    data: appointment
  });
});

/**
 * Randevu oluştur
 * @route   POST /api/appointments
 * @access  Private
 */
exports.createAppointment = asyncHandler(async (req, res, next) => {
  // Hasta ID'sini ekle
  req.body.hasta = req.user.id;

  // Doktor varlığını kontrol et
  const doctor = await Doctor.findById(req.body.doktor);
  if (!doctor) {
    return next(
      new ErrorResponse(`${req.body.doktor} ID'li doktor bulunamadı`, 404)
    );
  }

  // Mevcut randevuları kontrol et (aynı doktor, tarih ve saat)
  const existingAppointment = await Appointment.findOne({
    doktor: req.body.doktor,
    tarih: req.body.tarih,
    saat: req.body.saat
  });

  if (existingAppointment) {
    return next(
      new ErrorResponse('Bu tarih ve saatte randevu zaten alınmış', 400)
    );
  }

  // Randevu oluştur
  const appointment = await Appointment.create(req.body);

  res.status(201).json({
    success: true,
    data: appointment
  });
});

/**
 * Randevu güncelle
 * @route   PUT /api/appointments/:id
 * @access  Private
 */
exports.updateAppointment = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(
      new ErrorResponse(`${req.params.id} ID'li randevu bulunamadı`, 404)
    );
  }

  // Yetki kontrolü
  if (
    req.user.rol !== 'admin' && 
    appointment.hasta.toString() !== req.user.id &&
    !(req.user.rol === 'doktor' && appointment.doktor.toString() === req.body.doktor)
  ) {
    return next(
      new ErrorResponse('Bu randevuyu güncelleme yetkiniz yok', 403)
    );
  }

  // Randevu güncellemesi için tarih-saat-doktor kontrolü
  if (req.body.tarih && req.body.saat && req.body.doktor) {
    const existingAppointment = await Appointment.findOne({
      doktor: req.body.doktor,
      tarih: req.body.tarih,
      saat: req.body.saat,
      _id: { $ne: req.params.id } // Kendisi hariç
    });

    if (existingAppointment) {
      return next(
        new ErrorResponse('Bu tarih ve saatte randevu zaten alınmış', 400)
      );
    }
  }

  appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: appointment
  });
});

/**
 * Randevu iptal et
 * @route   DELETE /api/appointments/:id
 * @access  Private
 */
exports.deleteAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(
      new ErrorResponse(`${req.params.id} ID'li randevu bulunamadı`, 404)
    );
  }

  // Yetki kontrolü
  if (
    req.user.rol !== 'admin' && 
    appointment.hasta.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse('Bu randevuyu iptal etme yetkiniz yok', 403)
    );
  }

  // Randevu iptal edildiğinde durum güncellemesi yap
  appointment.durum = 'iptal edildi';
  appointment.iptalSebebi = req.body.iptalSebebi || 'Kullanıcı tarafından iptal edildi';
  await appointment.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * Kullanıcının kendi randevularını getir
 * @route   GET /api/appointments/me
 * @access  Private
 */
exports.getMyAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find({ hasta: req.user.id })
    .populate({
      path: 'doktor',
      select: 'uzmanlik',
      populate: {
        path: 'user',
        select: 'adSoyad'
      }
    })
    .populate({
      path: 'bolum',
      select: 'ad'
    });
    
  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

/**
 * Doktorun kendi randevularını getir
 * @route   GET /api/appointments/doctor
 * @access  Private/Doctor
 */
exports.getDoctorAppointments = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findOne({ user: req.user.id });
    
  if (!doctor) {
    return next(new ErrorResponse('Doktor profili bulunamadı', 404));
  }
  
  const appointments = await Appointment.find({ doktor: doctor._id })
    .populate({
      path: 'hasta',
      select: 'adSoyad email telefon'
    })
    .populate({
      path: 'bolum',
      select: 'ad'
    });
    
  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
}); 