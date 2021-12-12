const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const numberBtn = $$("[data-number]");
const operatorBtn = $$("[data-operator]");
const equalBtn = $("[data-operator]");
const deleteBtn = $("[data-delete]");
const allClearBtn = $("[data-all-clear]");
const previousOperand = $("[data-previous]");
const currentOperand = $("[data-current]");
const parenthesis = $$("[data-parenthesis]");
const themeSwitch = $("#dark-mode");

class Calculator {
  #calculatorExp;
  #currentNumber;
  #previousOperand;
  #operator;
  #parenthesis;
  constructor(previousOperand, currentOperand) {
    this.previousOperandElement = previousOperand;
    this.currentOperandElement = currentOperand;
    this.clearData();
  }

  clearData() {
    this.previousOperandElement.innerText = "";
    this.currentOperandElement.innerText = "";
    this.#operator = undefined;
    this.#currentNumber = "";
    this.#previousOperand = "";
    this.#calculatorExp = "";
    this.#parenthesis = [];
  }

  delete() {
    if (!this.#operator) {
      // khong co toan tu
      if (this.#currentNumber) {
        this.#currentNumber = this.#currentNumber.slice(0, -1);
        console.log("here");
        this.updateDisplay();
        return;
      }
      this.#calculatorExp = this.#calculatorExp.slice(0, -1);
      this.currentOperandElement.innerText = this.#calculatorExp;
      return;
    }
    this.#calculatorExp = this.#calculatorExp.slice(0, -1);
    this.currentOperandElement.innerText = this.#calculatorExp;
    this.#operator = undefined;
  }

  updateDisplay(state = "operand") {
    if (state === "operator") {
      this.currentOperandElement.innerText += this.#operator;
      return;
    }
    // state = "operand"
    if (!this.#currentNumber) {
      this.currentOperandElement.innerText = this.#calculatorExp;
      return;
    }
    const numberOnScreen = new Intl.NumberFormat("en-US").format(
      this.#currentNumber
    );
    this.currentOperandElement.innerText = this.#calculatorExp + numberOnScreen;
  }

  calculate(e) {
    if (!this._isValidParenthesis()) {
      alert("Invalid Parenthesis");
      return;
    }
    this.#calculatorExp += this.#currentNumber;
    this.#previousOperand = this.#calculatorExp;
    this.#calculatorExp = this._replaceOperator(this.#calculatorExp);

    try {
      this.#calculatorExp =
        eval(this.#calculatorExp) % 1 == 0
          ? eval(this.#calculatorExp)
          : eval(this.#calculatorExp).toFixed(2);
    } catch (error) {
      alert("Invalid Expression");
      return;
    }
    if (!Number.isFinite(this.#calculatorExp)) {
      alert("Inifinite value");
      alert("Please type again!");
      return;
    }
    this.currentOperandElement.innerText = new Intl.NumberFormat(
      "en-US"
    ).format(this.#calculatorExp);
    this.previousOperandElement.innerText = this.#previousOperand;

    this.#currentNumber = this.#calculatorExp;
    this.#calculatorExp = "";
  }

  _replaceOperator(expression) {
    return expression
      .replace(/−/g, "-")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/,/g, "");
  }

  appendNumber(e) {
    const number = e.target.innerText.trim();
    this.#currentNumber += number;
    this.#operator = undefined;
    this.updateDisplay();
  }

  appendOperator(e) {
    if (this.#operator) return;
    if (e.target.innerText.includes("=")) return this.calculate();

    this.#operator = e.target.innerText.trim();
    const number =
      this.#currentNumber === ""
        ? ""
        : new Intl.NumberFormat("en-US").format(this.#currentNumber);
    this.#calculatorExp += number + this.#operator;
    console.log(this.#calculatorExp);
    this.#currentNumber = "";
    this.updateDisplay("operator");
    console.log(this.#calculatorExp);
  }

  appendParenthesis(e) {
    const char = e.target.innerText.trim();
    if (this.#currentNumber && char == "(") return;
    this.#operator = undefined;
    if (char === "(") {
      this.#calculatorExp += char;
      this.currentOperandElement.innerText += char;
      return;
    }
    this.#calculatorExp += this.#currentNumber + char;
    this.#currentNumber = "";
    this.currentOperandElement.innerText += char;
  }

  showPreviousExpression() {
    this.previousOperandElement.innerText = "";
    this.#operator = undefined;
    this.#currentNumber = "";
    this.#calculatorExp = this.#previousOperand;
    this.currentOperandElement.innerText = this.#previousOperand;
  }

  _isValidParenthesis() {
    if (!this.#calculatorExp.length) return true;
    if (
      !this.#calculatorExp.includes("(") &&
      !this.#calculatorExp.includes(")")
    )
      return true;

    for (const character of this.#calculatorExp) {
      const isOpenChar = character.includes("(");
      if (isOpenChar) {
        this.#parenthesis.push(character);
      } else {
        const top = this.#parenthesis.pop();
        if (character === top) return false;
      }
    }
    console.log(this.#parenthesis);
    return this.#parenthesis.length === 0;
  }

  // Switching Dark-light mode
  toggleTheme(e) {
    if (e.target.checked)
      document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.setAttribute("data-theme", "light");
  }
}

const app = new Calculator(previousOperand, currentOperand);

// in small application, so i dont want to use EventDelegation technical
numberBtn.forEach((btn) => {
  btn.addEventListener("click", app.appendNumber.bind(app));
});

operatorBtn.forEach((btn) => {
  btn.addEventListener("click", app.appendOperator.bind(app));
});

parenthesis.forEach((btn) =>
  btn.addEventListener("click", app.appendParenthesis.bind(app))
);

previousOperand.addEventListener("click", app.showPreviousExpression.bind(app));

deleteBtn.addEventListener("click", app.delete.bind(app));
allClearBtn.addEventListener("click", app.clearData.bind(app));

themeSwitch.addEventListener("click", app.toggleTheme);
