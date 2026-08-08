const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { validate, validations } = require('../middleware/validation');

router.post('/register', validate(validations.register), register);
router.post('/login', validate(validations.login), login);
router.get('/me', protect, getMe);

module.exports = router;
