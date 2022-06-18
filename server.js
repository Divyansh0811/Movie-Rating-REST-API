const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const connectDB = require('./config/db');
const { errorHandler } = require("./middleware/errorMiddleware")
const app = express()

//Connecting DB
connectDB()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(errorHandler)
app.use('/api/movie', require('./routes/movieRoutes'))
app.use('/api/user', require('./routes/userRoutes'))


app.listen(port, () => console.log(`Server started on port ${port}`))