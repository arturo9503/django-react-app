import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    global.fetch = vi.fn()
  })

  it('shows the login form when no token is stored', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
  })

  it('shows the notes view when a valid token is stored', () => {
    localStorage.setItem('token', 'fake-token')
    localStorage.setItem('username', 'alice')
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve([]) })

    render(<App />)
    expect(screen.getByRole('heading', { name: /notes/i })).toBeInTheDocument()
  })
})
