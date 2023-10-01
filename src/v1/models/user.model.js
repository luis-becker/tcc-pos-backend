function userModel(dbConnector){
  
  async function createUser(user) {
    return await dbConnector.getDb().collection('users').insertOne(user)
  }

  async function getUserByEmail(email) {
    return await dbConnector.getDb().collection('users').findOne({email})
  }

  return {
    createUser,
    getUserByEmail
  }
}

module.exports = userModel