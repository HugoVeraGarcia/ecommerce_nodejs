const { Product } = require('../models/product.model');
const { Category } = require('../models/category.models');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const productExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id, status: 'active' },
    include: { model: Category },
  });

  if (!product) {
    return next(new AppError(`Product not found given that id: ${id}`, 404));
  }

  //add user data to request
  req.product = product;

  next();
});

const categoryExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOne({
    where: { id, status: 'active' },
    //include: [{ model: User }],
  });

  if (!category) {
    return next(new AppError(`Category not found given that id: ${id}`, 404));
  }

  //add user data to request
  req.category = category;

  next();
});

const protectProductOwner = catchAsync(async (req, res, next) => {
  // Get current session user and the user that is going to be updated
  const { sessionUser } = req;
  const { id } = req.params;

  // find userid
  const product = await Product.findOne({ where: { id } });
  // Compare the id's
  if (sessionUser.id !== product.userId) {
    // If the ids aren't equal, return error
    return next(new AppError('You do not own this account', 403));
  }

  // If the ids are equal, the request pass
  next();
});

module.exports = { productExist, categoryExist, protectProductOwner };
