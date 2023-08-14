const Router = require('express')
const { check } = require('express-validator')
const controller = require('../controllers/authController')

const router = new Router()

router.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('email', 'Почта введена не коректно').isEmail(),
    check('password', 'Пароль должен быть меньше 4 и не больше 10 символов').isLength(4, 10),
  ], controller.registration)
router.post('/login', controller.login)

module.exports = router