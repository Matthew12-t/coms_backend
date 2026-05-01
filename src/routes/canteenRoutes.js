const express = require('express');
const { getAllCanteens, getCanteenById } = require('../controllers/canteenController');
const { getCanteenHistory } = require('../controllers/occupancyController');

const router = express.Router();

router.get('/', getAllCanteens);
router.get('/:id', getCanteenById);
router.get('/:canteen_id/history', getCanteenHistory);

module.exports = router;
