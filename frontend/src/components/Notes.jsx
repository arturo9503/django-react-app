import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API, authHeaders } from '../api'

export default function Notes({ token, username, onLogout }) {
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState('')

  useEffect(() => {
    fetch(`${API}/notes/`, { headers: authHeaders(token) })
      .then(res => res.json())
      .then(data => setNotes(data))
  }, [token])

  function handleDelete(id) {
    fetch(`${API}/notes/${id}/`, { method: 'DELETE', headers: authHeaders(token) })
      .then(() => setNotes(notes.filter(n => n.id !== id)))
  }

  function handleSubmit(e) {
    e.preventDefault()
    fetch(`${API}/notes/`, {
      method: 'POST',
      headers: authHeaders(token),
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Notes</h1>
        <span>
          <Link to="/about" style={{ marginRight: '1rem' }}>About</Link>
          {username} <button onClick={onLogout}>Logout</button>
        </span>
      </div>
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
          <li key={note.id}>
            {note.content}
            <button onClick={() => handleDelete(note.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
