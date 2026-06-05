// test CI
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import About from '../About'

it('has a link back to the home page', () => {
  render(<MemoryRouter><About /></MemoryRouter>)
  expect(screen.getByRole('link', { name: /go to notes/i })).toBeInTheDocument()
})
