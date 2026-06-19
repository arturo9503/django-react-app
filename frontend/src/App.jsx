import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { authHeaders } from './api'
import LoginForm from './components/LoginForm'
import Notes from './components/Notes'
import About from './components/About'

const API = 'http://localhost:8000/api'

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={
          token
            ? <Notes token={token} username={username} onLogout={handleLogout} />
            : <LoginForm onLogin={handleLogin} />
        } />
      </Routes>
    </BrowserRouter>
  )
}
