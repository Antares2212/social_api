const bcrypt = require('bcryptjs')

const Role = require('../models/RoleModel')
const User = require('../models/UserModel')
const getNextSequence = require('../helpers/AutoID')

const createNewUser = async (req, res) => {
  const { username, password, email} = req.body
  const id = await getNextSequence('id')

  try {
    const candidat = await User.findOne({ $or: [{username: username}, {email: email}] })
    if (candidat) {
      if (candidat.username === username) {
        return res.status(400).json({message: 'Пользователь с таким именем уже существует!'})
      } else if (candidat.email === email) {
        return res.status(400).json({message: 'Пользователь с такой почтой уже существует!'})
      }  
    }

    const hashPassword = bcrypt.hashSync(password, 7)
    const userRole = await Role.findOne({value: 'USER'})

    const user = new User({username, email, password: hashPassword, roles: [userRole.value], id: id})
    await user.save()

    return res.json({message: 'Пользователь был успешно создан'})
  } catch (error) {
    console.log(error)
    res.status(500).send('Серверная ошибка')
  }
}

const editUser = async (req, res) => {
  try {
    const { id, ...editeFieald} = req.body
    const updatedUser = await User.findOneAndUpdate({id: req.params.id}, editeFieald, {new: true})
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send('Серверная ошибка')
  }
}

const getUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findOne({ id: id }).select('-password')
    
    if (!user) {
      return res.status(200).json({message: `Пользователь не найден`})
    }
    res.json(user)
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: `Ошибка при поиске пользователя`})
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Ошибка сервера'})
  }
}

const deleteUser = async (req, res) => {
  try {
    const candidate = await User.findOne({id: req.params.id})
    
    if (candidate) {
      await User.deleteOne({id: req.params.id})
      res.status(200).json({message: 'Пользователь успешно удален'})
    } else {
      res.status(300).json({message: 'Пользователь не найден'})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Ошибка сервера'})
  }
}

module.exports = {
  createNewUser,
  getUser,
  getUsers,
  editUser,
  deleteUser
}