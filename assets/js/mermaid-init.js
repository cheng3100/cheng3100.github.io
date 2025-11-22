// Mermaid initialization script
// Converts code blocks with language-mermaid to mermaid divs and initializes Mermaid

document.addEventListener('DOMContentLoaded', function() {
  // Find all code blocks with language-mermaid
  const mermaidCodeBlocks = document.querySelectorAll('code.language-mermaid, pre code.language-mermaid');
  
  mermaidCodeBlocks.forEach(function(codeBlock) {
    // Get the parent pre element if it exists
    const preElement = codeBlock.parentElement;
    const mermaidCode = codeBlock.textContent;
    
    // Create a new div with class 'mermaid'
    const mermaidDiv = document.createElement('div');
    mermaidDiv.className = 'mermaid';
    mermaidDiv.textContent = mermaidCode;
    
    // Replace the code block (or pre element) with the mermaid div
    if (preElement && preElement.tagName === 'PRE') {
      preElement.replaceWith(mermaidDiv);
    } else {
      codeBlock.replaceWith(mermaidDiv);
    }
  });
  
  // Initialize Mermaid if it's loaded
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    });
    mermaid.run();
  }
});
