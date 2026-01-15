import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock Form component
vi.mock('../components/Form', () => ({
  default: () => <div data-testid="form-component">Form Component</div>,
}))

describe('App', () => {
  it('renders header with title', () => {
    render(<App />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(screen.getByText(/Formularz z AutoComplete w React/i)).toBeInTheDocument()
  })

  it('renders main content with Form component', () => {
    render(<App />)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(screen.getByTestId('form-component')).toBeInTheDocument()
  })

  it('renders footer with copyright', () => {
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    expect(screen.getByText(/© 2025 AutoComplete w React/i)).toBeInTheDocument()
  })

  it('renders all main sections', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
