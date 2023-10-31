function notificationController(notificationService) {

  async function retrieveNotifications(req, res) {
    try {
      const notifications = await notificationService.retrieveNotifications(req.userId)
      res.send(notifications)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async function ackNotifications(req, res) {
    try {
      const acked = await notificationService.ackNotifications(req.body)
      if(acked) {
        res.send()
      } else {
        res.status(500).send("Could not ack notification")
      }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  return {
    retrieveNotifications,
    ackNotifications
  }
}

module.exports = notificationController