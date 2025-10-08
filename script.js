// Configuration
const config = {
    email: 'bujormihaialexandru@gmail.com',
    github: 'https://github.com/bujorelactimel',
    linkedin: 'https://linkedin.com/in/mihai-alexandru-bujor-27313525b/',
    
    blogPosts: [
        {
            title: "Getting Started with Functional Programming",
            date: "October 2025",
            excerpt: "Exploring the fundamentals of functional programming and its applications in modern software development.",
            file: "content/blog/functional-programming.md"
        },
        {
            title: "Understanding Graph Algorithms",
            date: "September 2025",
            excerpt: "A deep dive into graph traversal algorithms, including BFS and DFS, and their practical applications.",
            file: "content/blog/graph-algorithms.md"
        },
        {
            title: "Reflections on Learning Computer Science",
            date: "August 2025",
            excerpt: "My journey through computer science education, lessons learned, and advice for aspiring developers.",
            file: "content/blog/learning-cs.md"
        }
    ],
    
    resources: [
        {
            title: "Data Structures & Algorithms Course",
            type: "Course Materials",
            excerpt: "Complete lecture notes, assignments, and supplementary materials for the Data Structures and Algorithms course.",
            file: "content/resources/dsa-course.md"
        },
        {
            title: "Python Programming Tutorial",
            type: "Educational Tool",
            excerpt: "Interactive Python tutorial for beginners covering basics to advanced topics with practical examples.",
            file: "content/resources/python-tutorial.md"
        },
        {
            title: "Algorithm Complexity Cheat Sheet",
            type: "Reference Material",
            excerpt: "Quick reference for time and space complexity of common algorithms and data structures.",
            file: "content/resources/complexity-cheatsheet.md"
        }
    ]
};

// State management
let currentPage = 'home';
let currentView = 'list';

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
    const app = document.getElementById('app');
    
    switch(page) {
        case 'home':
            app.innerHTML = renderHome();
            break;
        case 'about':
            app.innerHTML = renderAbout();
            break;
        case 'blog':
            app.innerHTML = renderBlogList();
            setupBlogListeners();
            break;
        case 'resources':
            app.innerHTML = renderResourceList();
            setupResourceListeners();
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
            <p>Welcome! I'm Mihai, a Computer Science student passionate about artificial intelligence, software engineering, and theoretical computer science.</p>
            
            <h2>Background</h2>
            <p>I'm currently pursuing my degree in Computer Science, where I focus on understanding both the theoretical foundations and practical applications of computing.</p>
            
            <h2>Interests</h2>
            <p>My primary areas of interest include:</p>
            <ul>
                <li>Artificial Intelligence and Machine Learning</li>
                <li>Algorithm Design and Analysis</li>
                <li>Software Engineering Best Practices</li>
                <li>Theoretical Computer Science</li>
            </ul>

            <h2>This Website</h2>
            <p>This site serves as a space where I share my thoughts, projects, and resources with fellow students and anyone interested in computer science.</p>
        </div>
    `;
}

// Render blog list
function renderBlogList() {
    let html = '<h1 class="page-title">Blog</h1><div class="item-list">';
    
    config.blogPosts.forEach((post, index) => {
        html += `
            <div class="item-card" data-index="${index}">
                <h2>${post.title}</h2>
                <p class="item-meta">${post.date}</p>
                <p class="item-excerpt">${post.excerpt}</p>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Setup blog listeners
function setupBlogListeners() {
    const cards = document.querySelectorAll('.item-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            loadBlogPost(config.blogPosts[index]);
        });
    });
}

// Load blog post
function loadBlogPost(post) {
    currentView = 'detail';
    const app = document.getElementById('app');
    app.innerHTML = `
        <a class="back-button">← Back to Blog</a>
        <div class="content" id="markdown-content">Loading...</div>
    `;
    
    document.querySelector('.back-button').addEventListener('click', () => {
        loadPage('blog');
    });
    
    fetch(post.file)
        .then(response => {
            if (!response.ok) throw new Error('Post not found');
            return response.text();
        })
        .then(markdown => {
            document.getElementById('markdown-content').innerHTML = marked.parse(markdown);
        })
        .catch(error => {
            document.getElementById('markdown-content').innerHTML = `
                <p>Could not load blog post. Make sure the file exists at: ${post.file}</p>
            `;
        });
}

// Render resource list
function renderResourceList() {
    let html = '<h1 class="page-title">Resources</h1><div class="item-list">';
    
    config.resources.forEach((resource, index) => {
        html += `
            <div class="item-card" data-index="${index}">
                <h2>${resource.title}</h2>
                <p class="item-meta">${resource.type}</p>
                <p class="item-excerpt">${resource.excerpt}</p>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Setup resource listeners
function setupResourceListeners() {
    const cards = document.querySelectorAll('.item-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            loadResource(config.resources[index]);
        });
    });
}

// Load resource
function loadResource(resource) {
    currentView = 'detail';
    const app = document.getElementById('app');
    app.innerHTML = `
        <a class="back-button">← Back to Resources</a>
        <div class="content" id="markdown-content">Loading...</div>
    `;
    
    document.querySelector('.back-button').addEventListener('click', () => {
        loadPage('resources');
    });
    
    fetch(resource.file)
        .then(response => {
            if (!response.ok) throw new Error('Resource not found');
            return response.text();
        })
        .then(markdown => {
            document.getElementById('markdown-content').innerHTML = marked.parse(markdown);
        })
        .catch(error => {
            document.getElementById('markdown-content').innerHTML = `
                <p>Could not load resource. Make sure the file exists at: ${resource.file}</p>
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
