/* eslint-disable */
const request = require("supertest");

const db = require("../models/index");
const app = require("../app");
const cheerio = require("cheerio"); 
const passport = require("passport");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $('[name="_csrf"]').val();
}

// helper function for login
const login = async (agent, username, password) => {
  let res = await agent.get("/login")
  let csrfToken = extractCsrfToken(res)
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken
  })
}

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {}); // we use differet port for testing to avoid conflicts
    agent = request.agent(server);
  });


  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  // test to sign up a user
  test("Signs up a user", async () => {
    //signup is the route
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "John",
      lastName: "Doe",
      email: "doe@gmail.com",
      password: "12345",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  // // sign out test
  test("sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);

    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  })
  
  // test to create a todo
  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const agent = request.agent(server);
    await login(agent, "doe@gmail.com", "12345");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo with the given ID as complete", async () => {
    let res = await agent.get("/todos"); //here we are getting the csrf token
    let csrfToken = extractCsrfToken(res);

    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");

    const parsedGroupedTodosResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedTodosResponse.dueToday.length;
    const latestTodo = parsedGroupedTodosResponse.dueToday[dueTodayCount - 1];
    const id = latestTodo.id;
    console.log("id", id);

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}/`)
      .send({ _csrf: csrfToken, completed: true });

    const parsedMarkCompleteResponse = JSON.parse(markCompleteResponse.text);

    expect(parsedMarkCompleteResponse.completed).toBe(true);
  });

  // test to check if the item is unmarked
  test("Marks a todo with the given ID as incomplete", async () => {
    let res = await agent.get("/todos"); //here we are getting the csrf token
    let csrfToken = extractCsrfToken(res);

    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");

    const parsedGroupedTodosResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedTodosResponse.dueToday.length;
    const latestTodo = parsedGroupedTodosResponse.dueToday[dueTodayCount - 1];
    const id = latestTodo.id;
    console.log("id", id);

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const markIncompleteResponse = await agent
      .put(`/todos/${latestTodo.id}/`)
      .send({ _csrf: csrfToken, completed: false });

    const parsedMarkCompleteResponse = JSON.parse(markIncompleteResponse.text);

    expect(parsedMarkCompleteResponse.completed).toBe(false);
  });

// test to delete todo
  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);

    const response = await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedTodosResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedTodosResponse.dueToday.length;
    const latestTodo = parsedGroupedTodosResponse.dueToday[dueTodayCount - 1];
    // get the id of letestTodo
    const todoID = latestTodo.id;
    console.log("debug id", todoID);

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const deleteResponse = await agent
      .delete(`/todos/${todoID}`)
      .send({ _csrf: csrfToken });

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    expect(deleteResponse.body.success).toBe(true);
  }); 
});
