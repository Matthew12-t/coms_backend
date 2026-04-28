const express = require('express');
const { logOccupancy } = require('../controllers/occupancyController');

const router = express.Router();

router.post('/', logOccupancy);

module.exports = router;
