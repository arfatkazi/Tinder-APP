require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 6000
const ConnectDB = require('./config/db')
const userRoutes = require('./routes/user.route')
const authRoutes = require('./routes/auth.route')
const profileRoutes = require('./routes/profile.route')
const connectRequestRoutes = require('./routes/connectRequest.route')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/user', authRoutes)
app.use('/user', userRoutes)
app.use('/user', profileRoutes)
app.use('/user', connectRequestRoutes)

const startServer = async () => {
  try {
    await ConnectDB()
    app.listen(PORT, () => {
      console.log(`server is listening on ${PORT}`)
    })
  } catch (err) {
    console.error('failed to connect to the database', err)
    process.exit(1)
  }
}

startServer()
