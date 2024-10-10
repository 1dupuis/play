
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

class EnhancedAccessSystem {
    constructor() {
        this.initializeFirebase();
        this.auth = getAuth();
        this.db = getDatabase();
        this.googleProvider = new GoogleAuthProvider();

        this.authForm = document.getElementById('auth-form');
        this.emailInput = document.getElementById('email-input');
        this.passwordInput = document.getElementById('password-input');
        this.message = document.getElementById('message');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.authContainer = document.getElementById('auth-container');
        this.authTitle = document.getElementById('auth-title');
        this.authButton = document.getElementById('auth-button');
        this.authSwitch = document.getElementById('auth-switch');
        this.switchLink = document.getElementById('switch-link');
        this.googleSignInButton = document.getElementById('google-sign-in');
        this.forgotPasswordLink = document.getElementById('forgot-password-link');

        this.isLogin = true;

        this.addEventListeners();
        this.initializeParticles();
        this.initializeTypingEffect();
        this.updateAuthUIState();

        this.checkPersistentLogin();
    }

    initializeFirebase() {
        const firebaseConfig = {
            apiKey: "AIzaSyAToB2gXmzCK4t-1dW5urnGG87gbK6MxR8",
            authDomain: "dupuis-lol.firebaseapp.com",
            databaseURL: "https://dupuis-lol-default-rtdb.firebaseio.com",
            projectId: "dupuis-lol",
            storageBucket: "dupuis-lol.appspot.com",
            messagingSenderId: "807402660080",
            appId: "1:807402660080:web:545d4e1287f5803ebda235",
            measurementId: "G-TR8JMF5FRY"
        };
        initializeApp(firebaseConfig);
    }

    addEventListeners() {
        this.authForm.addEventListener('submit', this.handleAuth.bind(this));
        this.switchLink.addEventListener('click', this.toggleAuthMode.bind(this));
        this.googleSignInButton.addEventListener('click', this.handleGoogleSignIn.bind(this));
        this.forgotPasswordLink.addEventListener('click', this.handleForgotPassword.bind(this));
        
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', () => this.handleInputFocus(input));
            input.addEventListener('blur', () => this.handleInputBlur(input));
            input.addEventListener('input', () => this.validateInput(input));
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

    handleAuth(event) {
        event.preventDefault();
        this.clearMessage();
        this.showLoading();

        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value.trim();

        if (email === '' || password === '') {
            this.showMessage('Please enter both email and password.', 'error');
            this.hideLoading();
            return;
        }

        if (this.isLogin) {
            this.handleLogin(email, password);
        } else {
            this.handleSignup(email, password);
        }
    }

    async handleLogin(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();
            this.setPersistentLogin(token);
            this.showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/search';
            }, 1500);
        } catch (error) {
            this.showMessage('Invalid credentials. Please try again.', 'error');
            console.error(error);
        } finally {
            this.hideLoading();
        }
    }

    setPersistentLogin(token) {
        const now = new Date();
        const expirationDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
        const loginData = {
            token: token,
            expiration: expirationDate.toISOString()
        };
        localStorage.setItem('persistentLogin', JSON.stringify(loginData));
    }

    checkPersistentLogin() {
        const persistentLogin = localStorage.getItem('persistentLogin');
        if (persistentLogin) {
            const loginData = JSON.parse(persistentLogin);
            const now = new Date();
            const expirationDate = new Date(loginData.expiration);
            
            if (now < expirationDate) {
                // Token is still valid, use it to authenticate
                this.auth.signInWithCustomToken(loginData.token)
                    .then(() => {
                        window.location.href = '/search';
                    })
                    .catch((error) => {
                        console.error('Error with persistent login:', error);
                        localStorage.removeItem('persistentLogin');
                    });
            } else {
                // Token has expired, remove it
                localStorage.removeItem('persistentLogin');
            }
        }
    }

    async handleSignup(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            await set(ref(this.db, 'users/' + userCredential.user.uid), {
                email: email,
                createdAt: new Date().toISOString()
            });
            this.showMessage('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/search';
            }, 1500);
        } catch (error) {
            this.showMessage('Error creating account. Please try again.', 'error');
            console.error(error);
        } finally {
            this.hideLoading();
        }
    }

    async handleGoogleSignIn() {
        try {
            const result = await signInWithPopup(this.auth, this.googleProvider);
            const user = result.user;
            await set(ref(this.db, 'users/' + user.uid), {
                email: user.email,
                createdAt: new Date().toISOString()
            });
            this.showMessage('Google Sign-in successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/search';
            }, 1500);
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            if (error.code === 'auth/operation-not-allowed') {
                this.showMessage('Google Sign-In is not enabled. Please contact the administrator.', 'error');
                console.error('Google Sign-In is not enabled in Firebase console.');
            } else {
                this.showMessage('Google Sign-in failed. Please try again or use another method.', 'error');
            }
        }
    }

    async handleForgotPassword() {
        const email = prompt("Please enter your email address:");
        if (email) {
            try {
                await sendPasswordResetEmail(this.auth, email);
                this.showMessage('Password reset email sent. Please check your inbox.', 'success');
            } catch (error) {
                this.showMessage('Error sending password reset email. Please try again.', 'error');
                console.error(error);
            }
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
        this.authTitle.textContent = this.isLogin ? 'Log In' : 'Sign Up';
        this.authButton.textContent = this.isLogin ? 'Log In' : 'Sign Up';
        this.switchLink.textContent = this.isLogin ? 'Sign Up' : 'Log In';
        this.authSwitch.firstChild.textContent = this.isLogin ? "Don't have an account? " : 'Already have an account? ';
        this.forgotPasswordLink.style.display = this.isLogin ? 'inline' : 'none';
    }

    resetForm() {
        this.authForm.reset();
        const inputs = this.authForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.parentElement.classList.remove('focused', 'has-value');
        });
    }

    showMessage(text, type) {
        this.message.textContent = text;
        this.message.className = `message ${type}`;
        this.message.style.display = 'block';
    }

    clearMessage() {
        this.message.textContent = '';
        this.message.className = 'message';
        this.message.style.display = 'none';
    }

    showLoading() {
        this.loadingIndicator.style.display = 'flex';
        this.authButton.disabled = true;
    }

    hideLoading() {
        this.loadingIndicator.style.display = 'none';
        this.authButton.disabled = false;
    }

    initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#4285F4" },
                    shape: { type: "circle" },
                    opacity: { value: 0.1, random: false},
                    size: { value: 5, random: true },
                    line_linked: { enable: true, distance: 150, color: "#10a37f", opacity: 0.4, width: 1 },
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
                'exciting', 'adaptable', 'rewarding', 'immersive', 'dynamic'
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
    new EnhancedAccessSystem();
});
