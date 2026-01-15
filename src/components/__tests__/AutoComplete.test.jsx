import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AutoComplete from '../AutoComplete'

// Mock environment variable
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_URL: 'https://nominatim.openstreetmap.org/search',
  },
  writable: true,
})

describe('AutoComplete', () => {
  const mockOnChange = vi.fn()
  let user

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders input field with placeholder', () => {
    render(<AutoComplete value="" onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
    expect(input).toBeInTheDocument()
  })

  it('displays the value prop in input', () => {
    render(<AutoComplete value="Warsaw" onChange={mockOnChange} />)
    const input = screen.getByDisplayValue('Warsaw')
    expect(input).toBeInTheDocument()
  })

  it('calls onChange when user types in input', async () => {
    render(<AutoComplete value="" onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
    
    await user.type(input, 'Warsaw')
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  it('fetches suggestions after debounce delay', async () => {
    const mockResponse = [
      { display_name: 'Warsaw, Poland' },
      { display_name: 'Warsaw, Indiana, USA' },
    ]
    
    global.fetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    render(<AutoComplete value="" onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
    
    await user.type(input, 'Warsaw')
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    }, { timeout: 1000 })
  })

  it('displays suggestions when API returns data', async () => {
    const mockResponse = [
      { display_name: 'Warsaw, Poland' },
      { display_name: 'Warsaw, Indiana, USA' },
    ]
    
    // Reset and setup fetch mock for this test
    global.fetch.mockReset()
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const { rerender } = render(<AutoComplete value="" onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
    
    // Type to trigger onChange and debounced fetch
    await user.type(input, 'Warsaw')
    
    // Update the component with the new value to simulate controlled component
    rerender(<AutoComplete value="Warsaw" onChange={mockOnChange} />)
    
    // Wait for debounce (300ms) + fetch + transition to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    }, { timeout: 1000 })
    
    // Wait for suggestions to appear
    await waitFor(() => {
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
      expect(list.textContent).toContain('Warsaw, Poland')
    }, { timeout: 2000 })
  })

  it('highlights matching text in suggestions', async () => {
    const mockResponse = [
      { display_name: 'Warsaw, Poland' },
    ]
    
    global.fetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    render(<AutoComplete value="Warsaw" onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
    
    await user.clear(input)
    await user.type(input, 'Warsaw')
    
    await waitFor(() => {
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
      // Check if highlighting is applied (strong tag)
      const strongElements = list.querySelectorAll('strong')
      expect(strongElements.length).toBeGreaterThan(0)
    }, { timeout: 1000 })
  })

  it('calls onChange when suggestion is clicked', async () => {
    const mockResponse = [
      { display_name: 'Warsaw, Poland' },
    ]
    
    global.fetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    render(<AutoComplete value="Warsaw" onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
    
    await user.clear(input)
    await user.type(input, 'Warsaw')
    
    await waitFor(async () => {
      const listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
      await user.click(listItems[0])
      expect(mockOnChange).toHaveBeenCalledWith('Warsaw, Poland')
    }, { timeout: 1000 })
  })

  it('handles keyboard navigation with ArrowDown', async () => {
    const mockResponse = [
      { display_name: 'Warsaw, Poland' },
      { display_name: 'Warsaw, Indiana, USA' },
    ]
    
    global.fetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    render(<AutoComplete value="Warsaw" onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
    
    await user.clear(input)
    await user.type(input, 'Warsaw')
    
    await waitFor(async () => {
      await user.keyboard('{ArrowDown}')
      // The selected item should have different background
      const suggestions = screen.getAllByRole('listitem')
      expect(suggestions.length).toBeGreaterThan(0)
    }, { timeout: 1000 })
  })

  it('handles Enter key to select suggestion', async () => {
    const mockResponse = [
      { display_name: 'Warsaw, Poland' },
    ]
    
    global.fetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    render(<AutoComplete value="Warsaw" onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
    
    await user.clear(input)
    await user.type(input, 'Warsaw')
    
    await waitFor(async () => {
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')
      expect(mockOnChange).toHaveBeenCalledWith('Warsaw, Poland')
    }, { timeout: 1000 })
  })

  it('handles Escape key to close suggestions', async () => {
    const mockResponse = [
      { display_name: 'Warsaw, Poland' },
    ]
    
    global.fetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    render(<AutoComplete value="Warsaw" onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
    
    await user.clear(input)
    await user.type(input, 'Warsaw')
    
    await waitFor(async () => {
      expect(screen.getByRole('list')).toBeInTheDocument()
      await user.keyboard('{Escape}')
      await waitFor(() => {
        expect(screen.queryByRole('list')).not.toBeInTheDocument()
      })
    }, { timeout: 1000 })
  })

  it('handles API error gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'))

    render(<AutoComplete value="Warsaw" onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
    
    await user.clear(input)
    await user.type(input, 'Warsaw')
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
      // Suggestions should be empty on error
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('does not fetch suggestions for empty query', async () => {
    render(<AutoComplete value="" onChange={mockOnChange} />)
    const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
    
    await user.type(input, ' ')
    await user.clear(input)
    
    // Wait a bit to ensure debounce doesn't trigger fetch
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled()
    }, { timeout: 500 })
  })
})
