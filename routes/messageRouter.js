const Router = require('express')
const controller = require('../controllers/messageController')
const authMiddleware = require('../middleware/authMiddleware')

const router = new Router()

router.get('/', authMiddleware, controller.getAllMessages)
router.post('/create', authMiddleware, controller.createMessage)

module.exports = router
