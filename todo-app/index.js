const express = require('express');
const app = express();


//routing in express.js is a way to define the different routes in our application. we can define different routes for different HTTP methods. for example, we can define a route for GET request and a different route for POST request. we can also define a route for a specific URL. for example, we can define a route for /users URL. we can also define a route for a specific HTTP method and URL. for example, we can define a route for GET request on /users URL. Get request is used to get data from the server. Post request is used to send data to the server. Put request is used to update data on the server. Delete request is used to delete data from the server. 
app.get("/todos", (request, response) => {
    response.send("Todo list");
}); 

app.post("/todos", (request, response) => {
    console.log("Creating a todo", request.body);
});

app.put("/todos/:id/markAsCompleted", (request, response) => {
    console.log("Marking a todo as completed", request.params.id);// here we use param.id cuz the id is a parameter in the path of the url
});

app.delete("/todos/:id", (request, response) => {
    console.log("Deleting a todo", request.params.id);
});
// the below code is to make the server listen to port 3000
// app.listen(3000);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
}
);