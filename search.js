// Configuration object for easy editing //
const config = {
    categories: [
       {
           name: 'Games',
           subtitle: 'French and English Language Games',
           icon: 'fa-gamepad',
           subcategories: [
               {
                   name: 'French Games',
                   items: [
                       { name: 'Motle', url: '/motle', description: 'Guess the French word of the day' },
                       { name: 'DupuisGuessr', url: '/guessr', description: 'Guess the location of French landmarks' },
                       { name: 'Word Voyage', url: '/word-voyage', description: 'Improve your French spelling' },
                       { name: 'Stromae', url: '/stromae', description: 'Learn French through Stromae\'s music' },
                       { name: 'Snake Game', url: '/snake-game', description: 'Classic snake game to practice French' }
                   ]
               },
               {
                   name: 'English Games',
                   items: [
                       { name: 'Trivia', url: '/trivia', description: 'Test your knowledge with trivia' }
                   ]
               },
               {
                   name: 'Music Games',
                   items: [
                       { name: '✨ ScaleUp', url: '/scaleup', description: 'Music scales game' }
                   ]
               },
               {
                   name: 'Other Games',
                   items: [
                       { name: 'Ascend', url: '/ascend', description: 'Platformer game' }
                   ]
               }
           ]
       },
       {
           name: 'Resources',
           subtitle: 'Educational Materials and Tools',
           icon: 'fa-book',
           subcategories: [
               {
                   name: 'Learning Tools',
                   items: [
                       { name: '✨ Snow Day', url: '/snowday', description: 'French immersion through interactive stories' },
                       { name: 'Extension', url: '/extension/download', description: 'Browser extension for French learning' },
                       { name: 'Cuisine AI', url: '/cuisine-ai', description: 'AI-powered French cooking assistant' }
                   ]
               },
               {
                   name: 'Community',
                   items: [
                       { name: 'Events', url: '/events', description: 'Upcoming French language events' },
                       { name: 'Café', url: '/cafe', description: 'Chat with other French learners' },
                       { name: 'Rewards', url: '/rewards', description: 'Earn rewards for your French progress' }
                   ]
               },
               {
                   name: 'Information',
                   items: [
                       { name: 'News', url: '/news', description: 'Stay up-to-date with French news' },
                       { name: 'Translate', url: '/translate', description: 'Translate between French and other languages' }
                   ]
               }
           ]
       },
       {
           name: 'Classroom',
           subtitle: 'French Learning for Schools',
           icon: 'fa-school',
           subcategories: [
            {
                name: 'Classroom Resources',
                items: [
                    { name: '✨ FBL', url: 'https://fbl.dupuis.lol/account/signup', description: 'French Blended Learning for schools' }
                ]
            }
        ]
       },
       {
           name: 'Development',
           subtitle: 'Tools and Resources for Developers',
           icon: 'fa-code',
           subcategories: [
               {
                   name: 'Workspace',
                   items: [
                       { name: 'Study', url: '/workspace/study', description: 'Collaborative coding workspace' },
                       { name: 'Notes', url: '/workspace/notes', description: 'Take and share your programming notes' }
                   ]
               },
               {
                   name: 'Other Tools',
                   items: [
                       { name: 'Old Homepage', url: '/homepage', description: 'Access the previous version of the website' },
                       { name: 'Contact', url: '/contact', description: 'Get in touch with the dupuis.lol team' },
                       { name: 'Videos', url: '/videos', description: 'Tutorials and tech talks' },
                       { name: 'Forms', url: '/forms', description: 'Create and manage custom forms' }
                   ]
               }
           ]
       }
    ],
    announcements: [
        {
            message: "⚠️ Scheduled Weekly Maintenance in Progress.",
            startTime: "00:00",
            endTime: "24:00",
            days: ["Friday", "Saturday", "Sunday"],
            persistent: true
        },
        {
            message: "⚠️ Scheduled Weekly Maintenance Has Concluded.",
            startTime: "00:00",
            endTime: "24:00",
            days: ["Monday"],
            persistent: true
        },
        {
            message: "🟪 Welcome LEPSS!",
            showForever: true
        }
    ],
    defaultCategory: 'Games',
    searchPlaceholder: 'Search dupuis.lol...',
    noResultsMessage: 'No results found. Try a different search term.',
    easterEggCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
    easterEggDuration: 10000
};

class DupuisApp {
    constructor() {
        this.requiredElements = {
            'search-input': { tag: 'input', parent: 'body' },
            'search-button': { tag: 'button', parent: 'body' },
            'content': { tag: 'div', parent: 'body' },
            'categories': { tag: 'div', parent: 'body' },
            'menu-toggle': { tag: 'button', parent: 'body' },
            'sidebar': { tag: 'div', parent: 'body' },
            'modal': { tag: 'div', parent: 'body' },
            'modal-body': { tag: 'div', parent: '#modal' },
            'theme-toggle': { tag: 'button', parent: 'body' },
            'settings-button': { tag: 'button', parent: 'body' },
            'font-size': { tag: 'select', parent: '#modal-body' },
            'language': { tag: 'select', parent: '#modal-body' },
            'animations': { tag: 'input', parent: '#modal-body', attributes: { type: 'checkbox' } }
        };

        this.createMissingElements();
        this.initializeElements();

        this.currentCategory = null;
        this.currentSubcategory = null;
        this.currentItem = null;
        this.isDarkMode = false;

        if (this.validateDOMElements()) {
            this.init();
        } else {
            console.error('Some required DOM elements are missing. Please check your HTML and JavaScript.');
        }
    }

    createMissingElements() {
        Object.entries(this.requiredElements).forEach(([id, details]) => {
            if (!document.getElementById(id)) {
                const element = document.createElement(details.tag);
                element.id = id;
                if (details.attributes) {
                    Object.entries(details.attributes).forEach(([attr, value]) => {
                        element.setAttribute(attr, value);
                    });
                }
                const parent = details.parent === 'body' ? document.body : document.querySelector(details.parent);
                if (parent) {
                    parent.appendChild(element);
                } else {
                    console.warn(`Parent element ${details.parent} for ${id} not found. Appending to body.`);
                    document.body.appendChild(element);
                }
            }
        });
    }

    initializeElements() {
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        this.contentSection = document.getElementById('content');
        this.categoriesSection = document.getElementById('categories');
        this.menuToggle = document.getElementById('menu-toggle');
        this.sidebarSection = document.getElementById('sidebar');
        this.modal = document.getElementById('modal');
        this.modalBody = document.getElementById('modal-body');
        this.themeToggle = document.getElementById('theme-toggle');
        this.settingsButton = document.getElementById('settings-button');
        this.fontSizeSelect = document.getElementById('font-size');
        this.languageSelect = document.getElementById('language');
        this.animationsCheckbox = document.getElementById('animations');

        // Create nav-links if it doesn't exist
        this.navLinks = document.querySelector('.nav-links') || this.createNavLinks();
        
        // Create modal close button if it doesn't exist
        this.modalClose = this.modal.querySelector('.close') || this.createModalClose();
    }

    createNavLinks() {
        const navLinks = document.createElement('ul');
        navLinks.className = 'nav-links';
        document.body.appendChild(navLinks);
        return navLinks;
    }

    createModalClose() {
        const closeButton = document.createElement('span');
        closeButton.className = 'close';
        closeButton.innerHTML = '&times;';
        this.modal.appendChild(closeButton);
        return closeButton;
    }

    validateDOMElements() {
        return Object.keys(this.requiredElements).every(id => document.getElementById(id)) &&
               this.navLinks && this.modalClose;
    }

    generateCategories() {
        this.categoriesSection.innerHTML = ''; // Clear existing categories
        const fragment = document.createDocumentFragment();
        config.categories.forEach(category => {
            const categoryButton = this.createCategoryButton(category);
            fragment.appendChild(categoryButton);
        });
        this.categoriesSection.appendChild(fragment);
    }

    createCategoryButton(category) {
        const categoryButton = document.createElement('div');
        categoryButton.className = 'category';
        categoryButton.innerHTML = `
            <i class="fas ${category.icon}"></i>
            <h2>${category.name}</h2>
            <p>${category.subtitle}</p>
        `;
        categoryButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo(`/${category.name.toLowerCase()}`);
        });

        const icon = categoryButton.querySelector('i');
        categoryButton.addEventListener('mouseover', () => icon.classList.add('fa-bounce'));
        categoryButton.addEventListener('mouseout', () => icon.classList.remove('fa-bounce'));

        return categoryButton;
    }

    generateSubcategories(subcategories) {
        this.contentSection.innerHTML = ''; // Clear existing content
        const fragment = document.createDocumentFragment();
        subcategories.forEach(subcategory => {
            const subcategoryButton = this.createSubcategoryButton(subcategory);
            fragment.appendChild(subcategoryButton);
        });
        this.contentSection.appendChild(fragment);
    }

    createSubcategoryButton(subcategory) {
        const subcategoryButton = document.createElement('div');
        subcategoryButton.className = 'subcategory';
        subcategoryButton.innerHTML = `
            <h3>${subcategory.name}</h3>
            <div class="sub-container">
                ${subcategory.items.map(item => `
                    <div class="item-card">
                        <h4>${item.name}</h4>
                        <p>${item.description || 'No description available.'}</p>
                        <a href="${item.url}" class="button visit-button" data-url="${item.url}">Visit Page</a>
                    </div>
                `).join('')}
            </div>
        `;
        subcategoryButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo(`/${this.currentCategory.name.toLowerCase()}/${subcategory.name.toLowerCase()}`);
        });

        return subcategoryButton;
    }

    setupEventListeners() {
        this.searchButton.addEventListener('click', () => this.performSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        this.menuToggle.addEventListener('click', () => this.navLinks.classList.toggle('show'));

        window.addEventListener('resize', this.handleResize.bind(this));

        this.searchInput.setAttribute('placeholder', config.searchPlaceholder);

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.textContent.toLowerCase();
                this.navigateTo(`/${category}`);
            });
        });

        this.modalClose.addEventListener('click', () => this.closeModal());

        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        this.settingsButton.addEventListener('click', () => this.openSettings());

        // Add event delegation for dynamic content
        this.contentSection.addEventListener('click', (e) => {
            if (e.target.classList.contains('visit-button')) {
                e.preventDefault();
                const url = e.target.getAttribute('data-url');
                if (url) {
                    window.location.href = url;
                }
            }
        });

        // Add event delegation for sidebar items
        this.sidebarSection.addEventListener('click', (e) => {
            if (e.target.classList.contains('sidebar-item')) {
                e.preventDefault();
                const url = e.target.getAttribute('href');
                if (url) {
                    this.navigateTo(url);
                }
            }
        });
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.navLinks.classList.remove('show');
        }
    }

    setupRouter() {
        window.addEventListener('popstate', () => this.handleRouteChange());
        this.handleRouteChange();
    }

    handleRouteChange() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment !== '');

        if (pathSegments.length === 0) {
            // If no path is specified, load the default category (Games)
            this.loadCategoryContent('Games');
            return;
        }

        const category = config.categories.find(cat => cat.name.toLowerCase() === pathSegments[0]);
        if (category) {
            this.currentCategory = category;
            if (pathSegments.length === 1) {
                this.loadSubcategoryContent(category.subcategories);
            } else {
                const subcategory = category.subcategories.find(sub => sub.name.toLowerCase() === pathSegments[1]);
                if (subcategory) {
                    this.currentSubcategory = subcategory;
                    this.loadItemContent(subcategory.items);
                } else {
                    // If the subcategory is not found, load the subcategory content instead of 404
                    this.loadSubcategoryContent(category.subcategories);
                }
            }
        } else {
            const item = this.findItemByUrl(null, path);
            if (item) {
                const category = this.findCategoryByItem(item);
                this.currentCategory = category;
                this.currentItem = item.name;
                this.loadItemContent(category.subcategories.flatMap(sub => sub.items));
            } else {
                // If no matching category or item is found, load the default category (Games)
                this.loadCategoryContent('Games');
            }
        }
    }

    findItemByUrl(category, url) {
        if (category) {
            return category.items.find(item => item.url === url);
        }
        return config.categories.flatMap(cat => cat.subcategories.flatMap(sub => sub.items)).find(item => item.url === url);
    }

    findCategoryByItem(item) {
        return config.categories.find(category => category.subcategories.some(subcategory => subcategory.items.includes(item)));
    }

    loadSubcategoryContent(subcategories) {
        this.generateSubcategories(subcategories);
        this.updateActiveSidebarItem(this.currentCategory.name);
    }

    loadItemContent(items) {
        // Here, instead of displaying a mock content, we'll actually load the page content
        window.location.href = this.currentItem.url;
    }

    navigateTo(url, replace = false) {
        if (replace) {
            history.replaceState(null, '', url);
        } else {
            history.pushState(null, '', url);
        }
        this.handleRouteChange();
    }

    performSearch() {
        const query = this.searchInput.value.toLowerCase().trim();
        if (query) {
            const results = this.generateSearchResults(query);
            this.updateContent(results);
        }
    }

    generateSearchResults(query) {
        let results = '<h2>Search Results</h2><ul class="search-results">';
        let found = false;

        config.categories.forEach(category => {
            category.items.forEach(item => {
                if (item.name.toLowerCase().includes(query) || (item.description && item.description.toLowerCase().includes(query))) {
                    found = true;
                    results += `
                        <li>
                            <h3>${this.highlightMatch(item.name, query)}</h3>
                            <p>${item.description ? this.highlightMatch(item.description, query) : 'No description available.'}</p>
                            <a href="${item.url}" class="button visit-button" data-url="${item.url}">Visit Page</a>
                        </li>
                    `;
                }
            });
        });

        results += '</ul>';
        return found ? results : `<h2>Search Results</h2><p>${config.noResultsMessage}</p>`;
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    setupAnnouncements() {
        // Create announcement container
        const announcementContainer = document.createElement('div');
        announcementContainer.id = 'announcement-container';
        Object.assign(announcementContainer.style, {
            position: 'auto',
            top: '0',
            left: '0',
            right: '0',
            zIndex: '1000'
        });
        document.body.insertBefore(announcementContainer, document.body.firstChild);

        // Create a stack to manage multiple announcements
        this.announcementStack = [];

        const checkAnnouncements = () => {
            const now = new Date();
            const currentDay = now.toLocaleString('en-US', { weekday: 'long' });
            const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

            config.announcements.forEach(announcement => {
                if (this.isAnnouncementActive(announcement, now, currentDay, currentTime)) {
                    if (!this.announcementStack.includes(announcement)) {
                        this.announcementStack.push(announcement);
                    }
                } else {
                    const index = this.announcementStack.indexOf(announcement);
                    if (index > -1) {
                        this.announcementStack.splice(index, 1);
                    }
                }
            });

            this.updateAnnouncementDisplay();
        };

        // Check announcements immediately and then every minute
        checkAnnouncements();
        setInterval(checkAnnouncements, 60000);
    }

    isAnnouncementActive(announcement, now, currentDay, currentTime) {
        if (announcement.showForever) return true;

        if (announcement.showUntil) {
            const endDate = new Date(announcement.showUntil);
            if (now > endDate) return false;
        }

        if (announcement.start) {
            const startDate = new Date(announcement.start);
            if (now < startDate) return false;
        }

        if (announcement.days && !announcement.days.includes(currentDay)) return false;

        if (announcement.startTime && announcement.endTime) {
            return currentTime >= announcement.startTime && currentTime <= announcement.endTime;
        }

        return true;
    }

    updateAnnouncementDisplay() {
        const container = document.getElementById('announcement-container');
        container.innerHTML = '';

        this.announcementStack.forEach((announcement, index) => {
            this.showAnnouncement(announcement, index);
        });
    }

    showAnnouncement(announcement, index) {
        const container = document.getElementById('announcement-container');
        const announcementDiv = document.createElement('div');
        announcementDiv.className = 'announcement';
        Object.assign(announcementDiv.style, {
            backgroundColor: this.isDarkMode ? '#1e1e1e' : '#f8d7da',
            color: this.isDarkMode ? '#f8d7da' : '#721c24',
            padding: '10px 20px',
            textAlign: 'center',
            fontSize: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            animation: 'slideDown 0.5s ease-out',
            borderBottom: index > 0 ? '1px solid ' + (this.isDarkMode ? '#f8d7da' : '#721c24') : 'none'
        });

        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = announcement.message;
        Object.assign(messageParagraph.style, {
            margin: '0',
            flexGrow: '1'
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.className = 'close-announcement';
        Object.assign(closeButton.style, {
            background: 'none',
            border: 'none',
            color: this.isDarkMode ? '#f8d7da' : '#721c24',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0 10px'
        });

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.color = this.isDarkMode ? '#ffffff' : '#a71d2a';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.color = this.isDarkMode ? '#f8d7da' : '#721c24';
        });

        closeButton.addEventListener('click', () => this.hideAnnouncement(announcement));

        announcementDiv.appendChild(messageParagraph);
        announcementDiv.appendChild(closeButton);
        container.appendChild(announcementDiv);

        // Add keyframes for slide down animation
        if (!document.querySelector('#slideDownKeyframes')) {
            const keyframes = document.createElement('style');
            keyframes.id = 'slideDownKeyframes';
            keyframes.textContent = `
                @keyframes slideDown {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(0); }
                }
            `;
            document.head.appendChild(keyframes);
        }
    }

    hideAnnouncement(announcement) {
        const index = this.announcementStack.indexOf(announcement);
        if (index > -1) {
            this.announcementStack.splice(index, 1);
        }
        this.updateAnnouncementDisplay();
    }

    loadCategoryContent(categoryName) {
        const category = config.categories.find(cat => cat.name === categoryName);
        if (!category) return;

        let content = `
            <h2>${category.name}</h2>
            <div class="sub-container">
                ${category.items.map(item => `
                    <div class="item-card">
                        <h3>${item.name}</h3>
                        <p>${item.description || 'No description available.'}</p>
                        <a href="${item.url}" class="button visit-button" data-url="${item.url}">Visit Page</a>
                    </div>
                `).join('')}
            </div>
        `;

        this.updateContent(content);
        this.updateActiveSidebarItem(categoryName);
    }

    loadItemContent(categoryName, item) {
        // Here, instead of displaying a mock content, we'll actually load the page content
        window.location.href = item.url;
    }

    loadNotFoundContent() {
        const content = `
            <h2>404 - Page Not Found</h2>
            <p>The requested page could not be found. Please check the URL or navigate using the menu.</p>
            <a href="/" class="button">Go to Homepage</a>
        `;
        this.updateContent(content);
    }

    updateContent(content) {
        this.contentSection.style.opacity = 0;
        setTimeout(() => {
            this.contentSection.innerHTML = content;
            this.contentSection.style.opacity = 1;
        }, 300);
    }

    setupEasterEgg() {
        let konamiIndex = 0;
        const handleKeydown = (e) => {
            if (e.key === config.easterEggCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === config.easterEggCode.length) {
                    this.activateEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    activateEasterEgg() {
        document.body.style.fontFamily = 'Comic Sans MS, cursive';
        this.showNotification('Congratulations! You\'ve unlocked the secret Comic Sans mode!');
        setTimeout(() => {
            document.body.style.fontFamily = '';
        }, config.easterEggDuration);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    generateSidebar() {
        this.sidebarSection.innerHTML = ''; // Clear existing sidebar content
        const sidebarContent = config.categories.map(category => `
            <div class="sidebar-category">
                <h3>${category.name}</h3>
                ${category.items.map(item => `
                    <a href="${item.url}" class="sidebar-item" data-category="${category.name}" data-item="${item.name}">
                        ${item.name}
                    </a>
                `).join('')}
            </div>
        `).join('');

        this.sidebarSection.innerHTML = sidebarContent;
    }

    updateActiveSidebarItem(categoryName, subcategoryName = null, itemName = null) {
        const sidebarItems = this.sidebarSection.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            item.removeAttribute('aria-current');
        });

        if (subcategoryName) {
            const activeItem = this.sidebarSection.querySelector(`.sidebar-item[data-category="${categoryName}"][data-subcategory="${subcategoryName}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
                activeItem.setAttribute('aria-current', 'page');
            }
        } else if (itemName) {
            const activeItem = this.sidebarSection.querySelector(`.sidebar-item[data-category="${categoryName}"][data-item="${itemName}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
                activeItem.setAttribute('aria-current', 'page');
            }
        } else {
            const activeItem = this.sidebarSection.querySelector(`.sidebar-item[data-category="${categoryName}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
                activeItem.setAttribute('aria-current', 'page');
            }
        }
    }

    openModal(content) {
        this.modalBody.innerHTML = content;
        this.modal.style.display = 'block';
        this.modal.setAttribute('aria-hidden', 'false');
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.modal.setAttribute('aria-hidden', 'true');
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark-theme', this.isDarkMode);
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
        this.updateThemeToggleButton();
    }

    loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
    } else {
        // Default to light theme regardless of system preference
        this.isDarkMode = false;
        
        // Save the default light theme preference
        localStorage.setItem('theme', 'light');
    }

    // Apply the theme
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    
    // Update the theme toggle button
    this.updateThemeToggleButton();
    }

    updateThemeToggleButton() {
        const lightIcon = this.themeToggle.querySelector('.fa-sun');
        const darkIcon = this.themeToggle.querySelector('.fa-moon');
        if (this.isDarkMode) {
            lightIcon.classList.remove('active');
            darkIcon.classList.add('active');
        } else {
            lightIcon.classList.add('active');
            darkIcon.classList.remove('active');
        }
    }

    loadCurrentSettings() {
        const fontSize = localStorage.getItem('fontSize') || 'medium';
        const language = localStorage.getItem('language') || 'en';
        const animations = localStorage.getItem('animations') !== 'false';

        if (this.fontSizeSelect) this.fontSizeSelect.value = fontSize;
        if (this.languageSelect) this.languageSelect.value = language;
        if (this.animationsCheckbox) this.animationsCheckbox.checked = animations;

        this.applySettings(fontSize, language, animations);
    }

    applySettings(fontSize, language, animations) {
        // Apply font size
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${fontSize}`);

        // Apply language
        document.documentElement.lang = language;
        this.translateUI(language);

        // Apply animations setting
        document.body.classList.toggle('no-animations', !animations);

        // Update the config object with new settings
        config.fontSize = fontSize;
        config.language = language;
        config.animations = animations;

        // Refresh the UI to reflect the new settings
        this.refreshUI();
    }

    openSettings() {
        const settingsContent = `
            <h2>Settings</h2>
            <div class="settings-option">
                <label for="font-size">Font Size:</label>
                <select id="font-size">
                    <option value="small">Small</option>
                    <option value="medium" selected>Medium</option>
                    <option value="large">Large</option>
                </select>
            </div>
            <div class="settings-option">
                <label for="language">Language:</label>
                <select id="language">
                    <option value="en" selected>English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                </select>
            </div>
            <div class="settings-option">
                <label for="animations">Animations:</label>
                <input type="checkbox" id="animations" checked>
            </div>
            <button id="save-settings">Save Settings</button>
        `;
        this.openModal(settingsContent);

        // Re-initialize elements after modal content is set
        this.fontSizeSelect = document.getElementById('font-size');
        this.languageSelect = document.getElementById('language');
        this.animationsCheckbox = document.getElementById('animations');

        const saveButton = document.getElementById('save-settings');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveSettings());
        }

        // Load current settings
        this.loadCurrentSettings();
    }

    saveSettings() {
        const fontSize = this.fontSizeSelect ? this.fontSizeSelect.value : 'medium';
        const language = this.languageSelect ? this.languageSelect.value : 'en';
        const animations = this.animationsCheckbox ? this.animationsCheckbox.checked : true;

        localStorage.setItem('fontSize', fontSize);
        localStorage.setItem('language', language);
        localStorage.setItem('animations', animations);

        this.applySettings(fontSize, language, animations);
        this.closeModal();
        this.showNotification('Settings saved successfully!');
    }

    translateUI(language) {
        // In a real application, this method would use a translation library
        // or fetch translations from a server. For this example, we'll use a simple object.
        const translations = {
            en: {
                search: 'Search',
                settings: 'Settings',
                theme: 'Theme',
            },
            fr: {
                search: 'Rechercher',
                settings: 'Paramètres',
                theme: 'Thème',
            },
            es: {
                search: 'Buscar',
                settings: 'Ajustes',
                theme: 'Tema',
            }
        };

        const currentTranslations = translations[language] || translations.en;

        // Update UI elements with translated text
        this.searchButton.textContent = currentTranslations.search;
        this.settingsButton.textContent = currentTranslations.settings;
        this.themeToggle.setAttribute('aria-label', currentTranslations.theme);

        // Translate category and item names
        this.translateCategories(currentTranslations);
    }

    translateCategories(translations) {
        config.categories.forEach(category => {
            if (translations[category.name]) {
                category.name = translations[category.name];
            }
            category.items.forEach(item => {
                if (translations[item.name]) {
                    item.name = translations[item.name];
                }
                if (item.description && translations[item.description]) {
                    item.description = translations[item.description];
                }
            });
        });

        // Refresh the UI to reflect the translated content
        this.refreshUI();
    }

    refreshUI() {
        // Regenerate categories and sidebar with updated content
        this.generateCategories();
        this.generateSidebar();

        // Refresh the current page content
        this.handleRouteChange();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazy');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img.lazy');
            lazyImages.forEach(lazyImage => {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            const lazyImages = document.querySelectorAll('img.lazy');
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    enhanceAccessibility() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Ensure all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
        interactiveElements.forEach(el => {
            if (!el.getAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });

        // Add aria-label to icon buttons
        const iconButtons = document.querySelectorAll('button:not(:empty)');
        iconButtons.forEach(button => {
            if (!button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Add keyboard navigation for sidebar items
        this.sidebarSection.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('sidebar-item')) {
                const items = Array.from(this.sidebarSection.querySelectorAll('.sidebar-item'));
                const currentIndex = items.indexOf(e.target);
                
                if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
                    e.preventDefault();
                    items[currentIndex + 1].focus();
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    e.preventDefault();
                    items[currentIndex - 1].focus();
                }
            }
        });
    }

    init() {
        this.generateCategories();
        this.setupEventListeners();
        this.setupRouter();
        this.setupEasterEgg();
        this.generateSidebar();
        this.loadThemePreference();
        this.loadCurrentSettings();
        this.setupLazyLoading();
        this.enhanceAccessibility();
        this.setupKeyboardNavigation();
        this.setupAnnouncements();
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DupuisApp();
});
