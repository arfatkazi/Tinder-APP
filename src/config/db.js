const mongoose = require('mongoose')

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`Database connected properly`)
  } catch (err) {
    console.log(`Database not  connected properly`)
    process.exit(1)
  }
}

module.exports = ConnectDB
