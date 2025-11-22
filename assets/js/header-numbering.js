// Automatic Header Numbering Script
// Adds sequence numbers to markdown headers (H1-H6)
// Can be enabled/disabled per page or site-wide

(function() {
  'use strict';

  // Check if numbering is enabled
  function isNumberingEnabled() {
    // Check page-level setting first (from front matter)
    const pageMeta = document.querySelector('meta[name="header-numbering"]');
    if (pageMeta) {
      return pageMeta.content === 'true' || pageMeta.content === 'enabled';
    }
    
    // Check site-wide setting (from config)
    const siteMeta = document.querySelector('meta[name="site-header-numbering"]');
    if (siteMeta) {
      return siteMeta.content === 'true' || siteMeta.content === 'enabled';
    }
    
    // Default: disabled
    return false;
  }

  // Get numbering style (nested or flat)
  function getNumberingStyle() {
    const styleMeta = document.querySelector('meta[name="header-numbering-style"]');
    return styleMeta ? styleMeta.content : 'nested'; // 'nested' or 'flat'
  }

  // Add numbers to headers
  function addHeaderNumbers() {
    if (!isNumberingEnabled()) {
      return;
    }

    const postBody = document.querySelector('.post-body');
    if (!postBody) {
      return;
    }

    const style = getNumberingStyle();
    const headers = postBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headers.length === 0) {
      return;
    }

    // Initialize counters for each level
    const counters = [0, 0, 0, 0, 0, 0];
    
    headers.forEach(function(header) {
      const level = parseInt(header.tagName.charAt(1)) - 1; // H1 = 0, H2 = 1, etc.
      
      if (style === 'nested') {
        // Nested numbering: 1, 1.1, 1.1.1, etc.
        counters[level]++;
        
        // Reset lower level counters
        for (let i = level + 1; i < 6; i++) {
          counters[i] = 0;
        }
        
        // Build nested number
        let number = '';
        for (let i = 0; i <= level; i++) {
          if (counters[i] > 0) {
            number += (number ? '.' : '') + counters[i];
          }
        }
        
        // Add number prefix if not already present
        if (!header.classList.contains('numbered')) {
          header.classList.add('numbered');
          const text = header.textContent.trim();
          if (!/^\d+\.?\s/.test(text)) {
            header.innerHTML = '<span class="header-number">' + number + '. </span>' + header.innerHTML;
          }
        }
      } else {
        // Flat numbering: 1, 2, 3, etc. (only for H1)
        if (level === 0) {
          counters[0]++;
          if (!header.classList.contains('numbered')) {
            header.classList.add('numbered');
            const text = header.textContent.trim();
            if (!/^\d+\.?\s/.test(text)) {
              header.innerHTML = '<span class="header-number">' + counters[0] + '. </span>' + header.innerHTML;
            }
          }
        }
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHeaderNumbers);
  } else {
    addHeaderNumbers();
  }
})();
