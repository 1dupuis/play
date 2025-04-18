// Firebase Configuration
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

const TriviaGame = (function() {
    // Private variables with default values
  
    let firebaseApp;
    let database;
    let auth;
  
    let currentQuestionIndex = 0;
    let score = 0;
    let triviaQuestions = [];
    let gameLanguage = 'en';
    let gameDifficulty = 'medium';
    let gameCategory = '9';
    let timeLeft = 0;
    let timer;
    let streak = 0;
    let highestStreak = 0;
    let isLoading = false;
    
    const TIMER_DURATION = 20;
    const MAX_LEADERBOARD_ENTRIES = 10;
    const STREAK_BONUS = 5;
    const TIME_BONUS_THRESHOLD = 10;
    const TIME_BONUS_POINTS = 2;

    // DOM elements cache
    const elements = {};

    // Keyboard shortcuts configuration
    const keyboardShortcuts = {
        '1': 0,
        '2': 1,
        '3': 2,
        '4': 3,
        'n': 'nextQuestion',
        'Enter': 'nextQuestion'
    };

    function initFirebase() {
        try {
            // Initialize Firebase
            firebaseApp = initializeApp(firebaseConfig);
            database = getDatabase(firebaseApp);
            auth = getAuth(firebaseApp);
        } catch (error) {
            console.error('Firebase initialization error:', error);
            showModal(
                'Firebase Error', 
                'Could not connect to Firebase. Leaderboard may not work.',
                'OK',
                closeModal
            );
        }
    }

    // Localization strings
    const localizations = {
        fr: {
            startGame: 'Commencer le Trivia',
            nextQuestion: 'Question Suivante',
            timeLeft: 'Temps restant',
            score: 'Score',
            correct: 'Correct !',
            incorrect: 'Incorrect. La bonne réponse est',
            gameOver: 'Fin du jeu',
            finalScore: 'Votre score final est',
            playAgain: 'Rejouer',
            close: 'Fermer',
            enterName: 'Entrez votre nom pour le classement:',
            errorFetchingQuestions: 'Erreur lors de la récupération des questions. Veuillez réessayer.',
            retry: 'Réessayer',
            streak: 'Série de',
            timeBonus: 'Bonus de temps',
            streakBonus: 'Bonus de série',
            pressKey: 'Appuyez sur {key} pour',
            loading: 'Chargement...',
            currentStreak: 'Série actuelle',
            highestStreak: 'Meilleure série',
            bonusPoints: 'Points bonus',
            timeRemaining: 'Temps restant'
        },
        en: {
            startGame: 'Start Trivia',
            nextQuestion: 'Next Question',
            timeLeft: 'Time left',
            score: 'Score',
            correct: 'Correct!',
            incorrect: 'Incorrect. The correct answer is',
            gameOver: 'Game Over',
            finalScore: 'Your final score is',
            playAgain: 'Play Again',
            close: 'Close',
            enterName: 'Enter your name for the leaderboard:',
            errorFetchingQuestions: 'Error fetching questions. Please try again.',
            retry: 'Retry',
            streak: 'Streak of',
            timeBonus: 'Time Bonus',
            streakBonus: 'Streak Bonus',
            pressKey: 'Press {key} for',
            loading: 'Loading...',
            currentStreak: 'Current Streak',
            highestStreak: 'Highest Streak',
            bonusPoints: 'Bonus Points',
            timeRemaining: 'Time Remaining'
        }
    };

    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async function fetchWithRetry(url, maxRetries = 3) {
        let lastError;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            } catch (error) {
                lastError = error;
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
        throw lastError;
    }

    function showLoadingState(loading) {
        isLoading = loading;
        if (elements.startGame) {
            elements.startGame.disabled = loading;
            elements.startGame.innerHTML = loading ? 
                `<i class="fas fa-spinner fa-spin"></i> ${getLocalizedString('loading')}` : 
                getLocalizedString('startGame');
        }
    }

    async function fetchTriviaQuestions() {
        showLoadingState(true);
        try {
            const apiUrl = gameLanguage === 'fr'
                ? 'https://quizzapi.jomoreschi.fr/api/v1/quiz?limit=10'
                : `https://opentdb.com/api.php?amount=10&category=${gameCategory}&difficulty=${gameDifficulty}&type=multiple`;

            const data = await fetchWithRetry(apiUrl);
            
            if (gameLanguage === 'fr') {
                if (!Array.isArray(data.quizzes) || data.quizzes.length === 0) {
                    throw new Error('No questions received from French API');
                }
                triviaQuestions = processFrenchQuestions(data.quizzes);
            } else {
                if (data.response_code !== 0 || !Array.isArray(data.results)) {
                    throw new Error('Failed to fetch questions from English API');
                }
                triviaQuestions = processEnglishQuestions(data.results);
            }

            startGame();
        } catch (error) {
            console.error('Error fetching trivia questions:', error);
            showModal(
                getLocalizedString('errorFetchingQuestions'),
                error.message,
                getLocalizedString('retry'),
                fetchTriviaQuestions
            );
        } finally {
            showLoadingState(false);
        }
    }

    function processFrenchQuestions(questions) {
        return questions.map(item => ({
            question: decodeHTML(item.question),
            answers: shuffleArray([item.answer, ...item.badAnswers]),
            correctAnswer: item.answer
        }));
    }

    function processEnglishQuestions(questions) {
        return questions.map(question => ({
            question: decodeHTML(question.question),
            answers: shuffleArray([...question.incorrect_answers, question.correct_answer]),
            correctAnswer: question.correct_answer
        }));
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function startGame() {
        currentQuestionIndex = 0;
        score = 0;
        streak = 0;
        highestStreak = 0;
        updateScore();
        loadQuestion();
        showSection('trivia-center');
        setupKeyboardShortcuts();
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', handleKeyPress);
    }

    function handleKeyPress(event) {
        if (isLoading) return;
        
        const key = event.key.toLowerCase();
        if (keyboardShortcuts.hasOwnProperty(key)) {
            event.preventDefault();
            const action = keyboardShortcuts[key];
            
            if (typeof action === 'number') {
                const buttons = elements.answers?.getElementsByTagName('button');
                if (buttons && buttons[action] && !buttons[action].disabled) {
                    buttons[action].click();
                }
            } else if (action === 'nextQuestion' && !elements.nextQuestion?.classList.contains('hidden')) {
                elements.nextQuestion.click();
            }
        }
    }

    function loadQuestion() {
        if (currentQuestionIndex >= triviaQuestions.length) {
            endGame();
            return;
        }
    
        const question = triviaQuestions[currentQuestionIndex];
        
        if (elements.question) {
            elements.question.innerHTML = decodeHTML(question.question);
        }
    
        if (elements.answers) {
            elements.answers.innerHTML = '';
            question.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${decodeHTML(answer)}`;
                button.addEventListener('click', () => checkAnswer(answer));
                button.setAttribute('data-key', index + 1);
                elements.answers.appendChild(button);
            });
        }
    
        elements.nextQuestion?.classList.add('hidden');
        if (elements.feedback) {
            elements.feedback.textContent = '';
            elements.feedback.className = 'feedback';
        }
    
        updateProgress();
        startTimer();
    }

    function checkAnswer(selectedAnswer) {
        if (isLoading) return;
        
        clearInterval(timer);
        const question = triviaQuestions[currentQuestionIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;
        const buttons = elements.answers.getElementsByTagName('button');
    
        Array.from(buttons).forEach(button => {
            button.disabled = true;
            if (button.textContent.slice(3) === question.correctAnswer) {
                button.classList.add('correct');
            } else if (button.textContent.slice(3) === selectedAnswer) {
                button.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
        });
    
        let bonusPoints = 0;
        let feedbackMessage = '';
    
        if (isCorrect) {
            streak++;
            highestStreak = Math.max(highestStreak, streak);
            score++;
    
            // Time bonus
            if (timeLeft > TIME_BONUS_THRESHOLD) {
                bonusPoints += TIME_BONUS_POINTS;
                feedbackMessage += `${getLocalizedString('timeBonus')}: +${TIME_BONUS_POINTS}\n`;
            }
    
            // Streak bonus
            if (streak >= 3) {
                bonusPoints += STREAK_BONUS;
                feedbackMessage += `${getLocalizedString('streakBonus')}: +${STREAK_BONUS}\n`;
            }
    
            score += bonusPoints;
            feedbackMessage = `${getLocalizedString('correct')}\n${feedbackMessage}
                             ${getLocalizedString('currentStreak')}: ${streak}`;
            elements.feedback.className = 'feedback correct';
        } else {
            streak = 0;
            feedbackMessage = `${getLocalizedString('incorrect')}: ${decodeHTML(question.correctAnswer)}`;
            elements.feedback.className = 'feedback incorrect';
        }
    
        elements.feedback.innerHTML = feedbackMessage;
        updateScore();
    
        // Show appropriate button based on question number
        if (elements.nextQuestion) {
            elements.nextQuestion.classList.remove('hidden');
            // Change button text on last question
            if (currentQuestionIndex === triviaQuestions.length - 1) {
                elements.nextQuestion.textContent = getLocalizedString('finalScore');
            } else {
                elements.nextQuestion.textContent = getLocalizedString('nextQuestion');
            }
        }
    }

    function updateScore() {
        if (elements.currentScore) {
            elements.currentScore.innerHTML = `${score} <small>(${getLocalizedString('highestStreak')}: ${highestStreak})</small>`;
        }
    }

    function updateProgress() {
        const progressPercentage = ((currentQuestionIndex + 1) / triviaQuestions.length) * 100;
        if (elements.progress) {
            elements.progress.style.width = `${progressPercentage}%`;
        }
        if (elements.questionNumber) {
            elements.questionNumber.textContent = `Question ${currentQuestionIndex + 1}/${triviaQuestions.length}`;
        }
    }

    function startTimer() {
        clearInterval(timer);
        timeLeft = TIMER_DURATION;
        updateTimerDisplay();
        
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                checkAnswer(null);
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        if (elements.timeLeft) {
            const timerClass = timeLeft > TIME_BONUS_THRESHOLD ? 'timer-bonus' : '';
            elements.timeLeft.className = timerClass;
            elements.timeLeft.textContent = `${timeLeft}s${timeLeft > TIME_BONUS_THRESHOLD ? ' (Bonus!)' : ''}`;
        }
    }

    function endGame() {
        // Clear any existing timers and disable answer buttons
        clearInterval(timer);
        if (elements.answers) {
            const buttons = elements.answers.getElementsByTagName('button');
            Array.from(buttons).forEach(button => {
                button.disabled = true;
            });
        }
        
        // Hide next question button and update UI elements
        if (elements.nextQuestion) {
            elements.nextQuestion.classList.add('hidden');
        }
        
        // Calculate final statistics
        const correctAnswers = Math.floor(score - (score % 1)); // Handle any potential decimal scores
        const totalQuestions = triviaQuestions.length;
        const percentageScore = ((correctAnswers / totalQuestions) * 100).toFixed(1);
        
        const finalMessage = `
            ${getLocalizedString('finalScore')}: ${correctAnswers}/${totalQuestions} (${percentageScore}%)
            ${getLocalizedString('highestStreak')}: ${highestStreak}
            ${getLocalizedString('bonusPoints')}: ${score - correctAnswers}
        `.trim();
    
        // Show the game over modal
        showModal(
            getLocalizedString('gameOver'),
            finalMessage,
            getLocalizedString('playAgain'),
            () => {
                promptForLeaderboard(score);
            }
        );
    
        // Save current game stats
        try {
            const gameStats = {
                score: score,
                highestStreak: highestStreak,
                totalQuestions: totalQuestions,
                language: gameLanguage,
                difficulty: gameDifficulty,
                date: new Date().toISOString()
            };
            localStorage.setItem('lastGameStats', JSON.stringify(gameStats));
        } catch (error) {
            console.error('Error saving game stats:', error);
        }
    }

    function promptForLeaderboard(finalScore) {
        // Close the current modal first
        closeModal();
        
        // Create and show a custom prompt for name entry
        const promptHTML = `
            <div class="leaderboard-prompt">
                <h3>${getLocalizedString('enterName')}</h3>
                <input type="text" id="player-name-input" maxlength="20" placeholder="Your name">
                <div class="button-group">
                    <button id="submit-score" class="primary-button">${getLocalizedString('close')}</button>
                    <button id="skip-leaderboard" class="secondary-button">${getLocalizedString('playAgain')}</button>
                </div>
            </div>
        `;
        
        showModal(
            getLocalizedString('enterName'),
            promptHTML,
            null,
            null
        );
    
        // Get the newly created elements
        const nameInput = document.getElementById('player-name-input');
        const submitButton = document.getElementById('submit-score');
        const skipButton = document.getElementById('skip-leaderboard');
    
        if (nameInput && submitButton && skipButton) {
            // Focus the input field
            nameInput.focus();
    
            // Handle submit button click
            submitButton.onclick = () => {
                const playerName = nameInput.value.trim();
                if (playerName) {
                    updateLeaderboard(playerName, finalScore);
                }
                startNewGame();
            };
    
            // Handle skip button click
            skipButton.onclick = () => {
                startNewGame();
            };
    
            // Handle enter key in input
            nameInput.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    submitButton.click();
                }
            };
        }
    }

    function startNewGame() {
        // Reset game state
        currentQuestionIndex = 0;
        score = 0;
        streak = 0;
        highestStreak = 0;
        
        // Clear any existing timers
        clearInterval(timer);
        
        // Clear the modal
        closeModal();
        
        // Update UI elements
        updateScore();
        if (elements.feedback) {
            elements.feedback.textContent = '';
            elements.feedback.className = 'feedback';
        }
        
        // Start new game
        fetchTriviaQuestions();
    }

    function updateLeaderboard(playerName, finalScore) {
        if (!database) {
            console.error('Firebase database not initialized');
            return;
        }

        try {
            const newEntry = {
                name: escapeHTML(playerName.substring(0, 20)),
                score: Number(finalScore.toFixed(1)),
                language: gameLanguage,
                difficulty: gameDifficulty,
                highestStreak: highestStreak,
                date: new Date().toISOString()
            };

            // Generate a unique key for the leaderboard entry
            const leaderboardRef = ref(database, 'leaderboard/' + Date.now());
            
            // Use set instead of push
            set(leaderboardRef, newEntry)
                .then(() => {
                    console.log('Score submitted to Firebase');
                    displayLeaderboard(); // Refresh leaderboard
                })
                .catch(error => {
                    console.error('Error submitting score:', error);
                    // Fallback to local storage if Firebase fails
                    fallbackLocalStorageLeaderboard(newEntry);
                });
        } catch (error) {
            console.error('Error preparing leaderboard entry:', error);
            fallbackLocalStorageLeaderboard(newEntry);
        }
    }

    function fallbackLocalStorageLeaderboard(newEntry) {
        try {
            let leaderboard = [];
            try {
                leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
            } catch (e) {
                console.error('Error parsing leaderboard:', e);
            }

            leaderboard.push(newEntry);
            leaderboard.sort((a, b) => b.score - a.score);
            leaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);

            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            
            showModal(
                'Offline Mode', 
                'Score saved locally due to connection issues.',
                'OK',
                closeModal
            );
        } catch (error) {
            console.error('Fallback leaderboard storage failed:', error);
        }
    }

    function displayLeaderboard() {
        if (!elements.leaderboardBody) return;

        // Clear existing leaderboard
        elements.leaderboardBody.innerHTML = '';

        try {
            if (database) {
                // Fetch from Firebase
                const leaderboardRef = ref(database, 'leaderboard');
                
                get(leaderboardRef)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const leaderboardData = snapshot.val();
                            const leaderboard = Object.values(leaderboardData)
                                .sort((a, b) => b.score - a.score)
                                .slice(0, MAX_LEADERBOARD_ENTRIES);

                            // Render Firebase leaderboard
                            renderLeaderboardEntries(leaderboard);
                        } else {
                            // No data in Firebase
                            const localLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
                            renderLeaderboardEntries(localLeaderboard);
                        }
                    })
                    .catch((error) => {
                        console.error('Firebase leaderboard fetch error:', error);
                        // Fallback to local storage
                        const localLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
                        renderLeaderboardEntries(localLeaderboard);
                    });
            } else {
                // Fallback to local storage if Firebase not initialized
                const localLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
                renderLeaderboardEntries(localLeaderboard);
            }
        } catch (error) {
            console.error('Leaderboard display error:', error);
            const localLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
            renderLeaderboardEntries(localLeaderboard);
        }
    }

    function renderLeaderboardEntries(leaderboard) {
        leaderboard.forEach((entry, index) => {
            const row = document.createElement('tr');
            const date = new Date(entry.date);
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHTML(entry.name)}</td>
                <td>${entry.score}</td>
                <td>${entry.language.toUpperCase()}</td>
                <td>${entry.difficulty}</td>
                <td>${entry.highestStreak || 0}</td>
                <td>${date.toLocaleDateString()}</td>
            `;
            elements.leaderboardBody.appendChild(row);
        });
    }

    function showModal(title, message, actionText, actionCallback) {
        elements.modalTitle.textContent = title;
        elements.modalMessage.textContent = message;
        elements.modal.style.display = 'block';

        if (actionText && actionCallback) {
            elements.modalAction.textContent = actionText;
            elements.modalAction.classList.remove('hidden');
            elements.modalAction.onclick = () => {
                closeModal();
                actionCallback();
            };
        } else {
            elements.modalAction.classList.add('hidden');
        }

        elements.modalClose.onclick = closeModal;
    }

    function closeModal() {
        elements.modal.style.display = 'none';
    }

    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getLocalizedString(key) {
        return localizations[gameLanguage]?.[key] || key;
    }

    function setupNavigation() {
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').slice(1);
                showSection(targetId);
            });
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.altKey) {
                const num = parseInt(e.key);
                if (num >= 1 && num <= 3) {
                    e.preventDefault();
                    const sections = ['home', 'trivia-center', 'leaderboard'];
                    showSection(sections[num - 1]);
                }
            }
        });
    }

    function showSection(sectionId) {
        if (timer && sectionId !== 'trivia-center') {
            clearInterval(timer);
        }

        document.querySelectorAll('main > section').forEach(section => {
            section.classList.toggle('hidden-section', section.id !== sectionId);
            section.classList.toggle('active-section', section.id === sectionId);
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });

        // Save last active section to localStorage
        localStorage.setItem('lastActiveSection', sectionId);
    }

    function updateUI() {
        if (elements.startGame) {
            elements.startGame.textContent = getLocalizedString('startGame');
        }
        if (elements.nextQuestion) {
            elements.nextQuestion.textContent = getLocalizedString('nextQuestion');
        }

        const isFrench = gameLanguage === 'fr';
        if (elements.gameDifficulty?.parentElement) {
            elements.gameDifficulty.parentElement.style.display = isFrench ? 'none' : '';
        }
        if (elements.gameCategory?.parentElement) {
            elements.gameCategory.parentElement.style.display = isFrench ? 'none' : '';
        }

        // Update keyboard shortcut hints
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.dataset.key;
            const hint = document.createElement('small');
            hint.className = 'keyboard-hint';
            hint.textContent = `(${getLocalizedString('pressKey').replace('{key}', key)})`;
            element.appendChild(hint);
        });
    }

    function saveGameState() {
        const gameState = {
            gameLanguage,
            gameDifficulty,
            gameCategory,
            highestStreak: localStorage.getItem('highestStreak') || 0
        };
        localStorage.setItem('gameSettings', JSON.stringify(gameState));
    }

    function loadGameState() {
        try {
            const savedState = JSON.parse(localStorage.getItem('gameSettings'));
            if (savedState) {
                gameLanguage = savedState.gameLanguage || 'en';
                gameDifficulty = savedState.gameDifficulty || 'medium';
                gameCategory = savedState.gameCategory || '9';
                highestStreak = parseInt(savedState.highestStreak) || 0;

                // Update select elements
                if (elements.gameLanguage) elements.gameLanguage.value = gameLanguage;
                if (elements.gameDifficulty) elements.gameDifficulty.value = gameDifficulty;
                if (elements.gameCategory) elements.gameCategory.value = gameCategory;
            }
        } catch (error) {
            console.error('Error loading game state:', error);
        }
    }

    function init() {
        // Initialize elements object with all required DOM elements
        [
            'gameLanguage', 'gameDifficulty', 'gameCategory', 'startGame', 'questionNumber',
            'currentScore', 'progress', 'question', 'answers', 'feedback', 'timeLeft',
            'nextQuestion', 'leaderboardBody', 'modal', 'modalTitle', 'modalMessage',
            'modalClose', 'modalAction'
        ].forEach(id => {
            const domId = id.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
            elements[id] = document.getElementById(domId);
        });

        // Set up event listeners with error handling
        const addSafeEventListener = (element, event, handler) => {
            if (element) {
                element.addEventListener(event, (...args) => {
                    try {
                        handler(...args);
                    } catch (error) {
                        console.error(`Error in ${event} handler:`, error);
                    }
                });
            }
        };

        // Debounced save function
        const debouncedSave = debounce(saveGameState, 500);

        // Set up main event listeners
        addSafeEventListener(elements.startGame, 'click', fetchTriviaQuestions);
        addSafeEventListener(elements.nextQuestion, 'click', () => {
            currentQuestionIndex++;
            loadQuestion();
        });
        addSafeEventListener(elements.modalClose, 'click', closeModal);
        
        // Add change listeners with automatic saving
        addSafeEventListener(elements.gameLanguage, 'change', e => {
            gameLanguage = e.target.value;
            updateUI();
            debouncedSave();
        });
        
        addSafeEventListener(elements.gameDifficulty, 'change', e => {
            gameDifficulty = e.target.value;
            debouncedSave();
        });
        
        addSafeEventListener(elements.gameCategory, 'change', e => {
            gameCategory = e.target.value;
            debouncedSave();
        });

        // Initialize the game
        loadGameState();
        displayLeaderboard();
        setupNavigation();
        updateUI();

        // Restore last active section or default to home
        const lastSection = localStorage.getItem('lastActiveSection') || 'home';
        showSection(lastSection);

        // Close modal on outside click
        window.addEventListener('click', e => {
            if (e.target === elements.modal) {
                closeModal();
            }
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && timer) {
                clearInterval(timer);
            } else if (!document.hidden && elements.timeLeft && timeLeft > 0) {
                startTimer();
            }
        });

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            saveGameState();
            if (timer) {
                clearInterval(timer);
            }
        });
    }

    initFirebase();

    // Public API
    return { init };
})();

// Initialize the game when the page loads
window.addEventListener('load', TriviaGame.init);
