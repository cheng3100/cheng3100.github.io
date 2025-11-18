// Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const toggleButton = document.getElementById('sidebar-toggle');
  
  if (!sidebar || !toggleButton) return;

  // Toggle sidebar visibility
  function toggleSidebar() {
    sidebar.classList.toggle('hidden');
    // Store preference in localStorage
    const isHidden = sidebar.classList.contains('hidden');
    localStorage.setItem('sidebarHidden', isHidden);
    
    // Update button text/icon to reflect state
    updateToggleButton(isHidden);
  }

  // Update toggle button appearance based on sidebar state
  function updateToggleButton(isHidden) {
    if (isHidden) {
      toggleButton.textContent = '☰';
      toggleButton.setAttribute('aria-label', 'Show sidebar');
      toggleButton.setAttribute('title', 'Show sidebar');
    } else {
      toggleButton.textContent = '✕';
      toggleButton.setAttribute('aria-label', 'Hide sidebar');
      toggleButton.setAttribute('title', 'Hide sidebar');
    }
  }

  // Restore sidebar state from localStorage
  const sidebarHidden = localStorage.getItem('sidebarHidden');
  if (sidebarHidden === 'true') {
    sidebar.classList.add('hidden');
    updateToggleButton(true);
  } else {
    updateToggleButton(false);
  }

  // Add click event to toggle button
  toggleButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar();
  });

  // Close sidebar when clicking outside on mobile
  if (window.innerWidth <= 768) {
    document.addEventListener('click', function(event) {
      if (!sidebar.contains(event.target) && 
          !toggleButton.contains(event.target) && 
          !sidebar.classList.contains('hidden')) {
        sidebar.classList.add('hidden');
        localStorage.setItem('sidebarHidden', 'true');
        updateToggleButton(true);
      }
    });
  }

  // Handle window resize
  window.addEventListener('resize', function() {
    // On mobile, ensure sidebar starts hidden if it was hidden before
    if (window.innerWidth <= 768) {
      const wasHidden = localStorage.getItem('sidebarHidden') === 'true';
      if (wasHidden) {
        sidebar.classList.add('hidden');
        updateToggleButton(true);
      }
    }
  });
});
