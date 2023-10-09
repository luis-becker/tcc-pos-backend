const { ValidationError, CastError } = require("mongoose").Error

function scheduleController(scheduleService) {

  async function createSchedule(req, res) {
    try {
      const schedule = await scheduleService.createSchedule(req.body, req.userId)
      res.status(201).send(schedule)
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
      const schedules = await scheduleService.retrieveSchedules(req.userId)
      res.send(schedules)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async function retrieveSchedule(req, res) {
    try {
      const schedule = await scheduleService.retrieveSchedule(req.params.id, req.userId)
      if (!schedule) res.status(404).send('Schedule not found.')
      else res.send(schedule)
    } catch (err) {
      if (err instanceof CastError) res.status(400).send('Invalid id.')
      else res.status(500).send(err.message)
    }
  }

  async function cancelSchedule(req, res) {
    try {
      const schedule = await scheduleService.cancelSchedule(req.params.id, req.userId)
      if (!schedule) res.status(404).send('Schedule not found.')
      else res.send(schedule)
    } catch (err) {
      if (err instanceof CastError) res.status(400).send('Invalid id.')
      else res.status(500).send(err.message)
    }
  }


  return {
    createSchedule,
    retrieveSchedules,
    retrieveSchedule,
    cancelSchedule
  }
}

module.exports = scheduleController