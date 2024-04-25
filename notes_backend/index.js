// require('dotenv').config()
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

// const Note = require('./models/noteModel') //! after use model noteModel

// const notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only JavaScript',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     important: true
//   }, {
//     id: 4,
//     content: 'test backend with express',
//     important: true
//   }
// ]

// app.get('/', (req, res) => {
//   console.log('hello world')
//   res.json({ hello_msg: 'hello world' })
// })

// app.get('/api/notes', (req, res) => {
//   Note.find({}).then(notes => {
//     res.json(notes)
//   })
// })

// app.get('/api/notes/:id', (req, res, next) => {
//   const id = req.params.id
//   Note.findById(id)
//     .then(note => {
//       if (note) {
//         res.json(note)
//       } else {
//         res.status(404).end()
//       }
//     })
//     .catch(err => next(err))
// })

// app.delete('/api/notes/:id', (req, res, next) => {
//   Note.findByIdAndDelete(req.params.id)
//     .then(result => {
//       res.status(204).end()
//     })
//     .catch(err => next(err))
// })

// app.put('/api/notes/:id', (req, res, next) => {
//   const { content, important } = req.body

//   Note.findByIdAndUpdate(
//     req.params.id,
//     { content, important },
//     { new: true, runValidators: true, context: 'query' }
//   )
//     .then(updatedNote => {
//       res.json(updatedNote)
//     })
//     .catch(err => next(err))
// })

// // const generateId = () => {
// //   const maxId = Math.max(...notes.map(note => note.id))
// //   return maxId + 1
// // }

// app.post('/api/notes', (req, res, next) => {
//   const body = req.body

//   const newNote = new Note({
//     content: body.content,
//     important: body.important || false
//   })

//   newNote.save()
//     .then(savedNote => {
//       res.json(savedNote)
//     })
//     .catch(err => next(err))
// })


// app.use(errorHandler)


// const PORT = process.env.PORT || 3001
// const PORT = process.env.PORT
// app.listen(PORT, () => {
//   console.log(`server running in PORT ${PORT}`)
// })

