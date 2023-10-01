const { MongoClient } = require('mongodb')

function dbConnector() {

  const database = process.env.MONGO_DATABASE
  const databaseUser = process.env.MONGO_USER
  const databasePassword = process.env.MONGO_PASSWORD

  let db
  let client

  async function connect() {
    if (db) return
    client = new MongoClient(getConnectionString(database, databaseUser, databasePassword))
    await client.connect()
    db = client.db(database);
    console.log('Connected to database!')
  }

  async function close() {
    if (client) client.close()
    console.log('Connection to database closed.')
  }

  async function getDb() {
    if(!db) await connect()
    return db
  }

  return {
    connect,
    close,
    getDb
  }
}
module.exports = dbConnector

function getConnectionString(database, user, password) {
  return 'mongodb://' + user + ':' + password + '@mongodb:27017/' + database
}
