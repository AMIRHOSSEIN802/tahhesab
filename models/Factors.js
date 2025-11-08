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
      type: DataTypes.DATE,
      allowNull: true,
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

  return Factors;
};
