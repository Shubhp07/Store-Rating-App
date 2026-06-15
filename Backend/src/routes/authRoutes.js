const express = require('express');
const router = express.Router();
const { signup, login, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.patch('/change-password', authenticate, changePassword);

module.exports = router;