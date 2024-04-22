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

// //! moongose definitions =================================
// const mongoose = require('mongoose')
// const password = process.argv[2]
// const url = `mongodb+srv://nguyenknkn76:${password}@clusterfso2.zjsmwck.mongodb.net/noteApp?retryWrites=true&w=majority&appName=ClusterFso2`

// mongoose.set('strictQuery',false)
// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//     content: String,
//     important: Boolean
// })

// const Note = mongoose.model('Note',noteSchema)

// //! config note.id format
// noteSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// })
// //!==========================================================

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
    // res.json(notes)
})

app.get(`/api/notes/:id`,(req,res,next) => {
    // const id = Number(req.params.id)
    // const note = notes.find(note => note.id === id)
    // if(note){
    //     res.json(note)
    // }else{
    //     res.status.json({error:'not found'})
    // }
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
        // .catch(err => {
        //     console.log(err)
        //     res.status(400).send({error:"malformatted id"})
        // })
})

app.delete(`/api/notes/:id`, (req,res) =>{
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})
// app.put(`/api/notes/:id`,(req,res)=> {
//     const id = Number(req.params.id)
//     notes = notes.map(note => note.id !== id ? note : updatedNote)
// })

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
    // const note = {
    //     id: generateId(),
    //     content: body.content,
    //     important: body.important || false
    // }
    // notes = notes.concat(note)
    // res.json(note)
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

// npm install mongodb@4.0
// mongodb+srv://nguyenknkn76:<password>@nguyen-cluster.hkp3hcw.mongodb.net/?retryWrites=true&w=majority&appName=nguyen-cluster
// connecting string: //! mongodb+srv://nguyenknkn76:<password>@nguyen-cluster.hkp3hcw.mongodb.net/