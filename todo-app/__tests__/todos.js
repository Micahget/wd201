/* eslint-disable */
const request = require("supertest");

const db = require("../models/index");
const app = require("../app");
const cheerio = require("cheerio");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $('[name="_csrf"]').val();
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

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302); // 302 is a redirect status code for POST requests
    // expect(response.header["content-type"]).toBe(
    //   "application/json; charset=utf-8"
    // );
    // const parsedResponse = JSON.parse(response.text);
    // expect(parsedResponse.id).toBeDefined();
  });

  test("Marks a todo with the given ID as complete", async () => {
    let res = await agent.get("/"); //here we are getting the csrf token
    let csrfToken = extractCsrfToken(res);

    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json"); // here we are getting the todos from the database and storing them in the groupedTodosResponse variable. We are also setting the Accept header to application/json so that the response is in json format and not html

    const parsedGroupedTodosResponse = JSON.parse(groupedTodosResponse.text);
    console.log("tHIS IS MY", parsedGroupedTodosResponse);
    console.log("tHIS IS YOU", parsedGroupedTodosResponse.dueToday);
    const dueTodayCount = parsedGroupedTodosResponse.dueToday.length;
    const latestTodo = parsedGroupedTodosResponse.dueToday[dueTodayCount - 1];

    /* 
    // this one is my implementation
    const parsedGroupedTodosResponse = JSON.parse(groupedTodosResponse.text); // here we are parsing the json response to a javascript object
    const latestTodo = parsedGroupedTodosResponse[0]; // here we are getting the latest todo from the array of todos
    */

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);
    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}/`)
      .send({ _csrf: csrfToken, completed: true });

    const parsedMarkCompleteResponse = JSON.parse(markCompleteResponse.text);

    expect(parsedMarkCompleteResponse.completed).toBe(true);
  });

  // test("Fetches all todos in the database using /todos endpoint", async () => {
  //   await agent.post("/todos").send({
  //     title: "Buy xbox",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   await agent.post("/todos").send({
  //     title: "Buy ps3",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   const response = await agent.get("/todos");
  //   const parsedResponse = JSON.parse(response.text);

  //   expect(parsedResponse.length).toBe(3);
  //   expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  // });

  // test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
  //   // FILL IN YOUR CODE HERE
  //   const response = await agent.post("/todos").send({
  //     title: "Buy xbox",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });

  //   const parsedResponse = JSON.parse(response.text);
  //   const todoID = parsedResponse.id;

  //   const deleteResponse = await agent.delete(`/todos/${todoID}`).send();
  //   expect(deleteResponse.statusCode).toBe(200);
  //   expect(deleteResponse.header["content-type"]).toBe(
  //     "application/json; charset=utf-8"
  //   );

  //   expect(deleteResponse.body).toBe(true);
  // });
});
