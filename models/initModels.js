// Models
const { User } = require('./user.model');
const { Product } = require('./product.model');
const { Cart } = require('./cart.model');
const { Order } = require('./order.model');
const { ProductInCart } = require('./productInCart.model');
const { ProductImg } = require('./productImg.model');
const { Category } = require('./category.models');

const initModels = () => {
  // one user <–—> many product
  User.hasMany(Product);
  Product.belongsTo(User);

  // one user <---> many order
  User.hasMany(Order);
  Order.belongsTo(User);

  // one user <---> one cart
  User.hasOne(Cart);
  Cart.belongsTo(User);

  // one product <---> many productImg
  Product.hasMany(ProductImg);
  ProductImg.belongsTo(Product);

  // one product <---> one productInCart
  Product.hasOne(ProductInCart);
  ProductInCart.belongsTo(Product);

  // one Category <---> many product  //it's what I think
  Category.hasMany(Product);
  Product.belongsTo(Category);

  // one cart <---> many productInCart
  Cart.hasMany(ProductInCart);
  ProductInCart.belongsTo(Cart);

  // one cart <---> one order
  Cart.hasOne(Order);
  Order.belongsTo(Cart);
};

module.exports = { initModels };
