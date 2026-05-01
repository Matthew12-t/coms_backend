const express = require('express');
const {
  peakHours,
  dailyAverages,
  recommendations,
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/peak-hours', peakHours);
router.get('/daily-averages', dailyAverages);
router.get('/recommendations', recommendations);

module.exports = router;
