const express = require('express');
const { getAllCanteens } = require('../controllers/canteenController');

const router = express.Router();

router.get('/', getAllCanteens);

module.exports = router;
