(function() {
    'use strict';

    const AccessControl = {
        config: {
            maintenanceMode: true,
            blockedUrls: ['/contact', '/admin'],
            pages: {
                maintenance: '/maintenance.html',
                blocked: '/blocked-page.html'
            },
            defaultRedirect: '/',
            debug: false,
            language: 'en'
        },

        content: {
            en: {
                maintenance: {
                    title: 'Oops! We\'re Tidying Up',
                    message: 'Our digital elves are working their magic. We\'ll be back faster than you can say "website maintenance"!',
                    icon: 'fa-solid fa-hammer',
                    funFact: 'Did you know? The first website ever created is still online! It was published on August 6, 1991.'
                },
                blocked: {
                    title: 'Whoa there, Explorer!',
                    message: 'Looks like you\'ve stumbled upon a top-secret area. Unless you\'re wearing an invisibility cloak, we can\'t let you in!',
                    icon: 'fa-solid fa-user-secret',
                    funFact: 'Fun fact: The strongest known password would take 3 quintillion years to crack!'
                }
            }
            // Add more languages here
        },

        styles: `
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');
            
            body {
                font-family: 'Quicksand', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
                background-size: 400% 400%;
                animation: gradientBG 15s ease infinite;
                color: #333;
            }
            @keyframes gradientBG {
                0% { background-position: 0% 50% }
                50% { background-position: 100% 50% }
                100% { background-position: 0% 50% }
            }
            .container {
                text-align: center;
                padding: 3rem;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                max-width: 90%;
                width: 500px;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .container:hover {
                transform: translateY(-5px) rotate(1deg);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            }
            .icon {
                font-size: 4rem;
                margin-bottom: 1.5rem;
                color: #3498db;
                animation: floatIcon 3s ease-in-out infinite;
            }
            @keyframes floatIcon {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(10deg); }
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 1rem;
                font-weight: 600;
            }
            p {
                color: #34495e;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background-color: #3498db;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .btn:hover {
                background-color: #2980b9;
                transform: scale(1.05);
            }
            .btn::after {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: rgba(255,255,255,0.2);
                transform: rotate(45deg);
                transition: all 0.3s ease;
            }
            .btn:hover::after {
                left: 100%;
                top: 100%;
            }
            .fun-fact {
                font-style: italic;
                font-size: 0.9em;
                margin-top: 2rem;
                opacity: 0.8;
            }
            .emoji {
                font-size: 1.2em;
                margin: 0 0.2em;
                display: inline-block;
                animation: wave 2s infinite;
            }
            @keyframes wave {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(20deg); }
            }
        `,

        init() {
            this.handleNavigation();
            window.addEventListener('popstate', () => this.handleNavigation());
            document.addEventListener('click', (e) => this.interceptClicks(e));
            this.log('Access Control initialized');
        },

        handleNavigation() {
            const currentPath = window.location.pathname;
            
            if (this.config.maintenanceMode && !this.isCustomPage(currentPath)) {
                this.redirect(this.config.pages.maintenance);
                return;
            }
            
            if (this.isUrlBlocked(currentPath) && currentPath !== this.config.pages.blocked) {
                this.redirect(`${this.config.pages.blocked}?from=${encodeURIComponent(currentPath)}`);
            } else if (this.isCustomPage(currentPath)) {
                this.injectContent(currentPath);
            }
        },

        interceptClicks(e) {
            const link = e.target.closest('a');
            if (link && link.href) {
                try {
                    const url = new URL(link.href);
                    if (url.origin === window.location.origin) {
                        const fullPath = url.pathname;
                        if (this.config.maintenanceMode && !this.isCustomPage(fullPath)) {
                            e.preventDefault();
                            this.redirect(this.config.pages.maintenance);
                        } else if (this.isUrlBlocked(fullPath)) {
                            e.preventDefault();
                            this.redirect(`${this.config.pages.blocked}?from=${encodeURIComponent(fullPath)}`);
                        }
                    }
                } catch (error) {
                    this.log(`Error parsing URL: ${error.message}`);
                }
            }
        },

        isUrlBlocked(url) {
            return this.config.blockedUrls.some(blockedUrl => url.startsWith(blockedUrl));
        },

        isCustomPage(url) {
            return Object.values(this.config.pages).includes(url);
        },

        injectContent(page) {
            const pageType = Object.keys(this.config.pages).find(key => this.config.pages[key] === page);
            const content = this.getContent(pageType);
            
            if (!content) {
                this.log(`Content not found for page type: ${pageType}`);
                return;
            }

            this.injectStyles();

            // Create container if it doesn't exist
            let container = document.querySelector('.container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'container';
                document.body.appendChild(container);
            }

            const emoji = pageType === 'maintenance' ? '🛠️' : '🕵️';

            container.innerHTML = `
                <div class="icon"><i class="${this.escapeHTML(content.icon)}"></i></div>
                <h1>${this.escapeHTML(content.title)} <span class="emoji">${emoji}</span></h1>
                <p>${this.escapeHTML(content.message)}</p>
                <a href="${this.config.defaultRedirect}" class="btn">Beam Me Up, Scotty!</a>
                <p class="fun-fact">${this.escapeHTML(content.funFact)}</p>
            `;

            if (pageType === 'blocked') {
                const params = new URLSearchParams(window.location.search);
                const fromPage = params.get('from');
                if (fromPage) {
                    const messageElement = container.querySelector('p');
                    if (messageElement) {
                        messageElement.textContent = `Whoa! "${this.escapeHTML(fromPage)}" is off-limits. ${content.message}`;
                    }
                }
            }

            this.addInteractivity();
        },

        addInteractivity() {
            const icon = document.querySelector('.icon i');
            const container = document.querySelector('.container');
            const btn = document.querySelector('.btn');

            if (icon) {
                icon.addEventListener('mouseover', () => {
                    icon.style.animation = 'spin 1s linear infinite';
                });
                icon.addEventListener('mouseout', () => {
                    icon.style.animation = 'floatIcon 3s ease-in-out infinite';
                });
            }

            if (container) {
                container.addEventListener('mousemove', (e) => {
                    const { left, top, width, height } = container.getBoundingClientRect();
                    const x = (e.clientX - left) / width;
                    const y = (e.clientY - top) / height;
                    
                    container.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
                });

                container.addEventListener('mouseleave', () => {
                    container.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
                });
            }

            if (btn) {
                btn.addEventListener('mouseover', () => {
                    btn.textContent = 'Engaging Warp Drive!';
                });
                btn.addEventListener('mouseout', () => {
                    btn.textContent = 'Beam Me Up, Scotty!';
                });
            }
        },

        getContent(pageType) {
            return this.content[this.config.language]?.[pageType] || this.content.en[pageType];
        },

        injectStyles() {
            if (!document.querySelector('#access-control-styles')) {
                const styleElement = document.createElement('style');
                styleElement.id = 'access-control-styles';
                styleElement.textContent = this.styles;
                document.head.appendChild(styleElement);
            }
        },

        redirect(url) {
            window.location.href = url;
        },

        log(message) {
            if (this.config.debug) {
                console.log(`[AccessControl] ${message}`);
            }
        },

        escapeHTML(str) {
            const escapeChars = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
            };
            return String(str).replace(/[&<>"'`=\/]/g, function(char) {
                return escapeChars[char];
            });
        }
    };

    // Initialize the AccessControl object
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AccessControl.init());
    } else {
        AccessControl.init();
    }
})();
