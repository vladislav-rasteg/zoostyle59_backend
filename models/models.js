const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: false, allowNull: true, defaultValue: '' },
  mail: { type: DataTypes.STRING, unique: true, allowNull: true },
  phone: { type: DataTypes.STRING, unique: false, allowNull: false, defaultValue: '' },
  password: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.STRING, defaultValue: 'USER', allowNull: false },
  prevCodeDatetime: { type: DataTypes.DATE, allowNull: true },
  wrongRecoveryCodeAttempts: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: true },
  recoveryCode: { type: DataTypes.STRING, unique: false, allowNull: true, defaultValue: '' },
  category: { type: DataTypes.STRING, unique: false, allowNull: false, defaultValue: 'Basic' },
  discount: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: true },
  total: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: true },
});

const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: false, allowNull: false, defaultValue: '' },
  link: { type: DataTypes.STRING, unique: true, allowNull: false, defaultValue: '' },
  description: { type: DataTypes.TEXT, unique: true, allowNull: false, defaultValue: '' },
  parentId: { type: DataTypes.INTEGER, unique: false, allowNull: true },
  isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
});

const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: false, allowNull: false, defaultValue: '' },
  description: { type: DataTypes.TEXT, unique: false, allowNull: false, defaultValue: '' },
  link: { type: DataTypes.STRING, unique: true, allowNull: false, defaultValue: '' },
  images: { type: DataTypes.JSON, unique: false, allowNull: false},
  price: { type: DataTypes.FLOAT, unique: false, allowNull: false, defaultValue: 0 },
  old_price: { type: DataTypes.FLOAT, unique: false, allowNull: false, defaultValue: 0 },
  categoryId: { type: DataTypes.INTEGER, unique: false, allowNull: true },
  count: { type: DataTypes.INTEGER, unique: false, defaultValue: 0 },
  
  about: { type: DataTypes.TEXT, unique: false, allowNull: false, defaultValue: '' },
  
  weight: { type: DataTypes.INTEGER, unique: false, allowNull: true },
  variation: {type: DataTypes.ARRAY(DataTypes.STRING)},
  processing: {type: DataTypes.ARRAY(DataTypes.STRING)},
  fermentation: {type: DataTypes.ARRAY(DataTypes.STRING)},
  region: { type: DataTypes.STRING, allowNull: true },
  farmer: { type: DataTypes.STRING, allowNull: true },
  keyDescriptor: { type: DataTypes.STRING, allowNull: true },
  
  isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
});

const Order = sequelize.define('order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  sum: { type: DataTypes.FLOAT, allowNull: false },
});

const OrderProduct = sequelize.define('orderProduct', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

const CartProduct = sequelize.define('cartProduct', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  session: { type: DataTypes.UUID, allowNull: true },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

const RecipeCategory = sequelize.define('recipeCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, unique: false, allowNull: false},
  description: { type: DataTypes.TEXT, unique: false, allowNull: false},
  imageUrl: { type: DataTypes.STRING, unique: false, allowNull: false, defaultValue: '' },
  previewUrl: { type: DataTypes.STRING, unique: false, allowNull: false, defaultValue: '' },
  
  isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
});

const Recipe = sequelize.define('recipe', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  link: { type: DataTypes.STRING, unique: true, allowNull: false, defaultValue: '' },
  recipeCategoryId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.TEXT, unique: false, allowNull: false},
  steps: { type: DataTypes.JSON, unique: false, allowNull: false},
  productId: { type: DataTypes.INTEGER, allowNull: true },
  
  isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
});

Product.belongsTo(Category)
Category.hasMany(Product);

Order.belongsTo(User)
User.hasMany(Order);

OrderProduct.belongsTo(Product)
Product.hasMany(OrderProduct);
OrderProduct.belongsTo(Order)
Order.hasMany(OrderProduct);

CartProduct.belongsTo(Product)
Product.hasMany(CartProduct);
CartProduct.belongsTo(User)
User.hasMany(CartProduct);

Recipe.belongsTo(Product)
Product.hasMany(Recipe);
Recipe.belongsTo(RecipeCategory)
RecipeCategory.hasMany(Recipe);

module.exports = {
  User,
  Category,
  Product,
  Order,
  OrderProduct,
  CartProduct,
  Recipe,
  RecipeCategory
};
