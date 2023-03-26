// const { DESCRIBE } = require('sequelize/types/query-types');
const request = require('supertest')

const app = require('../app')
const db = require('../models/index')

let server, agent

describe('Todo test suite', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
    server = app.listen(3000, () => { })
    agent = request.agent(server)
  })
  afterAll(async () => {
    await db.sequelize.close()
    server.close()
  })
  test('responds with json at /todos', async () => {
    const response = await agent.post('/todos').send({
      title: 'Buy Milk',
      dueDate: new Date().toISOString(),
      completed: false
    })
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
    const parsedResponse = JSON.parse(response.text)
    expect(parsedResponse.id).toBeDefined()
  })

  // test to check if the todo is marked as completed
  test('responds with json at /todos/:id/markAsCompleted', async () => {
    const response = await agent.post('/todos').send({
      title: 'Buy Milk',
      dueDate: new Date().toISOString(),
      completed: false
    })

    const parsedResponse = JSON.parse(response.text)
    const todoID = parsedResponse.id

    expect(parsedResponse.completed).toBe(false)

    const markAsCompleteResponse = await agent.put(`/todos/${todoID}/markAsCompleted`).send()
    const parsedUpdatedResponse = JSON.parse(markAsCompleteResponse.text)
    expect(parsedUpdatedResponse.completed).toBe(true)
  })
})
