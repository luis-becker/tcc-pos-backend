const { ValidationError } = require("mongoose").Error

function scheduleController(scheduleService) {

  async function createSchedule(req, res) {
    try {
      const schedule = await scheduleService.createSchedule(req.body, req.email)
      res.send(schedule)
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).send(err.message)
      } else {
        res.status(500).send('Service Unavailable.')
      }
    }
  }

  async function retrieveSchedules(req, res) {
    try {
      const schedules = await scheduleService.retrieveSchedules(req.email)
      res.send(schedules)
    } catch (err) {
      res.status(500).send('Service Unavailable.')
    }
  }

  return {
    createSchedule,
    retrieveSchedules
  }
}

module.exports = scheduleController