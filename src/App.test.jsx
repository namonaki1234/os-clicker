import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('OS & Browser Academy', () => {
  it('awards XP when the active lesson is answered correctly', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /OS & Browser Academy/i })).toBeInTheDocument()
    expect(screen.getByTestId('total-xp')).toHaveTextContent('0')

    fireEvent.click(screen.getByRole('button', { name: /カーネルをメモリへ読み込み/i }))

    expect(screen.getByTestId('total-xp')).toHaveTextContent('15')
    expect(screen.getByRole('status')).toHaveTextContent(/ブートローダはカーネルを読み込み/i)
    expect(screen.getByText('クリア済み')).toBeInTheDocument()
  })

  it('lets learners switch lessons and shows a hint after a wrong answer', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /仮想メモリ/i }))
    expect(screen.getByRole('heading', { name: '仮想メモリ' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /ネットワークの遅延をゼロ/i }))

    expect(screen.getByTestId('total-xp')).toHaveTextContent('0')
    expect(screen.getByRole('status')).toHaveTextContent(/もう一歩/)
  })
})
