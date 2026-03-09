// DOM elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('searchInput');
const websitesGrid = document.getElementById('websitesGrid');
const tabButtons = document.querySelectorAll('.tab-btn');
const websiteCards = document.querySelectorAll('.website-card');

// Mobile navigation toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Update active nav link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = ['home', 'categories', 'about', 'contact'];
    const navHeight = document.querySelector('.navbar').offsetHeight;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        }
    });
});

// Category filtering
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        
        // Update active tab
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter websites
        filterWebsites(category, '');
    });
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const activeCategory = document.querySelector('.tab-btn.active').getAttribute('data-category');
    
    filterWebsites(activeCategory, searchTerm);
});

// Filter websites function
function filterWebsites(category, searchTerm) {
    websiteCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
        const cardDescription = card.querySelector('.card-description').textContent.toLowerCase();
        
        const matchesCategory = category === 'all' || cardCategory === category;
        const matchesSearch = searchTerm === '' || 
            cardTitle.includes(searchTerm) || 
            cardDescription.includes(searchTerm);
        
        if (matchesCategory && matchesSearch) {
            card.classList.remove('hidden');
            // Remove any existing highlights
            removeHighlight(card);
            // Add highlights if searching
            if (searchTerm !== '') {
                highlightText(card, searchTerm);
            }
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Show "no results" message if no cards are visible
    updateNoResultsMessage();
}

// Highlight search terms
function highlightText(card, searchTerm) {
    const title = card.querySelector('.card-title');
    const description = card.querySelector('.card-description');
    
    highlightInElement(title, searchTerm);
    highlightInElement(description, searchTerm);
}

function highlightInElement(element, searchTerm) {
    const originalText = element.textContent;
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    const highlightedText = originalText.replace(regex, '<span class="highlight">$1</span>');
    element.innerHTML = highlightedText;
}

function removeHighlight(card) {
    const highlightedElements = card.querySelectorAll('.highlight');
    highlightedElements.forEach(element => {
        element.outerHTML = element.textContent;
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Update no results message
function updateNoResultsMessage() {
    const existingMessage = document.querySelector('.no-results-message');
    const visibleCards = document.querySelectorAll('.website-card:not(.hidden)');
    
    if (visibleCards.length === 0) {
        if (!existingMessage) {
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #6b7280;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3 style="margin-bottom: 0.5rem; color: #374151;">No websites found</h3>
                    <p>Try adjusting your search terms or selecting a different category.</p>
                </div>
            `;
            websitesGrid.appendChild(message);
        }
    } else {
        if (existingMessage) {
            existingMessage.remove();
        }
    }
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Card animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all website cards
websiteCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus search with Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Clear search with Escape
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.blur();
        filterWebsites('all', '');
        // Reset to "All" category
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
    }
});

// Loading animation
document.addEventListener('DOMContentLoaded', () => {
    // Add staggered animation to cards
    websiteCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add keyboard shortcut hint
    const searchContainer = document.querySelector('.search-container');
    const shortcutHint = document.createElement('div');
    shortcutHint.className = 'search-shortcut-hint';
    shortcutHint.innerHTML = '<small style="color: rgba(255,255,255,0.8); margin-top: 0.5rem; display: block;">Press Ctrl+K to focus search</small>';
    searchContainer.appendChild(shortcutHint);
});

// External link tracking (optional - for analytics)
document.querySelectorAll('.card-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const websiteName = e.target.closest('.website-card').querySelector('.card-title').textContent;
        const websiteUrl = e.target.href;
        
        // You can add analytics tracking here
        console.log(`User clicked on: ${websiteName} (${websiteUrl})`);
        
        // Add a small delay to ensure the click is tracked
        // (This is optional and depends on your analytics setup)
    });
});

// Touch gestures for mobile (swipe between categories)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        const activeTabIndex = Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
        
        if (swipeDistance > 0 && activeTabIndex > 0) {
            // Swipe right - go to previous category
            tabButtons[activeTabIndex - 1].click();
        } else if (swipeDistance < 0 && activeTabIndex < tabButtons.length - 1) {
            // Swipe left - go to next category
            tabButtons[activeTabIndex + 1].click();
        }
    }
}

// Performance optimization: Debounce search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Replace the immediate search with debounced version
const debouncedSearch = debounce((searchTerm, activeCategory) => {
    filterWebsites(activeCategory, searchTerm);
}, 300);

// Update search event listener to use debounced function
searchInput.removeEventListener('input', searchInput.oninput);
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const activeCategory = document.querySelector('.tab-btn.active').getAttribute('data-category');
    debouncedSearch(searchTerm, activeCategory);
});

// Add search suggestions (optional feature)
const popularSearches = ['github', 'google', 'facebook', 'youtube', 'netflix', 'chatgpt', 'linkedin'];

searchInput.addEventListener('focus', () => {
    if (searchInput.value === '') {
        // Could add search suggestions dropdown here
        searchInput.placeholder = 'Try: ' + popularSearches[Math.floor(Math.random() * popularSearches.length)];
    }
});

// Profile card toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const profileCard = document.querySelector('.profile-card');
    const profileToggle = document.querySelector('.profile-toggle');
    
    if (profileCard) {
        // Toggle profile card on click
        profileCard.addEventListener('click', function(e) {
            // Don't toggle if clicking on social links or toggle button
            if (e.target.closest('.profile-link') || e.target.closest('.profile-toggle')) {
                return;
            }
            
            this.classList.toggle('expanded');
        });
        
        // Close profile card when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.profile-corner') && profileCard.classList.contains('expanded')) {
                profileCard.classList.remove('expanded');
            }
        });
        
        // Toggle button functionality
        if (profileToggle) {
            profileToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                profileCard.classList.remove('expanded');
            });
        }
        
        // ESC key to close expanded profile card
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && profileCard.classList.contains('expanded')) {
                profileCard.classList.remove('expanded');
            }
        });
        
        // Smooth animations for profile stats counter
        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + '+';
            }, 30);
        }
        
        // Animate counters when profile expands
        profileCard.addEventListener('transitionend', function(e) {
            if (e.propertyName === 'width' && this.classList.contains('expanded')) {
                const websitesStat = document.querySelector('.stat-item:nth-child(1) .stat-number');
                const categoriesStat = document.querySelector('.stat-item:nth-child(2) .stat-number');
                
                if (websitesStat && categoriesStat) {
                    // Reset counters first
                    websitesStat.textContent = '0+';
                    categoriesStat.textContent = '0+';
                    
                    // Animate counters
                    setTimeout(() => {
                        animateCounter(websitesStat, 200);
                        animateCounter(categoriesStat, 8);
                    }, 200);
                }
            }
        });
        
        // Add hover effect for collapsed state
        profileCard.addEventListener('mouseenter', function() {
            if (!this.classList.contains('expanded')) {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        profileCard.addEventListener('mouseleave', function() {
            if (!this.classList.contains('expanded')) {
                this.style.transform = 'scale(1)';
            }
        });
    }
});

searchInput.addEventListener('blur', () => {
    searchInput.placeholder = 'Search for websites...';
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set initial state
    filterWebsites('all', '');
    
    // Add version info to console
    console.log('🌐 WebsiteHub v1.0 - All Useful Websites in One Place');
    console.log('💡 Tip: Press Ctrl+K to quickly focus the search bar');
});