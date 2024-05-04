import { useState } from 'react'

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState('')
    const addNote = (event) => {
        event.preventDefault()
        createNote({
            content: newNote,
            important: true
        })
        setNewNote('')
    }

    return (
        <div>
        <h2>Create a new note</h2>
            <form onSubmit={addNote}>
                Add note : <input
                    value={newNote}
                    onChange={event => setNewNote(event.target.value)}
                />
                <button type="submit">save</button>
            </form>
        </div>
    )
}

// const NoteForm = ({addNote,newNote, handleNewNoteChange}) =>{
//     return(
//         <form onSubmit={addNote}>
//             Add note : <input value={newNote} onChange={handleNewNoteChange}/>
//             <button type="submit">save</button>
//         </form>
//     )
// }

export default NoteForm
