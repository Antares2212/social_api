const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const Role = require('../models/RoleModel')
const User = require('../models/UserModel')

const { secret } = require('../config')
const getNextSequence = require('../helpers/AutoID')

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  }

  return jwt.sign(payload, secret, {expiresIn: "24h"})
}

const registration = async (req, res) => {
  try {
    const { username, password, email } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({message: 'Ошибка при регистрации!', errors})
    }

    const candidate = await User.findOne({ $or: [{username: username}, {email: email}] })
    if (candidate) {
      if (candidate.username === username) {
        return res.status(400).json({message: 'Пользователь с таким именем уже существует!'})
      } else if (candidate.email === email) {
        return res.status(400).json({message: 'Пользователь с такой почтой уже существует!'})
      }  
    }
    
    const hashPassword = bcrypt.hashSync(password, 7)
    const userRole = await Role.findOne({value: 'USER'})
    const id = await getNextSequence('id')

    const user = new User({username, email, password: hashPassword, roles: [userRole.value], id: id})
    await user.save()

    return res.json({message: 'Пользователь был успешно зарегистрирован!'})

  } catch (error) {
    console.log(error)
    res.status(400).json({message: 'Ошибка при реистрации'})
  }
}

const login = async (req, res) => {
  try {
    const data = req.body
 
    const user = await User.findOne({username: data.username})
    if (!user) {
      return res.status(400).json({message: `Пользователь ${data.username} не найден!`})
    }

    const validPassword = bcrypt.compareSync(data.password, user.password)
    if (!validPassword) {
      return res.status(400).json({message: `Введен неверный пароль`})
    }

    const { password, ...profile } = user.toJSON()

    const token = generateAccessToken(user.id, user.roles)
    return res.json({token, profile})

  } catch (error) {
    console.log(error)
    res.status(400).json({message: 'Login error'})
  }
}

module.exports = {
  registration,
  login
}