const { default: mongoose } = require("mongoose");

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Внутренняя ошибка сервера';

  const errorResponse = {
    error: (err instanceof mongoose.CastError) ? 'Недопустимый ID записи' :
           (err instanceof mongoose.ValidationError) ? Object.keys(err.errors).reduce((result, key) => {
              result[key] = err.errors[key].message
              return result
           }, {}) : message
  }

  res.status(status).json(errorResponse)
}

module.exports = errorHandler