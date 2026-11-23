class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }

  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
    this.justComputed = false
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
        computation = prev * current
        break
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

    this.currentOperand = this.round(computation)
    this.previousOperand = ''
    this.operation = undefined
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


const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const signButton = document.querySelector('[data-sym]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.innerText === '%') {
      calculator.percent()
    } else {
      calculator.chooseOperation(button.innerText)
    }
    calculator.updateDisplay()
  })
})

equalsButton.addEventListener('click', () => {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', () => {
  calculator.clear()
  calculator.updateDisplay()
})

if (deleteButton) {
  deleteButton.addEventListener('click', () => {
    calculator.delete()
    calculator.updateDisplay()
  })
}

if (signButton) {
  signButton.addEventListener('click', () => {
    calculator.toggleSign()
    calculator.updateDisplay()
  })
}

const keyboardOperations = {
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '÷'
}

document.addEventListener('keydown', function (event) {
  if (event.key >= '0' && event.key <= '9') {
    event.preventDefault()
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
    return
  }
  if (event.key === '.') {
    event.preventDefault()
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
    return
  }
  if (event.key in keyboardOperations) {
    event.preventDefault()
    calculator.chooseOperation(keyboardOperations[event.key])
    calculator.updateDisplay()
    return
  }
  if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault()
    calculator.compute()
    calculator.updateDisplay()
    return
  }
  if (event.key === 'Backspace') {
    event.preventDefault()
    calculator.delete()
    calculator.updateDisplay()
    return
  }
  if (event.key === 'Delete' || event.key === 'Escape') {
    event.preventDefault()
    calculator.clear()
    calculator.updateDisplay()
  }
})
