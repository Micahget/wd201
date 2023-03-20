// connectDB.js

const Sequelize = require('sequelize')

const database = 'todo_db'
const username = 'postgres'
const password = 'mypostgres'
const sequelize = new Sequelize(database, username, password, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false // to disable the logging of the sql queries.
})

const connect = async () => {
  return sequelize.authenticate()
}

module.exports = {
  connect,
  sequelize
}
