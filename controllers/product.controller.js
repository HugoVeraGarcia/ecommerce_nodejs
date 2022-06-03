const { Product } = require('../models/product.model');
const { Category } = require('../models/category.models');
const { User } = require('../models/user.model');
const { AppError } = require('../utils/appError');

// utils
const { catchAsync } = require('../utils/catchAsync');

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: 'active' },
    include: { model: Category },
  });
  res.status(200).json({
    products,
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;

  res.status(200).json({
    product,
  });
});

const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, quantity, categoryId } = req.body;
  const { sessionUser } = req;
  const product = await Product.create({
    title,
    description,
    quantity,
    price,
    categoryId,
    userId: sessionUser.id,
  });
  res.status(201).json({ status: 'success', product });
});

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { sessionUser } = req;
  const category = await Category.create({
    name,
  });
  res.status(201).json({ category });
});

const getAllCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findAll({ where: { status: 'active' } });
  res.status(201).json({ category });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, price, quantity } = req.body;

  await product.update({ title, description, price, quantity });
  res.status(200).json({ status: 'success', product });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOne({ where: { id } });

  await category.update({ status: 'deleted' });

  res.status(201).json({
    status: 'success',
    message: 'Category have been deleted',
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, status } = req.body;

  const category = await Category.findOne({ where: { id } });

  await category.update({ name, status });
  res.status(200).json({ status: 'success', category });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'deleted' });

  res.status(201).json({
    status: 'success',
    message: 'Product have been deleted',
  });
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  createCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
};
