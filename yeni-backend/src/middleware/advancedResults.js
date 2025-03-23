/**
 * Gelişmiş sorgu sonuçları middleware'i
 * Filtreleme, sıralama, sayfalama ve seçme özellikleri sağlar
 * 
 * @param {Model} model - Mongoose modeli
 * @param {String} populate - Populate edilecek alanlar (varsa)
 */
const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // İstek parametrelerinin bir kopyasını oluştur
  const reqQuery = { ...req.query };

  // Özel alanları çıkar (sayfalama, sıralama vb.)
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // MongoDB operatörlerini ekleme (gt, gte, lt, lte, in)
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Sorguyu oluştur
  query = model.find(JSON.parse(queryStr));

  // Belirli alanları seçme
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sıralama
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // Varsayılan olarak oluşturma tarihine göre azalan sıralama
    query = query.sort('-createdAt');
  }

  // Sayfalama
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Populate işlemi
  if (populate) {
    query = query.populate(populate);
  }

  // Sorguyu çalıştır
  const results = await query;

  // Sayfalama sonuçları
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  // Sonuçları res.advancedResults'e ekle
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults; 