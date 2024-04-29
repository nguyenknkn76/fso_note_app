const NoteForm = ({addNote,newNote, handleNewNoteChange}) =>{
    return(
        <form onSubmit={addNote}>
            Add note : <input value={newNote} onChange={handleNewNoteChange}/>
            <button type="submit">save</button>
        </form>
    )
}
export default NoteForm
