function userModel(dbConnector){
  
  async function createUser(user) {
    return await dbConnector.getDb().collection('users').insertOne(user)
  }

  async function getUserByEmail(email) {
    return await dbConnector.getDb().collection('users').findOne({email})
  }

  async function updateUser(user) {
    const updateDoc = {
      $set: user
    };
    return await dbConnector.getDb().collection('users').updateOne({"email": user.email}, updateDoc)
  }

  return {
    createUser,
    getUserByEmail,
    updateUser
  }
}

module.exports = userModel