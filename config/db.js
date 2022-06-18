const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`Database connected on post ${conn.connection.host} successfully`)
  } catch (error) {
    console.error(error)
  }
}

module.exports = connectDB