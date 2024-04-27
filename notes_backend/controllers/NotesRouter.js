const notesRouter = require('express').Router()
const e = require('express')
const Note = require('../models/noteModel')


notesRouter.get('/', async (req,res) => {
    const notes = await Note.find({})
    res.json(notes)
})

notesRouter.get('/:id', async (req,res) =>{
    try{
        const note = await Note.findById(req.params.id)
        if(note) res.json(note)
        else res.status(404).end()
    } catch(e) {
        next(e)
    }
    
})

notesRouter.post ('/', async (req,res ,next) => {
    const body = req.body
    const note = new Note ({
        content : body.content,
        important: body.important || false
    })
    try{
        const savedNote = await note.save()
        res.status(201).json(savedNote)
    }catch (e) {
        next(e)
    }
    
})

notesRouter.delete('/:id', async (req,res, next) => {
    try{
        await Note.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch(e) {
        next(e)
    }
    
    
})

notesRouter.put('/:id',  async (req,res, next) => {
    const body = req.body
    const note = {
        content: body.content,
        important: body.important
    }
    try{
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, note)
        res.json(updatedNote)
    } catch(e){
        next(e)
    }
    // Note.findByIdAndUpdate(req.params.id, note)
    //     .then(updatedNote => {
    //         res.json(updatedNote)
    //     })
    //     .catch(err => next(err))
})

module.exports = notesRouter

