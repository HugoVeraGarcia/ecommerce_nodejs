const express = require('express');
const { body } = require('express-validator');

//middleware
const {
  productExist,
  categoryExist,
  protectProductOwner,
} = require('../middlewares/products.middleware');
const { protectToken } = require('../middlewares/users.middlewares');

const {
  createProductValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  createCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
} = require('../controllers/product.controller');

//router declaration
const router = express.Router();

router.get('/category', getAllCategory);

router.get('/', getAllProducts);

router.get('/:id', productExist, getProductById);

// Apply protectToken middleware
router.use(protectToken);

router.post('/', createProductValidations, checkValidations, createProduct);

//category
router.get('/category', getAllCategory);
router.post('/category', createCategory);
router.delete('/category/:id', categoryExist, deleteCategory);
router.patch('/category/:id', categoryExist, updateCategory);

router
  .route('/:id')
  .patch(productExist, protectProductOwner, updateProduct)
  .delete(productExist, protectProductOwner, deleteProduct);

module.exports = { productsRouter: router };
