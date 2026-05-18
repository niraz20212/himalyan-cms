const express = require('express');
const controller = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { orderValidator } = require('../validators/orderValidator');

const router = express.Router();

router.use(protect);
router.get('/my', controller.listMyOrders);
router.get('/my/:id', controller.getMyOrder);
router.post('/', orderValidator, validate, controller.createOrder);

module.exports = router;
