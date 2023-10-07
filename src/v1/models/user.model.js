const { ObjectId } = require("mongodb");

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

  async function getUserById(userId) {
    return await dbConnector.getDb().collection('users').findOne({_id: ObjectId(userId)})
  }

  return {
    createUser,
    getUserByEmail,
    updateUser,
    getUserById
  }
}

module.exports = userModel