const { Schema, model} = require('mongoose');

const friendModel = new Schema({
  user: { type: Number, ref: 'User', required: true },
  friends: { type: Array, user: { type: Number, ref: 'User', } },
  requests: {
    type: Array,
    user: { type: Number, ref: 'User', },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected'], 
      default: 'pending' 
    } 
  }
}, { timestamps: true })

module.exports = model('Friend', friendModel)