const { body, validationResult } = require('express-validator');

const createUserValidations = [
  body('username').notEmpty().withMessage('Username cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const loginValidations = [
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    // [msg, msg, msg] -> 'msg. msg. msg'
    const errorMsg = messages.join('. ');

    return res.status(400).json({
      status: 'error',
      message: errorMsg,
    });
  }

  next();
};

const createProductValidations = [
  body('title').notEmpty().withMessage('Title cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  body('price')
    .notEmpty()
    .withMessage('Price cannot be empty')
    .isNumeric({ min: 0 })
    .withMessage('Price must be over 0'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity cannot be empty')
    .isNumeric({ min: 0 })
    .withMessage('Quantity must be over 0'),
  body('categoryId')
    .notEmpty()
    .withMessage('categoryId cannot be empty')
    .isInt({ min: 1 })
    .withMessage('categoryId must be an integer greater or equal than 1'),
];

module.exports = {
  createUserValidations,
  createProductValidations,
  checkValidations,
  loginValidations,
};
