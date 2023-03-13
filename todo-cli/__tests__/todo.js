//import todo.js
const todoList = require('../todo1');

const {all, markAsComplete, add, dueDate} = todoList();

describe('todoList test suite', () => {
    beforeAll(()  => 
    {
        add({
            title: 'buy milk',
            completed: false,
            dueDate: new Date().toISOString().slice(0, 10)
        })

    })
    test('add a todo item', () => {
const todoCount = all.length;
        add({
            title: 'buy milk',
            completed: false,
            dueDate: new Date().toISOString().slice(0, 10)
        })
        // expect(all).toHaveLength(1)
        expect(all.length).toBe(todoCount + 1)
    })

    test('mark as complete', () =>
    {
        expect(all[0].completed).toBe(false)
        markAsComplete(0)
        expect(all[0].completed).toBe(true)
    })

})