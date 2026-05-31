import { useState, useEffect } from 'react'

const API = 'http://localhost:8000/api'

function authHeaders(token) {
  return { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    fetch(`${API}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          onLogin(data.token, data.username)
        } else {
          setError(data.error || 'Login failed')
        }
      })
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '300px', margin: '4rem auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

function Notes({ token, username, onLogout }) {
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

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [username, setUsername] = useState(() => localStorage.getItem('username'))

  function handleLogin(token, username) {
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    setToken(token)
    setUsername(username)
  }

  function handleLogout() {
    fetch(`${API}/logout/`, { method: 'POST', headers: authHeaders(token) })
      .finally(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        setToken(null)
        setUsername(null)
      })
  }

  if (!token) return <LoginForm onLogin={handleLogin} />
  return <Notes token={token} username={username} onLogout={handleLogout} />
}
