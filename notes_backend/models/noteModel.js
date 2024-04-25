const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  // content: String,
  content: {
    type: String,
    minLength: 5,
    require: true
  },
  important: Boolean
})

//! config note.id format
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
