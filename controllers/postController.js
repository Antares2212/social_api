const getNextSequence = require('../helpers/AutoID')
const Post = require('../models/PostModel')

const createPost = async (req, res, next) => {
  try {
    const { title, content, author } = req.body
    const id = await getNextSequence('postId')

    const post = new Post({id, title, content, author})
    await post.save()
    res.status(200).json({ message: 'Пост создан' })
  } catch (err) {
    return next(err)
  }
}

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: 'id',
          as: 'authorDetails'
        }
      }
    ]).exec();
    res.status(200).json(posts)
  } catch (err) {
    return next(err)
  }
}

const getPost = async (req, res, next) => {
  try {
    const post = await Post.aggregate([
      {
        $match: { id: Number(req.params.id) }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: 'id',
          as: 'authorDetails'
        }
      }
    ]).exec()
    if (!post) {
      res.status(404).json({ message: 'Пост не найден' })
    }
    res.status(200).json(post)
  } catch (err) {
    return next(err)
  }
}

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    if (!post) {
      res.status(404).json({ message: 'Пост не найден' })
    }
    res.status(200).json(post)
  } catch (err) {
    return next(err)
  }
}

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndRemove({id: req.params.id})
    if (!post) {
      res.status(404).json({ message: 'Пост не найден' })
    }
    res.status(200).json({ message: 'Пост удален' })
  } catch (err) {
    return next(err)
  }
}

const addComment = async (req, res, next) => {
  try {
    const post = await Post.findOne({id: req.params.id}).exec()
    console.log(post.comments);
    post.comments.push(req.body)
    await post.save()
    res.status(200).json({ message: 'Комментарий создан' })
  } catch (err) {
    return next(err)
  }
}

// const deleteComment = async (req, res, next) => {
//   try {
//     const post = await Post.findOne(req.params.postId).exec();
//     post.comments.id(req.params.commentId).remove();
//     post.save();
//     res.status(200).json({ message: 'Комментарий удален' });
//   } catch (err) {
//     return next(err);
//   }
// }

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  addComment,
  // deleteComment,
  getPost
}