import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('http://localhost:8000/api/hello/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error: could not reach Django backend'))
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '4rem' }}>
      <h1>Django React App</h1>
      <p>Message from Django: <strong>{message}</strong></p>
    </div>
  )
}

export default App
