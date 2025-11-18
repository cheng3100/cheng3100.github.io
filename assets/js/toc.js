// Generate Table of Contents from headings
document.addEventListener('DOMContentLoaded', function() {
  const tocContainer = document.getElementById('toc');
  const postBody = document.querySelector('.post-body');
  
  if (!tocContainer || !postBody) return;

  // Include H1, H2, H3, H4 headings
  const headings = postBody.querySelectorAll('h1, h2, h3, h4');
  
  if (headings.length === 0) {
    tocContainer.innerHTML = '<p style="color: #888; font-size: 14px;">No headings found</p>';
    return;
  }

  let tocHTML = '<ul>';
  let currentLevel = 0;

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const id = heading.id || `heading-${index}`;
    heading.id = id;

    // Just set the ID for linking, don't add visible link element to heading

    if (level > currentLevel) {
      tocHTML += '<ul>'.repeat(level - currentLevel);
    } else if (level < currentLevel) {
      tocHTML += '</ul>'.repeat(currentLevel - level);
    }

    tocHTML += `<li><a href="#${id}">${heading.textContent}</a></li>`;
    currentLevel = level;
  });

  // Close remaining ul tags
  tocHTML += '</ul>'.repeat(currentLevel);
  tocHTML += '</ul>';

  tocContainer.innerHTML = tocHTML;

  // Smooth scroll for anchor links
  tocContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL without jumping
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
});
