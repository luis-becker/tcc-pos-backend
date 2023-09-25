const dbConnector = require('../utils/dbConnector')

const userModel = {}

userModel.createUser = async (user) => {
  return await dbConnector.db.collection('users').insertOne(user)
}

module.exports = userModel