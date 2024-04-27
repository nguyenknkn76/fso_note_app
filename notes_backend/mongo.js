const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://nguyenknkn76:${password}@clusterfso2.zjsmwck.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=ClusterFso2`

// npm install mongodb@4.0
// mongodb+srv://nguyenknkn76:${password}@clusterfso2.zjsmwck.mongodb.net/${appname}?retryWrites=true&w=majority&appName=ClusterFso2
// string: mongodb+srv://nguyenknkn76:<password>@clusterfso2.zjsmwck.mongodb.net/

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({

  content: 'css is NOT easy',
  important: false
})

// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })

note.save().then(result => {
    console.log('note saved')
    mongoose.connection.close()
})
