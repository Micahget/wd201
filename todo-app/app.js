const express = require('express');
const app = express();
const { Todo } = require('./models')
const bodyParser = require('body-parser');// this is a middleware that parses the body of the request and puts it in the request.body object
app.use(bodyParser.json());// this is a middleware that parses the body of the request and puts it in the request.body object

/*
//routing in express.js is a way to define the different routes in our application. we can define different routes for different HTTP methods. for example, we can define a route for GET request and a different route for POST request. we can also define a route for a specific URL. for example, we can define a route for /users URL. we can also define a route for a specific HTTP method and URL. for example, we can define a route for GET request on /users URL. Get request is used to get data from the server. Post request is used to send data to the server. Put request is used to update data on the server. Delete request is used to delete data from the server. 
*/

app.get("/todos", (request, response) => {
    response.send("Todo list");
});

app.post("/todos", async (request, response) => {
    console.log("Creating a todo", request.body);
    try {
        const todo = await Todo.addTodo({ title: request.body.title, dueDate: request.body.dueDate, completed: false });
        return response.json(todo);

    }
    catch (error) {
        return response.status(422).json({ error: error.message });
    }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {//here todos is 
    console.log("Marking a todo as completed", request.params.id);// here we use param.id cuz the id is a parameter in the path of the url
    const todo = await Todo.findByPk(request.params.id);
    try {
        const updatedToDo = await todo.markAsCompleted();
        return response.json(updatedToDo)
    }
    catch (error) {
        console.log(error)
        return response.status(422).json(error);
    }
});

app.delete("/todos/:id", (request, response) => {
    console.log("Deleting a todo", request.params.id);
});



// //fetch the data from database and print it in the console
// const fetchTodos = async () => {
//     const todos = await Todo.findAll();
//     console.log(todos.map(todo => todo.toJSON()));
// }
// fetchTodos();

module.exports = app;