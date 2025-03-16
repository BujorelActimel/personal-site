# Markdown-Powered Personal Website

A minimal, clean, dark-themed personal website with easy content management through Markdown files. This project provides a simple way to showcase your information, projects, articles, and teaching materials in an elegant, easily maintainable website.


## Project Structure

```
website/
│
├── index.html                  # Main page
├── about.html                  # About page
├── projects.html               # Projects page
├── articles.html               # Articles listing page
├── teaching.html               # Teaching listing page
│
├── css/
│   └── styles.css              # Main stylesheet
│
├── js/
│   ├── main.js                 # Main JavaScript file
│   └── markdown.js             # Markdown rendering functions
│
├── content/
│   ├── about.md                # About page content
│   ├── projects.md             # Projects page content
│   │
│   ├── articles/               # Articles folder
│   │   ├── metadata.json       # Articles metadata for listing
│   │   ├── article1.md         # Individual article content
│   │   ├── article2.md
│   │   └── ...
│   │
│   └── teaching/               # Teaching materials folder
│       ├── metadata.json       # Teaching courses metadata
│       ├── course1/            # Course folders
│       │   ├── info.md         # Course information
│       │   ├── lectures.json   # Lectures metadata
│       │   ├── lecture1.md     # Individual lectures
│       │   ├── lecture2.md
│       │   └── ...
│       │
│       ├── course2/
│       └── ...
```

## Adding Content

### Updating About Page

Edit `content/about.md` with your information in Markdown format.

### Adding Projects

Edit `content/projects.md` to add or modify your projects.

### Adding Articles

1. Create a new Markdown file (e.g., `article3.md`) in the `content/articles/` folder
2. Update `content/articles/metadata.json` to include your new article:

```json
{
  "id": "3",
  "title": "Your New Article Title",
  "date": "March 20, 2025",
  "description": "Brief description of your article.",
  "file": "article3.md"
}
```

### Adding Teaching Materials

1. For a new course:
   - Create a new folder (e.g., `course3`) in the `content/teaching/` directory
   - Add an `info.md` file with course information
   - Add a `lectures.json` file to list lectures
   - Update `content/teaching/metadata.json` to include the new course

2. For new lectures in an existing course:
   - Add a new Markdown file (e.g., `lecture5.md`) in the course folder
   - Update the `lectures.json` file to include the new lecture

## Markdown Features

The Markdown renderer supports:

- Headings (`#`, `##`, `###`)
- Bold text (`**bold**`)
- Italic text (`*italic*`)
- Lists (`- item`)
- Code blocks (``` code ```)
- Links (`[text](url)`)
- Paragraphs (separated by blank lines)
