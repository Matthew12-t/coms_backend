const express = require('express');
const { getProfile, upsertProfile } = require('../controllers/profileController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const { profileSchema } = require('../models/schemas');

const router = express.Router();

router.use(requireAuth);
router.get('/', getProfile);
router.put('/', validate(profileSchema), upsertProfile);

module.exports = router;
