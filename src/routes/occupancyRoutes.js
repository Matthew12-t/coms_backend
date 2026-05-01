const express = require('express');
const { logOccupancy, getLatestOccupancy } = require('../controllers/occupancyController');
const { validate } = require('../middleware/validate');
const { occupancySchema } = require('../models/schemas');

const router = express.Router();

router.get('/latest', getLatestOccupancy);
router.post('/', validate(occupancySchema), logOccupancy);

module.exports = router;
