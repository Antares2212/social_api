const { Schema, model } = require('mongoose')

const PostModel = Schema(
  {
    id: { type: Number, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Number, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: Number, ref: 'User' }],
    comments: [{
      user: { type: Number, ref: 'User' },
      text: { type: String, ref: 'Comment' }
    }]
  },
  {
    timestamps: true
  }
);

module.exports = model('Post', PostModel);