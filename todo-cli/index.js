/* eslint-disable */
const { connect } = require("./connectDB.js"); // this is the connection to the database.
const { count } = require("./TodoModel.js");
const Todo = require("./TodoModel.js"); // this is the model for the table.

const createTodo = async (title, dueDate, completed) => {
  try {
    await connect();
    const todo = await Todo.addTodo({
      title: title,
      dueDate: dueDate,
      completed: completed,
    });

    console.log(`Created todo with ID : ${todo.id}`);
  } catch (error) {
    console.error(error);
  }
};

const countItems = async () => {
  try {
    const totalCount = await Todo.count();
    console.log(`Found ${totalCount} items in the database`);
  } catch (error) {
    console.error(error);
  }
};
// to fetch the data from the table
const getAllTodos = async () => {
  try {
    const todos = await Todo.findAll();
    const pring = todos.map((todo) => todo.displayableString()).join("\n");
    console.log(pring);
  } catch (error) {
    console.error(error);
  }
};

// to get single todo

const getSingleTodo = async () => {
  try {
    const todo = await Todo.findOne({
      where: {
        completed: false,
      },
      order: [["id", "DESC"]],
    });
    console.log(todo.displayableString());
  } catch (error) {
    console.error(error);
  }
};

// to update the data in the table
const updatItem = async (title, dueDate, completed) => {
  try {
    await Todo.update(
      {
        title: title,
        dueDate: dueDate,
        completed: completed,
      },
      {
        where: {
          id: 4,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

// deleteing the data from the table
const deleteItem = async (id) => {
  try {
    const deletedRowCount = await Todo.destroy({
      where: {
        id: id,
      },
    });
    console.log(`Number of rows deleted: ${deletedRowCount}`);
  } catch (error) {
    console.error(error);
  }
};

// this is the main function that will be called when the script is run. It is called an IIFE (Immediately Invoked Function Expression).
// (async () => {

//     // await createTodo("Fourth stuff", new Date(), true);
//     // await countItems();
//     await getAllTodos();
//     console.log("After Delete")
//     await deleteItem(5);
//     // await updatItem("Fourth stuff", new Date(), false);
//     await getAllTodos();
//     // await getSingleTodo();
// })();

/*
    this is to show the asyncronus nature of javascript

*/
// getAllTodos();
// countItems(); // this will be printed first even if it is not called first because of the the asyncronus nature of javascript. To avoid this we can use async await or promises.

/*

    this is to show the async await nature of javascript

*/
const run = async () => {
  await getAllTodos();
  await countItems();
};

run(); // now the output will be printed in the correct order. because the run function is async and it will wait for the getAllTodos and countItems to finish before printing the output.

// invoking the fun anoniomus function
(async () => {
  await getAllTodos();
  await countItems();
})();
