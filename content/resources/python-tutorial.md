# Python Programming Tutorial

## Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability.

## Getting Started

### Installation
```bash
# Download from python.org
# Or use a package manager
brew install python  # macOS
apt-get install python3  # Ubuntu
```

### Your First Program
```python
print("Hello, World!")
```

## Basic Concepts

### Variables and Data Types
```python
name = "Alice"  # string
age = 25        # integer
height = 5.6    # float
is_student = True  # boolean
```

### Control Flow
```python
if age >= 18:
    print("Adult")
else:
    print("Minor")

for i in range(5):
    print(i)

while age < 30:
    age += 1
```

### Functions
```python
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))
```

### Lists and Dictionaries
```python
fruits = ["apple", "banana", "orange"]
person = {"name": "Alice", "age": 25}
```

## Advanced Topics

- List comprehensions
- Generators
- Decorators
- Context managers
- Object-oriented programming

## Practice Exercises

Work through the exercises in the accompanying notebook to reinforce your learning!