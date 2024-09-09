// Configuration object for easy editing
const config = {
    categories: [
        { 
            name: 'Games', 
            icon: 'fa-gamepad', 
            items: [
                { name: 'Snake Game', url: '/snake-game' },
                { name: 'Trivia', url: '/trivia' },
                { name: 'Motle', url: '/motle' },
                { name: 'DupuisGuessr', url: '/guessr' },
                { name: 'Ascend', url: '/ascend' }
            ]
        },
        { 
            name: 'Resources', 
            icon: 'fa-book', 
            items: [
                { name: 'Extension', url: '/extension/download' },
                { name: 'Cuisine AI', url: '/cuisine-ai' },
                { name: 'Events', url: '/events' },
                { name: 'Café', url: '/cafe' },
                { name: 'Rewards', url: '/rewards' },
                { name: 'News', url: '/news' },
                { name: 'Translate', url: '/translate' }
            ]
        },
        { 
            name: 'Development', 
            icon: 'fa-code', 
            items: [
                { name: 'Study', url: '/workspace/study' },
                { name: 'Notes', url: '/workspace/notes' },
                { name: 'Old Homepage', url: '/homepage' },
                { name: 'Contact', url: '/contact' },
                { name: 'Videos', url: '/videos' },
                { name: 'Forms', url: '/forms' }
            ]
        }
    ],
    defaultCategory: 'Games',
    searchPlaceholder: 'Search dupuis.lol...',
    noResultsMessage: 'No results found. Try a different search term.',
    easterEggCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
    easterEggDuration: 5000
};

class DupuisApp {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        this.contentSection = document.getElementById('content');
        this.categoriesSection = document.getElementById('categories');
        this.menuToggle = document.getElementById('menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.sidebarSection = document.getElementById('sidebar');

        this.currentCategory = null;
        this.currentItem = null;

        if (this.validateDOMElements()) {
            this.init();
        } else {
            console.error('Some required DOM elements are missing. Please check your HTML.');
        }
    }

    validateDOMElements() {
        return this.searchInput && this.searchButton && this.contentSection && 
               this.categoriesSection && this.menuToggle && this.navLinks && this.sidebarSection;
    }

    init() {
        this.generateCategories();
        this.setupEventListeners();
        this.setupRouter();
        this.setupEasterEgg();
        this.generateSidebar();
    }

    generateCategories() {
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
            this.loadCategoryContent(config.defaultCategory);
            return;
        }

        const category = config.categories.find(cat => cat.name.toLowerCase() === pathSegments[0]);
        if (category) {
            this.currentCategory = category.name;
            if (pathSegments.length === 1) {
                this.loadCategoryContent(category.name);
            } else {
                const item = this.findItemByUrl(category, `/${pathSegments.join('/')}`);
                if (item) {
                    this.currentItem = item.name;
                    this.loadItemContent(category.name, item.name);
                } else {
                    this.loadNotFoundContent();
                }
            }
        } else {
            const item = this.findItemByUrl(null, path);
            if (item) {
                const category = this.findCategoryByItem(item);
                this.currentCategory = category.name;
                this.currentItem = item.name;
                this.loadItemContent(category.name, item.name);
            } else {
                this.loadNotFoundContent();
            }
        }
    }

    findItemByUrl(category, url) {
        if (category) {
            return category.items.find(item => item.url === url);
        }
        return config.categories.flatMap(cat => cat.items).find(item => item.url === url);
    }

    findCategoryByItem(item) {
        return config.categories.find(category => category.items.includes(item));
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
                if (item.name.toLowerCase().includes(query)) {
                    found = true;
                    results += `<li><a href="#" onclick="app.navigateTo('${item.url}'); return false;">${this.highlightMatch(item.name, query)} (${category.name})</a></li>`;
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

    loadCategoryContent(categoryName) {
      const category = config.categories.find(cat => cat.name === categoryName);
      if (!category) return;

      let content = `
        <h2>${category.name}</h2>
        <div class="sub-container">
            ${category.items.map(item => `
                <div class="item-card">
                    <h3>${item.name}</h3>
                    <a href="${item.url}" class="button visit-button">Visit Page</a>
                </div>
            `).join('')}
        </div>
    `;

    this.updateContent(content);
    this.updateActiveSidebarItem(categoryName);
  }

    loadItemContent(categoryName, itemName) {
        const category = config.categories.find(cat => cat.name === categoryName);
        const item = category ? category.items.find(i => i.name === itemName) : null;

        if (!category || !item) {
            this.loadNotFoundContent();
            return;
        }

        const content = `
            <h2>${category.name}</h2>
            <div class="sub-container">
                ${category.items.map(i => `
                    <a href="#" class="button ${i.name === itemName ? 'active' : ''}" 
                       onclick="app.navigateTo('${i.url}'); return false;">${i.name}</a>
                `).join('')}
            </div>
            <div class="item-content">
                <h3>${itemName}</h3>
                <p>Content for ${itemName} in the ${categoryName} category would be displayed here.</p>
                <p>URL: ${item.url}</p>
            </div>
        `;
        this.updateContent(content);
        this.updateActiveSidebarItem(categoryName, itemName);
    }

    loadNotFoundContent() {
        const content = `
            <h2>404 - Page Not Found</h2>
            <p>The requested page could not be found. Please check the URL or navigate using the menu.</p>
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
        const sidebarContent = config.categories.map(category => `
            <div class="sidebar-category">
                <h3>${category.name}</h3>
                ${category.items.map(item => `
                    <a href="#" class="sidebar-item" data-category="${category.name}" data-item="${item.name}"
                       onclick="app.navigateTo('${item.url}'); return false;">
                        ${item.name}
                    </a>
                `).join('')}
            </div>
        `).join('');

        this.sidebarSection.innerHTML = sidebarContent;
    }

    updateActiveSidebarItem(categoryName, itemName = null) {
        const sidebarItems = this.sidebarSection.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            item.removeAttribute('aria-current');
        });

        if (itemName) {
            const activeItem = this.sidebarSection.querySelector(`.sidebar-item[data-category="${categoryName}"][data-item="${itemName}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
                activeItem.setAttribute('aria-current', 'page');
            }
        }
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DupuisApp();
});
