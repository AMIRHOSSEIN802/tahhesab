const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('fadakTest', 'root', 'Et3uuKLaY2yJxSEESTwboqju', {
  host: 'vinson.liara.cloud',
  port: 34971,
  dialect: 'mysql',
  logging: false
});

const Factors = require('./Factors')(sequelize, DataTypes);
const LastRequest = require('./LastRequest')(sequelize, DataTypes);
const Counter = require('./Counter')(sequelize, DataTypes);

const db = {
  sequelize,
  Sequelize,
  Factors,
  LastRequest,
  Counter
};

module.exports = db;
