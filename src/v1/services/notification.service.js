function notificationService(notificationModel) {

  async function retrieveNotifications(userId) {
    return await notificationModel.find({ userRef: userId, acked: { $ne: true } }).select('message')
  }

  async function ackNotifications(notificationsIds) {
    await notificationModel.updateMany(
      { _id: { $in: notificationsIds } },
      { $set: {acked: true} })
    return true
  }

  async function createNotification(params) {
    let notification = notificationModel(params)
    return await notification.save()
  }

  return {
    retrieveNotifications,
    ackNotifications,
    createNotification
  }
}

module.exports = notificationService