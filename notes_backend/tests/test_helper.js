const Note = require('../models/noteModel')

const initNotes = [
    {
        content: 'HTML is easy',
        important: false
    },
    {
        content: 'Browser can execute only JavaScript',
        important: true
    }
]

const nonExistingId = async () => {
    const note = new Note({content:'willremovethissoon'})
    await note.save()
    await note.deleteOne()
    return note._id.toString()
}

const notesInDb = async () =>{
    const notes = await Note.find({})
    return notes.mpa(note => note.toJSON())
}
 
module.exports = {
    initNotes, nonExistingId, notesInDb
}