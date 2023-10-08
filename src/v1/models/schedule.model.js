const { Schema, model } = require('mongoose')

let userSchema = new Schema({
  ref: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    require: true
  }
}, { _id: false })

let timeSchema = new Schema({
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true,
    validate: function (value) {
      return this.start < value;
    }
  },
}, { _id: false })

let scheduleSchema = new Schema({
  owner: userSchema,
  attendee: userSchema,
  service: {
    type: String
  },
  address: {
    type: String
  },
  time: timeSchema,
  canceled: {
    type: Boolean
  }
})

module.exports = model('Schedule', scheduleSchema)