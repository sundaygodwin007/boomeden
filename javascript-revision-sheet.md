# JavaScript Step-by-Step Revision Sheet

## 1. What JavaScript is

JavaScript makes web pages interactive.

It can:
- show messages
- change text on a page
- react to clicks
- store and use data

---

## 2. The basic beginner flow

The normal pattern is:

1. declare a variable
2. assign it a value
3. use it
4. check the result

Example:

```js
let name = "Amina";
console.log(name);
```

---

## 3. Variables

A variable is like a box that stores information.

Examples:

```js
let age = 20;
let isStudent = true;
let city = "Lagos";
```

### Common variable rules
- `let` creates the variable
- the name is the label
- the value is what it stores

---

## 4. Data types

### String
Text:

```js
let message = "Hello world";
```

### Number
A number:

```js
let price = 500;
```

### Boolean
True or false:

```js
let isActive = true;
```

### Undefined
Declared but no value yet:

```js
let result;
```

---

## 5. Comments

Comments help explain code and are ignored by JavaScript.

```js
// Single-line comment

/*
Multi-line comment
*/
```

---

## 6. Functions

A function is a reusable block of code.

Example:

```js
function greet() {
  console.log("Hello there");
}

greet();
```

### How to read it
- `function greet()` creates the function
- inside the braces is the code
- `greet()` runs the function

### Function with a parameter

```js
function greetUser(name) {
  console.log("Hello " + name);
}

greetUser("Amina");
```

---

## 7. If statements

An `if` statement checks a condition.

```js
let age = 18;

if (age >= 18) {
  console.log("You are an adult.");
}
```

### Meaning
- if the condition is true, the block runs
- if false, it does nothing

---

## 8. Basic logic pattern

This is the main thing to remember:

```js
let value = 5;
value = value + 2;
console.log(value);
```

### Flow
1. create variable
2. store value
3. update value
4. print result

---

## 9. How to understand JavaScript step by step

When reading code, ask:

1. What is being declared?
2. What value is assigned?
3. What happens next?
4. What does `console.log` show?
5. What condition or function is being used?

---

## 10. Beginner order to learn

Learn in this order:

1. variables
2. values and types
3. `console.log`
4. functions
5. `if` statements
6. loops
7. events

---

## 11. One-line summary

JavaScript is the language that makes webpages react and do things.
The beginner pattern is:

- declare
- assign
- use
- check

---

## 12. Practice task

Try writing this yourself:

```js
let studentName = "Kemi";
let score = 90;

console.log("Student: " + studentName);
console.log("Score: " + score);
```

Then ask yourself:
- What are the variables?
- What values do they store?
- What is printed in the console?
