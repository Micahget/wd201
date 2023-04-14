/* eslint-disable */

const express = require("express");
var csrf = require("tiny-csrf");
// define cookie parser
var cookieParser = require("cookie-parser");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path"); // here we are using path module to get the path of the public folder
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
/* this is to post data from the form. It is a middleware that parses incoming requests with urlencoded payloads and is based on body-parser. It is used to parse the data that the user submits in the form. And it is used to parse the data that is sent in the request body.*/
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

// set the view engine to ejs
app.set("view engine", "ejs");

/*// we add this get route to render the index.ejs file in the views folder and pass the data to it using the allTodos variable which is an array of all the todos in the database*/

/*
// this one is my implementation. TO USE THIS, YOU SHOULD MAKE SOME CHANGES IN THE TODOS.EJS FILE AND TODO.JS FILE IN TESTS FOLDER.
app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")) {
    // if the browser
    response.render("index", {
      allTodos,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json(allTodos);
  }
}); 
*/

app.get("/", async (request, response) => {
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  const completedItem = await Todo.completedItem();

  if (request.accepts("html")) {
    response.render("index", {
      title: "Todo Application",
      overdue,
      dueToday,
      dueLater,
      completedItem,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      overdue,
      dueToday,
      dueLater,
      completedItem,
    });
  }
}); // the above code is not working b/c the overdue, dueToday and dueLater are not defined in the Todo model. Now they have been defined.

// to render files from the public folder
app.use(express.static(path.join(__dirname, "public"))); // here we are using path module to get the path of the public folder

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE
  try {
    const todos = await Todo.findAll();
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    // get the value of completed in /todos/:id/completed
    const completed = request.body.completed;
    const updatedTodo = await todo.setCompletionStatus(completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
