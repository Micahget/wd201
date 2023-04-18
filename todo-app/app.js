/* eslint-disable */

const express = require("express");
var csrf = require("tiny-csrf");
// define cookie parser
var cookieParser = require("cookie-parser");
const app = express(); // here we are creating an instance of express
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path"); // here we are using path module to get the path of the public folder
app.set("views", path.join(__dirname, "views")); // here we are setting the path of the views folder
app.use(express.static(path.join(__dirname, "public"))); // here we are using path module to get the path of the public folder.

// import authentication middlewares
const passport = require("passport");
const session = require("express-session");
const connectEnsureLogin = require("connect-ensure-login");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// connect flash message
const flash = require("connect-flash");
app.use(flash());



app.use(bodyParser.json());

const saltRounds = 10;

/* this is to post data from the form. It 
is a middleware that parses incoming requests with urlencoded payloads and is based on body-parser. It is used to parse the data that the user submits in the form. And it is used to parse the data that is sent in the request body.*/
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

// here we are using express-session middleware to store the session data in the server memory
app.use(
  session({
    secret: "my_super_secret_key-2345235234534534534",
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  
 
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
      User.findOne({ where: { email: username } })
        .then(async function (user) {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Incorrect password."
            });
          }
        })
        .catch((error) => {
          return done(error);
        });
    }
  )
);


// implementing flash message on login
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

// tell passport how to serialize the user
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
  const loggedInUser = request.user.id;
  const overdue = await Todo.overdue(loggedInUser);
  const dueToday = await Todo.dueToday(loggedInUser);
  const dueLater = await Todo.dueLater(loggedInUser);
  const completedItem = await Todo.completedItem(loggedInUser);

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
  const { name } =request.body;
  if(!name) {
    request.flash ("error", "Please fill in all the fields");
    return response.redirect("/signup");
  }
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
app.post("/session",passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (request, response) {
    console.log(request.user);
    response.redirect("/todos");
  }
);
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
  const { name } = request.body; 
  
  if (!name || name.length < 5) {
    request.flash('error', 'Todo name must be at least 5 characters long');
    return response.redirect("/todos");
  }
    try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      userId: request.user.id,
    });
    return response.redirect("/todos")
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
}); // this method is used to create a new todo

// this method is used to update a todo
app.put("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
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
// this method is used to delete a todo
app.delete("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
  try {
    const userId = request.user.id;
    await Todo.remove(request.params.id, userId);
    return response.json({ success: true });
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }

});
module.exports = app;

