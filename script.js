// Get the main calculator container where all buttons exist
const inputBox = document.getElementById('input');

// Get the element that shows the current expression (e.g. 12+3)
const expressionDiv = document.getElementById('expression');

// Get the element that shows the final calculated result
const resultDiv = document.getElementById('result');

// Store the mathematical expression entered by the user
let expression = '';

// Store the calculated result after pressing "="
let result = '';

// This function runs whenever any calculator button is clicked
function buttonClick(event) {
  // The button that was clicked
  const target = event.target;

  // The type of action the button performs (number, add, clear, etc.)
  const action = target.dataset.action;

  // The actual value of the button (0–9, +, -, etc.)
  const value = target.dataset.value;

  // Decide what to do based on the button's action
  switch (action) {
    case 'number':
      // Add numbers (0–9) to the expression
      addValue(value);
      break;

    case 'clear':
      // Reset everything
      clear();
      break;

    case 'backspace':
      // Remove the last entered character
      backspace();
      break;

    // These cases handle mathematical operators
    case 'addition':
    case 'subtraction':
    case 'multiplication':
    case 'division':
      // If expression is empty but result exists, start new calculation from result
      if (expression === '' && result !== '') {
        startFromResult(value);
      }
      // Only add operator if last character is NOT already an operator
      else if (expression !== '' && !isLastCharOperator()) {
        addValue(value);
      }
      break;

    case 'submit':
      // Calculate the expression when "=" is pressed
      submit();
      break;

    case 'negate':
      // Change positive to negative or vice versa
      negate();
      break;

    case 'mod':
      // Convert value to percentage
      percentage();
      break;

    case 'decimal':
      // Add decimal point safely
      decimal(value);
      break;
  }

  // Update what the user sees on the screen
  updateDisplay(expression, result);
}

// Listen for clicks on any calculator button
inputBox.addEventListener('click', buttonClick);

// Adds numbers or decimal to the expression safely
function addValue(value) {
  if (value === '.') {
    // Find where the last operator appears in the expression
    const lastOperatorIndex = expression.search(/[+\-*/]/);

    // Find the last decimal point
    const lastDecimalIndex = expression.lastIndexOf('.');

    // Find the last number boundary after an operator
    const lastNumberIndex = Math.max(
      expression.lastIndexOf('+'),
      expression.lastIndexOf('-'),
      expression.lastIndexOf('*'),
      expression.lastIndexOf('/')
    );

    // Allow decimal only if the current number doesn't already have one
    if (
      (lastDecimalIndex < lastOperatorIndex ||
        lastDecimalIndex < lastNumberIndex ||
        lastDecimalIndex === -1) &&
      (expression === '' ||
        expression.slice(lastNumberIndex + 1).indexOf('-') === -1)
    ) {
      expression += value;
    }
  } else {
    // Add number or operator normally
    expression += value;
  }
}

// Update the calculator display with latest expression and result
function updateDisplay(expression, result) {
  expressionDiv.textContent = expression;
  resultDiv.textContent = result;
}

// Clear both expression and result
function clear() {
  expression = '';
  result = '';
}

// Remove the last character from the expression
function backspace() {
  expression = expression.slice(0, -1);
}

// Check if the last character is an operator (+, -, *, /)
function isLastCharOperator() {
  return isNaN(parseInt(expression.slice(-1)));
}

// Start a new expression using the previous result
function startFromResult(value) {
  expression += result + value;
}

// Calculate the expression and store the result
function submit() {
  result = evaluateExpression();
  expression = '';
}

// Evaluate the mathematical expression safely
function evaluateExpression() {
  const evalResult = eval(expression);

  // If result is invalid or infinite, return empty space
  return isNaN(evalResult) || !isFinite(evalResult)
    ? ' '
    // For very small numbers, keep higher precision
    : evalResult < 1
    ? parseFloat(evalResult.toFixed(10))
    // For normal numbers, keep 2 decimal places
    : parseFloat(evalResult.toFixed(2));
}

// Change the sign of expression or result
function negate() {
  // Negate the result if expression is empty
  if (expression === '' && result !== '') {
    result = -result;
  }
  // Add negative sign to expression
  else if (!expression.startsWith('-') && expression !== '') {
    expression = '-' + expression;
  }
  // Remove negative sign if already present
  else if (expression.startsWith('-')) {
    expression = expression.slice(1);
  }
}

// Convert the value to percentage
function percentage() {
  // If expression exists, calculate first then divide by 100
  if (expression !== '') {
    result = evaluateExpression();
    expression = '';

    if (!isNaN(result) && isFinite(result)) {
      result /= 100;
    } else {
      result = '';
    }
  }
  // If only result exists, directly divide it by 100
  else if (result !== '') {
    result = parseFloat(result) / 100;
  }
}

// Add decimal only if it's valid
function decimal(value) {
  // Prevent adding multiple decimals or invalid decimal placement
  if (!expression.endsWith('.') && !isNaN(expression.slice(-1))) {
    addValue(value);
  }
}
