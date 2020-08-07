const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const clearButton = document.querySelector('.clear');
const backspaceButton = document.querySelector('.backspace');
const negativePositiveButton = document.querySelector('.negative-positive');
const equalsButton = document.querySelector('.equals');
const totalDisplay = document.querySelector('.total');
const equationDisplay = document.querySelector('.equation');
let operatorArray = ['+', '-', '×', '÷', '*', '/'];
let num1 = "";
let num2 = "";
let tempNum = "";
let currentOperator;

function calculate(operate, a, b) {
    let operatorFunctions = {
        '+': function(a, b) {
            return a + b;
        },
        '-': function(a, b) {
            return a - b;
        },
        '×': function(a, b) {
            return a * b;
        },
        '÷': function(a, b) {
            return a / b;
        }
    }
    return operatorFunctions[operate](a, b);
}

function number(buttonValue) {
    totalDisplay.id = 'erase-active';
    if (equationDisplay.innerHTML[equationDisplay.innerHTML.length - 1] === '=' || totalDisplay.innerHTML === 'Cannot divide by zero') clearCalculator();
    if (String(num2) === '0') num2 = '';
    if (buttonValue === '.' && num2.includes('.')) return;
    num2 += buttonValue;
    if (num2 === '.') num2 = '0.';
    totalDisplay.innerHTML = num2;
}

function operator(buttonValue) {
    if (totalDisplay.innerHTML === 'Cannot divide by zero') clearCalculator();
    if (equationDisplay.innerHTML[equationDisplay.innerHTML.length - 1] === '=') {
        equationDisplay.innerHTML = `${num1} ${buttonValue} `;
        currentOperator = buttonValue;
    } else if (operatorArray.includes(equationDisplay.innerHTML[equationDisplay.innerHTML.length - 2]) && num2 === '') {
        equationDisplay.innerHTML = equationDisplay.innerHTML.slice(0, -2);
        equationDisplay.innerHTML = `${equationDisplay.innerHTML} ${buttonValue} `;
        currentOperator = buttonValue;
    } else {
        equationDisplay.innerHTML += `${num2} ${buttonValue} `;
        if (num1 !== '' && num2 !== '') {
            num1 = calculate(currentOperator, parseFloat(num1), parseFloat(num2));
            currentOperator === '÷' && num2 === '0' ? totalDisplay.innerHTML = 'Cannot divide by zero' : totalDisplay.innerHTML = num1;
            currentOperator = buttonValue;
        } else if (num1 === '' && num2 === '') {
            currentOperator = buttonValue;
            num1 = '0';
            equationDisplay.innerHTML = `${num1} ${buttonValue} `;
        } else {
            currentOperator = buttonValue;
            num1 = num2;
        }
        num2 = '';
    }
    totalDisplay.removeAttribute('id');
}

function equals() {
    if (totalDisplay.innerHTML === 'Cannot divide by zero') {
        clearCalculator();
        return;
    } else if (equationDisplay.innerHTML[equationDisplay.innerHTML.length - 1] === '=' && currentOperator === undefined) {
        return;
    } else if (equationDisplay.innerHTML[equationDisplay.innerHTML.length - 1] === '=') {
        num2 = tempNum;
        equationDisplay.innerHTML = `${num1} ${currentOperator} ${num2} ${equalsButton.innerHTML}`;
        num1 = calculate(currentOperator, parseFloat(num1), parseFloat(num2));
        (currentOperator === '÷' && num2 === '0') ? totalDisplay.innerHTML = 'Cannot divide by zero' : totalDisplay.innerHTML = num1;
    } else {
        if (currentOperator === undefined) {
            if (num2 === '') num2 = '0';
            num1 = num2;
        } else {
            if (num2 === '') num2 = num1;
            num1 = calculate(currentOperator, parseFloat(num1), parseFloat(num2));
            (currentOperator === '÷' && num2 === '0') ? totalDisplay.innerHTML = 'Cannot divide by zero' : totalDisplay.innerHTML = num1;
        }
        tempNum = num2;
        equationDisplay.innerHTML += `${num2} ${equalsButton.innerHTML}`;
    }
    num2 = '';
    totalDisplay.removeAttribute('id');
}

function clearCalculator() {
    num1 = '';
    num2 = '';
    currentOperator = undefined;
    totalDisplay.innerHTML = 0;
    equationDisplay.innerHTML = '';
}

function negativePositive() {
    if(num2 === '' && equationDisplay.innerHTML[equationDisplay.innerHTML.length - 1] !== '=' || totalDisplay.innerHTML === 'Cannot divide by zero') {
        return;
    } else if (totalDisplay.innerHTML > 0) {
        num2 = String(-Math.abs(totalDisplay.innerHTML));
        totalDisplay.innerHTML = num2;
    } else {
        num2 = String(Math.abs(totalDisplay.innerHTML));
        totalDisplay.innerHTML = num2;
    } 
    
    if (equationDisplay.innerHTML[equationDisplay.innerHTML.length - 1] === '=') {
        num1 = num2;
        num2 = '';
    }
}

function backspace() {
    if (totalDisplay.id === 'erase-active') {
        num2 = (num2.slice(0, -1));
        if (num2 === '' || num2 === '-') num2 = '0';
        totalDisplay.innerHTML = num2;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearCalculator();
    } else if (e.key.match(/[0-9.]/)) {
        number(e.key);
    } else if (operatorArray.includes(e.key)) {
        switch(e.key) {
            case '+': operator('+');
            break;
            case '-': operator('-');
            break;
            case '*': operator('×');
            break;
            case '/': operator('÷');
            break;
        }
    } else if (e.key === '=' || e.key === 'Enter') {
        equals();
    } else if (e.key.toLowerCase() === 'n') {
        negativePositive();
    } else if (e.key === 'Backspace') {
        backspace();
    }
});

numberButtons.forEach(button => button.addEventListener('mousedown', () => number(button.innerHTML)));
operatorButtons.forEach(button => button.addEventListener('mousedown', () => operator(button.innerHTML)));
equalsButton.addEventListener('mousedown', equals);
clearButton.addEventListener('mousedown', clearCalculator);
negativePositiveButton.addEventListener('mousedown', negativePositive);
backspaceButton.addEventListener('mousedown', backspace);