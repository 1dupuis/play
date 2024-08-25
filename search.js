document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const contentSection = document.querySelector('.content');
    const menuToggle = document.querySelector('.menu-toggle');

    const categories = [
        { name: 'Games', icon: 'fa-gamepad' },
        { name: 'Resources', icon: 'fa-book' },
        { name: 'Development', icon: 'fa-link' }
    ];

    // Generate category buttons dynamically
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'categories';
    categories.forEach(category => {
        const categoryButton = document.createElement('div');
        categoryButton.className = 'category';
        categoryButton.innerHTML = `
            <i class="fas ${category.icon}"></i>
            <h2>${category.name}</h2>
        `;
        categoryButton.addEventListener('click', () => loadCategoryContent(category.name));

        // Ensure the icon exists before adding hover effects
        const icon = categoryButton.querySelector('i');
        if (icon) {
            categoryButton.addEventListener('mouseover', () => {
                icon.classList.add('fa-spin');
            });
            categoryButton.addEventListener('mouseout', () => {
                icon.classList.remove('fa-spin');
            });
        }

        categoryContainer.appendChild(categoryButton);
    });
    document.querySelector('main').insertBefore(categoryContainer, contentSection);

    // Search functionality
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (query) {
            const results = `
                <h2>Search Results for "${query}"</h2>
                <ul class="search-results">
                    ${generateSearchResults(query)}
                </ul>
            `;
            updateContent(results);
        }
    }

    function generateSearchResults(query) {
        const allContent = {
            'Games': ['Snake Game', 'Trivia', 'Motle', 'DupuisGuessr'],
            'Resources': ['Videos', 'Events', 'Translate', 'Rewards', 'News', 'Forms', 'Café'],
            'Development': ['Old Homepage', 'Contact', 'Updates']
        };

        let results = '';
        const highlightStyle = 'background-color: yellow; font-weight: bold;';

        for (const category in allContent) {
            allContent[category].forEach(item => {
                const itemLower = item.toLowerCase();
                if (itemLower.includes(query)) {
                    const highlightedItem = item.replace(new RegExp(query, 'gi'), match => `<span style="${highlightStyle}">${match}</span>`);
                    results += `<li><a href="#" onclick="loadCategoryContent('${category}')">${highlightedItem}</a></li>`;
                }
            });
        }
        return results || '<li>No results found</li>';
    }

    function loadCategoryContent(category) {
        let content = '';
        switch (category) {
            case 'Games':
                content = `
                    <div class="sub-container">
                        <h2>Games</h2>
                        <a href="snake-game" class="button">Snake Game</a>
                        <a href="trivia" class="button">Trivia</a>
                        <a href="motle" class="button">Motle</a>
                        <a href="guessr" class="button">DupuisGuessr</a>
                    </div>
                `;
                break;
            case 'Resources':
                content = `
                    <div class="sub-container">
                        <h2>Resources</h2>
                        <a href="videos" class="button">Videos</a>
                        <a href="events" class="button">Events</a>
                        <a href="translate" class="button">Translate</a>
                        <a href="rewards" class="button">Rewards</a>
                        <a href="news" class="button">News</a>
                        <a href="forms" class="button">Forms</a>
                        <a href="cafe" class="button">Café</a>
                    </div>
                `;
                break;
            case 'Development':
                content = `
                    <div class="sub-container">
                        <h2>Development</h2>
                        <a href="homepage" class="button">Old Homepage</a>
                        <a href="contact" class="button">Contact</a>
                    </div>
                `;
                break;
            default:
                content = '<h2>Content not found</h2>';
        }
        updateContent(content);
    }

    function updateContent(content) {
        if (contentSection) {
            contentSection.style.opacity = 0;
            setTimeout(() => {
                contentSection.innerHTML = content;
                contentSection.style.opacity = 1;
            }, 300);
        }
    }

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('menu-open');
        });
    }

    // Initialize with default content (e.g., Games)
    loadCategoryContent('Games');

    // Easter egg: Konami code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        document.body.style.fontFamily = 'Comic Sans MS, cursive';
        alert('Congratulations! You\'ve unlocked the secret Comic Sans mode!');
        setTimeout(() => {
            document.body.style.fontFamily = '';
        }, 5000);
    }
});
