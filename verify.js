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
        this.type();
    }
}

class Verification {
    constructor(formId, inputId, buttonId, messageId, loadingId) {
        this.form = document.getElementById(formId);
        this.input = document.getElementById(inputId);
        this.button = document.getElementById(buttonId);
        this.message = document.getElementById(messageId);
        this.loadingIndicator = document.getElementById(loadingId);

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.input.addEventListener('input', this.clearMessage.bind(this));
        this.checkSession();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.clearMessage();
        this.showLoading();

        const password = this.input.value.trim().toLowerCase();
        if (password === '') {
            this.showMessage('Please enter a password.', 'error');
            this.hideLoading();
            return;
        }

        setTimeout(() => {
            if (password === 'loellen' || password === 'lep') {
                this.setSession();
                this.showMessage('Access granted! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = '/homepage';
                }, 1500);
            } else {
                this.showMessage('Invalid password. Please try again.', 'error');
            }
            this.hideLoading();
        }, 1000);
    }

    setSession() {
        const expirationTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        Cookies.set('accessGranted', 'true', { expires: expirationTime, sameSite: 'strict', secure: true });
    }

    checkSession() {
        if (Cookies.get('accessGranted') === 'true') {
            window.location.href = '/homepage';
        }
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
        this.button.disabled = true;
    }

    hideLoading() {
        this.loadingIndicator.style.display = 'none';
        this.button.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.getElementById('typing-text');
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

    new Verification(
        'verification-form',
        'password-input',
        'verify-button',
        'message',
        'loading-indicator'
    );
});
