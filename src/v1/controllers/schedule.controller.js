const { ValidationError, CastError } = require("mongoose").Error

function scheduleController(scheduleService, notificationService) {

  async function createSchedule(req, res) {
    try {
      const schedule = await scheduleService.createSchedule(req.body, req.userId)

      const dateString = schedule.time.start.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const parts = dateString.split('/')
      const month = parts[0]
      const day = parts[1]
      notificationService.createNotification({ userRef: req.body.owner.ref, message: `${req.user.name} marcou um horário no dia ${day}/${month}.` })

      res.status(201).send(schedule)
    }
    catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).send(err.message)
      } else if (err.message == 'Owner not found.') {
        res.status(400).send(err.message)
      } else if (err.message == 'Invalid schedule time.') {
        res.status(400).send(err.message)
      } else {
        res.status(500).send(err.message)
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
      else {
        const dateString = schedule.time.start.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const parts = dateString.split('/')
        const month = parts[0]
        const day = parts[1]
        const user = schedule.owner.ref == req.userId.toString() ? schedule.attendee : schedule.owner
        notificationService.createNotification({ userRef: user.ref, message: `${req.user.name} cancelou o horário do dia ${day}/${month}.` })

        res.send(schedule)
      }
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