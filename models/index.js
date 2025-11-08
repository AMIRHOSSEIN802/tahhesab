const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('fadakTest', 'root', 'Et3uuKLaY2yJxSEESTwboqju', {
  host: 'vinson.liara.cloud',
  port: 34971,
  dialect: 'mysql',
  logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Factors = require('./Factors')(sequelize, DataTypes);
db.LastRequest = require('./LastRequest')(sequelize, DataTypes);

module.exports = db;
