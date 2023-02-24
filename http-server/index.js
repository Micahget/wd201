const http = require("http");
const fs = require("fs");

let homeContent = "";
let projectContent = "";

fs.readFile("home.html", (err, home) => {
    if (err) {
        throw err;
    }
    homeContent = home;
});

fs.readFile("project.html", (err, project) => {
    if (err) {
        throw err;
    }
    projectContent = project;
});
//here we are reading the registration.html file and storing it in registrationContent variable.
fs.readFile("registration.html", (err, home) => {
    if (err) {
        throw err;
    }
    registrationContent = home;
});
/*
//here we are creating the server and listening to the port 3000
http.createServer((request, response) => {
        let url = request.url;
        response.writeHeader(200, { "Content-Type": "text/html" });
        switch (url) {
            //here we are checking the url and sending the appropriate content
            case "/project":
                response.write(projectContent);
                response.end();
                break;
            case "/registration":
                response.write(registrationContent);
                response.end();
                break;
            default:
                response.write(homeContent);
                response.end();
                break;
        }
    })
    .listen(3000);
*/

//using minimist to accept cli input and using default port 3000 if no port is provided in cli
const minimist = require('minimist')
const args = minimist(process.argv.slice(2), {
   default: {
     port: 3000
      }})
const port = args.port

//here we are creating the server and listening to the cli input port
http.createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
        case "/project":
            response.write(projectContent);
            response.end();
            break;
        case "/registration":
            response.write(registrationContent);
            response.end();
            break;
        default:
            response.write(homeContent);
            response.end();
            break;
    }
}).listen(port);




