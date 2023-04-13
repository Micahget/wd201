/* eslint-disable*/
"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static getTodos() {
      return this.findAll();
    }

    markAsCompleted() {
      return this.update({ completed: true });
    }
    // I added the below 3 methods, overdue dueToday and dueLater to implement the todo app in the instaractors way
    static overdue() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
      });
    }
    static dueToday() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
      });
    }
    static dueLater() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
      });
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
