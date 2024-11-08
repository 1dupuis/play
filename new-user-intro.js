import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

class NewUserIntro {

    constructor() {
        this.config = {
            totalSteps: 4,
            animationDuration: 300,
            storageKey: 'hasCompletedIntro',
            minTimePerStep: 1000, // Minimum time in ms before allowing next step
        };

        this.state = {
            currentStep: 1,
            startTime: null,
            user: null,
            hasInteracted: false
        };

        this.modal = null;
        this.auth = null;
        this.db = null;
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
        this.auth = getAuth();
        this.db = getDatabase();
    }

    init() {
        // Initialize Firebase
        this.initializeFirebase();
        
        // Bind auth state listener
        this.auth.onAuthStateChanged(this.handleAuthStateChange.bind(this));
        
        // Create and inject CSS
        this.injectStyles();
    }

    // Handle authentication state changes
    async handleAuthStateChange(user) {
        if (!user) return;
        
        this.state.user = user;
        const isNewUser = await this.checkIfNewUser(user.uid);
        
        if (isNewUser) {
            setTimeout(() => this.startIntroExperience(), 1000);
            this.logAnalytics('intro_started', { userId: user.uid });
        }
    }

    // Check if user is new
    async checkIfNewUser(userId) {
        try {
            const userRef = ref(this.db, `users/${userId}/${this.config.storageKey}`);
            const snapshot = await get(userRef);
            if (!snapshot.exists()) {
                // If the user doesn't have the 'hasCompletedIntro' field, set it to false
                await set(userRef, false);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking user status:', error);
            return false;
        }
    }

    async startIntroExperience() {
        this.modal = this.createModal();
        document.body.appendChild(this.modal);
        
        requestAnimationFrame(() => {
            this.modal.classList.add('visible');
            this.state.startTime = Date.now();
        });

        this.setupOfflineSupport();
    }

    // Create the modal HTML structure
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'intro-modal';
        modal.innerHTML = `
            <div class="intro-modal-content">
                <div class="intro-header">
                    <img src="dupuis-lol-web-icon.png" alt="dupuis.lol logo" class="intro-logo">
                    <h2>Welcome to dupuis.lol! 🎉</h2>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="step-indicator">Step <span class="current-step">1</span> of ${this.config.totalSteps}</div>
                    </div>
                </div>
                
                <div class="intro-body">
                    <div class="intro-step active" data-step="1">
                        <div class="step-icon">🎨</div>
                        <h3>Learn French</h3>
                        <p>Welcome to your personalized French learning journey! We'll help you master French through interactive lessons, games, and real conversations.</p>
                    </div>

                    <div class="intro-step" data-step="2">
                        <div class="step-icon">🎮</div>
                        <h3>Interactive Games & Activities</h3>
                        <p>Learn through play with our collection of French learning games, quizzes, and interactive exercises designed to make learning fun and effective.</p>
                        <div class="games-preview">
                            <div class="game-card">Motle</div>
                            <div class="game-card">Ascend</div>
                            <div class="game-card">Trivia</div>
                        </div>
                    </div>

                    <div class="intro-step" data-step="3">
                        <div class="step-icon">📈</div>
                        <h3>Track Your Progress</h3>
                        <p>Watch your French skills grow with detailed progress tracking, achievements, and personalized learning recommendations.</p>
                    </div>

                    <div class="intro-step" data-step="4">
                        <div class="step-icon">👥</div>
                        <h3>Join Our Community</h3>
                        <p>Connect with fellow learners, practice, and access resources to accelerate your learning.</p>
                        <div class="community-features">
                            <span class="feature-tag">Events</span>
                            <span class="feature-tag">Cafe</span>
                        </div>
                    </div>
                </div>

                <div class="intro-footer">
                    <button class="intro-btn skip-btn" data-action="skip">Skip Tour</button>
                    <div class="button-group">
                        <button class="intro-btn back-btn" data-action="back" disabled>Back</button>
                        <button class="intro-btn next-btn primary" data-action="next">Next</button>
                    </div>
                </div>
            </div>
        `;

        // Set up event listeners
        this.setupEventListeners(modal);
        
        return modal;
    }

    // Set up event listeners
    setupEventListeners(modal) {
        const buttons = modal.querySelectorAll('.intro-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (this.canProceed()) {
                    this.handleAction(action);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (!this.modal) return;
            
            if (e.key === 'Escape') {
                this.handleAction('skip');
            } else if (e.key === 'ArrowRight' && this.canProceed()) {
                this.handleAction('next');
            } else if (e.key === 'ArrowLeft' && this.canProceed()) {
                this.handleAction('back');
            }
        });
    }

    // Handle button actions
    handleAction(action) {
        switch (action) {
            case 'next':
                if (this.state.currentStep < this.config.totalSteps) {
                    this.goToStep(this.state.currentStep + 1);
                } else {
                    this.completeIntro();
                }
                break;
            case 'back':
                if (this.state.currentStep > 1) {
                    this.goToStep(this.state.currentStep - 1);
                }
                break;
            case 'skip':
                this.confirmSkip();
                break;
        }
    }

    canProceed() {
        return Date.now() - this.state.startTime >= this.config.minTimePerStep;
    }

    goToStep(step) {
        this.state.currentStep = step;
        this.state.hasInteracted = true;
        
        const steps = this.modal.querySelectorAll('.intro-step');
        steps.forEach(s => s.classList.remove('active'));
        
        const currentStep = this.modal.querySelector(`[data-step="${step}"]`);
        currentStep.classList.add('active');
        
        this.updateProgress();
        this.updateButtons();
        this.logAnalytics('step_viewed', { step });
    }

    // Update progress bar and indicators
    updateProgress() {
        const progress = (this.state.currentStep / this.config.totalSteps) * 100;
        const progressFill = this.modal.querySelector('.progress-fill');
        const stepIndicator = this.modal.querySelector('.current-step');
        
        progressFill.style.width = `${progress}%`;
        stepIndicator.textContent = this.state.currentStep;
    }

    updateButtons() {
        const backBtn = this.modal.querySelector('.back-btn');
        const nextBtn = this.modal.querySelector('.next-btn');
        
        backBtn.disabled = this.state.currentStep === 1;
        nextBtn.textContent = this.state.currentStep === this.config.totalSteps ? 'Get Started!' : 'Next';
    }

    confirmSkip() {
        if (this.state.hasInteracted) {
            this.completeIntro();
        } else {
            const confirmed = confirm('Are you sure you want to skip the introduction? You can always access it later from your profile settings.');
            if (confirmed) {
                this.completeIntro();
            }
        }
    }

    // Complete the introduction
    async completeIntro() {
        try {
            const userRef = ref(this.db, `users/${this.state.user.uid}`);
            await set(ref(this.db, `${userRef}/${this.config.storageKey}`), true);
            await set(ref(this.db, `${userRef}/introCompletedAt`), new Date().toISOString());
            
            this.logAnalytics('intro_completed', {
                stepsViewed: this.state.currentStep,
                timeSpent: Date.now() - this.state.startTime
            });

            this.modal.classList.remove('visible');
            setTimeout(() => {
                this.modal.remove();
                this.modal = null;
            }, this.config.animationDuration);

        } catch (error) {
            console.error('Error completing intro:', error);
            location.reload(true);
        }
    }

    setupOfflineSupport() {
        window.addEventListener('online', () => {
            if (this.pendingCompletion) {
                this.completeIntro();
            }
        });
    }

    async logAnalytics(event, data = {}) {
        try {
            const analyticsRef = ref(this.db, 'analytics/intro-experience');
            await set(ref(this.db, `${analyticsRef}/${new Date().getTime()}`), {
                event,
                data,
                timestamp: new Date().toISOString(),
                userId: this.state.user.uid
            });
        } catch (error) {
            console.error('Error logging analytics:', error);
        }
    }

    // Inject required styles
    injectStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .intro-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(5px);
            }

            .intro-modal.visible {
                opacity: 1;
            }

            .intro-modal-content {
                background: white;
                padding: 2.5rem;
                border-radius: 20px;
                max-width: 600px;
                width: 90%;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                transform: translateY(20px);
                transition: transform 0.3s ease;
                overflow: hidden;
            }

            .intro-modal.visible .intro-modal-content {
                transform: translateY(0);
            }

            .intro-logo {
                width: 120px;
                height: auto;
                margin-bottom: 1rem;
            }

            .intro-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .intro-header h2 {
                font-size: 1.8rem;
                color: #2D3748;
                margin: 0.5rem 0;
            }

            .progress-container {
                margin-top: 1.5rem;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: #E2E8F0;
                border-radius: 3px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: #4F46E5;
                transition: width 0.3s ease;
                border-radius: 3px;
            }

            .step-indicator {
                font-size: 0.9rem;
                color: #718096;
                margin-top: 0.5rem;
            }

            .intro-step {
                display: none;
                animation: fadeIn 0.3s ease;
            }

            .intro-step.active {
                display: block;
            }

            .step-icon {
                font-size: 2.5rem;
                text-align: center;
                margin-bottom: 1rem;
            }

            .intro-step h3 {
                font-size: 1.4rem;
                color: #2D3748;
                margin-bottom: 1rem;
                text-align: center;
            }

            .intro-step p {
                color: #4A5568;
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }

            .feature-preview {
                border-radius: 12px;
                overflow: hidden;
                margin: 1.5rem 0;
            }

            .feature-preview img {
                width: 100%;
                height: auto;
                display: block;
            }

            .games-preview {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin: 1.5rem 0;
            }

            .game-card {
                background: #F7FAFC;
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
                font-size: 0.9rem;
                color: #4A5568;
            }

            .progress-preview {
                background: #F7FAFC;
                border-radius: 12px;
                height: 200px;
                margin: 1.5rem 0;
            }

            .community-features {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin: 1.5rem 0;
                justify-content: center;
            }

            .feature-tag {
                background: #EBF4FF;
                color: #4F46E5;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.9rem;
            }

            .intro-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 2rem;
            }

            .button-group {
                display: flex;
                gap: 1rem;
            }

            .intro-btn {
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.2s ease;
                outline: none;
            }

            .intro-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .intro-btn.primary {
                background: #4F46E5;
                color: white;
            }

            .intro-btn.primary:hover {
                background: #4338CA;
                transform: translateY(-1px);
            }

            .intro-btn.primary:active {
                transform: translateY(0);
            }

            .skip-btn {
                background: transparent;
                color: #718096;
            }

            .skip-btn:hover {
                color: #4A5568;
            }

            .back-btn {
                background: #EDF2F7;
                color: #4A5568;
            }

            .back-btn:hover:not(:disabled) {
                background: #E2E8F0;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 640px) {
                .intro-modal-content {
                    padding: 1.5rem;
                }

                .intro-header h2 {
                    font-size: 1.5rem;
                }

                .games-preview {
                    grid-template-columns: 1fr;
                }

                .intro-btn {
                    padding: 0.5rem 1rem;
                    font-size: 0.9rem;
                }

                .button-group {
                    gap: 0.5rem;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Create and export instance
const newUserIntro = new NewUserIntro();

// Initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => newUserIntro.init());
} else {
    newUserIntro.init();
}

export default newUserIntro;
