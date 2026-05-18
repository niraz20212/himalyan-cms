const express = require('express');
const controller = require('../controllers/authController');
const validate = require('../middlewares/validateMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const { loginValidator, registerValidator } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerValidator, validate, controller.register);
router.post('/login', loginValidator, validate, controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', protect, controller.me);

module.exports = router;
