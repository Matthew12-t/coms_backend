const express = require('express');
const { register, verifyEmail, exchangeCode, login, logout, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const { authSchema } = require('../models/schemas');

const router = express.Router();

router.post('/register', validate(authSchema), register);
router.post('/verify-email', verifyEmail);
router.post('/exchange-code', exchangeCode);
router.post('/login', validate(authSchema), login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

module.exports = router;
