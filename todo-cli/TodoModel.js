/* eslint-disable */

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("./connectDB.js");

class Todo extends Model {
  // create a static method to create a todo item. which will be used in the index.js file. and its useful to perform validations on the data before saving it to the database.
  static async addTodo(params) {
    return await Todo.create(params);
  }

  displayableString() {
    return `${this.id} ${this.title} ${this.dueDate} ${this.completed}`;
  }
}

Todo.init(
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    completed: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
  }
); // here the name of the table is todo

Todo.sync();
module.exports = Todo;
