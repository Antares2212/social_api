const { Schema, model } = require('mongoose')

const CommentModel = new Schema({
  text: {type: String, require: true},
  user: {type: Number, ref: 'User'},
  date: {type: Date, default: Date.now},
  message: {type: Number, ref: 'Message'}
})

module.exports = model('Comment', CommentModel)