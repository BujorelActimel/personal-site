# Online Graph Editor

When working with graphs it's kind of hard to think about them in terms
of matrixes or adjacency lists, and rather in a more graphical way, so
a tool that draws graphs from these representations would be useful. There is <a href=https://csacademy.com/app/graph_editor>this</a>
website that does that, but I find it very frustrating to work with,
and it is missing a feature that I need when working specifically with high school students.

## Enter the 'solution'

Because of the problems mentioned above, I tried to build my own version,
you can tinker with it <a href=https://graph-editor.onrender.com>here</a> and if you want to check the source code, 
you can find it <a href=https://github.com/BujorelActimel/graph-editor>here</a>. (feel free to fork and do whatever you want with it)

## What's different?

Adjacency matrix support. That's all.
I know that there is a reason for that, nobody really uses them when working
with graphs, but you know who does? High school students. That's actually the main
data structure used to teach graph algorithms. So when working with them, you would
want an easy way to instantly draw a graph from this kind of matrix, well that's
exactly what it does, It can parse and render a graph, based on the adjacency matrix,
or after manually drawing a graph, to export its adjacency matrix in a text file.

## Try it yourself

This tool has high schoolers and teachers in mind, so give it a try, see if it helps,
for me it's definitely a helpful tool. PRs are welcome too!