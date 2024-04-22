//! moongose definitions =================================
const mongoose = require('mongoose')
// const password = process.argv[2]

const url = process.env.MONGODB_URI
// const url = `mongodb+srv://nguyenknkn76:${password}@clusterfso2.zjsmwck.mongodb.net/noteApp?retryWrites=true&w=majority&appName=ClusterFso2`

mongoose.set('strictQuery',false)
console.log(`connecting to ${url}`)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(err => {
        console.log(`error connecting to MongoDB: ${err.message}`)
    })

const noteSchema = new mongoose.Schema({
    // content: String,
    content:{
        type: String,
        minLength: 5,
        require: true
    },
    important: Boolean
})

// const Note = mongoose.model('Note',noteSchema)

//! config note.id format
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)
