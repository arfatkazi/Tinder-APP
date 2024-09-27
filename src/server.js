require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 6000

console.log(process.env.PORT)

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('home page')
})

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`)
})
