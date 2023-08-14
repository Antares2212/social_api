const Friend = require('../models/FriendModel')
const User = require('../models/UserModel')

const checkUser = async (id) => {
  const user = await User.findOne({id: id})
  if (!user) {
    throw new Error('Пользователя с таким id не существует')
  }
  return user
}

const checkFriendship = async (user, friend) => {
  const existingFriendship = await Friend.findOne({
    user: user,
    friends: { user: friend }
  })

  if (existingFriendship) {
    throw new Error('Пользователи уже являются друзьями')
  }
}

const addFriendRequest = async (req, res) => {
  try {
    const { id, friendId } = req.body

    await checkUser(id)
    await checkUser(friendId)
    await checkFriendship(id, friendId)

    // Создание записи о заявке в поле requests
    await Friend.updateOne(
      {user: id},
      {$addToSet: {requests: { user: friendId, status: 'pending'}}},
      {new: true, upsert: true}
    )

    res.status(201).json({message: 'Заявка на добавление в друзья успешно отправлена'})
  } catch (error) {
    console.log(error)
    res.status(400).json({message: error.message})
  }
}

const acceptFriendRequest = async (req, res) => {
  try {
    const { id, friendId } = req.body

    await checkUser(id)
    await checkUser(friendId)
    await checkFriendship(id, friendId)

    // Поиск записи о заявке для подтверждения
    const friendship = await Friend.findOneAndUpdate(
      {user: id, 'requests.user': friendId, 'requests.status': 'pending'},
      {$set: {'requests.$.status': 'accepted'}},
      {new: true}
    )

    if (!friendship) {
      throw new Error('Не удалось подтвердить заявку в друзья')
    }

    // Добавление друга в массив friends для обоих пользователей
    await Friend.findOneAndUpdate(
      { user: id },
      { $addToSet: { friends: { user: friendId } } }
    )

    await Friend.findOneAndUpdate(
      { user: friendId },
      { $addToSet: { friends: { user: id } } }
    )

    res.status(200).json({message: 'Пользователь успешно добавлен в друзья'})
  } catch (error) {
    console.log(error)
    res.status(400).json({message: error.message})
  }
}

const getFriends = async (req, res, next) => { 
  
  const { id } = req.params

  try { 
    await checkUser(id)
    const friends = await Friend.findOne({ user: id })

    if (!friends) {
      const error = new Error('У этого пользователя нет друзей');
      error.status = 404;
      throw error;
    }

    res.json(friends.friends.map(friend => friend))

  } catch (error) { 
    next(error) 
  } 
}

const deleteFriend = async (req, res) => { 
  const { id, friendId } = req.body

  try { 
    await checkUser(id) 
    await checkUser(friendId)

    const existingFriendship = await Friend.findOne({
      user: id,
      friends: { user: friendId }
    })

    if (existingFriendship) {
      await Friend.updateMany(
        { user: { $in: [id, friendId] } },
        { $pull: { friends: { user: friendId } } }
      )
      res.status(200).json({ message: 'Пользователь успешно удален из друзей' })
    } else {
      throw new Error('Пользователи не являются друзьями')
    }

  } catch (error) { 
    console.log(error) 
    res.status(500).send({ message: 'Ошибка сервера' }) 
  } 
}

// Функция, возвращающая список общих друзей для двух пользователей
const findCommonFriends = async (id, friendId) => {
  // Получаем список друзей для пользователей
  const [userFriends, friendFriends] = await Promise.all([
      Friend.findOne({ user: id }).populate('friends'),
      Friend.findOne({ user: friendId }).populate('friends'),
  ])

  // Получаем список друзей id для каждого пользователя
  const userFriendIds = userFriends.friends.map(friend => friend._id.toString())
  const friendFriendIds = friendFriends.friends.map(friend => friend._id.toString())

  // Находим общих друзей и возвращаем их список
  return userFriendIds.filter(friendId => friendFriendIds.includes(friendId))
}

module.exports = {
  acceptFriendRequest,
  addFriendRequest,
  getFriends,
  deleteFriend,
  findCommonFriends
}