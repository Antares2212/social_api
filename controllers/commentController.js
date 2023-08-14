const Comment = require("../models/CommentModel")

const createNewComment = async (req, res, next) => {
  const { text } = req.body
  try {
    const user = req.user.id
    const message = req.params.id
    const comment = new Comment({ text, user, message })

    await comment.save()
    res.status(200).json(comment)
  } catch (error) {
    next(error)
  }
} 

const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({message: req.params.id}).populate('user', ['id', 'avatar'])
    res.status(200).json(comments)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createNewComment,
  getAllComments
}