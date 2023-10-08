function scheduleController(scheduleService) {

  async function createSchedule(req, res) {
    const {schedule, err} = await scheduleService.createSchedule(req.body, req.email)
    if(err) {
      err == 'Schedule conflict.' ? res.status(409) : res.status(500)
      res.send(err)
      return
  }
  res.status(201).send(schedule)
  return
  }

  return {
    createSchedule
  }
}

module.exports = scheduleController