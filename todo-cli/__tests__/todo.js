/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable no-undef */

const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();
const getRandomDateInFuture = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 100 * Math.random());
  return tomorrow.toISOString().slice(0, 10);
};
const getRandomDateInPast = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 100 * Math.random());
  return yesterday.toISOString().slice(0, 10);
};

describe("todoList test suite", () => {
  beforeAll(() => {
    add({
      title: "buy milk",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });
  test("A test that checks creating a new todo", () => {
    const todoCount = all.length;
    add({
      title: "study",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoCount + 1);
  });

  test("...checks marking a todo as completed", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  // Overdue
  test("retrieval of overdue items", () => {
    const overdueItems = overdue(); // directly used the method instead of writing the logic for filter
    expect(overdueItems.length).toBe(0);
    add({
      title: "Finish the assignment",
      dueDate: getRandomDateInPast(),
      completed: false,
    });
    expect(overdue().length).toBe(overdueItems.length + 1);
  });
  // due today
  test("retrieval of due today's items", () => {
    const duetodayItems = dueToday(); // directly used the method instead of writing the logic for filter
    expect(duetodayItems.length).toBe(2);
    add({
      title: "Finish the assignment",
      // get todays Date
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
    });
    expect(dueToday().length).toBe(duetodayItems.length + 1);
  });
  // duelater
  test("retrieval of duelater items", () => {
    const duelaterItems = dueLater(); // directly used the method instead of writing the logic for filter
    expect(duelaterItems.length).toBe(0);
    add({
      title: "Finish the assignment",
      // get random day in future
      dueDate: getRandomDateInFuture(),
      completed: false,
    });
    expect(dueLater().length).toBe(duelaterItems.length + 1);
  });
});
