const express = require('express');
const app = express();


app.get("/", (request , response) => {
    response.send("Hello World!");
}
);

// the below code is to make the server listen to port 3000
app.listen(5555, () => {
    console.log("Server is running on port 3000");
}
);