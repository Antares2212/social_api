const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/add', authMiddleware, postController.createPost)
router.get('/', authMiddleware, postController.getAllPosts)
router.get('/:id', authMiddleware, postController.getPost)
router.put('/edite/:id', authMiddleware, postController.updatePost)
router.delete('/delete/:id', authMiddleware, postController.deletePost)
router.post('/add-comment/:id', authMiddleware, postController.addComment)

module.exports = router