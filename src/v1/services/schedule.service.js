const { default: mongoose } = require("mongoose")

function scheduleService(scheduleModel, userModel) {

  async function createSchedule(params, userId) {
    params.attendee = { ref: userId }
    let schedule = new scheduleModel(params)
    await schedule.validate()
    let owner = await userModel.findOne({ _id: schedule.owner.ref })
    if (!owner) throw Error('Owner not found.')
    let ownerSchedules = await scheduleModel.find({'owner.ref' : owner._id})
    if(!checkOwnerSchedules(schedule, owner, ownerSchedules)) throw Error('Invalid schedule time.')
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

function checkOwnerSchedules(schedule, owner, ownerSchedules) {

  isValidTime = owner.agenda.reduce((acc, ownerTime) => {
    let weekDay = schedule.time.start.getDay()
    let start = {hour: schedule.time.start.getHours(), minute: schedule.time.start.getMinutes()}
    let end = {hour: schedule.time.end.getHours(), minute: schedule.time.end.getMinutes()}

    if(ownerTime.weekDay != weekDay) return acc
    if(ownerTime.startTime.hour != start.hour) return acc
    if(ownerTime.startTime.minute != start.minute) return acc
    if(ownerTime.endTime.hour != end.hour) return acc
    if(ownerTime.endTime.minute != end.minute) return acc
    return true
  }, false)
  
  isFree = ownerSchedules.reduce((acc, e) => {
    let start1 = e.time.start
    let end1 = e.time.end
    let start2 = schedule.time.start
    let end2 = schedule.time.end

    if ((start1 < end2 && end1 > start2) || (start2 < end1 && end2 > start1)) {
      return false
    }
      return acc
  }, true)

  return isValidTime && isFree
}