# Glossary

Ubiquitous language for the Calculator project. Use these terms consistently in specs, tickets, code, and reviews.

## Terms

### Operand
The numerical value that is being operated upon.
- **Current Operand**: The value currently being entered or recently computed on screen.
- **Previous Operand**: The stored operand waiting for a second operand and execution.

### Operator
A mathematical operation selected by the user (`+`, `-`, `*`, `÷`).

### Function Key
Non-arithmetic utility actions that immediately mutate or reset the operand (`Clear All`, `Toggle Sign`, `Percent`, `Delete`).

### Active Operator
The operator currently held in pending state, visually signaled to the user on the keypad while they enter the second operand.

### Calculation History
A chronological record of executed calculations (`previousOperand operation currentOperand = result`), which can be inspected, cleared, or recalled into the active input.

### Keypad
The grid container housing all interactive buttons.

### Seam
The architectural boundary between computation logic (Calculator engine class) and UI presentation/interaction (DOM event listeners and rendering).
