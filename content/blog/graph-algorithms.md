# Understanding Graph Algorithms

## What are Graphs?

Graphs are data structures consisting of nodes (vertices) connected by edges. They're used to represent networks, relationships, and many real-world problems.

## Depth-First Search (DFS)

DFS explores as far as possible along each branch before backtracking.

```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    print(start)
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited
```

## Breadth-First Search (BFS)

BFS explores all neighbors at the current depth before moving to nodes at the next depth level.

```python
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        vertex = queue.popleft()
        print(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

## Applications

- Social networks
- Web crawling
- GPS navigation
- Network routing
- Dependency resolution

## When to Use Which?

- **DFS**: Finding paths, topological sorting, cycle detection
- **BFS**: Shortest path in unweighted graphs, level-order traversal