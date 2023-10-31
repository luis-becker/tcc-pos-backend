const express = require('express')

function notificationRouter(authMiddleware, notificationController) {

  const router = express.Router()
  router.use(authMiddleware.authorization)
  router.get('/', notificationController.retrieveNotifications)
  router.post('/ack', notificationController.ackNotifications)

  return router
}
module.exports = notificationRouter
