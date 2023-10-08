function scheduleService(scheduleModel) {

  async function createSchedule(params) {
    let schedule = new scheduleModel(params)
    return await schedule.save()
  }

  return {
    createSchedule
  }
}

module.exports = scheduleService