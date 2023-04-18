/* eslint-disable */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todo, {
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
