function userModel(dbConnector){
  
  async function createUser(user) {
    return await dbConnector.getDb().collection('users').insertOne(user)
  }

  return {
    createUser
  }
}

module.exports = userModel