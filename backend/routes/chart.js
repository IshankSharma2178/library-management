const express = require('express');
const router = express.Router();
const {
  getMonthlyStats,
  getCategoryStats,
  getStatusStats,
  getDailyStats
} = require('../controllers/chartController');

router.get('/monthly', getMonthlyStats);
router.get('/categories', getCategoryStats);
router.get('/status', getStatusStats);
router.get('/daily', getDailyStats);

module.exports = router;