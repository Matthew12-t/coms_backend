const express = require('express');
const { listMenus, createMenu } = require('../controllers/menuController');
const { validate } = require('../middleware/validate');
const { menuSchema } = require('../models/schemas');

const router = express.Router();

router.get('/', listMenus);
router.post('/', validate(menuSchema), createMenu);

module.exports = router;
