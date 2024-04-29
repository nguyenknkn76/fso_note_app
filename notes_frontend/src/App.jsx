import { useState } from "react"
import Note from "./components/NoteComponent"
import axios from 'axios'
import { useEffect } from "react"
import noteService from "./services/NoteService"
import loginService from "./services/LoginService"
import Notification from "./components/NotificationComponent"
import Footer from "./components/FooterComponent"
// import { set } from "../../notes_backend/app"

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('new note nhe')
  const [showAll, setShowAll]  = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')  
  const [user, setUser] = useState(null)


  //! FORM
  const loginForm = () => {
    return(
      <form onSubmit={handleLogin}>
        <div>
          username: <input type="text" value={username} name="Username" onChange={({target}) => setUsername(target.value)}/>
        </div>
        <div>
          password: <input type="password" value={password} name="Password" onChange={({target}) => setPassword(target.value)}/>
        </div>
        <button type="submit">Login</button>
    </form>
    )
  }

  const noteForm = () => {
    return(
      <form onSubmit={addNote}>
        <input value={newNote} onChange={({target}) => setNewNote(target.value)}/>
        <button type="submit">save</button>
      </form>
    )

  } 

  //! Some function
  useEffect(() => {
    noteService
      .getAll()
      .then(initNotes => {
        setNotes(initNotes)
      })
  },[])
  
  useEffect(()=> {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  },[])

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
  // const handleNoteChange = (event) => {
  //   console.log(event.target.value)
  //   setNewNote(event.target.value)
  // } 
  
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log(`logging with username: ${username}, password: ${password}`)
    try{
      const loginUser = await loginService.login({username, password})
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(loginUser))
      console.log(`this localStorage`, window.localStorage)
      noteService.setToken(loginUser.token)
      console.log('this is loginUser',loginUser)
      setUser(loginUser)
      setUsername('')
      setPassword('')
    }catch(e){
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    }
  }
  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    noteService.setToken(null)
    window.localStorage.removeItem('loggedNoteAppUser')
    console.log(window.localStorage)
    // alert('logout success')
    // window.localStorage.clear() //! clear all local storage
  }
  return(
    <div>
      <h1>notes - nothing change</h1>
      <Notification message = {errorMessage}/>

      {user === null ? loginForm() : 
        <div>
          <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
          {/* {logoutForm()} */}
          {noteForm()}
        </div>
      }

      <br/>
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
      <Footer/>
    </div>
  )
}

export default App