/* eslint-disable */
//The below commented code is mine.
/*
const express = require('express')
const app = express()
const { Todo } = require('./models')
const bodyParser = require('body-parser') // this is a middleware that parses the body of the request and puts it in the request.body object
app.use(bodyParser.json()) // this is a middleware that parses the body of the request and puts it in the request.body object
*/
/*
//routing in express.js is a way to define the different routes in our application. we can define different routes for different HTTP methods. for example, we can define a route for GET request and a different route for POST request. we can also define a route for a specific URL. for example, we can define a route for /users URL. we can also define a route for a specific HTTP method and URL. for example, we can define a route for GET request on /users URL. Get request is used to get data from the server. Post request is used to send data to the server. Put request is used to update data on the server. Delete request is used to delete data from the server.
*/
/*
app.get('/todos', (request, response) => {
  response.send('Todo list')
})

app.post('/todos', async (request, response) => {
  console.log('Creating a todo', request.body)
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false
    })
    return response.json(todo)
  } catch (error) {
    return response.status(422).json({ error: error.message })
  }
})

app.put('/todos/:id/markAsCompleted', async (request, response) => {
  // here todos is
  console.log('Marking a todo as completed', request.params.id) // here we use param.id cuz the id is a parameter in the path of the url
  const todo = await Todo.findByPk(request.params.id)
  try {
    const updatedToDo = await todo.markAsCompleted()
    return response.json(updatedToDo)
  } catch (error) {
    console.log(error)
    return response.status(422).json(error)
  }
})
app.delete('/todos/:id', (request, response) => {
  console.log('Deleting a todo', request.params.id)
})

// //fetch the data from database and print it in the console
// const fetchTodos = async () => {
//     const todos = await Todo.findAll();
//     console.log(todos.map(todo => todo.toJSON()));
// }
// fetchTodos();

module.exports = app
*/

const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path"); // here we are using path module to get the path of the public folder
app.use(bodyParser.json());



// set the view engine to ejs
app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")) {
    response.render("index", { allTodos });
  } else {
    response.json(allTodos);

  }
});


// to render files from the public folder
app.use(express.static(path.join(__dirname, 'public')))// here we are using path module to get the path of the public folder

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
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
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
    const todo = await Todo.findByPk(request.params.id);
    // if todo exists
    if (todo) {
      await todo.destroy();
      return response.json(true);
    }
    return response.json(false);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
});

module.exports = app;
