const express = require('express');
const { ingestPrediction } = require('../controllers/predictionController');
const { validate } = require('../middleware/validate');
const { requireDeviceKey } = require('../middleware/deviceAuth');
const { predictionSchema } = require('../models/schemas');

const router = express.Router();

router.post('/', requireDeviceKey, validate(predictionSchema), ingestPrediction);

module.exports = router;
