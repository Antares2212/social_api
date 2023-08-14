const Message = require('../models/MessageModel');

// Создать сообщение
const createMessage = async (req, res, next) => {
  const { text } = req.body
  try {
    const user = req.user.id
    const message = new Message({ text, user })

    await message.save()
    res.status(200).json(message)
  } catch (err) {
    next(err)
  }
};

// Получить все сообщения
const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    return next(err);
  }
};

// Получить сообщение по id
const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId)
      .populate('user')
      .exec();
    if (!message) {
      res.status(404).json({ message: 'Сообщение не найдено' });
    }
    res.status(200).json(message);
  } catch (err) {
    return next(err);
  }
};

// Обновить сообщение
const updateMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { $set: req.body },
      { new: true }
    );
    if (!message) {
      res.status(404).json({ message: 'Сообщение не найдено' });
    }
    res.status(200).json(message);
  } catch (err) {
    return next(err);
  }
};

// Удалить сообщение
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndRemove(
      req.params.messageId
    ).exec();
    if (!message) {
      res.status(404).json({ message: 'Сообщение не найдено' });
    }
    res.status(200).json({ message: 'Сообщение удалено' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createMessage,
  getAllMessages,
  getMessage,
  updateMessage,
  deleteMessage
}