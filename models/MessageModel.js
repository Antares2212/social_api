const { Schema, model } = require('mongoose')

const MessageModel = new Schema({
  text: {type: String, require: true, maxlength: 100},
  user: {type: Number, ref: 'User'},
  date: {type: Date, default: Date.now}
})

module.exports = model('Message', MessageModel)