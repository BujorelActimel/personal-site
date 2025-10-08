# Algorithm Complexity Cheat Sheet

## Big O Notation

Big O notation describes the upper bound of an algorithm's time or space complexity.

## Common Complexities (Best to Worst)

1. **O(1)** - Constant
2. **O(log n)** - Logarithmic
3. **O(n)** - Linear
4. **O(n log n)** - Linearithmic
5. **O(n²)** - Quadratic
6. **O(2ⁿ)** - Exponential
7. **O(n!)** - Factorial

## Data Structure Operations

### Array
- Access: O(1)
- Search: O(n)
- Insert: O(n)
- Delete: O(n)

### Linked List
- Access: O(n)
- Search: O(n)
- Insert: O(1)
- Delete: O(1)

### Hash Table
- Access: N/A
- Search: O(1) average
- Insert: O(1) average
- Delete: O(1) average

### Binary Search Tree
- Access: O(log n) average
- Search: O(log n) average
- Insert: O(log n) average
- Delete: O(log n) average

## Sorting Algorithms

| Algorithm | Best | Average | Worst | Space |
|-----------|------|---------|-------|-------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |

## Tips

- Always consider both time and space complexity
- Best case ≠ average case ≠ worst case
- Optimize for the common case, not edge cases