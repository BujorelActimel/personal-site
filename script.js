// Configuration
const config = {
    email: 'bujormihaialexandru@gmail.com',
    github: 'https://github.com/bujorelactimel',
    linkedin: 'https://linkedin.com/in/mihai-alexandru-bujor-27313525b/',

    // Unified articles section
    articles: [
        {
            title: "Online Graph Editor",
            date: "2025-10-26",
            tags: ['edu', 'tooling', 'graphs'],
            excerpt: "A tool for visualizing graphs from adjacency matrices and lists, built specifically for high school students learning graph algorithms.",
            file: "/content/resources/graph-editor.md"
        },
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
    setupRouting();
    // Load page from URL hash or default to home
    const hash = window.location.hash.slice(1) || 'home';
    handleRoute(hash);
});

// Setup URL routing
function setupRouting() {
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1) || 'home';
        handleRoute(hash);
    });
}

// Handle routing
function handleRoute(hash) {
    // Check if it's an article route (format: articles/slug or articles/index)
    if (hash.startsWith('articles/')) {
        const articleIdentifier = hash.split('/')[1];

        // Try to find article by index or by slug
        let article;
        const index = parseInt(articleIdentifier);
        if (!isNaN(index)) {
            article = config.articles[index];
        } else {
            // Find by slug (derived from title)
            article = config.articles.find(a => createSlug(a.title) === articleIdentifier);
        }

        if (article) {
            loadArticleDirect(article);
        } else {
            loadPage('404');
        }
    } else {
        loadPage(hash);
    }
}

// Create URL-friendly slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            window.location.hash = page;
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

    // Update active nav indicator
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });

    // Update URL hash without triggering hashchange
    if (window.location.hash.slice(1) !== page) {
        history.replaceState(null, null, `#${page}`);
    }

    // Add exit animation
    app.classList.add('page-transition-exit-active');

    setTimeout(() => {
        app.classList.remove('page-transition-exit-active');

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
            default:
                app.innerHTML = render404();
                setup404Listeners();
                break;
        }

        // Add enter animation
        app.classList.add('page-transition-enter');
        requestAnimationFrame(() => {
            app.classList.remove('page-transition-enter');
            app.classList.add('page-transition-enter-active');
            setTimeout(() => {
                app.classList.remove('page-transition-enter-active');
            }, 80);
        });
    }, 60);
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Render articles list
function renderArticlesList() {
    const allTags = getAllTags();
    const filteredArticles = filterArticles();

    let html = '<h1 class="page-title">Articles</h1>';

    // Compact filters section
    html += '<div class="filters">';

    // Search/filter toggle
    html += '<div class="filter-controls">';
    html += '<input type="text" class="search-input" placeholder="Search articles..." id="article-search">';

    // Only show tag filters if there are tags
    if (allTags.length > 0) {
        html += '<div class="filter-tags">';
        allTags.forEach(tag => {
            const isActive = selectedTags.includes(tag);
            html += `<button class="tag-filter ${isActive ? 'active' : ''}" data-tag="${tag}">${tag}</button>`;
        });
        html += '</div>';
    }

    html += '</div>'; // End filter-controls
    html += '</div>'; // End filters

    // Articles list
    html += '<div class="item-list">';

    if (filteredArticles.length === 0) {
        html += '<p class="no-results">No articles found matching the selected filters.</p>';
    } else {
        filteredArticles.forEach((article) => {
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
    // Search input listener
    const searchInput = document.getElementById('article-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.item-card');

            cards.forEach(card => {
                const title = card.querySelector('h2').textContent.toLowerCase();
                const excerpt = card.querySelector('.item-excerpt').textContent.toLowerCase();
                const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');

                const matches = title.includes(searchTerm) || excerpt.includes(searchTerm) || tags.includes(searchTerm);
                card.style.display = matches ? 'block' : 'none';
            });
        });
    }

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

// Load article from article list (no URL update to prevent loop)
function loadArticle(article) {
    // Update URL with article slug
    const slug = createSlug(article.title);
    window.location.hash = `articles/${slug}`;
}

// Load article directly (with page transition)
function loadArticleDirect(article) {
    currentView = 'detail';
    const app = document.getElementById('app');

    // Update active nav indicator
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === 'articles') {
            link.classList.add('active');
        }
    });

    // Add exit animation
    app.classList.add('page-transition-exit-active');

    setTimeout(() => {
        app.classList.remove('page-transition-exit-active');

        app.innerHTML = `
            <a class="back-button">← Back to Articles</a>
            <div class="content" id="markdown-content">Loading...</div>
        `;

        document.querySelector('.back-button').addEventListener('click', () => {
            window.location.hash = 'articles';
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
            .catch(() => {
                document.getElementById('markdown-content').innerHTML = `
                    <p>Could not load article. Make sure the file exists at: ${article.file}</p>
                `;
            });

        // Add enter animation
        app.classList.add('page-transition-enter');
        requestAnimationFrame(() => {
            app.classList.remove('page-transition-enter');
            app.classList.add('page-transition-enter-active');
            setTimeout(() => {
                app.classList.remove('page-transition-enter-active');
            }, 80);
        });
    }, 60);
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

// Render 404 page with ASCII animation
function render404() {
    return `
        <div class="error-404">
            <div class="ascii-animation">
                <pre id="ascii-art"></pre>
            </div>

            <a class="back-home-link">← Back to Home</a>
        </div>
    `;
}

// Setup 404 page listeners
function setup404Listeners() {
    const backHomeLink = document.querySelector('.back-home-link');
    if (backHomeLink) {
        backHomeLink.addEventListener('click', () => {
            window.location.hash = 'home';
        });
    }

    initAsciiAnimation();
}

// ASCII Animation - Glitching "404 NOT FOUND"
function initAsciiAnimation() {
    const asciiEl = document.getElementById('ascii-art');
    if (!asciiEl) return;

    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    const targetText = '404 NOT FOUND';
    let frame = 0;

    function glitchText() {
        let result = '';
        for (let i = 0; i < targetText.length; i++) {
            if (Math.random() > 0.85) {
                result += chars[Math.floor(Math.random() * chars.length)];
            } else {
                result += targetText[i];
            }
        }
        return result;
    }

    function animate() {
        frame++;

        // Every few frames, show the correct text briefly
        if (frame % 15 === 0) {
            asciiEl.textContent = targetText;
        } else if (frame % 3 === 0) {
            asciiEl.textContent = glitchText();
        }
    }

    // Start animation
    setInterval(animate, 80);
}
