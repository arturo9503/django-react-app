import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../components/LoginForm'

const onLogin = vi.fn()

beforeEach(() => {
  onLogin.mockClear()
  global.fetch = vi.fn()
})

it('calls onLogin with token on successful login', async () => {
  global.fetch.mockResolvedValueOnce({
    json: () => Promise.resolve({ token: 'abc123', username: 'alice' }),
  })

  render(<LoginForm onLogin={onLogin} />)
  await userEvent.type(screen.getByPlaceholderText('Username'), 'alice')
  await userEvent.type(screen.getByPlaceholderText('Password'), 'secret')
  await userEvent.click(screen.getByRole('button', { name: /login/i }))

  await waitFor(() => expect(onLogin).toHaveBeenCalledWith('abc123', 'alice'))
})

it('shows an error message on failed login', async () => {
  global.fetch.mockResolvedValueOnce({
    json: () => Promise.resolve({ error: 'Invalid credentials' }),
  })

  render(<LoginForm onLogin={onLogin} />)
  await userEvent.type(screen.getByPlaceholderText('Username'), 'baduser')
  await userEvent.type(screen.getByPlaceholderText('Password'), 'wrong')
  await userEvent.click(screen.getByRole('button', { name: /login/i }))

  await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument())
})
