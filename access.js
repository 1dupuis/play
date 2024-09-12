(function() {
    'use strict';

    const AccessControl = {
        config: {
            maintenanceMode: true,
            blockedUrls: ['/contact', '/admin'],
            pages: {
                maintenance: '/maintenance',
                blocked: '/blocked-page'
            },
            defaultRedirect: '/',
            debug: false,
            language: 'en'
        },

        content: {
            en: {
                maintenance: {
                    title: 'Site Undergoing Maintenance',
                    message: 'We apologize for the inconvenience. Our site is currently undergoing maintenance to improve your experience. Please check back soon.',
                    icon: 'fa-solid fa-wrench'
                },
                blocked: {
                    title: 'Access Restricted',
                    message: 'We\'re sorry, but you don\'t have permission to access this page. If you believe this is an error, please contact the site administrator.',
                    icon: 'fa-solid fa-lock'
                }
            }
            // Add more languages here
        },

        styles: `
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f7f7f7;
                color: #333;
            }
            .container {
                text-align: center;
                padding: 2rem;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 90%;
                width: 500px;
            }
            .icon {
                font-size: 3rem;
                margin-bottom: 1rem;
                color: #3498db;
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 1rem;
            }
            p {
                color: #34495e;
                line-height: 1.6;
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

            container.innerHTML = `
                <div class="icon"><i class="${this.escapeHTML(content.icon)}"></i></div>
                <h1>${this.escapeHTML(content.title)}</h1>
                <p>${this.escapeHTML(content.message)}</p>
            `;

            if (pageType === 'blocked') {
                const params = new URLSearchParams(window.location.search);
                const fromPage = params.get('from');
                if (fromPage) {
                    const messageElement = container.querySelector('p');
                    if (messageElement) {
                        messageElement.textContent = `Access to "${this.escapeHTML(fromPage)}" is restricted. ${content.message}`;
                    }
                }
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
