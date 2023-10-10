const { Schema, model } = require('mongoose')
const validator = require('validator')

let tokenSchema = new Schema({
  value: String,
  expirationDate: Date,
}, {_id: false})

let authSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function (value) {
      return validator.isEmail(value)
    },
  },
  password: {
    type: String,
    required: true,
    validate: function (value) {
      return validator.isHash(value, 'sha512')
    },
  },
  salt: {
    type: String,
    required: true,
  },
  tokens: {
    type: [tokenSchema],
    validate: function (value) {
      let isValid = true
      value.forEach(e => {
        if(!validator.isHash(e.value, 'sha512')) isValid = false
      })
      return isValid
    },
  }
})

module.exports = model('Auth', authSchema)
