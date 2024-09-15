class TypingEffect {
    constructor(element, words, options = {}) {
        this.element = element;
        this.words = words;
        this.wait = options.wait || 3000;
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.loop = options.loop !== undefined ? options.loop : true;

        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isWaiting = false;
    }

    type() {
        if (!this.element) return;

        const currentWord = this.words[this.wordIndex];
        const shouldDelete = this.isDeleting && this.charIndex > 0;
        const shouldChangeWord = this.isDeleting && this.charIndex === 0;
        const wordComplete = !this.isDeleting && this.charIndex === currentWord.length;

        this.element.textContent = currentWord.substring(0, this.charIndex);

        if (shouldDelete) {
            this.charIndex--;
        } else if (shouldChangeWord) {
            this.wordIndex = this.loop ? (this.wordIndex + 1) % this.words.length : Math.min(this.wordIndex + 1, this.words.length - 1);
            this.isDeleting = false;
            this.isWaiting = true;
            setTimeout(() => {
                this.isWaiting = false;
                this.type();
            }, 500);
            return;
        } else if (!wordComplete) {
            this.charIndex++;
        }

        if (wordComplete) {
            this.isWaiting = true;
            setTimeout(() => {
                this.isWaiting = false;
                this.isDeleting = true;
                this.type();
            }, this.wait);
            return;
        }

        if (!this.isWaiting) {
            setTimeout(() => this.type(), this.isDeleting ? this.deleteSpeed : this.typeSpeed);
        }
    }

    start() {
        if (this.words.length > 0) {
            this.type();
        }
    }
}

class AccessSystem {
    constructor() {
        this.verificationForm = document.getElementById('verification-form');
        this.verificationInput = document.getElementById('verification-input');
        this.authForm = document.getElementById('auth-form');
        this.usernameInput = document.getElementById('username-input');
        this.passwordInput = document.getElementById('password-input');
        this.message = document.getElementById('message');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.authContainer = document.getElementById('auth-container');
        this.verificationContainer = document.getElementById('verification-container');
        this.authTitle = document.getElementById('auth-title');
        this.authButton = document.getElementById('auth-button');
        this.authSwitch = document.getElementById('auth-switch');
        this.switchLink = document.getElementById('switch-link');

        this.cookieExpiration = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
        this.isLogin = this.getCookie('isLogin') === 'true';
        this.users = this.loadUsers();

        this.addEventListeners();
        this.checkSession();
        this.initializeParticles();
        this.initializeTypingEffect();
        this.updateAuthUIState();
    }

    addEventListeners() {
        if (this.verificationForm) {
            this.verificationForm.addEventListener('submit', this.handleVerification.bind(this));
        }
        if (this.authForm) {
            this.authForm.addEventListener('submit', this.handleAuth.bind(this));
        }
        if (this.switchLink) {
            this.switchLink.addEventListener('click', this.toggleAuthMode.bind(this));
        }
        ['usernameInput', 'passwordInput', 'verificationInput'].forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('focus', () => this.handleInputFocus(input));
                input.addEventListener('blur', () => this.handleInputBlur(input));
                input.addEventListener('input', () => this.validateInput(input));
            }
        });
    }

    handleInputFocus(input) {
        if (input && input.parentElement) {
            input.parentElement.classList.add('focused');
        }
    }

    handleInputBlur(input) {
        if (input && input.parentElement) {
            if (input.value === '') {
                input.parentElement.classList.remove('focused');
            }
        }
    }

    validateInput(input) {
        if (input && input.parentElement) {
            if (input.value.length > 0) {
                input.parentElement.classList.add('has-value');
            } else {
                input.parentElement.classList.remove('has-value');
            }
        }
    }

    loadUsers() {
        const usersCookie = this.getCookie('users');
        if (usersCookie) {
            try {
                return JSON.parse(atob(usersCookie));
            } catch (error) {
                console.error('Error loading users:', error);
                return {};
            }
        }
        return {};
    }

    saveUsers() {
        try {
            const usersString = btoa(JSON.stringify(this.users));
            this.setCookie('users', usersString, this.cookieExpiration);
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    handleVerification(event) {
        event.preventDefault();
        this.clearMessage();
        this.showLoading();

        const password = this.verificationInput.value.trim().toLowerCase();
        if (password === '') {
            this.showMessage('Please enter a password.', 'error');
            this.hideLoading();
            return;
        }

        setTimeout(() => {
            if (password === 'loellen' || password === 'lep') {
                this.showMessage('Access granted!', 'success');
                setTimeout(() => {
                    if (this.verificationContainer && this.authContainer) {
                        this.verificationContainer.style.display = 'none';
                        this.authContainer.style.display = 'block';
                    }
                }, 1500);
            } else {
                this.showMessage('Invalid password. Please try again.', 'error');
            }
            this.hideLoading();
        }, 1000);
    }

    handleAuth(event) {
        event.preventDefault();
        this.clearMessage();
        this.showLoading();

        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();

        if (username === '' || password === '') {
            this.showMessage('Please enter both username and password.', 'error');
            this.hideLoading();
            return;
        }

        setTimeout(() => {
            if (this.isLogin) {
                this.handleLogin(username, password);
            } else {
                this.handleSignup(username, password);
            }
            this.hideLoading();
        }, 1000);
    }

    handleLogin(username, password) {
        if (this.users[username] && this.users[username].password === password) {
            this.setSession(username);
            this.setCookie('isLogin', 'true', this.cookieExpiration);
            this.showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/search';
            }, 1500);
        } else {
            this.showMessage('Invalid credentials. Please try again.', 'error');
        }
    }

    handleSignup(username, password) {
        if (this.users[username]) {
            this.showMessage('Username already exists. Please choose another.', 'error');
        } else {
            this.users[username] = { password: password };
            this.saveUsers();
            this.setSession(username);
            this.setCookie('isLogin', 'true', this.cookieExpiration);
            this.showMessage('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/search';
            }, 1500);
        }
    }

    toggleAuthMode(event) {
        event.preventDefault();
        this.isLogin = !this.isLogin;
        this.updateAuthUIState();
        this.clearMessage();
        this.resetForm();
    }

    updateAuthUIState() {
        if (this.authTitle) this.authTitle.textContent = this.isLogin ? 'Log In' : 'Sign Up';
        if (this.authButton) this.authButton.textContent = this.isLogin ? 'Log In' : 'Sign Up';
        if (this.switchLink) this.switchLink.textContent = this.isLogin ? 'Sign Up' : 'Log In';
        if (this.authSwitch) this.authSwitch.firstChild.textContent = this.isLogin ? "Don't have an account? " : 'Already have an account? ';
    }

    resetForm() {
        if (this.authForm) {
            this.authForm.reset();
            const inputs = this.authForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.parentElement.classList.remove('focused', 'has-value');
            });
        }
    }

    setSession(username) {
        this.setCookie('accessGranted', 'true', this.cookieExpiration);
        this.setCookie('username', username, this.cookieExpiration);
    }

    checkSession() {
        const accessGranted = this.getCookie('accessGranted');
        const username = this.getCookie('username');
        const isLogin = this.getCookie('isLogin');

        if (accessGranted === 'true' && username && isLogin === 'true') {
            if (this.users[username]) {
                window.location.href = '/search';
            } else {
                this.clearSession();
            }
        }
    }

    clearSession() {
        this.setCookie('accessGranted', '', -1);
        this.setCookie('username', '', -1);
        this.setCookie('isLogin', '', -1);
        this.setCookie('users', '', -1);
    }

    setCookie(name, value, expirationMs) {
        const d = new Date();
        d.setTime(d.getTime() + expirationMs);
        const expires = `expires=${d.toUTCString()}`;
        document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Strict;Secure`;
    }

    getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
            if (cookieName === name) return decodeURIComponent(cookieValue);
        }
        return null;
    }

    showMessage(text, type) {
        if (this.message) {
            this.message.textContent = text;
            this.message.className = `message ${type}`;
            this.message.style.display = 'block';
        }
    }

    clearMessage() {
        if (this.message) {
            this.message.textContent = '';
            this.message.className = 'message';
            this.message.style.display = 'none';
        }
    }

    showLoading() {
        if (this.loadingIndicator) this.loadingIndicator.style.display = 'flex';
        if (this.verificationForm) {
            const button = this.verificationForm.querySelector('button');
            if (button) button.disabled = true;
        }
        if (this.authForm) {
            const button = this.authForm.querySelector('button');
            if (button) button.disabled = true;
        }
    }

    hideLoading() {
        if (this.loadingIndicator) this.loadingIndicator.style.display = 'none';
        if (this.verificationForm) {
            const button = this.verificationForm.querySelector('button');
            if (button) button.disabled = false;
        }
        if (this.authForm) {
            const button = this.authForm.querySelector('button');
            if (button) button.disabled = false;
        }
    }

    initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#4285F4" },
                    shape: { type: "circle" },
                    opacity: { value: 0.5, random: false },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: "#4285F4", opacity: 0.4, width: 1 },
                    move: {
                        enable: true,
                        speed: 6,
                        direction: "none",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: { enable: false, rotateX: 600, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: true,
                            mode: "grab"
                        },
                        onclick: {
                            enable: true,
                            mode: "push"
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            });
        } else {
            console.warn('particlesJS is not defined. Make sure to include the particles.js library.');
        }
    }

    initializeTypingEffect() {
        const typingElement = document.getElementById('typing-text');
        if (typingElement) {
            const words = [
                'fun', 'easy', 'interactive', 'effective', 'modern',
                'engaging', 'intuitive', 'practical', 'innovative', 'efficient',
                'exciting', 'adaptable', 'rewarding', 'immersive', 'dynamic',
                'amusant', 'facile', 'rapide', 'créatif', 'naturel'
            ];
            
            const typingEffect = new TypingEffect(typingElement, words, {
                wait: 2000,
                typeSpeed: 100,
                deleteSpeed: 50,
                loop: true
            });
            
            typingEffect.start();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AccessSystem();
});
