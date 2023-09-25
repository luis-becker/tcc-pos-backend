const { MongoClient } = require('mongodb')

const database = process.env.MONGO_DATABASE
const databaseUser = process.env.MONGO_USER
const databasePassword = process.env.MONGO_PASSWORD

class dbConnector {
  static db
  static client
  static connect = async () => {
    if (this.db) return
    this.client = new MongoClient(this.getConnectionString(database, databaseUser, databasePassword))
    await this.client.connect()
    this.db = this.client.db(database);
    console.log('Connected to database!')
  }

  static close = async () => {
    if(this.client) this.client.close()
    console.log('Connection to database closed.')
  }

  static getConnectionString = (database, user, password) => {
    return 'mongodb://' + user + ':' + password + '@mongodb:27017/' + database
  }

}

module.exports = dbConnector