const Router = require('express')
const controller = require('../controllers/friendController')
const authMiddleware = require('../middleware/authMiddleware')

const router = new Router()

router.get('/:id', authMiddleware, controller.getFriends)
router.post('/request', authMiddleware, controller.addFriendRequest)
router.post('/add', authMiddleware, controller.acceptFriendRequest)
router.delete('/delete', authMiddleware, controller.deleteFriend)

module.exports = router
