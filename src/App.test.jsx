import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('OS Boot Clicker', () => {
  it('unlocks the kernel once enough cycles are collected', () => {
    render(<App />)

    const generateButton = screen.getByRole('button', { name: /generate cycle/i })
    const kernelButton = screen.getByRole('button', { name: /load kernel/i })

    for (let i = 0; i < 10; i += 1) {
      fireEvent.click(generateButton)
    }

    expect(screen.getByTestId('cpu-cycles')).toHaveTextContent('10')

    fireEvent.click(kernelButton)

    expect(screen.getByRole('status')).toHaveTextContent(/kernel online/i)
  })

  it('progresses through the boot sequence when each dependency is unlocked', () => {
    render(<App />)

    const generateButton = screen.getByRole('button', { name: /generate cycle/i })

    for (let i = 0; i < 10; i += 1) {
      fireEvent.click(generateButton)
    }

    fireEvent.click(screen.getByRole('button', { name: /load kernel/i }))

    for (let i = 0; i < 25; i += 1) {
      fireEvent.click(generateButton)
    }

    fireEvent.click(screen.getByRole('button', { name: /initialize memory/i }))

    expect(screen.getByRole('status')).toHaveTextContent(/memory initialized/i)
  })
})
