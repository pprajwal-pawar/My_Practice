import { useEffect, useState } from 'react'
import './App.css'

const buttons = [
  ['C', 'clear'], ['/', 'operator'], ['*', 'operator'], ['back', 'backspace'],
  ['7', 'number'], ['8', 'number'], ['9', 'number'], ['-', 'operator'],
  ['4', 'number'], ['5', 'number'], ['6', 'number'], ['+', 'operator'],
  ['1', 'number'], ['2', 'number'], ['3', 'number'], ['=', 'equals'],
  ['0', 'number wide'], ['.', 'number'],
]

const operatorPattern = /[+\-*/]$/

function formatResult(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 'Error'
  return Number.isInteger(number) ? String(number) : String(Number(number.toFixed(8)))
}

function App() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')

  const calculate = () => {
    if (!expression || operatorPattern.test(expression)) return
    try {
      const value = Function(`"use strict"; return (${expression})`)()
      const formatted = formatResult(value)
      setResult(formatted)
      setExpression(formatted === 'Error' ? '' : formatted)
    } catch {
      setResult('Error')
    }
  }

  const press = (label) => {
    if (/\d/.test(label) || label === '.') {
      if (label === '.' && expression.split(/[+\-*/]/).pop().includes('.')) return
      setExpression((current) => current + label)
      setResult((current) => (current === 'Error' ? '0' : current))
    } else if (label === 'C') {
      setExpression('')
      setResult('0')
    } else if (label === 'back') {
      setExpression((current) => current.slice(0, -1))
    } else if (label === '=') {
      calculate()
    } else if (operatorPattern.test(label)) {
      setExpression((current) => {
        if (!current) return label === '-' ? '-' : current
        if (operatorPattern.test(current)) return current.slice(0, -1) + label
        return current + label
      })
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (/^[0-9.]$/.test(event.key) || '+-*/'.includes(event.key)) press(event.key)
      if (event.key === 'Enter' || event.key === '=') press('=')
      if (event.key === 'Backspace') press('back')
      if (event.key === 'Escape') press('C')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="intro-copy"><span className="line" /><p>Small tool, clear thinking.</p><span className="line" /></div>
        <div className="calculator-wrap">
          <div className="calculator">
            <div className="calculator-topline"><span>CALC / 001</span><span>READY</span></div>
            <div className="display" aria-live="polite"><span className="expression">{expression || '0'}</span><strong>{result}</strong></div>
            <div className="keypad">
              {buttons.map(([label, type]) => <button className={`key ${type}`} key={label} type="button" aria-label={label === 'back' ? 'Backspace' : label} onClick={() => press(label)}>{label === 'back' ? '⌫' : label}</button>)}
            </div>
          </div>
          <div className="user-info">
            <p><strong>Name:</strong> Prajwal Pawar</p>
            <p><strong>PRN:</strong> 1272250602</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
