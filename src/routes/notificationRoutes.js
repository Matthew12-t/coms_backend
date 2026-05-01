const express = require('express');
const {
  listNotifications,
  createNotification,
  deleteNotification,
} = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const { notificationSchema } = require('../models/schemas');

const router = express.Router();

router.use(requireAuth);
router.get('/', listNotifications);
router.post('/', validate(notificationSchema), createNotification);
router.delete('/:id', deleteNotification);

module.exports = router;
