let mongoose = require('mongoose')

const host = process.env.MONGO_DATABASE || 'mongodb:27017'
const database = process.env.MONGO_DATABASE
const databaseUser = process.env.MONGO_USER
const databasePassword = process.env.MONGO_PASSWORD

async function connect() {
  await mongoose.connect(`mongodb://${databaseUser}:${databasePassword}@${host}/${database}`)
  console.log('Connected to database!')
}


module.exports = {connect}