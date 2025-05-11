const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const Position = sequelize.define('position', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  mail: { type: DataTypes.STRING, unique: true, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: true },
  positionId: { type: DataTypes.INTEGER, unique: false, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: true },
  middleName: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.STRING, defaultValue: 'USER', allowNull: false },
  phone: { type: DataTypes.STRING, unique: false, allowNull: false, defaultValue: '' },
  birth: { type: DataTypes.DATEONLY, unique: false, allowNull: true },

  isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
});

const Pet = sequelize.define('pet', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: false, allowNull: true, defaultValue: '' },
    nameEng: { type: DataTypes.STRING, unique: false, allowNull: true, defaultValue: '' },
    sex: { type: DataTypes.STRING, unique: false, allowNull: true },
    birth: { type: DataTypes.DATEONLY, unique: false, allowNull: true },
    breed: { type: DataTypes.STRING, unique: false, allowNull: true },
    type: { type: DataTypes.STRING, unique: false, allowNull: true },
    feautures: { type: DataTypes.TEXT, unique: false, allowNull: true, defaultValue: '' },
    clientId: { type: DataTypes.INTEGER, allowNull: false },

    isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
  },
  {
    indexes: [
      {
        fields: ['nameEng'],
        using: 'gin',
        operator: 'gin_trgm_ops',
        concurrently: true,
      },
    ],
  },
);

const Client = sequelize.define('client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    surname: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: true },
    middleName: { type: DataTypes.STRING, allowNull: true },
    fullNameEng: { type: DataTypes.STRING, allowNull: true },
    birth: { type: DataTypes.DATEONLY, unique: false, allowNull: true },
    mail: { type: DataTypes.STRING, unique: true, allowNull: true },
    phone: { type: DataTypes.STRING, unique: false, allowNull: false, defaultValue: '' },

    isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
  },
  {
    indexes: [
      {
        fields: ['fullNameEng'],
        using: 'gin',
        operator: 'gin_trgm_ops',
        concurrently: true,
      },
    ],
  },
);

const Appointment = sequelize.define('appointment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clientId: { type: DataTypes.INTEGER, allowNull: false },
  petId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: false },
  note: { type: DataTypes.TEXT, allowNull: true },
  sum: { type: DataTypes.FLOAT, allowNull: false },

  isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
});

const Service = sequelize.define('service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  servicesGroupId: {type: DataTypes.INTEGER, allowNull: true},

  isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
});

const ServicesGroup = sequelize.define('servicesGroup', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: false },
});

const AppointmentService = sequelize.define('appointmentService', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  appointmentId: { type: DataTypes.INTEGER, allowNull: false },
  serviceId: { type: DataTypes.INTEGER, allowNull: false },
});

const Product = sequelize.define('product', 
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: false, allowNull: false, defaultValue: '' },
    nameEng: { type: DataTypes.STRING, unique: false, allowNull: false, defaultValue: '' },
    price: { type: DataTypes.FLOAT, unique: false, allowNull: false, defaultValue: 0 },
    count: { type: DataTypes.INTEGER, unique: false, defaultValue: 0 },
    
    isForService: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
    isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
  },
  {
    indexes: [
      {
        fields: ['nameEng'],
        using: 'gin',
        operator: 'gin_trgm_ops',
        concurrently: true,
      },
    ],
  }
);

const Sale = sequelize.define('sale', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  clientId: { type: DataTypes.INTEGER, allowNull: true },
  sum: { type: DataTypes.FLOAT, allowNull: false },

  isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
});

const SaleProduct = sequelize.define('saleProduct', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  saleId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

const Purchase = sequelize.define('purchase', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  note: { type: DataTypes.TEXT, unique: false, allowNull: false, defaultValue: '' },
  sum: { type: DataTypes.FLOAT, allowNull: false },

  isDeleted: { type: DataTypes.BOOLEAN, unique: false, defaultValue: false },
});

const PurchaseProduct = sequelize.define('purchaseProduct', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  purchaseId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

Sale.belongsTo(User)
User.hasMany(Sale);
Sale.belongsTo(Client)
Client.hasMany(Sale);

Purchase.belongsTo(User)
User.hasMany(Purchase);

Service.belongsTo(ServicesGroup)
ServicesGroup.hasMany(Service);

SaleProduct.belongsTo(Sale);
Sale.hasMany(SaleProduct);
SaleProduct.belongsTo(Product);
Product.hasMany(SaleProduct);

PurchaseProduct.belongsTo(Purchase);
Purchase.hasMany(PurchaseProduct);
PurchaseProduct.belongsTo(Product);
Product.hasMany(PurchaseProduct);

Appointment.belongsTo(Client);
Client.hasMany(Appointment);
Appointment.belongsTo(User);
User.hasMany(Appointment);

Pet.belongsTo(Client);
Client.hasMany(Pet);

AppointmentService.belongsTo(Appointment);
Appointment.hasMany(AppointmentService);
Appointment.belongsTo(Pet);
Pet.hasMany(Appointment);
AppointmentService.belongsTo(Service);
Service.hasMany(AppointmentService);

User.belongsTo(Position);

module.exports = {
  User,
  Product,
  Sale,
  SaleProduct,
  Appointment,
  Client,
  Service,
  AppointmentService,
  Position,
  Pet,
  Purchase,
  PurchaseProduct,
  ServicesGroup
};
