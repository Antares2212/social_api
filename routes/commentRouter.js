const Router = require('express')
const controller = require('../controllers/commentController')
const authMiddleware = require('../middleware/authMiddleware')

const router = new Router()

router.get('/', authMiddleware, controller.getAllComments)
router.post('/create', authMiddleware, controller.createNewComment)

module.exports = router
