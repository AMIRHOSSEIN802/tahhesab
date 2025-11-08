module.exports = (sequelize, DataTypes) => {
  const LastRequest = sequelize.define('LastRequest', {
    timestamp: { type: DataTypes.DATE }
  }, {
    timestamps: true
  });

  return LastRequest;
};
