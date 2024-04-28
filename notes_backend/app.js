const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/NotesRouter')
const usersRouter = require('./controllers/UsersRouter')
const loginRouter = require('./controllers/LoginRouter')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
require('express-async-errors')

const mongoose = require('mongoose')


mongoose.set('strictQuery', false)
logger.info('connecting to ', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
    .then(()=> {
        logger.info('connected to MongoDB')
    })
    .catch((err) => {
        logger.error(`error connecting to MongoDB: ${err.message}`)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app