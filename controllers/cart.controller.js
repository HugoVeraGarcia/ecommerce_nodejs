const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { AppError } = require('../utils/appError');

const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');

// utils
const { catchAsync } = require('../utils/catchAsync');

const addCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  //create Cart
  const cart = await Cart.create({ userId: sessionUser.id });
  res.status(200).json({
    cart,
  });
});

const addProduct = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { sessionUser } = req;

  let idCart;

  //VALIDATE STOCK
  const product = await Product.findOne({
    where: { id: productId, status: 'active' },
  });
  //validate the product exists
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  //stock enough
  if (product.quantity < quantity) {
    return next(
      new AppError(`Not enough stock, current stock = ${product.quantity}`, 400)
    );
  }

  //FIND CART
  const cart = await Cart.findOne({ userId: sessionUser.id, status: 'active' });

  if (!cart) {
    //create Cart
    const newCart = await Cart.create({ userId: sessionUser.id });
    idCart = newCart.id;
  } else {
    idCart = cart.id;
  }

  //FIND CART
  const cartSecondFind = await Cart.findOne({
    userId: sessionUser.id,
    status: 'active',
  });

  if (cartSecondFind.status === 'removed') {
    //update Cart
    await cartSecondFind.update({ status: 'active' });
    idCart = cartSecondFind.id;
  }

  //FIND PRODUCTINCART
  const productInCart = await ProductInCart.findOne({
    where: { cartId: idCart, productId },
  });
  //doesnt exist
  if (!productInCart) {
    //add product
    const newProductInCart = await ProductInCart.create({
      cartId: idCart,
      productId,
      quantity,
    });
  } else {
    //exists but removed
    if (productInCart.status === 'removed') {
      //update status
      await productInCart.update({ status: 'active', quantity });
    }
    //VALIDATE PRODUCT DOES NOT EXIST IN PRODUCTINCART
    if (productInCart.status === 'active') {
      return next(new AppError('You cannot add this product again', 400));
    }
  }
  res.status(200).json({
    productInCart,
  });
});

const updateCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { sessionUser } = req;

  //find Cart
  const cart = await Cart.findOne({ userId: sessionUser.id });

  //find productInCart
  const productInCart = await ProductInCart.findOne({
    where: { cartId: cart.id, productId },
  });

  //find stock
  const product = await Product.findOne({
    where: { id: productId, status: 'active' },
  });
  //validate the product exists
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  //stock enough
  if (product.quantity < quantity) {
    return next(new AppError('Not enough stock', 400));
  }
  //verify status productInCart
  if (productInCart.status === 'removed' && quantity > 0) {
    await productInCart.update({ status: 'active', quantity });
  }
  if (productInCart.status === 'active' && quantity > 0) {
    await productInCart.update({ quantity });
  }
  //remove if quantity = 0
  if (quantity === 0 && productInCart.status === 'active') {
    await productInCart.update({ quantity, status: 'removed' });
  }
  res.status(200).json({ status: 'success' });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { sessionUser } = req;

  //FIND CART
  const cart = await Cart.findOne({ where: { userId: sessionUser.id } });
  if (!cart || cart.status === 'removed') {
    return next(new AppError('Cart not found', 404));
  }

  const productInCart = await ProductInCart.findOne({ productId });
  if (!productInCart || productInCart.status === 'removed') {
    return next(new AppError('Product not found', 404));
  }

  await productInCart.update({ status: 'removed', quantity: 0 });

  res.status(201).json({
    status: 'success',
    message: `User account has been deleted`,
  });
});

const purchaseCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { sessionUser } = req;

  //FIND CART
  const cart = await Cart.findOne({ where: { userId: sessionUser.id } });
  if (!cart || cart.status === 'removed') {
    return next(new AppError('Cart not found', 404));
  }

  const productInCart = await ProductInCart.findOne({ productId });
  if (!productInCart || productInCart.status === 'removed') {
    return next(new AppError('Product not found', 404));
  }

  await productInCart.update({ status: 'removed', quantity: 0 });

  res.status(201).json({
    status: 'success',
    message: `User account has been deleted`,
  });
});

module.exports = {
  addProduct,
  updateCart,
  deleteProduct,
  purchaseCart,
  addCart,
};
