import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Notes } from '../App'

const onLogout = vi.fn()

beforeEach(() => {
  onLogout.mockClear()
  global.fetch = vi.fn()
})

function renderNotes() {
  return render(
    <MemoryRouter>
      <Notes token="test-token" username="alice" onLogout={onLogout} />
    </MemoryRouter>
  )
}

it('fetches and renders notes on mount', async () => {
  global.fetch.mockResolvedValueOnce({
    json: () => Promise.resolve([{ id: 1, content: 'First note' }]),
  })

  renderNotes()

  await waitFor(() => expect(screen.getByText('First note')).toBeInTheDocument())
})

it('adds a new note and clears the textarea', async () => {
  global.fetch
    .mockResolvedValueOnce({ json: () => Promise.resolve([]) })
    .mockResolvedValueOnce({ json: () => Promise.resolve({ id: 2, content: 'New note' }) })

  renderNotes()

  const textarea = screen.getByPlaceholderText('Write a note...')
  await userEvent.type(textarea, 'New note')
  await userEvent.click(screen.getByRole('button', { name: /save/i }))

  await waitFor(() => expect(screen.getByText('New note')).toBeInTheDocument())
  expect(textarea).toHaveValue('')
})

it('removes a note after clicking Delete', async () => {
  global.fetch
    .mockResolvedValueOnce({ json: () => Promise.resolve([{ id: 1, content: 'Delete me' }]) })
    .mockResolvedValueOnce({})

  renderNotes()

  await waitFor(() => expect(screen.getByText('Delete me')).toBeInTheDocument())
  await userEvent.click(screen.getByRole('button', { name: /delete/i }))

  await waitFor(() => expect(screen.queryByText('Delete me')).not.toBeInTheDocument())
})

it('calls onLogout when the logout button is clicked', async () => {
  global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve([]) })

  renderNotes()
  await userEvent.click(screen.getByRole('button', { name: /logout/i }))

  expect(onLogout).toHaveBeenCalledTimes(1)
})
