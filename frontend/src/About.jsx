import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '500px', margin: '4rem auto' }}>
      <h1>About</h1>
      <p>A simple notes app built with Django + React.</p>
      <Link to="/">Go to Notes</Link>
    </div>
  )
}
