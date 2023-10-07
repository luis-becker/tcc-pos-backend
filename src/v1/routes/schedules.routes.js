const express = require('express')

function scheduleRouter(authMiddleware, scheduleController) {

  const router = express.Router()

  router.use(authMiddleware.authorization)

  router.post('/', scheduleController.createSchedule)
  // router.get('/', scheduleController.retrieveSchedules)
  // router.get('/:id', scheduleController.retrieveSchedule)
  // router.delete('/:id', scheduleController.deleteSchedule)


  return router
}
module.exports = scheduleRouter
