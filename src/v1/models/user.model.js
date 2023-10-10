const { Schema, model } = require('mongoose')
const validator = require('validator')

let agendaSchema = new Schema({
  weekDay: Number,
  startTime: {hour: Number, minute: Number},
  endTime: {hour: Number, minute: Number},
}, {_id: false})

let userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function (value) {
      return validator.isEmail(value)
    },
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  service: {
    type: String,
  },
  agenda: {
    type: [agendaSchema],
    validate: function (value) {
      let isValid = true
      value.forEach(e => {
        if (e.weekDay < 0 || e.weekDay > 6) isValid = false
        if (e.startTime.hour < 0 || e.startTime.hour > 23) isValid = false
        if (e.startTime.minute < 0 || e.startTime.minute > 59) isValid = false
        if (e.endTime.hour < 0 || e.endTime.hour > 23) isValid = false
        if (e.endTime.minute < 0 || e.endTime.minute > 59) isValid = false
        
        if (e.startTime.hour > e.endTime.hour) isValid = false
        if (e.startTime.hour === e.endTime.hour && e.startTime.minute > e.endTime.minute) isValid = false
      })
      return isValid
    },
  }
})

module.exports = model('User', userSchema)
