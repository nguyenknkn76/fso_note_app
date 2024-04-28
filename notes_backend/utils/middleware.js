const logger = require('./logger')

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:  ', req.path)
    console.log('Body:  ', req.body)
    console.log('---')
    next()
}

//! config morgan
// const morgan = require('morgan')
// morgan.token('body', function (req, res) {
//   return JSON.stringify(req.body)
// })
// const formatStr = ':method :url :status :res[content-length] - :response-time ms :body'
// app.use(morgan(formatStr))

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
    console.error(err.message)
    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id ???' })
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')){
        return res.status(400).json({error: 'expected `username` to be unique'})
    } else if (err.name === 'JsonWebTokenError'){
        return res.status(401).json({error: 'token invalid'})
    } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({error: 'token expired'})
    }
    next(err)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}