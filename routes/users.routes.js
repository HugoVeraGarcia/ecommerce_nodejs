const express = require('express');
const { body } = require('express-validator');

//middleware
const {
  userExists,
  protectToken,
  protectEmployee,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');

const {
  createUserValidations,
  checkValidations,
  loginValidations,
} = require('../middlewares/validations.middlewares');

//import controller functions
const {
  createUser,
  updateUser,
  deleteUser,
  login,
  getMyProducts,
  getAllOrders,
  getOrderById,
} = require('../controllers/user.controller');

//router declaration
const router = express.Router();

router.post('/', createUserValidations, checkValidations, createUser);

router.post('/login', loginValidations, checkValidations, login);

// Apply protectToken middleware
router.use(protectToken);

router.get('/me', getMyProducts);

router.get('/orders', getAllOrders);

router.get('/orders/:id', getOrderById);

router
  .route('/:id')
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
