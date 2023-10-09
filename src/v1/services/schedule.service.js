const { default: mongoose } = require("mongoose")

function scheduleService(scheduleModel) {

  async function createSchedule(params, userId) {
    params.attendee = { ref: userId }
    let schedule = new scheduleModel(params)
    return await schedule.save()
  }

  async function retrieveSchedules(userId) {
    userRef = new mongoose.Types.ObjectId(userId)
    let schedules = await scheduleModel.find({ $or: [{ 'owner.ref': userRef }, { 'attendee.ref': userRef }] })
    return schedules
  }

  async function retrieveSchedule(id, userId) {
    let schedule = await scheduleModel.findOne({ _id: id, $or: [{ 'owner.ref': userId }, { 'attendee.ref': userId }] })
    return schedule
  }

  async function cancelSchedule(id, userId) {
    let schedule = await scheduleModel.findOne({ _id: id, $or: [{ 'owner.ref': userId }, { 'attendee.ref': userId }] })
    if (!schedule) return null
    schedule.canceled = true
    return await schedule.save()
  }

  return {
    createSchedule,
    retrieveSchedules,
    retrieveSchedule,
    cancelSchedule
  }
}

module.exports = scheduleService