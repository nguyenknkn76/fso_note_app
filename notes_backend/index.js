require('dotenv').config()
const express = require('express')
const app = express()

const Note = require('./models/noteModel') //! after use model noteModel

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))
app.use(express.json()) //! json-parser


//! config request logger
//todo same function with morgan
// const requestLogger = (req,res, next) => {
//     console.log('Method:', req.method)
//     console.log('Path:  ', req.path)
//     console.log('Body:  ', req.body)
//     console.log('---')
//     next()
// }
// app.use(requestLogger)

//! config morgan
const morgan = require('morgan')
morgan.token('body', function (req, res) { 
    return JSON.stringify(req.body)
})
const formatStr = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(formatStr))

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    },{
        id: 4,
        content: "test backend with express",
        important: true
    }
]

app.get(`/`,(req, res) => {
    console.log(`hello world`)
    res.json({hello_msg: "hello world"})
})

app.get(`/api/notes`,(req,res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get(`/api/notes/:id`,(req,res,next) => {
    const id = req.params.id
    Note.findById(id)
        .then(note => {
            if(note){
                res.json(note)
            }else{
                res.status(404).end()
            }
        })
        .catch(err => next(err))
})

app.delete(`/api/notes/:id`, (req,res,next) =>{
    Note.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(err => next(err))
})

app.put(`/api/notes/:id`,(req,res, next)=> {
    const body = req.body
    const note = {
        content: body.content,
        important: body.important,
    }
    Note.findByIdAndUpdate(req.params.id, note,{new: true})
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(err => next(err))
})

const generateId = () => {
    const maxId = Math.max(...notes.map(note => note.id))
    return maxId + 1
}

app.post(`/api/notes`,(req,res) => {
    const body = req.body
    if (body.content === undefined){
        return res.status(400).json({error: 'content missing'})
    }
    const newNote = new Note({
        content: body.content,
        important: body.important || false
    })

    newNote.save().then(savedNote => {
        res.json(savedNote)
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error:"unknown endpoint"})
}
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
    console.error(err.message)
    if(err.name = 'CastError'){
        return res.status(400).send({error:'malformatted id'})
    }
    next(err)
}
app.use(errorHandler)
// const PORT = process.env.PORT || 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running in PORT ${PORT}`)
})
