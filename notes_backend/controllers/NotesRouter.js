const notesRouter = require('express').Router()
const Note = require('../models/noteModel')

notesRouter.get('/',(req,res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

notesRouter.get('/:id',(req,res, next) => {
    Note.findById(req.params.id)
        .then(note => {
            if(note) res.json(note)
            else res.status(404).end()
        })
        .catch(err => next(err))
})

notesRouter.post('/', (req,res, next) => {
    const body = req.body
    const note = new Note({
        content: body.content, 
        important: body.important || false
    })

    note.save()
        .then(savedNote => {
            res.json(savedNote)
        })
        .catch(err => next(err))
})

notesRouter.delete('/:id', (req,res,next) => {
    Note.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(err => next(err))
})

notesRouter.put('/:id', (req,res, next) => {
    const body = req.body
    const note = {
        content: body.content,
        important: body.important
    }
    Note.findByIdAndUpdate(req.params.id, note)
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(err => next(err))
})

module.exports = notesRouter

