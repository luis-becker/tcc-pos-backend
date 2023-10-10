function userService(userModel) {

    async function createUser(params, email) {
        params.email = email
        let user = new userModel(params)
        user.agenda.forEach(e => {
            e.validate()
        });
        return await user.save()
    }

    async function retrieveUserByEmail(email) {
        return await userModel.findOne({ email: email })
    }

    async function updateUser(params, userId) {
        let filter = { _id: userId }
        let update = params
        delete update?.email
        let opts = { new: true , runValidators: true}
        return await userModel.findOneAndUpdate(filter, update, opts)
    }

    async function retrieveUserById(userId) {
        let user = await userModel.findOne({ _id: userId })
        delete user?._doc?.email
        return user
    }

    async function retrieveUserById(userId) {
        const user = await userModel.findOne({ _id: userId })
        delete user?._doc.email
        return user
    }

    return {
        createUser,
        retrieveUserByEmail,
        updateUser,
        retrieveUserById
    }
}
module.exports = userService
