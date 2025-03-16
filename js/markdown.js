// Markdown parser and renderer

/**
 * Render markdown content to HTML
 * @param {string} markdown - The markdown text to render
 * @return {string} The HTML representation
 */
function renderMarkdown(markdown) {
    if (!markdown) return '';

    // Process the markdown in stages
    let html = markdown
        // Replace HTML entities for safety
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        
        // Process code blocks first (to avoid processing markdown inside them)
        .replace(/```([a-z]*)\n([\s\S]*?)\n```/g, function(match, language, code) {
        return `<pre><code class="language-${language}">${code}</code></pre>`;
        })
        
        // Process headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        
        // Process emphasis (bold and italic)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Process inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // Process links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        
        // Process unordered lists
        .replace(/^\s*[\-\*] (.*)/gim, '<ul><li>$1</li></ul>')
        .replace(/<\/ul>\s*<ul>/g, '')
        
        // Process ordered lists
        .replace(/^\s*(\d+)\. (.*)/gim, '<ol><li>$2</li></ol>')
        .replace(/<\/ol>\s*<ol>/g, '')
        
        // Process horizontal rule
        .replace(/^\s*---\s*$/gim, '<hr>')
        
        // Process paragraphs (after all other elements)
        .split(/\n\n+/)
        .map(paragraph => {
        // Skip if it's already an HTML element
        return /^<(\/?)(h\d|ul|ol|li|blockquote|pre|hr)/i.test(paragraph.trim()) ? 
            paragraph : 
            `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
        })
        .join('\n\n');

    return html;
}
  
/**
 * Extract the title from markdown content
 * @param {string} markdown - The markdown text
 * @return {string} The extracted title
 */
function extractTitle(markdown) {
    if (!markdown) return '';

    // Look for the first h1 header
    const titleMatch = markdown.match(/^# (.*$)/m);
    return titleMatch ? titleMatch[1] : '';
}
  
/**
 * Extract a summary from markdown content
 * @param {string} markdown - The markdown text
 * @param {number} length - Maximum length of summary
 * @return {string} The extracted summary
 */
function extractSummary(markdown, length = 150) {
    if (!markdown) return '';

    // Remove headers and formatting
    const plainText = markdown
        .replace(/^#+\s+.*$/gm, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/`([^`]+)`/g, '$1') // Remove inline code
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
        .replace(/^\s*[\-\*] /gm, '') // Remove list markers
        .replace(/^\s*(\d+)\. /gm, '') // Remove numbered list markers
        .trim();

    // Extract first paragraph or up to length characters
    const firstParagraph = plainText.split(/\n\n+/)[0] || '';

    if (firstParagraph.length <= length) {
        return firstParagraph;
    }

    // Truncate to length and add ellipsis
    return firstParagraph.substring(0, length).trim() + '...';
}