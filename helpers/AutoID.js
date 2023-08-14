const Sequence = require('../models/SequenceModel')

async function getNextSequence (name) {
  return await Sequence.findOneAndUpdate(
    { name: name },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  ).then((result) => result.value);
}

module.exports = getNextSequence