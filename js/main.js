// Main JavaScript for content loading and routing

document.addEventListener('DOMContentLoaded', function() {
  // Set up navigation
  setActiveNavLink();
  
  // Load content based on current page
  loadContent();
  
  // Handle navigation clicks
  setupNavigation();
});

// Get current page name from URL
function getCurrentPage() {
  const path = window.location.pathname;
  
  // Get the file name from the path
  const fileName = path.split('/').pop();
  
  // Handle root or empty cases
  if (path === '/' || fileName === '' || fileName === 'index.html') {
    return 'index.html';
  }
  
  return fileName || 'index.html';
}

// Set active navigation link
function setActiveNavLink() {
  const currentPage = getCurrentPage();
  
  // Remove active class from all links
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Determine which nav link should be active
  let activePage;
  
  if (currentPage === 'index.html') {
    activePage = 'index.html';
  } else if (currentPage.startsWith('article-')) {
    activePage = 'articles.html';
  } else if (currentPage.startsWith('course-')) {
    activePage = 'teaching.html';
  } else {
    activePage = currentPage;
  }
  
  // Find the matching link and set it active
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === activePage) {
      link.classList.add('active');
    }
  });
}

// Load content based on current page
function loadContent() {
  const currentPage = getCurrentPage();
  
  // Get the content div
  const contentDiv = document.getElementById('content');
  
  // If no content div is found, don't proceed
  if (!contentDiv) {
    return;
  }
  
  // Reference to header element that should only be visible on home page
  const headerElement = document.querySelector('header');
  
  // Handle page structure differences
  if (currentPage === 'index.html') {
    // Home page - show header, clear content
    if (headerElement) {
      headerElement.style.display = 'block';
    }
    
    // Clear any content that might have been loaded
    contentDiv.innerHTML = '';
    contentDiv.className = 'home-content';
    return;
  } else {
    // Other pages - hide header, show content
    if (headerElement) {
      headerElement.style.display = 'none';
    }
    
    // Remove home-content class if present
    contentDiv.classList.remove('home-content');
  }
  
  // Clear the content div
  contentDiv.innerHTML = '';
  
  // Handle different pages
  if (currentPage === 'about.html') {
    loadMarkdownFile('content/about.md', contentDiv);
  }
  else if (currentPage === 'projects.html') {
    loadMarkdownFile('content/projects.md', contentDiv);
  }
  else if (currentPage === 'articles.html') {
    loadArticlesList(contentDiv);
  }
  else if (currentPage.startsWith('article-')) {
    const articleId = currentPage.replace('article-', '').replace('.html', '');
    loadArticle(articleId, contentDiv);
  }
  else if (currentPage === 'teaching.html') {
    loadCoursesList(contentDiv);
  }
  else if (currentPage.startsWith('course-')) {
    const courseInfo = currentPage.replace('course-', '').replace('.html', '').split('-');
    const courseId = courseInfo[0];
    const lectureId = courseInfo.length > 1 ? courseInfo[1] : null;
    loadCourse(courseId, lectureId, contentDiv);
  }
  else {
    // Handle 404
    contentDiv.innerHTML = `
      <div class="section">
        <h2>404 - Page Not Found</h2>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <p>You might want to check out these pages instead:</p>
        <ul>
          <li><a href="about.html">About Me</a></li>
          <li><a href="projects.html">My Projects</a></li>
          <li><a href="articles.html">Articles</a></li>
        </ul>
        <a href="index.html" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Back to Home
        </a>
      </div>
    `;
  }
}

// Load Markdown file
async function loadMarkdownFile(filePath, targetElement) {
  try {
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`Failed to load markdown: ${response.status}`);
    }
    
    const markdown = await response.text();
    targetElement.innerHTML = `
      <div class="section">
        <div class="markdown">${renderMarkdown(markdown)}</div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading markdown:', error);
    targetElement.innerHTML = `
      <div class="section">
        <h2>Error Loading Content</h2>
        <p>Sorry, we couldn't load the content. Please try again later.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

// Load articles list
async function loadArticlesList(targetElement) {
  try {
    const response = await fetch('content/articles/metadata.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load articles: ${response.status}`);
    }
    
    const articles = await response.json();
    
    let articlesHTML = `
      <div class="section">
        <h2>Articles</h2>
        <div class="article-list">
    `;
    
    articles.forEach(article => {
      articlesHTML += `
        <div class="article-card">
          <a href="article-${article.id}.html">
            <div class="article-date">${article.date}</div>
            <div class="article-title">${article.title}</div>
            <div class="article-description">${article.description}</div>
          </a>
        </div>
      `;
    });
    
    articlesHTML += `
        </div>
      </div>
    `;
    
    targetElement.innerHTML = articlesHTML;
  } catch (error) {
    console.error('Error loading articles:', error);
    targetElement.innerHTML = `
      <div class="section">
        <h2>Error Loading Articles</h2>
        <p>Sorry, we couldn't load the article list. Please try again later.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

// Load individual article
async function loadArticle(articleId, targetElement) {
  try {
    // First load the metadata to get the correct filename
    const metadataResponse = await fetch('content/articles/metadata.json');
    
    if (!metadataResponse.ok) {
      throw new Error(`Failed to load article metadata: ${metadataResponse.status}`);
    }
    
    const articles = await metadataResponse.json();
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
      throw new Error(`Article with ID ${articleId} not found`);
    }
    
    const response = await fetch(`content/articles/${article.file}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load article: ${response.status}`);
    }
    
    const markdown = await response.text();
    targetElement.innerHTML = `
      <div class="section">
        <a href="articles.html" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Back to Articles
        </a>
        <div class="markdown">${renderMarkdown(markdown)}</div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading article:', error);
    targetElement.innerHTML = `
      <div class="section">
        <h2>Article Not Found</h2>
        <p>Sorry, the article you are looking for could not be found.</p>
        <p>Error: ${error.message}</p>
        <a href="articles.html" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Back to Articles
        </a>
      </div>
    `;
  }
}

// Load courses list
async function loadCoursesList(targetElement) {
  try {
    const response = await fetch('content/teaching/metadata.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load courses: ${response.status}`);
    }
    
    const courses = await response.json();
    
    let coursesHTML = `
      <div class="section">
        <h2>Teaching</h2>
        <div class="course-list">
    `;
    
    courses.forEach(course => {
      coursesHTML += `
        <div class="course-card">
          <a href="course-${course.id}.html">
            <div class="course-title">${course.title}</div>
            <div class="course-period">${course.period}</div>
            <div class="course-description">${course.description}</div>
          </a>
        </div>
      `;
    });
    
    coursesHTML += `
        </div>
      </div>
    `;
    
    targetElement.innerHTML = coursesHTML;
  } catch (error) {
    console.error('Error loading courses:', error);
    targetElement.innerHTML = `
      <div class="section">
        <h2>Error Loading Courses</h2>
        <p>Sorry, we couldn't load the course list. Please try again later.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

// Load individual course
async function loadCourse(courseId, lectureId, targetElement) {
  try {
    // First load the metadata to get the correct folder
    const metadataResponse = await fetch('content/teaching/metadata.json');
    
    if (!metadataResponse.ok) {
      throw new Error(`Failed to load course metadata: ${metadataResponse.status}`);
    }
    
    const courses = await metadataResponse.json();
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    
    let filePath;
    let lecturesData = [];
    
    // Try to load lecture data
    try {
      const lecturesResponse = await fetch(`content/teaching/${course.folder}/lectures.json`);
      if (lecturesResponse.ok) {
        lecturesData = await lecturesResponse.json();
      }
    } catch (err) {
      console.warn('No lectures data found:', err);
    }
    
    if (lectureId) {
      // Load specific lecture
      const lecture = lecturesData.find(l => l.id === lectureId);
      if (!lecture) {
        throw new Error(`Lecture with ID ${lectureId} not found`);
      }
      filePath = `content/teaching/${course.folder}/${lecture.file}`;
    } else {
      // Load course info
      filePath = `content/teaching/${course.folder}/info.md`;
    }
    
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`Failed to load course content: ${response.status}`);
    }
    
    const markdown = await response.text();
    
    // Create lectures navigation
    let lecturesNav = '';
    if (lecturesData.length > 0) {
      lecturesNav = '<div class="lectures-nav"><h3>Lectures</h3><ul>';
      lecturesData.forEach(lecture => {
        const isActive = lectureId === lecture.id ? 'class="active"' : '';
        lecturesNav += `<li><a href="course-${courseId}-${lecture.id}.html" ${isActive}>${lecture.title}</a></li>`;
      });
      lecturesNav += '</ul></div>';
    }
    
    targetElement.innerHTML = `
      <div class="section">
        <a href="teaching.html" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Back to Courses
        </a>
        
        <div class="course-container">
          ${lecturesNav}
          <div class="markdown">${renderMarkdown(markdown)}</div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading course:', error);
    targetElement.innerHTML = `
      <div class="section">
        <h2>Course Content Not Found</h2>
        <p>Sorry, the course content you are looking for could not be found.</p>
        <p>Error: ${error.message}</p>
        <a href="teaching.html" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Back to Courses
        </a>
      </div>
    `;
  }
}

// Set up navigation event handling
function setupNavigation() {
  document.addEventListener('click', function(e) {
    // Find closest anchor tag if clicked on child element
    const anchor = e.target.closest('a');
    
    // Check if clicked element is a navigation link
    if (anchor && anchor.getAttribute('href')) {
      const href = anchor.getAttribute('href');
      
      // Only handle internal links (excluding external and anchors)
      if (!href.startsWith('http') && !href.startsWith('#') && !anchor.getAttribute('target')) {
        e.preventDefault();
        
        // Update the URL
        window.history.pushState({}, '', href);
        
        // Update active link and load content
        setActiveNavLink();
        loadContent();
        window.scrollTo(0, 0);
      }
    }
  });
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', function() {
    setActiveNavLink();
    loadContent();
  });
}