"use strict";

/**
 * Get all the span elements I'll use to show data
 */
const screenEntry = document.getElementById('operation'),
  screenResult = document.getElementById('result'),
  screenError = document.getElementById('errorMsg'),
  operations = ['/', '*', '-', '+'];

let number = '';
let expression = [];

/**
 * Get all the buttons and add onclick event to them
 */
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    screenError.innerText = '';
    const value = button.innerText;
    if (value === '=') {
      expression.push(number);
      screenEntry.innerText = calculate(expression);
      number = '';
      expression = [];
      return;
    }
    if (value === '.' && number.includes('.')) {
      error('No double points in one number!');
      return;
    }
    if (value === 'AC') {
      number = '';
      expression = [];
      screenEntry.innerText = '0';
      screenResult.innerText = '0';
      return;
    }
    // TODO: Clean 0 from expression if tried to divide by it
    if (isOperation(value)) {
      // Validate operation is not first button
      if (expression.length === 0 && number === '') error('Can not start with an operand!');
      // Validate not double operations
      if (isOperation(expression[expression.length - 1]) && number === '') error('Can not parse two continuous operands!');
      expression.push(number);
      evaluate(expression);
      number = '';
      expression.push(value);
    } else {
      number += value;
      evaluate([...expression, number]);
    }
    screenEntry.innerText = expression.join('').toString() + number;
  })
})

const isOperation = (value = '') => operations.includes(value);

const operation = (x, y, operand) => {
  if (operand === '+') return x + y;
  if (operand === '-') return x - y;
  if (operand === '*') return x * y;
  if (operand === '/') {
    if (y === 0) error('Division by cero not allowed!');
    return x / y;
  }
}

/**
 * 
 * @param {*} data Array with the mathematical expression
 * @param {*} sameLevelOperations Operations to solve at the same time in order from right to left
 * @returns A new smaller array with all the operations passed solved
 */
const calculateOperation = (data = [], sameLevelOperations = []) => {
  if (data.length === 0) return [0];
  if (data.length === 1) return data;
  let dataArr = [...data];
  const idx = dataArr.findIndex(value => sameLevelOperations.includes(value));
  if (idx === -1) return dataArr;
  const x = parseFloat(dataArr[idx - 1]);
  const y = parseFloat(dataArr[idx + 1]);
  const operand = dataArr[idx];
  dataArr = [...dataArr.slice(0, idx - 1), operation(x, y, operand), ...dataArr.slice(idx + 2)];
  return calculateOperation(dataArr, sameLevelOperations);
}

/**
 * 
 * @param {*} validExpression Array with the mathematical expression
 * @returns Final result of the mathematical operation after calculating the expression one level of operation at a time
 */
const calculate = (validExpression) => {
  if (validExpression.length === 0) return 0;
  if (validExpression.length === 1) return validExpression[0];
  const multiplicationAndDivision = calculateOperation(validExpression, ['*', '/']);
  if (multiplicationAndDivision.length === 1) return multiplicationAndDivision[0];
  const sumAndRest = calculateOperation(multiplicationAndDivision, ['+', '-']);
  return sumAndRest[0];
}

/**
 * 
 * @param {*} expression Array with the mathematical expression
 */
const evaluate = (expression) => {
  screenResult.innerText = calculate(expression);
}

/**
 * 
 * @param {*} msg Error message
 */
const error = msg => {
  screenError.innerText = msg;
  throw new Error(msg);
}

// TODO: Add keyboard support