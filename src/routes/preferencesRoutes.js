const express = require('express');
const {
  getPreferences,
  upsertPreferences,
} = require('../controllers/preferencesController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const { preferencesSchema } = require('../models/schemas');

const router = express.Router();

router.use(requireAuth);
router.get('/', getPreferences);
router.put('/', validate(preferencesSchema), upsertPreferences);

module.exports = router;
