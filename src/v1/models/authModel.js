const dbConnector = require('../utils/dbConnector')

const authModel = {}

authModel.retrieveAuthByEmail = async (email) => {
  return await dbConnector.db.collection('auth').findOne({email})
}

authModel.createAuth = async (credentials) => {
  return await dbConnector.db.collection('auth').insertOne(credentials)
}

authModel.saveToken = async (dbCredentials, token) => {
  if(!dbCredentials.tokens) {
    return await dbConnector.db.collection('auth').updateOne({_id: dbCredentials._id}, {$set: {tokens: [token]}})
  } else {
    return await dbConnector.db.collection('auth').updateOne({_id: dbCredentials._id}, {$push: {tokens: token}})
  }
}

authModel.retrieveToken = async (token) => {
  return await dbConnector.db.collection('auth').findOne({'tokens.value': token})
}

authModel.deleteToken = async (token) => {
  return await dbConnector.db.collection('auth').updateOne({'tokens.value': token}, {$pull: {tokens: {value: token}}})
}

module.exports = authModel