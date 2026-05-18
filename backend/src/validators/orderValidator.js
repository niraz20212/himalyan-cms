const { body } = require('express-validator');

const orderValidator = [
  body('productId').notEmpty().withMessage('Product is required'),
  body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required'),
  body('orderType').optional().isString(),
  body('quantity').optional().isString(),
  body('country').optional().isString(),
  body('phone').optional().isString(),
  body('notes').optional().isString(),
];

module.exports = { orderValidator };
