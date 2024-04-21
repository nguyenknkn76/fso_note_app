import { useState } from "react"
import Note from "./components/NoteComponent"
import axios from 'axios'
import { useEffect } from "react"
import noteService from "./services/NoteService"
import Notification from "./components/NotificationComponent"
import Footer from "./components/FooterComponent"

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('new note nhe')
  const [showAll, setShowAll]  = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error was happend')
  useEffect(() => {
    noteService
      .getAll()
      .then(initNotes => {
        setNotes(initNotes)
      })
  },[])
  // useEffect(() => {
  //   console.log('effect')
  //   axios
  //     .get('http://localhost:3001/notes')
  //     .then(response => {
  //       setNotes(response.data)
  //     })
  // },[])
  // console.log('render', notes.length, 'notes')
  
  const noteToShow = showAll ? notes : notes.filter(note => note.important === true)
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
    // axios
    //   .post('http://localhost:3001/notes',noteObject)
    //   .then(response => {
    //     setNotes(notes.concat(response.data))
    //     setNewNote('')
    //   })
    
    // console.log("button click", event.target)
  }
  const toggleImportance = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(note => note.id === id)
    const changedNote = {...note, important: !note.important}
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        // alert(`the note ${note.content} was already deleted from server`)
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
    // axios
    //   .put(url, changedNote)
    //   .then(response => {
    //     setNotes(notes.map(note => note.id !== id ? note : response.data))
    //   })
    // console.log('important of',id, 'nedds to be toggled')
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  } 

  return(
    <div>
      <h1>notes</h1>
      <Notification message = {errorMessage}/>
      <div><button onClick={() => {setShowAll(!showAll)}}>show {showAll ? 'important' : 'all'}</button></div>
      
      <ul>
        {noteToShow.map(note => 
          <Note 
            key = {note.id} 
            note ={note}
            toggleImportance={() => toggleImportance(note.id)}
          />
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      
      <Footer/>
    </div>
  )
}

export default App