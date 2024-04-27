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
  const [errorMessage, setErrorMessage] = useState(null)
  const [initLoad, setInitLoad] = useState(true)
  // useEffect(() => {
  //   noteService
  //     .getAll()
  //     .then(initNotes => {
  //       setNotes(initNotes)
  //     })
  // },[])
  const reRender = () =>{
    useEffect(() => {
      noteService
      .getAll()
      .then(initNotes => {
        setNotes(initNotes)
        setInitLoad(false)
      })
    },[])
  }

  reRender()


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
        // setNotes(notes.filter(note => note.id !== id))
      })
  }
  const deleteNote = (id) => {
    noteService
      .remove(id)
      .then(deletedNote => {
        const newNotes = notes.filter(note => note.id !== deleteNote.id)
        setNotes(newNotes)
        console.log('delete success')
      })
      .catch(err => {
        setErrorMessage(
          `Note '${note.content}' delete error`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  }
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  } 

  return(
    <div>
      <h1>notes - nothing change</h1>
      <Notification message = {errorMessage}/>
      <div><button onClick={() => {setShowAll(!showAll)}}>show {showAll ? 'important' : 'all'}</button></div>
      
      <ul>
        {noteToShow.map(note => 
          <Note 
            key = {note.id} 
            note ={note}
            toggleImportance={() => toggleImportance(note.id)}
            deleteNote={() => deleteNote(note.id)}
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