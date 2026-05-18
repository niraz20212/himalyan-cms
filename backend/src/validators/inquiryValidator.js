const { body } = require('express-validator');

const inquiryValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email is required'),
  body('type').notEmpty().withMessage('Inquiry type is required'),
  body('message').notEmpty().withMessage('Message is required'),
];

module.exports = { inquiryValidator };
