const { Schema, model } = require("mongoose")

const SequenceModel = new Schema({
  name: { type: String, required: true },
  value: { type: Number, default: 0 }
})

module.exports = model('Sequence', SequenceModel)