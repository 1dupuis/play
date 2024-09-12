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
            language: 'en',
            allowedLanguages: ['en', 'es', 'fr'], // Add supported languages here
            cookieName: 'access_control_lang',
            cookieExpireDays: 30
        },

        content: {
            en: {
                maintenance: {
                    title: 'Digital Gardening in Progress! 🌱',
                    message: 'Our tech wizards are sprucing things up. We\'ll be back in bloom before you know it!',
                    icon: 'fa-solid fa-seedling'
                },
                blocked: {
                    title: 'Whoops! VIP Treehouse Ahead 🌳',
                    message: 'You\'ve stumbled upon our secret clubhouse. Only members with the magic password can enter!',
                    icon: 'fa-solid fa-tree'
                }
            },
            es: {
                maintenance: {
                    title: '¡Jardinería Digital en Progreso! 🌱',
                    message: 'Nuestros magos tecnológicos están arreglando las cosas. ¡Volveremos a florecer antes de que te des cuenta!',
                    icon: 'fa-solid fa-seedling'
                },
                blocked: {
                    title: '¡Ups! Casa del Árbol VIP Adelante 🌳',
                    message: '¡Has tropezado con nuestro club secreto. Solo los miembros con la contraseña mágica pueden entrar!',
                    icon: 'fa-solid fa-tree'
                }
            },
            fr: {
                maintenance: {
                    title: 'Jardinage Numérique en Cours ! 🌱',
                    message: 'Nos magiciens tech sont en train d\'arranger les choses. Nous serons de retour en fleurs avant que vous ne le sachiez !',
                    icon: 'fa-solid fa-seedling'
                },
                blocked: {
                    title: 'Oups ! Cabane VIP Droit Devant 🌳',
                    message: 'Vous êtes tombé sur notre club secret. Seuls les membres avec le mot de passe magique peuvent entrer !',
                    icon: 'fa-solid fa-tree'
                }
            }
        },

        funFacts: {
            en: [
                'The first computer bug was an actual real-life moth found in a computer relay in 1947!',
                'The world\'s largest treehouse is over seven stories tall and uses 6 trees as its foundation!',
                'The term "bugs" in computer science originated from actual insects causing problems in early computers.',
                'The first website ever created is still online! You can visit it at info.cern.ch.',
                'The most expensive domain name ever sold was Cars.com for $872 million.',
                'There are more possible iterations of a game of chess than there are atoms in the known universe.',
                'The first computer mouse was made of wood!',
                'The QWERTY keyboard layout was designed to slow typists down to prevent jamming on mechanical typewriters.',
                'The first webcam was created at Cambridge University to monitor a coffee pot!',
                'The original name for Windows was Interface Manager.'
            ],
            es: [
                '¡El primer "bug" informático fue una polilla real encontrada en un relé de computadora en 1947!',
                '¡La casa del árbol más grande del mundo tiene más de siete pisos de altura y usa 6 árboles como base!',
                'El término "bugs" en informática se originó de insectos reales que causaban problemas en las primeras computadoras.',
                '¡El primer sitio web creado aún está en línea! Puedes visitarlo en info.cern.ch.',
                'El nombre de dominio más caro jamás vendido fue Cars.com por $872 millones.',
                '¡Hay más posibles iteraciones en un juego de ajedrez que átomos en el universo conocido!',
                '¡El primer ratón de computadora estaba hecho de madera!',
                'El diseño del teclado QWERTY se creó para ralentizar a los mecanógrafos y evitar atascos en las máquinas de escribir mecánicas.',
                '¡La primera webcam fue creada en la Universidad de Cambridge para monitorear una cafetera!',
                'El nombre original de Windows era Interface Manager.'
            ],
            fr: [
                'Le premier "bug" informatique était un vrai papillon de nuit trouvé dans un relais d\'ordinateur en 1947 !',
                'La plus grande cabane dans les arbres du monde fait plus de sept étages de haut et utilise 6 arbres comme fondation !',
                'Le terme "bugs" en informatique provient d\'insectes réels qui causaient des problèmes dans les premiers ordinateurs.',
                'Le premier site web jamais créé est toujours en ligne ! Vous pouvez le visiter à info.cern.ch.',
                'Le nom de domaine le plus cher jamais vendu était Cars.com pour 872 millions de dollars.',
                'Il y a plus d\'itérations possibles dans une partie d\'échecs que d\'atomes dans l\'univers connu !',
                'La première souris d\'ordinateur était faite en bois !',
                'La disposition du clavier AZERTY a été conçue pour ralentir les dactylographes afin d\'éviter les blocages sur les machines à écrire mécaniques.',
                'La première webcam a été créée à l\'Université de Cambridge pour surveiller une cafetière !',
                'Le nom original de Windows était Interface Manager.'
            ]
        },

        styles: `
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
            @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');
            
            body {
                font-family: 'Nunito', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                color: #333;
            }
            .container {
                text-align: center;
                padding: 3rem;
                background-color: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                max-width: 90%;
                width: 500px;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .container::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
                transform: rotate(0deg);
                animation: shimmer 5s linear infinite;
            }
            @keyframes shimmer {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .content {
                position: relative;
                z-index: 1;
            }
            .icon {
                font-size: 4rem;
                margin-bottom: 1.5rem;
                color: #4CAF50;
                animation: pulse 2s ease-in-out infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 1rem;
                font-weight: 700;
            }
            p {
                color: #34495e;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            .btn {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 30px;
                transition: all 0.3s ease;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .btn:hover {
                background-color: #45a049;
                transform: translateY(-2px);
                box-shadow: 0 6px 8px rgba(0,0,0,0.15);
            }
            .fun-fact {
                font-style: italic;
                font-size: 0.9em;
                margin-top: 2rem;
                opacity: 0.8;
                background-color: rgba(76, 175, 80, 0.1);
                padding: 1rem;
                border-radius: 10px;
                cursor: pointer;
            }
            .emoji {
                font-size: 1.2em;
                margin: 0 0.2em;
                display: inline-block;
                animation: wiggle 2s infinite;
            }
            @keyframes wiggle {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(10deg); }
                75% { transform: rotate(-10deg); }
            }
            .language-selector {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 2;
            }
            .language-selector select {
                padding: 5px;
                border-radius: 5px;
                border: 1px solid #4CAF50;
                background-color: white;
                color: #4CAF50;
                font-family: 'Nunito', sans-serif;
                cursor: pointer;
            }
            .countdown {
                font-size: 0.9em;
                margin-top: 1rem;
                color: #4CAF50;
            }
            .visually-hidden {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `,

        init() {
            this.handleNavigation();
            window.addEventListener('popstate', () => this.handleNavigation());
            document.addEventListener('click', (e) => this.interceptClicks(e));
            this.setLanguage(this.getLanguageFromCookie() || this.getBrowserLanguage() || this.config.language);
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

            const emoji = pageType === 'maintenance' ? '🌱' : '🌳';
            const funFact = this.getRandomFunFact();

            container.innerHTML = `
                <div class="language-selector">
                    <label for="language-select" class="visually-hidden">Select Language</label>
                    <select id="language-select">
                        ${this.config.allowedLanguages.map(lang => `<option value="${lang}"${lang === this.config.language ? ' selected' : ''}>${lang.toUpperCase()}</option>`).join('')}
                    </select>
                </div>
                <div class="content">
                    <div class="icon"><i class="${this.escapeHTML(content.icon)}" aria-hidden="true"></i></div>
                    <h1>${this.escapeHTML(content.title)} <span class="emoji" aria-hidden="true">${emoji}</span></h1>
                    <p>${this.escapeHTML(content.message)}</p>
                    <a href="${this.config.defaultRedirect}" class="btn">${this.translate('Return to Homepage')}</a>
                    <p class="fun-fact" tabindex="0" role="button" aria-label="Click to see a new fun fact">🤓 ${this.translate('Fun Fact')}: ${this.escapeHTML(funFact)}</p>
                    ${pageType === 'maintenance' ? '<p class="countdown" aria-live="polite"></p>' : ''}
                </div>
            `;

            if (pageType === 'blocked') {
                const params = new URLSearchParams(window.location.search);
                const fromPage = params.get('from');
                if (fromPage) {
                    const messageElement = container.querySelector('p');
                    if (messageElement) {
                        messageElement.textContent = `${this.translate('Oops!')} "${this.escapeHTML(fromPage)}" ${this.translate('is a VIP area.')} ${content.message}`;
                    }
                }
            }

            this.addInteractivity();

            if (pageType === 'maintenance') {
                this.startCountdown();
            }
        },

        addInteractivity() {
            const icon = document.querySelector('.icon i');
            const container = document.querySelector('.container');
            const btn = document.querySelector('.btn');
            const funFactElement = document.querySelector('.fun-fact');
            const languageSelect = document.getElementById('language-select');

            if (icon) {
                icon.addEventListener('mouseover', () => {
                    icon.style.animation = 'spin 1s linear infinite';
                });
                icon.addEventListener('mouseout', () => {
                    icon.style.animation = 'pulse 2s ease-in-out infinite';
                });
            }

            if (container) {
                container.addEventListener('mousemove', (e) => {
                    const { left, top, width, height } = container.getBoundingClientRect();
                    const x = (e.clientX - left) / width;
                    const y = (e.clientY - top) / height;
                    
                    container.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${y * -3}deg)`;
                });

                container.addEventListener('mouseleave', () => {
                    container.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
                });
            }

            if (btn) {
                btn.addEventListener('mouseover', () => {
                    btn.textContent = this.translate('Let\'s Go!');
                });
                btn.addEventListener('mouseout', () => {
                    btn.textContent = this.translate('Return to Homepage');
                });
            }

            if (funFactElement) {
                funFactElement.addEventListener('click', () => {
                    funFactElement.textContent = `🤓 ${this.translate('Fun Fact')}: ${this.getRandomFunFact()}`;
                });
                funFactElement.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        funFactElement.click();
                    }
                });
            }

            if (languageSelect) {
                languageSelect.addEventListener('change', (e) => {
                    this.setLanguage(e.target.value);
                    this.handleNavigation();
                });
            }
        },

        startCountdown() {
            const countdownElement = document.querySelector('.countdown');
            if (!countdownElement) return;

            const endTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes from now

            const updateCountdown = () => {
                const now = new Date().getTime();
                const timeLeft = endTime - now;

                if (timeLeft < 0) {
                    countdownElement.textContent = this.translate('Maintenance complete! Refreshing...');
                    setTimeout(() => window.location.reload(), 3000);
                    return;
                }

                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                countdownElement.textContent = `${this.translate('Estimated time remaining')}: ${minutes}m ${seconds}s`;

                setTimeout(updateCountdown, 1000);
            };

            updateCountdown();
        },

        getContent(pageType) {
            return this.content[this.config.language]?.[pageType] || this.content.en[pageType];
        },

        getRandomFunFact() {
            const facts = this.funFacts[this.config.language] || this.funFacts.en;
            return facts[Math.floor(Math.random() * facts.length)];
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
        },

        setLanguage(lang) {
            if (this.config.allowedLanguages.includes(lang)) {
                this.config.language = lang;
                this.setCookie(this.config.cookieName, lang, this.config.cookieExpireDays);
            } else {
                this.log(`Unsupported language: ${lang}`);
            }
        },

        getLanguageFromCookie() {
            const name = this.config.cookieName + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieArray = decodedCookie.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                let cookie = cookieArray[i].trim();
                if (cookie.indexOf(name) === 0) {
                    return cookie.substring(name.length, cookie.length);
                }
            }
            return null;
        },

        getBrowserLanguage() {
            const lang = navigator.language || navigator.userLanguage;
            return lang.split('-')[0];
        },

        setCookie(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        },

        translate(key) {
            const translations = {
                en: {
                    'Return to Homepage': 'Return to Homepage',
                    'Let\'s Go!': 'Let\'s Go!',
                    'Fun Fact': 'Fun Fact',
                    'Oops!': 'Oops!',
                    'is a VIP area.': 'is a VIP area.',
                    'Estimated time remaining': 'Estimated time remaining',
                    'Maintenance complete! Refreshing...': 'Maintenance complete! Refreshing...'
                },
                es: {
                    'Return to Homepage': 'Volver a la Página Principal',
                    'Let\'s Go!': '¡Vamos!',
                    'Fun Fact': 'Dato Curioso',
                    'Oops!': '¡Ups!',
                    'is a VIP area.': 'es un área VIP.',
                    'Estimated time remaining': 'Tiempo estimado restante',
                    'Maintenance complete! Refreshing...': '¡Mantenimiento completo! Actualizando...'
                },
                fr: {
                    'Return to Homepage': 'Retour à la Page d\'Accueil',
                    'Let\'s Go!': 'Allons-y !',
                    'Fun Fact': 'Anecdote',
                    'Oops!': 'Oups !',
                    'is a VIP area.': 'est une zone VIP.',
                    'Estimated time remaining': 'Temps estimé restant',
                    'Maintenance complete! Refreshing...': 'Maintenance terminée ! Actualisation...'
                }
            };
            return translations[this.config.language]?.[key] || translations.en[key] || key;
        }
    };

    // Initialize the AccessControl object
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AccessControl.init());
    } else {
        AccessControl.init();
    }
})();
