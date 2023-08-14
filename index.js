const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const messageRouter = require('./routes/messageRouter')
const commentRouter = require('./routes/commentRouter')
const friendRouter = require('./routes/friendRouter')
const postRouter = require('./routes/postRouter')

const errorHandler = require('./middleware/errorMiddleware')
const middlewares = require('./middleware/middlewares')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(middlewares.setHeaders)
app.use(cors())
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/message', messageRouter)
app.use('/comment', commentRouter)
app.use('/friend', friendRouter)
app.use('/post', postRouter)
app.use(errorHandler)

const start = async () => {
  const url = 'mongodb://localhost:27017/vk'
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4
    })
    
    app.listen(PORT, () => {
      console.log(`Server has been started port: ${PORT}`);
    })
  } catch (error) {
    console.log(error)
  }
}

start()