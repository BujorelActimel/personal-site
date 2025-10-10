// Configuration
const config = {
    email: 'bujormihaialexandru@gmail.com',
    github: 'https://github.com/bujorelactimel',
    linkedin: 'https://linkedin.com/in/mihai-alexandru-bujor-27313525b/',

    // Unified articles section
    articles: [
        {
            title: "Getting Started with Functional Programming",
            date: "2025-10-01",
            tags: ['blog'],
            excerpt: "Exploring the fundamentals of functional programming and its applications in modern software development.",
            file: "content/blog/functional-programming.md"
        },
        {
            title: "Understanding Graph Algorithms",
            date: "2025-09-15",
            tags: ['blog'],
            excerpt: "A deep dive into graph traversal algorithms, including BFS and DFS, and their practical applications.",
            file: "content/blog/graph-algorithms.md"
        },
        {
            title: "Reflections on Learning Computer Science",
            date: "2025-08-20",
            tags: ['blog', 'rant'],
            excerpt: "My journey through computer science education, lessons learned, and advice for aspiring developers.",
            file: "content/blog/learning-cs.md"
        },
        {
            title: "Data Structures & Algorithms Course",
            date: "2025-01-10",
            tags: ['course material'],
            excerpt: "Complete lecture notes, assignments, and supplementary materials for the Data Structures and Algorithms course.",
            file: "content/resources/dsa-course.md"
        },
        {
            title: "Python Programming Tutorial",
            date: "2024-12-05",
            tags: ['educational tool'],
            excerpt: "Interactive Python tutorial for beginners covering basics to advanced topics with practical examples.",
            file: "content/resources/python-tutorial.md"
        },
        {
            title: "Algorithm Complexity Cheat Sheet",
            date: "2024-11-15",
            tags: ['reference'],
            excerpt: "Quick reference for time and space complexity of common algorithms and data structures.",
            file: "content/resources/complexity-cheatsheet.md"
        }
    ]
};

// Extract all unique tags from articles
function getAllTags() {
    const tagSet = new Set();
    config.articles.forEach(article => {
        article.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
}

// State management
let currentPage = 'home';
let currentView = 'list';
let selectedTags = [];
let selectedTimeFilter = 'all'; // 'all', 'year', '6months', '3months'

// Configure marked to use highlight.js
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (err) {}
        }
        return hljs.highlightAuto(code).value;
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadPage('home');
});

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            loadPage(page);
        });
    });
}

// Load page
function loadPage(page) {
    currentPage = page;
    currentView = 'list';
    selectedTags = [];
    selectedTimeFilter = 'all';
    const app = document.getElementById('app');

    switch(page) {
        case 'home':
            app.innerHTML = renderHome();
            break;
        case 'about':
            app.innerHTML = renderAbout();
            break;
        case 'articles':
            app.innerHTML = renderArticlesList();
            setupArticlesListeners();
            break;
        case 'contact':
            app.innerHTML = renderContact();
            break;
    }
}

// Render home page
function renderHome() {
    return `
        <div class="home-content">
            <h1>Bujor Mihai Alexandru</h1>
            <p class="subtitle">Computer Science Student</p>
            <p class="email"><a href="mailto:${config.email}">${config.email}</a></p>
        </div>
    `;
}

// Render about page
function renderAbout() {
    return `
        <h1 class="page-title">About Me</h1>
        <div class="content">
            <p>I'm Mihai, a Computer Science student <a href="https://www.cs.ubbcluj.ro/">@UBB</a> and software engineer 
            <a href="https://www.accenture.com/">@Accenture</a> with aspirations of becoming a teacher and a researcher</p>
                        
            <h2>Interests</h2>
            <ul>
                <li>Compiler design and programming languages</li>
                <li>Computer science education and tooling</li>
                <li>Developer tooling</li>
                <li>Distributed systems</li>
            </ul>

            <h2>This Website</h2>
            <p>Serves as a space where I share my thoughts, projects, and resources with students and anyone interested in whatever I am talking about</p>
        </div>
    `;
}

// Filter articles based on selected tags and time
function filterArticles() {
    let filtered = config.articles;

    // Filter by tags
    if (selectedTags.length > 0) {
        filtered = filtered.filter(article =>
            article.tags.some(tag => selectedTags.includes(tag))
        );
    }

    // Filter by time
    if (selectedTimeFilter !== 'all') {
        const now = new Date();
        const cutoffDate = new Date();

        switch(selectedTimeFilter) {
            case 'year':
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
            case '6months':
                cutoffDate.setMonth(now.getMonth() - 6);
                break;
            case '3months':
                cutoffDate.setMonth(now.getMonth() - 3);
                break;
        }

        filtered = filtered.filter(article => {
            const articleDate = new Date(article.date);
            return articleDate >= cutoffDate;
        });
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    return filtered;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}

// Render articles list
function renderArticlesList() {
    const allTags = getAllTags();
    const filteredArticles = filterArticles();

    let html = '<h1 class="page-title">Articles</h1>';

    // Filters section
    html += '<div class="filters">';

    // Tag filters
    html += '<div class="filter-group"><div class="filter-label">Tags:</div><div class="tag-filters">';
    allTags.forEach(tag => {
        const isActive = selectedTags.includes(tag);
        html += `<button class="tag-filter ${isActive ? 'active' : ''}" data-tag="${tag}">${tag}</button>`;
    });
    html += '</div></div>';

    // Time filters
    html += '<div class="filter-group"><div class="filter-label">Time:</div><div class="time-filters">';
    const timeOptions = [
        { value: 'all', label: 'All time' },
        { value: 'year', label: 'Past year' },
        { value: '6months', label: 'Past 6 months' },
        { value: '3months', label: 'Past 3 months' }
    ];
    timeOptions.forEach(option => {
        const isActive = selectedTimeFilter === option.value;
        html += `<button class="time-filter ${isActive ? 'active' : ''}" data-time="${option.value}">${option.label}</button>`;
    });
    html += '</div></div>';

    html += '</div>'; // End filters

    // Articles list
    html += '<div class="item-list">';

    if (filteredArticles.length === 0) {
        html += '<p class="no-results">No articles found matching the selected filters.</p>';
    } else {
        filteredArticles.forEach((article, index) => {
            const originalIndex = config.articles.indexOf(article);
            html += `
                <div class="item-card" data-index="${originalIndex}">
                    <h2>${article.title}</h2>
                    <div class="item-meta">
                        <span>${formatDate(article.date)}</span>
                        <span class="tags">${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</span>
                    </div>
                    <p class="item-excerpt">${article.excerpt}</p>
                </div>
            `;
        });
    }

    html += '</div>';
    return html;
}

// Setup articles listeners
function setupArticlesListeners() {
    // Tag filter listeners
    const tagFilters = document.querySelectorAll('.tag-filter');
    tagFilters.forEach(button => {
        button.addEventListener('click', () => {
            const tag = button.getAttribute('data-tag');
            if (selectedTags.includes(tag)) {
                selectedTags = selectedTags.filter(t => t !== tag);
            } else {
                selectedTags.push(tag);
            }
            refreshArticlesList();
        });
    });

    // Time filter listeners
    const timeFilters = document.querySelectorAll('.time-filter');
    timeFilters.forEach(button => {
        button.addEventListener('click', () => {
            selectedTimeFilter = button.getAttribute('data-time');
            refreshArticlesList();
        });
    });

    // Article card listeners
    const cards = document.querySelectorAll('.item-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            loadArticle(config.articles[index]);
        });
    });
}

// Refresh articles list (maintain filters)
function refreshArticlesList() {
    const app = document.getElementById('app');
    app.innerHTML = renderArticlesList();
    setupArticlesListeners();
}

// Load article
function loadArticle(article) {
    currentView = 'detail';
    const app = document.getElementById('app');
    app.innerHTML = `
        <a class="back-button">← Back to Articles</a>
        <div class="content" id="markdown-content">Loading...</div>
    `;

    document.querySelector('.back-button').addEventListener('click', () => {
        loadPage('articles');
    });

    fetch(article.file)
        .then(response => {
            if (!response.ok) throw new Error('Article not found');
            return response.text();
        })
        .then(markdown => {
            document.getElementById('markdown-content').innerHTML = marked.parse(markdown);
            // Apply syntax highlighting to all code blocks
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        })
        .catch(error => {
            document.getElementById('markdown-content').innerHTML = `
                <p>Could not load article. Make sure the file exists at: ${article.file}</p>
            `;
        });
}

// Render contact page
function renderContact() {
    return `
        <h1 class="page-title">Get in Touch</h1>
        <div class="contact-content">
            <p>Feel free to reach out if you have any questions or just want to connect.</p>
            
            <div class="contact-links">
                <a href="mailto:${config.email}" class="contact-link">
                    <i class="fa-solid fa-envelope"></i>
                    <span>Email</span>
                </a>
                <a href="${config.github}" class="contact-link" target="_blank">
                    <i class="fa-brands fa-github"></i>
                    <span>GitHub</span>
                </a>
                <a href="${config.linkedin}" class="contact-link" target="_blank">
                    <i class="fa-brands fa-linkedin"></i>
                    <span>LinkedIn</span>
                </a>
            </div>
        </div>
    `;
}
