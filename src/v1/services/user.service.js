function userService(userModel, scheduleModel) {

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
        if (user) {
            delete user._doc.email
            let schedules = await scheduleModel.find({'owner.ref': userId, canceled: undefined})
            user._doc.schedules = schedules.reduce((acc, e) => {
                if(!e.canceled) {
                    acc.push({
                        startTime: e.time.start,
                        endTime: e.time.end
                    })
                }
                return acc
            }, [])
        }
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
