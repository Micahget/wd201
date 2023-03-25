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
      const overdue = await Todo.overdue();
      overdue.forEach((todo) => {
        console.log(todo.displayableString());
      });

      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const dueToday = await Todo.dueToday();
      dueToday.forEach((todo) => {
        console.log(todo.displayableString());
      });

      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const dueLater = await Todo.dueLater();
      dueLater.forEach((todo) =>{
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
           [Op.eq]: new Date(),
          },
        },
      });
    }

    static async dueLater() {
      // FILL IN HERE
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE
      return await Todo.update({complete: true}, {where : {id: id}})
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";

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
