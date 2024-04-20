const express = require('express')
const app = express()

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
    }
]

app.get(`/`,(req, res) => {
    console.log(`hello world`)
    res.json({hello_msg: "hello world"})
})

app.get(`/api/notes`,(req,res) => {
    // console.log(notes)
    res.json(notes)
})

app.get(`/api/notes/:id`,(req,res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if(note){
        res.json(note)
    }else{
        res.status.json({error:'not found'})
    }
})

app.delete(`/api/notes/:id`, (req,res) =>{
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const maxId = Math.max(...notes.map(note => note.id))
    return maxId + 1
}

app.post(`/api/notes`,(req,res) => {
    const body = req.body
    const note = {
        id: generateId(),
        content: body.content,
        important: body.important || false
    }
    notes = notes.concat(note)
    res.json(note)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error:"unknown endpoint"})
}
app.use(unknownEndpoint)

PORT = 3001
app.listen(PORT, ()=> {
    console.log(`server running in PORT ${PORT}`)
})