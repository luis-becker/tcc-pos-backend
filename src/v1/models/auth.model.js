function authModel(dbConnector) {

  async function retrieveAuthByEmail(email) {
    return await dbConnector.getDb().collection('auth').findOne({email})
  }

  async function createAuth(credentials) {
    return await dbConnector.getDb().collection('auth').insertOne(credentials)
  }

  async function saveToken(dbCredentials, token) {
    if(!dbCredentials.tokens) {
      return await dbConnector.getDb().collection('auth').updateOne({_id: dbCredentials._id}, {$set: {tokens: [token]}})
    } else {
      return await dbConnector.getDb().collection('auth').updateOne({_id: dbCredentials._id}, {$push: {tokens: token}})
    }
  }

  async function retrieveToken(token) {
    return await dbConnector.getDb().collection('auth').findOne({'tokens.value': token})
  }

  async function deleteToken(token) {
    return await dbConnector.getDb().collection('auth').updateOne({'tokens.value': token}, {$pull: {tokens: {value: token}}})
  }

  return {
    retrieveAuthByEmail,
    createAuth,
    saveToken,
    retrieveToken,
    deleteToken
  }
}
module.exports = authModel