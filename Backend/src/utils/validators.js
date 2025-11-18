const { body } = require('express-validator');

exports.registerValidation = [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 chars'),
  body('email').isEmail(),
  body('address').optional().isLength({ max: 400 }),
  body('password').matches(/^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/).withMessage('Password criteria: 8-16 chars, 1 uppercase, 1 special char')
];

exports.loginValidation = [
  body('email').isEmail(),
  body('password').exists()
];

exports.ratingValidation = [
  body('store_id').isInt().withMessage('store_id is required'),
  body('rating').isInt({ min: 1, max: 5 })
];
