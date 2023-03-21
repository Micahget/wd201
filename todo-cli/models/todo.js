/* eslint-disable */

//The previous one
/*
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
/*
static async addTask(params) {
  return  await Todo.create(params);
}
static associate(models) {
  // define association here
}
displayableString() {
  let checkbox = this.completed ? "[x]" : "[ ]";
  return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
}
}
Todo.init({
title: DataTypes.STRING,
dueDate: DataTypes.DATEONLY,
completed: DataTypes.BOOLEAN
}, {
sequelize,
modelName: 'Todo',
});
return Todo;
};

*/ // models/todo.js
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN here
      // write a method to return the items that are overdue by using filter method
      const overdue = await Todo.overdue();
      overdue.forEach((todo) => {
        console.log(todo.displayableString());
      });

      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      // todo due today, Todo.displayableString should return a string of the format `ID. [ ] TITLE` (date should not be shown)
      const dueToday = await Todo.dueToday();
      dueToday.forEach((todo) => {
        //date should not be showen
        console.log(todo.displayableString());
      });

      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const dueLater = await Todo.dueLater();
      dueLater.forEach((todo) => {
        console.log(todo.displayableString());
      });
    }

    static async overdue() {
      // FILL IN HERE TO RETURN ITEMS OVERDUE
      // write a metho to return the items that are overdue
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      return await Todo.findAll({
        where: {
          dueDate: {
            //ReferenceError: Op is not defined. I don't know why. I have imported sequelize and Op
            [Op.eq]: new Date(),
          },
        },
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
      });
    }

    static async markAsComplete(id) {
      // FILL in here to markAsComplete the item
      return await Todo.update(
        {
          completed: true,
        },
        {
          where: {
            id: id,
          },
        }
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";

      // if the duedate in the above is dueToday then don't show the Date
      if (this.dueDate === new Date().toISOString().slice(0, 10)) {
        return `${this.id}. ${checkbox} ${this.title}`;
      } else {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
      }
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
