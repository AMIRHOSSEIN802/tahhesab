module.exports = (sequelize, DataTypes) => {
  const Factors = sequelize.define("Factors", {
    Factor_Code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    ZamanSabt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    isCheck: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  Factors.beforeCreate((factor, options) => {
    if (factor.ZamanSabt) {
      factor.ZamanSabt = `${factor.ZamanSabt} 00:00:00`;
    } else {
      factor.ZamanSabt = "00:00:00";
    }
  });

  return Factors;
};
