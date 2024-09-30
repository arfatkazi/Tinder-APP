require('dotenv').config()
const express = require('express')
const adminAuth = require('./middlewares/auth')
const app = express()
const PORT = process.env.PORT || 6000
const ConnectDB = require('./config/db')
const userRoutes = require('./routes/user.route')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/user', userRoutes)

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
