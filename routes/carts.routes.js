const express = require('express');
const { body } = require('express-validator');

//middleware
const { protectToken } = require('../middlewares/users.middlewares');

//import controller functions
const {
  addProduct,
  updateCart,
  deleteProduct,
  purchaseCart,
  addCart,
} = require('../controllers/cart.controller');

//router declaration
const router = express.Router();

// Apply protectToken middleware
router.use(protectToken);

router.post('/add-product', addProduct);

router.patch('/update-cart', updateCart);

router.delete('/:productId', deleteProduct);

router.post('/purchase', purchaseCart);

module.exports = { cartsRouter: router };
