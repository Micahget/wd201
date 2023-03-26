// const { DESCRIBE } = require('sequelize/types/query-types');
const request = require('supertest');

const app = require('../app');
const db = require('../models/index');

let server, agent;

describe("Todo test suite", () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        server = app.listen(3000, () => {}); // here i am getting error. It says app.listen is not a function. this happened b/c of the way i am exporting the app from app.js. I am exporting the app as a function. To avoid this error, i can export the app as an object. Exapmel: module.exports = { app: app, server: server }
        agent = request.agent(server); // 
    });
    afterAll(async () => {
        await db.sequelize.close();
        server.close();
    });
    test('responds with json at /todos', async () => {
        const response = await agent.post('/todos').send({
            'title': 'Buy Milk',
            dueDate: new Date().toISOString(),
            completed: false
        });
        expect(response.statusCode).toBe(200);
        expect(response.header["content-type"]).toBe('application/json; charset=utf-8');
        const parsedResponse = JSON.parse(response.text);
        expect(parsedResponse.id).toBeDefined();
    });

});
