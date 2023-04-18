/* eslint-disable */

const express = require("express");
var csrf = require("tiny-csrf");
// define cookie parser
var cookieParser = require("cookie-parser");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path"); // here we are using path module to get the path of the public folder

// import authentication middlewares
const passport = require("passport");
const session = require("express-session");
const connectEnsureLogin = require("connect-ensure-login");
const LocalStrategy = require("passport-local").Strategy;

// password encryption 
const bcrypt = require("bcrypt");

// connect flash message
const flash = require("connect-flash");
app.use(flash());



const saltRounds = 10;
app.use(bodyParser.json());

/* this is to post data from the form. It 
is a middleware that parses incoming requests with urlencoded payloads and is based on body-parser. It is used to parse the data that the user submits in the form. And it is used to parse the data that is sent in the request body.*/
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

// configure passport.js to use the session
app.use(
  session({
    secret: "my_super_secret_key-2345235234534534534",
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

// to render files from the public folder
app.use(express.static(path.join(__dirname, "public"))); // here we are using path module to get the path of the public folder


// set the view engine to ejs
app.set("view engine", "ejs");



// configure passport.js to use the local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({
        where: {
          email: username
        }
      }).then((user) => {
        (async (user) => {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        })(user);
      }).catch((error) => {
        return done(error);
      });
    }
    )
    );
    
    // tell passport how to serialize the user
    /* here serialize means 
 convert an object into a string. And deserialize 
means to convert a string into an object.
 So, here we are telling passport how to convert the user object into a string. And we are using the user id to do that. 
 the reson why we are serializing 
is b/c we want to store the user id in the session.
 And we want to store the user id in the session b/c we want to know which user is logged in. */
passport.serializeUser((user, done) => {
  console.log("serializing user in session ", user.id);
  done(null, user.id);
});

// tell passport how to deserialize the user
passport.deserializeUser((id, done) => {
  User.findByPk(id).then((user) => {
    console.log("deserializing user in session ", user.id);
    done(null, user);
  }).catch((error) => {
    done(error, null);
  });
});


/*// we add this get route to
 render t
 he index.ejs file in the views folder and pass the data to it using the allTodos variable which is an array of all the todos in the database
 
// this one is my implementation. TO USE THIS, YOU SHOULD MAKE SOME CHANGES IN THE TODOS
.EJS FILE AND TODO.JS FILE IN TESTS FOLDER.
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

// this is root route and it is public
app.get("/", async (request, response) => {
  response.render("index", {
    title: "Todo Application",
    csrfToken: request.csrfToken(),
  });
  
});

/*// here this 
page is private page and it is protected by the authentication middleware that is what connectEnsureLogin.ensureLoggedIn() does */
app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  const completedItem = await Todo.completedItem();

  if (request.accepts("html")) {
    response.render("todos", {
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
});


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

// render the login page
app.get("/signup", function (request, response) {
  response.render("signup", { title: "Signup", csrfToken: request.csrfToken() });
});


// creating users route to render the signup.ejs file
app.post("/users", async function (request, response) {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,

    });
    // here we should initialize the session
    request.login(user, (error) => {
      if (error) {
        console.log(error);
        return response.status(422).json(error);
      }
      return response.redirect("/todos");
    })
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// render the login page
app.get("/login", function (request, response) {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() }); // here the title is located in the login.ejs file  
});

// creating session route to render the login.ejs file
app.post("/session", passport.authenticate('local', {
  failureRedirect: "/login"
}), (request, response) => {
  response.redirect("/todos");
});

// creating logout route to render the login.ejs file
app.get("/signout", (request, response, next) => {
  request.logout((error) => { //logout is a method provided by passport
    if (error) { return next(error); }
    return response.redirect("/"); // redirect to the landing page
  });
});


// this method is used to create a new todo
app.post("/todos", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  console.log("Processing new Todo ...", request.user);
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      userId: request.user.id,
    });
    return response.redirect("/todos");
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
