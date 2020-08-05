const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const clearButton = document.querySelector('.clear');
const backspaceButton = document.querySelector('.backspace');
const negativePositiveButton = document.querySelector('.negative-positive');
const equalsButton = document.querySelector('.equals');
const totalDisplay = document.querySelector('.total');
const equationDisplay = document.querySelector('.equation');
let num1 = "";
let num2 = "";
let tempNum = "";
let operator;

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

function clearCalculator() {
    num1 = '';
    num2 = '';
    operator = undefined;
    totalDisplay.innerHTML = 0;
    equationDisplay.innerHTML = '';
}

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        totalDisplay.id = 'erase-active';
        if (equationDisplay.innerHTML[equationDisplay.innerHTML.length - 1] === '=' || totalDisplay.innerHTML === 'Cannot divide by zero') clearCalculator();
        if (String(num2) === '0') num2 = '';
        if (button.innerHTML === '.' && num2.includes('.')) return;
        num2 += button.innerHTML;
        if (num2 === '.') num2 = '0.';
        totalDisplay.innerHTML = num2;
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        let operatorArray = ['+', '-', '×', '÷'];
        if (totalDisplay.innerHTML === 'Cannot divide by zero') clearCalculator();
        if (equationDisplay.innerHTML[equationDisplay.innerHTML.length - 1] === '=') {
            equationDisplay.innerHTML = `${num1} ${button.innerHTML} `;
            operator = button.innerHTML;
        } else if (operatorArray.includes(equationDisplay.innerHTML[equationDisplay.innerHTML.length - 2]) && num2 === '') {
            equationDisplay.innerHTML = equationDisplay.innerHTML.slice(0, -2);
            equationDisplay.innerHTML = `${equationDisplay.innerHTML} ${button.innerHTML} `;
            operator = button.innerHTML;
        } else {
            equationDisplay.innerHTML += `${num2} ${button.innerHTML} `;
            if (num1 !== '' && num2 !== '') {
                num1 = calculate(operator, parseFloat(num1), parseFloat(num2));
                operator === '÷' && num2 === '0' ? totalDisplay.innerHTML = 'Cannot divide by zero' : totalDisplay.innerHTML = num1;
                operator = button.innerHTML;
            } else if (num1 === '' && num2 === '') {
                operator = button.innerHTML;
                num1 = '0';
                equationDisplay.innerHTML = `${num1} ${button.innerHTML} `;
            } else {
                operator = button.innerHTML;
                num1 = num2;
            }
            num2 = '';
        }
        totalDisplay.removeAttribute('id');
    });
});

equalsButton.addEventListener('click', () => {
    if (totalDisplay.innerHTML === 'Cannot divide by zero') {
        clearCalculator();
        return;
    } else if (equationDisplay.innerHTML[equationDisplay.innerHTML.length - 1] === '=' && operator === undefined) {
        return;
    } else if (equationDisplay.innerHTML[equationDisplay.innerHTML.length - 1] === '=') {
        num2 = tempNum;
        equationDisplay.innerHTML = `${num1} ${operator} ${num2} ${equalsButton.innerHTML}`;
        num1 = calculate(operator, parseFloat(num1), parseFloat(num2));
        (operator === '÷' && num2 === '0') ? totalDisplay.innerHTML = 'Cannot divide by zero' : totalDisplay.innerHTML = num1;
    } else {
        if (operator === undefined) {
            if (num2 === '') num2 = '0';
            num1 = num2;
        } else {
            if (num2 === '') num2 = num1;
            num1 = calculate(operator, parseFloat(num1), parseFloat(num2));
            (operator === '÷' && num2 === '0') ? totalDisplay.innerHTML = 'Cannot divide by zero' : totalDisplay.innerHTML = num1;
        }
        tempNum = num2;
        equationDisplay.innerHTML += `${num2} ${equalsButton.innerHTML}`;
    }
    num2 = '';
    totalDisplay.removeAttribute('id');
});

negativePositiveButton.addEventListener('click', () => {
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
});

backspaceButton.addEventListener('click', () => {
    if (totalDisplay.id === 'erase-active') {
        num2 = (num2.slice(0, -1));
        if (num2 === '' || num2 === '-') num2 = '0';
        totalDisplay.innerHTML = num2;
    }
});

clearButton.addEventListener('click', clearCalculator);