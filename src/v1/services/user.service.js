function userService(userModel) {

    async function createUser(user) {
        const userSanitized = sanitizeInput(user)
        let response = await userModel.getUserByEmail(userSanitized.email)
        if(response) return {email: userSanitized, error: 'User already exists.'}
        response = await userModel.createUser(userSanitized)
        if (!response.insertedId) return {user: userSanitized, error: 'Unable to create user.'}
        return {user: userSanitized, error: null}
    }

    return {
        createUser
    }
}
module.exports = userService

function sanitizeInput(user) {
    const email = user.email
    const address = user.address
    const service = user.service
    const agenda = []
    if(user.agenda && user.agenda.length > 0){
        user.agenda.forEach(e => {
            agenda.push({
                weekDay: e.weekDay,
                startTime: e.startTime,
                endTime: e.endTime
            })
        });
    }
    return {
        email, 
        address, 
        service, 
        agenda
    }
}
