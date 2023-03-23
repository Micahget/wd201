const express = require('express');
const app = express();


app.get("/", (request, response) => {
    response.send("Hello World!");
}); // here we are listening get request on the root route. if we want to listen post request we can use app.post() method

// the below code is to make the server listen to port 3000
// app.listen(3000);
app.listen(5555, () => {
    console.log("Server is running on port 3000");
}
);