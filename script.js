// =========================================================
// MODERN WEBSITEHUB - COMPLETE JAVASCRIPT
// =========================================================

// DOM Elements - will be initialized after DOM is loaded
let hamburger, navMenu, navLinks, searchInput, websitesGrid, tabButtons, navbar, notificationBanner, websiteCards, userSuggestionForm, profileCard, profileToggle;

// Popular search suggestions
const suggestions = [
    'ChatGPT', 'Figma', 'GitHub', 'Claude AI', 'Notion',
    'Slack', 'Google Drive', 'Canva', 'Dev Tools', 'AI Tools',
    'Productivity', 'Design', 'Free Resources'
];

// =========================================================
// PAGE INITIALIZATION & SETUP
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements first
    hamburger = document.getElementById('hamburger');
    navMenu = document.querySelector('.nav-menu');
    navLinks = document.querySelectorAll('.nav-link');
    searchInput = document.getElementById('searchInput');
    websitesGrid = document.getElementById('websitesGrid');
    tabButtons = document.querySelectorAll('.tab-btn');
    navbar = document.getElementById('navbar');
    notificationBanner = document.getElementById('notificationBanner');
    websiteCards = document.querySelectorAll('.website-card');
    userSuggestionForm = document.getElementById('userSuggestionForm');
    profileCard = document.getElementById('profileCard');
    profileToggle = document.getElementById('profileToggle');
    
    // Then setup functionality
    initializeWebsiteCards();
    setupEventListeners();
    setupNavbarScroll();
    initializeNotificationBanner();
    setupProfileCard();
});

function initializeWebsiteCards() {
    websiteCards = document.querySelectorAll('.website-card');
    websiteCards.forEach(card => {
        card.classList.remove('hidden');
        card.classList.add('fade-in');
    });
    const activeCategory = document.querySelector('.tab-btn.active')?.getAttribute('data-category') || 'all';
    setTimeout(() => {
        filterWebsites(activeCategory, '');
    }, 100);
}

function setupEventListeners() {
    // Mobile navigation
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Navigation smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            handleNavLinkClick(e);
        });
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('focus', showSearchSuggestions);
        document.addEventListener('click', hideSearchSuggestions);
    }

    // Category filtering
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleCategoryFilter(button);
        });
    });

    // Submission form
    if (userSuggestionForm) {
        userSuggestionForm.addEventListener('submit', handleUserSuggestionSubmit);
    }
}

function handleUserSuggestionSubmit(e) {
    e.preventDefault();

    const formData = new FormData(userSuggestionForm);
    const name = (formData.get('name') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();
    const statusEl = document.getElementById('submissionStatus');

    if (!name || !message) {
        if (statusEl) {
            statusEl.textContent = 'Please enter your name and message.';
            statusEl.style.color = '#fca5a5';
        }
        return;
    }

    // Store latest suggestion locally as fallback when no backend is connected.
    const payload = {
        name,
        email: (formData.get('email') || '').toString().trim(),
        website: (formData.get('website') || '').toString().trim(),
        message,
        submittedAt: new Date().toISOString()
    };
    localStorage.setItem('websitehubLatestSuggestion', JSON.stringify(payload));

    userSuggestionForm.reset();
    if (statusEl) {
        statusEl.textContent = 'Thanks! Your suggestion has been submitted.';
        statusEl.style.color = '#86efac';
    }
}

// =========================================================
// MOBILE NAVIGATION
// =========================================================
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    const isExpanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', String(isExpanded));
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}

// =========================================================
// NAVIGATION HANDLERS
// =========================================================
function handleNavLinkClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        const navHeight = navbar.offsetHeight + 44;
        const targetPosition = targetSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    updateActiveNavLink(e.target);
}

function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function setupNavbarScroll() {
    window.addEventListener('scroll', () => {
        updateNavOnScroll();
        updateNavbarShadow();
    });
}

function updateNavbarShadow() {
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }
}

function updateNavOnScroll() {
    const sections = ['home', 'featured', 'categories'];
    const navHeight = navbar.offsetHeight + 44;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                const linkRef = `[href="#${sectionId}"]`;
                const activeLink = document.querySelector(`.nav-link${linkRef}`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        }
    });
}

// =========================================================
// SEARCH FUNCTIONALITY
// =========================================================
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const activeCategory = document.querySelector('.tab-btn.active').getAttribute('data-category');
    
    if (searchTerm.length > 0) {
        displaySearchSuggestions(searchTerm);
    }
    
    filterWebsites(activeCategory, searchTerm);
}

function displaySearchSuggestions(searchTerm) {
    const suggestionsDiv = document.getElementById('searchSuggestions');
    if (!suggestionsDiv) return;
    
    const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filtered.length > 0 && searchTerm.length > 0) {
        suggestionsDiv.innerHTML = filtered.slice(0, 5).map(s => 
            `<div class="suggestion-item" onclick="selectSuggestion('${s}')">${s}</div>`
        ).join('');
        suggestionsDiv.style.display = 'block';
    } else {
        suggestionsDiv.style.display = 'none';
    }
}

function showSearchSuggestions(e) {
    if (e.target.value.length === 0 && suggestions.length > 0) {
        const suggestionsDiv = document.getElementById('searchSuggestions');
        if (suggestionsDiv) {
            suggestionsDiv.innerHTML = suggestions.slice(0, 6).map(s => 
                `<div class="suggestion-item" onclick="selectSuggestion('${s}')">${s}</div>`
            ).join('');
            suggestionsDiv.style.display = 'block';
        }
    }
}

function hideSearchSuggestions(e) {
    const suggestionsDiv = document.getElementById('searchSuggestions');
    if (suggestionsDiv && !e.target.closest('.search-box')) {
        suggestionsDiv.style.display = 'none';
    }
}

function selectSuggestion(suggestion) {
    searchInput.value = suggestion;
    const activeCategory = document.querySelector('.tab-btn.active').getAttribute('data-category');
    filterWebsites(activeCategory, suggestion.toLowerCase());
    document.getElementById('searchSuggestions').style.display = 'none';
}

// =========================================================
// CATEGORY FILTERING
// =========================================================
function handleCategoryFilter(button) {
    const category = button.getAttribute('data-category');
    
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    searchInput.value = '';
    filterWebsites(category, '');
}

function filterWebsites(category, searchTerm) {
    websiteCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
        const cardDescription = card.querySelector('.card-description').textContent.toLowerCase();
        const searchText = getCardSearchText(card);
        
        const matchesCategory = category === 'all' || cardCategory === category;
        const matchesSearch = searchTerm === '' || 
            cardTitle.includes(searchTerm) || 
            cardDescription.includes(searchTerm) ||
            searchText.includes(normalizeSearchText(searchTerm));
        
        if (matchesCategory && matchesSearch) {
            setTimeout(() => {
                card.classList.remove('hidden');
                card.classList.remove('fade-out');
                card.classList.add('fade-in');
            }, Math.random() * 100);
            
            removeHighlight(card);
            if (searchTerm !== '') {
                highlightText(card, searchTerm);
            }
        } else {
            card.classList.remove('fade-in');
            card.classList.add('fade-out');
            setTimeout(() => {
                card.classList.add('hidden');
            }, 300);
        }
    });
    
    setTimeout(() => {
        updateNoResultsMessage();
    }, 400);
}

function normalizeSearchText(text) {
    return (text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function buildAcronym(text) {
    return normalizeSearchText(text)
        .split(' ')
        .filter(Boolean)
        .map(word => word[0])
        .join('');
}

function getInstitutionAliases(title) {
    const aliases = [];
    const normalized = normalizeSearchText(title);

    if (normalized.startsWith('indian institute of technology')) {
        const location = normalized.replace('indian institute of technology', '').trim();
        if (location) aliases.push(`iit ${location}`);
    }

    if (normalized.startsWith('national institute of technology')) {
        const location = normalized.replace('national institute of technology', '').trim();
        if (location) aliases.push(`nit ${location}`);
    }

    if (normalized.includes('visvesvaraya national institute of technology nagpur')) {
        aliases.push('vnit nagpur', 'nit nagpur', 'iit nagpur');
    }

    if (normalized.includes('all india institute of medical sciences')) {
        const location = normalized.replace('all india institute of medical sciences', '').trim();
        aliases.push('aiims');
        if (location) aliases.push(`aiims ${location}`);
    }

    return aliases;
}

function getCardSearchText(card) {
    const title = card.querySelector('.card-title')?.textContent || '';
    const description = card.querySelector('.card-description')?.textContent || '';
    const titleNormalized = normalizeSearchText(title);
    const descriptionNormalized = normalizeSearchText(description);
    const acronym = buildAcronym(title);
    const institutionAliases = getInstitutionAliases(title);

    return [titleNormalized, descriptionNormalized, acronym, ...institutionAliases]
        .filter(Boolean)
        .join(' ');
}

// =========================================================
// TEXT HIGHLIGHTING & NO RESULTS
// =========================================================
function highlightText(card, searchTerm) {
    const title = card.querySelector('.card-title');
    const description = card.querySelector('.card-description');
    
    if (title && description) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        title.innerHTML = title.textContent.replace(regex, '<mark>$1</mark>');
        description.innerHTML = description.textContent.replace(regex, '<mark>$1</mark>');
    }
}

function removeHighlight(card) {
    const title = card.querySelector('.card-title');
    const description = card.querySelector('.card-description');
    
    if (title && description) {
        title.innerHTML = title.textContent;
        description.innerHTML = description.textContent;
    }
}

function updateNoResultsMessage() {
    const visibleCards = Array.from(websiteCards).filter(card => 
        !card.classList.contains('hidden')
    );
    
    const existingMsg = document.querySelector('.no-results');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    if (visibleCards.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: rgba(226, 232, 240, 0.5);">
                <i style="font-size: 2rem; margin-bottom: 1rem; display: block;">🔍</i>
                <h3>No results found</h3>
                <p>Try a different search term or category</p>
            </div>
        `;
        websitesGrid.appendChild(noResultsDiv);
    }
}

// =========================================================
// TRENDING TAGS & CATEGORY LINKS
// =========================================================
function searchByTag(button) {
    const tag = button.textContent.trim();
    searchInput.value = tag;
    const activeCategory = document.querySelector('.tab-btn.active').getAttribute('data-category');
    filterWebsites(activeCategory, tag.toLowerCase());
    
    const categoriesSection = document.getElementById('categories') || document.getElementById('explore');
    if (categoriesSection) {
        const navHeight = navbar.offsetHeight + 44;
        const targetPosition = categoriesSection.offsetTop - navHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function filterByCategory(category) {
    const button = document.querySelector(`.tab-btn[data-category="${category}"]`);
    if (button) {
        handleCategoryFilter(button);
        const categoriesSection = document.getElementById('categories') || document.getElementById('explore');
        if (categoriesSection) {
            const navHeight = navbar.offsetHeight + 44;
            const targetPosition = categoriesSection.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// =========================================================
// NOTIFICATION BANNER
// =========================================================
function initializeNotificationBanner() {
    const closeBtn = document.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeNotification);
    }
}

function closeNotification() {
    if (notificationBanner) {
        notificationBanner.style.display = 'none';
    }
}

function closeNoticeBar() {
    closeNotification();
}

// =========================================================
// PROFILE CARD
// =========================================================
function setupProfileCard() {
    if (!profileCard || !profileToggle) return;

    profileToggle.addEventListener('click', () => {
        profileCard.classList.toggle('collapsed');
        const icon = profileToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-chevron-up', !profileCard.classList.contains('collapsed'));
            icon.classList.toggle('fa-chevron-down', profileCard.classList.contains('collapsed'));
        }
    });
}

// =========================================================
// DYNAMIC STYLING
// =========================================================
const style = document.createElement('style');
style.textContent = `
    mark {
        background: rgba(248, 113, 113, 0.3);
        color: #fca5a5;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-weight: 600;
    }

    .suggestion-item {
        padding: 0.8rem 1rem;
        cursor: pointer;
        color: #e2e8f0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.2s ease;
    }

    .suggestion-item:last-child {
        border-bottom: none;
    }

    .suggestion-item:hover {
        background: rgba(96, 165, 250, 0.1);
        color: #60a5fa;
        padding-left: 1.5rem;
    }

    .no-results {
        animation: fadeInDown 0.3s ease;
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// =========================================================
// ERROR HANDLING
// =========================================================
if (!hamburger) {
    console.warn('Hamburger element not found');
}

if (!searchInput) {
    console.warn('Search input element not found');
}

// =========================================================
// EXPORT TO GLOBAL SCOPE
// =========================================================
window.searchByTag = searchByTag;
window.filterByCategory = filterByCategory;
window.selectSuggestion = selectSuggestion;
window.closeNotification = closeNotification;

// Console message
console.log('🌐 WebsiteHub v2.0 - Your Gateway to the Web\'s Best Tools');
console.log('💡 Tip: Press Ctrl+K to quickly focus the search bar');