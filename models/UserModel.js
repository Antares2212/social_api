const { Schema, model } = require('mongoose')

const UserModel = new Schema({
  id: { type: Number, unique: true },
  username: {type: String, unique: true, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  roles: [{type: String, ref: 'Role'}],
  avatar: [{type: String, default: 'https://placehold.it/150x150'}]
})

module.exports = model('User', UserModel)