let mongoose = require('mongoose')

const host = process.env.MONGO_HOST || 'mongodb:27017'
const database = process.env.MONGO_DATABASE
const databaseUser = process.env.MONGO_USER
const databasePassword = process.env.MONGO_PASSWORD

class Database {
  constructor() {
    this._connect()
  }
  async _connect() {
    try {
      await mongoose.connect(`mongodb://${databaseUser}:${databasePassword}@${host}/${database}`)
      console.log('Database connection successful')
    } catch (err) {
      console.error('Database connection error:', err)
    }
  }
}


module.exports = new Database