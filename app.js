class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.history = []
    this.clear()
  }

  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
    this.justComputed = false
  }

  clearHistory() {
    this.history = []
  }

  delete() {
    if (this.justComputed) {
      this.clear()
      return
    }
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  appendNumber(number) {
    if (this.justComputed) {
      this.currentOperand = ''
      this.justComputed = false
    }
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') {
      if (this.previousOperand !== '') this.operation = operation
      return
    }
    if (this.previousOperand !== '') this.compute()
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
    this.justComputed = false
  }

  toggleSign() {
    if (this.currentOperand === '' || this.currentOperand === 'Error') return
    const value = this.currentOperand.toString()
    this.currentOperand = value.startsWith('-') ? value.slice(1) : `-${value}`
  }

  percent() {
    if (this.currentOperand === '' || this.currentOperand === 'Error') return
    const value = parseFloat(this.currentOperand)
    if (isNaN(value)) return
    this.currentOperand = this.round(value / 100)
  }

  round(value) {
    return parseFloat(value.toPrecision(12)).toString()
  }

  compute() {
    if (this.operation == null) return
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return

    let computation
    switch (this.operation) {
      case '+':
        computation = prev + current
        break
      case '-':
        computation = prev - current
        break
      case '*':
      case '×':
        computation = prev * current
        break
      case '/':
      case '÷':
        if (current === 0) {
          this.currentOperand = 'Error'
          this.previousOperand = ''
          this.operation = undefined
          this.justComputed = true
          return
        }
        computation = prev / current
        break
      default:
        return
    }

    const result = this.round(computation)
    this.history.unshift({
      prev: this.previousOperand,
      op: this.operation,
      current: this.currentOperand,
      result: result
    })
    if (this.history.length > 30) this.history.pop()

    this.currentOperand = result
    this.previousOperand = ''
    this.operation = undefined
    this.justComputed = true
  }

  recallResult(value) {
    this.currentOperand = String(value)
    this.justComputed = true
  }

  getDisplayNumber(number) {
    if (number === '' || number == null) return ''
    if (number === 'Error') return 'Error'

    const stringNumber = String(number)
    if (isNaN(parseFloat(stringNumber))) return stringNumber

    const [integerPart, decimalPart] = stringNumber.split('.')
    const integerDigits = parseFloat(integerPart)
    const negative = stringNumber.startsWith('-')
    const magnitude = isNaN(integerDigits)
      ? 0
      : Math.abs(integerDigits).toLocaleString('en', { maximumFractionDigits: 0 })

    const integerDisplay = negative ? `-${magnitude}` : String(magnitude)
    if (decimalPart != null) return `${integerDisplay}.${decimalPart}`
    return integerDisplay
  }

  updateDisplay() {
    const current = this.getDisplayNumber(this.currentOperand)
    const text = current === '' ? '0' : current
    this.currentOperandTextElement.innerText = text
    this.currentOperandTextElement.classList.toggle('is-long', text.length > 11)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}

// UI Bindings and Event Listeners
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const signButton = document.querySelector('[data-sym]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const historyToggleBtn = document.querySelector('[data-history-toggle]')
const historyPanel = document.querySelector('[data-history-panel]')
const historyList = document.querySelector('[data-history-list]')
const clearHistoryBtn = document.querySelector('[data-clear-history]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
if (typeof window !== 'undefined') {
  window.calculator = calculator
  window.updateOperatorHighlights = updateOperatorHighlights
  window.renderHistory = renderHistory
}

function updateOperatorHighlights() {
  operationButtons.forEach(btn => {
    if (btn.innerText === '%' || btn.innerText === '±') return
    const isActive = calculator.operation != null && btn.innerText === calculator.operation
    btn.classList.toggle('is-active', isActive)
  })
}

function renderHistory() {
  if (!historyList) return
  historyList.innerHTML = ''
  calculator.history.forEach(item => {
    const li = document.createElement('li')
    li.className = 'history-item'
    li.tabIndex = 0
    li.setAttribute('role', 'button')
    li.setAttribute('aria-label', `Recall result ${item.result} from ${item.prev} ${item.op} ${item.current}`)

    const eqSpan = document.createElement('span')
    eqSpan.className = 'history-equation'
    eqSpan.innerText = `${item.prev} ${item.op} ${item.current} =`

    const resSpan = document.createElement('span')
    resSpan.className = 'history-result'
    resSpan.innerText = item.result

    li.appendChild(eqSpan)
    li.appendChild(resSpan)

    const recall = () => {
      calculator.recallResult(item.result)
      calculator.updateDisplay()
      updateOperatorHighlights()
    }

    li.addEventListener('click', recall)
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        recall()
      }
    })

    historyList.appendChild(li)
  })
}

function flashButton(btn) {
  if (!btn) return
  btn.classList.add('is-pressed')
  setTimeout(() => btn.classList.remove('is-pressed'), 120)
}

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    flashButton(button)
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
    updateOperatorHighlights()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    flashButton(button)
    if (button.innerText === '%') {
      calculator.percent()
    } else {
      calculator.chooseOperation(button.innerText)
    }
    calculator.updateDisplay()
    updateOperatorHighlights()
  })
})

if (equalsButton) {
  equalsButton.addEventListener('click', () => {
    flashButton(equalsButton)
    calculator.compute()
    calculator.updateDisplay()
    updateOperatorHighlights()
    renderHistory()
  })
}

if (allClearButton) {
  allClearButton.addEventListener('click', () => {
    flashButton(allClearButton)
    calculator.clear()
    calculator.updateDisplay()
    updateOperatorHighlights()
  })
}

if (deleteButton) {
  deleteButton.addEventListener('click', () => {
    flashButton(deleteButton)
    calculator.delete()
    calculator.updateDisplay()
    updateOperatorHighlights()
  })
}

if (signButton) {
  signButton.addEventListener('click', () => {
    flashButton(signButton)
    calculator.toggleSign()
    calculator.updateDisplay()
  })
}

if (historyToggleBtn && historyPanel) {
  historyToggleBtn.addEventListener('click', () => {
    const isOpen = historyPanel.classList.toggle('is-open')
    historyToggleBtn.classList.toggle('is-open', isOpen)
    historyToggleBtn.setAttribute('aria-expanded', String(isOpen))
  })
}

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener('click', () => {
    calculator.clearHistory()
    renderHistory()
  })
}

const keyboardOperations = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷'
}

document.addEventListener('keydown', function (event) {
  if (event.key >= '0' && event.key <= '9') {
    event.preventDefault()
    const targetBtn = Array.from(numberButtons).find(b => b.innerText === event.key)
    flashButton(targetBtn)
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
    updateOperatorHighlights()
    return
  }

  if (event.key === '.') {
    event.preventDefault()
    const targetBtn = Array.from(numberButtons).find(b => b.innerText === '.')
    flashButton(targetBtn)
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
    updateOperatorHighlights()
    return
  }

  if (event.key in keyboardOperations) {
    event.preventDefault()
    const op = keyboardOperations[event.key]
    const targetBtn = Array.from(operationButtons).find(b => b.innerText === op)
    flashButton(targetBtn)
    calculator.chooseOperation(op)
    calculator.updateDisplay()
    updateOperatorHighlights()
    return
  }

  if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault()
    flashButton(equalsButton)
    calculator.compute()
    calculator.updateDisplay()
    updateOperatorHighlights()
    renderHistory()
    return
  }

  if (event.key === 'Backspace') {
    event.preventDefault()
    flashButton(deleteButton)
    calculator.delete()
    calculator.updateDisplay()
    updateOperatorHighlights()
    return
  }

  if (event.key === 'Delete' || event.key === 'Escape') {
    event.preventDefault()
    flashButton(allClearButton)
    calculator.clear()
    calculator.updateDisplay()
    updateOperatorHighlights()
    return
  }

  if (event.key === 'h' || event.key === 'H') {
    if (historyToggleBtn) {
      event.preventDefault()
      historyToggleBtn.click()
    }
  }
})
