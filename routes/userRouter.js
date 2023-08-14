const Router = require('express')
const controller = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const currentUserMiddleware = require('../middleware/currentMiddleware')

const router = new Router()

router.get('/', authMiddleware, controller.getUsers)
router.get('/user/:id', [authMiddleware, currentUserMiddleware], controller.getUser)
router.put('/edite/:id', authMiddleware, controller.editUser)
router.delete('/delete/:id', [authMiddleware, roleMiddleware(['ADMIN'])], controller.deleteUser)
router.post('/create', [authMiddleware, roleMiddleware(['ADMIN'])], controller.createNewUser)

module.exports = router
