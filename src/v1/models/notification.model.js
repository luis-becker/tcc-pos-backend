const { Schema, model } = require('mongoose')

let notificationSchema = new Schema({
  userRef: {
    type: Schema.Types.ObjectId,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  acked: Boolean
})

module.exports = model('Notification', notificationSchema)