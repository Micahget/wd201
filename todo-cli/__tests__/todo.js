/* eslint-disable quotes */
/* eslint-disable no-undef */

const todoList = require("../todo1");

const { all, markAsComplete, add } = todoList();

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
  // overdue
  test("...checks retrieval of overdue items", () => {
    const overdue = all.filter((item) => {
      return item.dueDate < new Date().toISOString().slice(0, 10);
    });
    expect(overdue.length).toBe(0);
  });
  // due today
  test("...checks retrieval of due today items", () => {
    const dueToday = all.filter((item) => {
      return item.dueDate === new Date().toISOString().slice(0, 10);
    });
    expect(dueToday.length).toBe(2);
  });
  // duelater
  test("...checks retrieval of due later items", () => {
    const dueLater = all.filter((item) => {
      return item.dueDate > new Date().toISOString().slice(0, 10);
    });
    expect(dueLater.length).toBe(0);
  });
});
