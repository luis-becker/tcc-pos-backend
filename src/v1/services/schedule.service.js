function scheduleService(Schedule) {

  async function createSchedule(params) {
    let schedule = new Schedule(params)
    let {insertedId} = await schedule.save()
    if (!insertedId) return { schedule: schedule, err: 'Unable to create schedule.' }
    return {schedule: schedule, err: null}
  }

  return {
    createSchedule
  }
}

module.exports = scheduleService

function checkConflicts(shedule, listOfSchedules) {

}