const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/noteModel')
const User = require('../models/userModel')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

//todo GET
notesRouter.get('/', async (req,res) => {
    const notes = await Note.find({}).populate('user', { name: 1})
    res.json(notes)
})

notesRouter.get('/:id', async (req,res) =>{
        const note = await Note.findById(req.params.id)
        if(note) {res.json(note)}
        else {res.status(404).end()}
})

//todo POST
notesRouter.post ('/', async (req,res ) => {
    const body = req.body
    //! use TOKEN to authorization user (lib jsonwebtoken)
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if(!decodedToken.id){
        return res.status(401).json({error: 'token invalid'})
    }
    const user = await User.findById(decodedToken.id)
    // const user = await User.findById(body.userId)

    const note = new Note ({
        content : body.content,
        important: body.important || false,
        user: user.id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.status(201).json(savedNote)
})

//todo PUT
notesRouter.delete('/:id', async (req,res) => {
    await Note.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

//todo PUT 
notesRouter.put('/:id',  async (req,res) => {
    const body = req.body
    const note = {
        content: body.content,
        important: body.important
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, note)
    res.json(updatedNote)

})

module.exports = notesRouter

