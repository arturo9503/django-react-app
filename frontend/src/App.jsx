import { useState, useEffect } from 'react'

function App() {
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/api/notes/')
      .then(res => res.json())
      .then(data => setNotes(data))
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    fetch('http://localhost:8000/api/notes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
      .then(res => res.json())
      .then(newNote => {
        setNotes([newNote, ...notes])
        setContent('')
      })
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '500px', margin: '4rem auto' }}>
      <h1>Notes</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write a note..."
          rows={3}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <button type="submit">Save</button>
      </form>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
