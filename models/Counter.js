// models/Counter.js
module.exports = (sequelize, DataTypes) => {
  const Counter = sequelize.define('Counter', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    value: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'Counters',
    timestamps: false,
  });

  return Counter;
};
