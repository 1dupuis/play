(function() {
    'use strict';

    const AccessControl = {
        config: {
            maintenanceMode: false,
            blockedUrls: ['/contact', '/admin'],
            pages: {
                maintenance: '/maintenance',
                blocked: '/blocked-page'
            },
            defaultRedirect: '/',
            debug: false,
            language: 'en',
            allowedLanguages: ['en', 'es', 'fr'],
            cookieName: 'access_control_lang',
            cookieExpireDays: 30,
            loginCookieName: 'isLogin',
            redirectUrl: '/',
            redirectDelay: 500,
            autoLogoutTime: 30 * 60 * 1000 // 30 minutes
        },

        content: {
            en: {
                maintenance: {
                    title: 'Site Under Maintenance',
                    message: 'We are currently performing updates and improvements. The site will be back online shortly. Thank you for your patience.',
                    icon: 'fa-solid fa-seedling'
                },
                blocked: {
                    title: 'Access Restricted',
                    message: 'This section is restricted to authorized users only. Please enter the correct password to proceed.',
                    icon: 'fa-solid fa-tree'
                },
                logout: {
                    title: 'Session Expired',
                    message: 'You have been logged out due to inactivity.',
                    loginButton: 'Log In',
                    icon: 'fa-solid fa-door-open'
                }
            },
            es: {
                maintenance: {
                    title: 'Sitio en Mantenimiento',
                    message: 'Actualmente estamos realizando actualizaciones y mejoras. El sitio volverá a estar en línea pronto. Gracias por su paciencia.',
                    icon: 'fa-solid fa-seedling'
                },
                blocked: {
                    title: 'Acceso Restringido',
                    message: 'Esta sección está restringida solo para usuarios autorizados. Por favor, ingrese la contraseña correcta para continuar.',
                    icon: 'fa-solid fa-tree'
                },
                logout: {
                    title: 'Sesión Expirada',
                    message: 'Se ha cerrado su sesión debido a inactividad.',
                    loginButton: 'Iniciar Sesión',
                    icon: 'fa-solid fa-door-open'
                }
            },
            fr: {
                maintenance: {
                    title: 'Site en Maintenance',
                    message: 'Nous effectuons actuellement des mises à jour et des améliorations. Le site sera de retour en ligne sous peu. Merci de votre patience.',
                    icon: 'fa-solid fa-seedling'
                },
                blocked: {
                    title: 'Accès Restreint',
                    message: 'Cette section est réservée aux utilisateurs autorisés. Veuillez entrer le mot de passe correct pour continuer.',
                    icon: 'fa-solid fa-tree'
                },
                logout: {
                    title: 'Session Expirée',
                    message: 'Vous avez été déconnecté en raison d\'inactivité.',
                    loginButton: 'Se Connecter',
                    icon: 'fa-solid fa-door-open'
                }
            }
        },

        funFacts: {
            en: [
                "The first computer bug was an actual bug - a moth trapped in a Harvard Mark II computer in 1947.",
                "The average computer user blinks 7 times a minute, less than half the normal rate of 20.",
                "More than 80% of the emails sent daily are spam.",
                "The first 1GB hard disk drive was announced in 1980 and weighed about 550 pounds.",
                "The original name for Windows was Interface Manager.",
                "The first computer mouse was made of wood.",
                "The first domain name ever registered was Symbolics.com on March 15, 1985.",
                "About 70% of virus writers are said to work under contract for organized crime syndicates.",
                "The QWERTY keyboard was designed to slow typing speed.",
                "The first computer programmer was Ada Lovelace, a woman."
            ],
            es: [
                "El primer 'bug' informático fue un insecto real: una polilla atrapada en una computadora Harvard Mark II en 1947.",
                "El usuario promedio de computadora parpadea 7 veces por minuto, menos de la mitad de la tasa normal de 20.",
                "Más del 80% de los correos electrónicos enviados diariamente son spam.",
                "El primer disco duro de 1GB se anunció en 1980 y pesaba alrededor de 250 kg.",
                "El nombre original de Windows era Interface Manager.",
                "El primer ratón de computadora estaba hecho de madera.",
                "El primer nombre de dominio registrado fue Symbolics.com el 15 de marzo de 1985.",
                "Se dice que alrededor del 70% de los creadores de virus trabajan bajo contrato para sindicatos del crimen organizado.",
                "El teclado QWERTY fue diseñado para reducir la velocidad de escritura.",
                "La primera programadora de computadoras fue Ada Lovelace, una mujer."
            ],
            fr: [
                "Le premier 'bug' informatique était un vrai insecte - un papillon de nuit piégé dans un ordinateur Harvard Mark II en 1947.",
                "L'utilisateur moyen d'ordinateur cligne des yeux 7 fois par minute, moins de la moitié du taux normal de 20.",
                "Plus de 80% des e-mails envoyés quotidiennement sont des spams.",
                "Le premier disque dur de 1 Go a été annoncé en 1980 et pesait environ 250 kg.",
                "Le nom original de Windows était Interface Manager.",
                "La première souris d'ordinateur était en bois.",
                "Le premier nom de domaine jamais enregistré était Symbolics.com le 15 mars 1985.",
                "Environ 70% des créateurs de virus travailleraient sous contrat pour des syndicats du crime organisé.",
                "Le clavier AZERTY a été conçu pour ralentir la vitesse de frappe.",
                "La première programmeuse informatique était Ada Lovelace, une femme."
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
                border: none;
                cursor: pointer;
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
            .logout-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            .logout-modal {
                background-color: white;
                padding: 2rem;
                border-radius: 10px;
                text-align: center;
                max-width: 90%;
                width: 400px;
            }
            .logout-modal .icon {
                color: #e74c3c;
            }
            .logout-modal h2 {
                margin-bottom: 1rem;
            }
            .logout-modal p {
                margin-bottom: 2rem;
            }
        `,

        init() {
            if (!this.isLoggedIn()) {
                this.redirectAfterDelay();
                return;
            }

            this.handleNavigation();
            window.addEventListener('popstate', () => this.handleNavigation());
            document.addEventListener('click', (e) => this.interceptClicks(e));
            this.setLanguage(this.getLanguageFromCookie() || this.getBrowserLanguage() || this.config.language);
            this.setupAutoLogout();
            this.injectStyles();
            this.log('Access Control initialized');
        },

        isLoggedIn() {
            return this.getCookie(this.config.loginCookieName) === 'true';
        },

        redirectAfterDelay() {
            setTimeout(() => {
                window.location.href = this.config.redirectUrl;
            }, this.config.redirectDelay);
        },

        setupAutoLogout() {
            let logoutTimer;
            const resetLogoutTimer = () => {
                clearTimeout(logoutTimer);
                logoutTimer = setTimeout(() => {
                    this.logout(true);
                }, this.config.autoLogoutTime);
            };

            ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {
                document.addEventListener(eventType, resetLogoutTimer, { passive: true });
            });

            resetLogoutTimer();
        },

        logout(showModal = false) {
            this.setCookie(this.config.loginCookieName, 'false', 0);
            if (showModal) {
                this.showLogoutModal();
            } else {
                this.redirectAfterDelay();
            }
        },

        showLogoutModal() {
            const overlay = document.createElement('div');
            overlay.className = 'logout-overlay';
            
            const modal = document.createElement('div');
            modal.className = 'logout-modal';
            
            const content = this.getContent('logout');
            
            modal.innerHTML = `
                <div class="icon"><i class="${content.icon}" aria-hidden="true"></i></div>
                <h2>${this.escapeHTML(content.title)}</h2>
                <p>${this.escapeHTML(content.message)}</p>
                <button class="btn login-btn">${this.escapeHTML(content.loginButton)}</button>
            `;
            
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            
            const loginBtn = modal.querySelector('.login-btn');
            loginBtn.addEventListener('click', () => {
                window.location.href = this.config.redirectUrl;
            });
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
            const container = document.querySelector('.container') || document.createElement('div');
            container.className = 'container';

            const pageType = Object.keys(this.config.pages).find(key => this.config.pages[key] === page);
            const content = this.getContent(pageType);
            const emoji = this.getRandomEmoji();
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
                    <button class="btn logout-btn">${this.translate('Logout')}</button>
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

            if (!document.body.contains(container)) {
                document.body.appendChild(container);
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
            const logoutBtn = document.querySelector('.logout-btn');

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

            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.logout(false));
            }
        },

        startCountdown() {
            const countdownElement = document.querySelector('.countdown');
            if (!countdownElement) return;

            const endTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 hours from now

            const updateCountdown = () => {
                const now = new Date().getTime();
                const timeLeft = endTime - now;

                if (timeLeft < 0) {
                    countdownElement.textContent = this.translate('Maintenance complete! Refreshing...');
                    setTimeout(() => window.location.reload(), 3000);
                    return;
                }

                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                countdownElement.textContent = `${this.translate('Estimated time remaining')}: ${hours}h ${minutes}m ${seconds}s`;

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

        getRandomEmoji() {
            const emojis = ['🚧', '🔒', '🛠️', '🔐', '🚨', '⚠️'];
            return emojis[Math.floor(Math.random() * emojis.length)];
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
            return this.getCookie(this.config.cookieName);
        },

        getBrowserLanguage() {
            const lang = navigator.language || navigator.userLanguage;
            return lang.split('-')[0];
        },

        setCookie(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
        },

        getCookie(name) {
            const cookieArray = document.cookie.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                let cookie = cookieArray[i].trim();
                if (cookie.startsWith(name + '=')) {
                    return cookie.substring(name.length + 1);
                }
            }
            return null;
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
                    'Maintenance complete! Refreshing...': 'Maintenance complete! Refreshing...',
                    'Logout': 'Logout'
                },
                es: {
                    'Return to Homepage': 'Volver a la Página Principal',
                    'Let\'s Go!': '¡Vamos!',
                    'Fun Fact': 'Dato Curioso',
                    'Oops!': '¡Ups!',
                    'is a VIP area.': 'es un área VIP.',
                    'Estimated time remaining': 'Tiempo estimado restante',
                    'Maintenance complete! Refreshing...': '¡Mantenimiento completo! Actualizando...',
                    'Logout': 'Cerrar sesión'
                },
                fr: {
                    'Return to Homepage': 'Retour à la Page d\'Accueil',
                    'Let\'s Go!': 'Allons-y !',
                    'Fun Fact': 'Anecdote',
                    'Oops!': 'Oups !',
                    'is a VIP area.': 'est une zone VIP.',
                    'Estimated time remaining': 'Temps estimé restant',
                    'Maintenance complete! Refreshing...': 'Maintenance terminée ! Actualisation...',
                    'Logout': 'Déconnexion'
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
