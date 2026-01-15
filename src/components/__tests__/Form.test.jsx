import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Form from '../Form'

// Mock AutoComplete component
vi.mock('../AutoComplete', () => ({
  default: ({ value, onChange }) => (
    <div>
      <input
        id="city"
        data-testid="autocomplete-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Wpisz nazwę miasta..."
      />
    </div>
  ),
}))

describe('Form', () => {
  it('renders all form fields', () => {
    render(<Form />)
    
    expect(screen.getByLabelText(/Imię:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Miasto:/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Wyślij/i })).toBeInTheDocument()
  })

  it('updates name field when user types', async () => {
    const user = userEvent.setup()
    render(<Form />)
    
    const nameInput = screen.getByLabelText(/Imię:/i)
    await user.type(nameInput, 'John')
    
    expect(nameInput).toHaveValue('John')
  })

  it('updates email field when user types', async () => {
    const user = userEvent.setup()
    render(<Form />)
    
    const emailInput = screen.getByLabelText(/Email:/i)
    await user.type(emailInput, 'john@example.com')
    
    expect(emailInput).toHaveValue('john@example.com')
  })

  it('updates city field when AutoComplete changes', async () => {
    const user = userEvent.setup()
    render(<Form />)
    
    const cityInput = screen.getByTestId('autocomplete-input')
    await user.type(cityInput, 'Warsaw')
    
    expect(cityInput).toHaveValue('Warsaw')
  })

  it('displays validation errors when form is submitted empty', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    render(<Form />)
    
    const submitButton = screen.getByRole('button', { name: /Wyślij/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Imię jest wymagane/i)).toBeInTheDocument()
      expect(screen.getByText(/Email jest wymagany/i)).toBeInTheDocument()
      expect(screen.getByText(/Miasto jest wymagane/i)).toBeInTheDocument()
    })
    
    expect(alertSpy).not.toHaveBeenCalled()
    expect(consoleSpy).not.toHaveBeenCalled()
    
    consoleSpy.mockRestore()
    alertSpy.mockRestore()
  })

  it('submits form when all fields are valid', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    render(<Form />)
    
    // Fill in all fields
    await user.type(screen.getByLabelText(/Imię:/i), 'John')
    await user.type(screen.getByLabelText(/Email:/i), 'john@example.com')
    await user.type(screen.getByTestId('autocomplete-input'), 'Warsaw')
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /Wyślij/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Dane formularza:',
        expect.objectContaining({
          name: 'John',
          email: 'john@example.com',
          city: 'Warsaw',
        })
      )
      expect(alertSpy).toHaveBeenCalledWith('Formularz wysłany!')
    })
    
    // Check that no errors are displayed
    expect(screen.queryByText(/Imię jest wymagane/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Email jest wymagany/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Miasto jest wymagane/i)).not.toBeInTheDocument()
    
    consoleSpy.mockRestore()
    alertSpy.mockRestore()
  })

  it('clears errors when form is resubmitted with valid data', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    render(<Form />)
    
    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /Wyślij/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Imię jest wymagane/i)).toBeInTheDocument()
    })
    
    // Fill in fields and resubmit
    await user.type(screen.getByLabelText(/Imię:/i), 'John')
    await user.type(screen.getByLabelText(/Email:/i), 'john@example.com')
    await user.type(screen.getByTestId('autocomplete-input'), 'Warsaw')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/Imię jest wymagane/i)).not.toBeInTheDocument()
      expect(alertSpy).toHaveBeenCalled()
    })
    
    consoleSpy.mockRestore()
    alertSpy.mockRestore()
  })

  it('prevents default form submission', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    render(<Form />)
    
    // Fill in all fields
    await user.type(screen.getByLabelText(/Imię:/i), 'John')
    await user.type(screen.getByLabelText(/Email:/i), 'john@example.com')
    await user.type(screen.getByTestId('autocomplete-input'), 'Warsaw')
    
    const submitButton = screen.getByRole('button', { name: /Wyślij/i })
    const form = submitButton.closest('form')
    
    expect(form).toBeInTheDocument()
    
    // Submit form via button click (which should trigger form submit)
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled()
    })
    
    consoleSpy.mockRestore()
    alertSpy.mockRestore()
  })
})
