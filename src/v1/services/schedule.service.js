function scheduleService(scheduleModel) {

  async function createSchedule(params) {
    let schedule = new scheduleModel(params)
    return await schedule.save()
  }

  async function retrieveSchedules(userEmail) {
    let schedules = await scheduleModel.find({ $or: [{ 'owner.email': userEmail }, { 'attendee.email': userEmail }] }).select('-owner.email -attendee.email')
    return schedules
  }

  return {
    createSchedule,
    retrieveSchedules
  }
}

module.exports = scheduleService