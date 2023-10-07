function userService(userModel) {

    async function createUser(user) {
        const userSanitized = sanitizeInput(user)
        let response = await userModel.getUserByEmail(userSanitized.email)
        if (response) return { email: userSanitized, error: 'User already exists.' }
        response = await userModel.createUser(userSanitized)
        if (!response.insertedId) return { user: userSanitized, error: 'Unable to create user.' }
        return { user: userSanitized, error: null }
    }

    async function retrieveUser(email) {
        return await userModel.getUserByEmail(email)
    }

    async function updateUser(user) {
        const userSanitized = sanitizeInput(user)
        let result = await userModel.updateUser(userSanitized)
        if (!result.matchedCount || result.matchedCount == 0) return null
        return await userModel.getUserByEmail(userSanitized.email)
    }

    async function retrieveUserById(userId) {
        return await userModel.getUserById(userId)
    }

    return {
        createUser,
        retrieveUser,
        updateUser,
        retrieveUserById
    }
}
module.exports = userService

function sanitizeInput(user) {
    const email = user.email
    const address = user.address
    const service = user.service
    const agenda = []
    if (user.agenda && user.agenda.length > 0) {
        user.agenda.forEach(e => {
            if (!agendaItemIsValid(e)) return
            agenda.push({
                weekDay: e.weekDay,
                startTime: {
                    hour: e.startTime.hour,
                    minute: e.startTime.minute
                },
                endTime: {
                    hour: e.endTime.hour,
                    minute: e.endTime.minute
                }
            })
        });
    }
    sanitizedUser = {}
    if (email) sanitizedUser.email = email
    if (address) sanitizedUser.address = address
    if (service) sanitizedUser.service = service
    if (agenda.length > 0) sanitizedUser.agenda = agenda
    return sanitizedUser
}

function agendaItemIsValid(agendaItem) {
    if (!agendaItem) return false
    if (!agendaItem.weekDay) return false
    if (!agendaItem.startTime) return false
    if (!agendaItem.startTime.hour) return false
    if (!agendaItem.startTime.minute) return false
    if (!agendaItem.endTime) return false
    if (!agendaItem.endTime.hour) return false
    if (!agendaItem.endTime.minute) return false

    if (agendaItem.weekDay < 1 || agendaItem.weekDay > 7) return false
    if (agendaItem.startTime.hour < 0 || agendaItem.startTime.hour > 23) return false
    if (agendaItem.startTime.minute < 0 || agendaItem.startTime.minute > 59) return false

    if (agendaItem.endTime.hour < 0 || agendaItem.endTime.hour > 23) return false
    if (agendaItem.endTime.minute < 0 || agendaItem.endTime.minute > 59) return false

    if (agendaItem.startTime.hour > agendaItem.endTime.hour) return false
    if (agendaItem.startTime.hour == agendaItem.endTime.hour && agendaItem.startTime.minute >= agendaItem.endTime.minute) return false

    return true
}