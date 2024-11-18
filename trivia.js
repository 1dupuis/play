const TriviaGame = (function() {
    // Private variables with default values
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
        
        // Validate that we have a valid question before proceeding
        if (currentQuestionIndex >= triviaQuestions.length || !triviaQuestions[currentQuestionIndex]) {
            console.warn('No valid question found for index:', currentQuestionIndex);
            endGame();
            return;
        }
        
        const question = triviaQuestions[currentQuestionIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        // Ensure we have the answers element before proceeding
        if (!elements.answers) {
            console.error('Answers element not found');
            return;
        }
        
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
    
            if (timeLeft > TIME_BONUS_THRESHOLD) {
                bonusPoints += TIME_BONUS_POINTS;
                feedbackMessage += `${getLocalizedString('timeBonus')}: +${TIME_BONUS_POINTS}\n`;
            }
    
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
    
        if (elements.feedback) {
            elements.feedback.innerHTML = feedbackMessage;
        }
        updateScore();
    
        // Show next question button or end game
        if (elements.nextQuestion) {
            elements.nextQuestion.classList.remove('hidden');
            elements.nextQuestion.disabled = false;
            
            if (currentQuestionIndex === triviaQuestions.length - 1) {
                elements.nextQuestion.textContent = getLocalizedString('finalScore');
                elements.nextQuestion.onclick = endGame;
            } else {
                elements.nextQuestion.textContent = getLocalizedString('nextQuestion');
                elements.nextQuestion.onclick = () => {
                    currentQuestionIndex++;
                    loadQuestion();
                };
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
        // Clear any existing timers and event listeners
        clearInterval(timer);
        if (elements.nextQuestion) {
            elements.nextQuestion.onclick = null;
            elements.nextQuestion.classList.add('hidden');
        }
        
        // Calculate final statistics
        const correctAnswers = Math.floor(score);
        const totalQuestions = triviaQuestions.length;
        const percentageScore = ((correctAnswers / totalQuestions) * 100).toFixed(1);
        const bonusPoints = score - correctAnswers;
        
        const finalMessage = `
            ${getLocalizedString('finalScore')}: ${correctAnswers}/${totalQuestions} (${percentageScore}%)
            ${getLocalizedString('highestStreak')}: ${highestStreak}
            ${getLocalizedString('bonusPoints')}: ${bonusPoints}
        `.trim();
    
        // Save game stats before showing modal
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
    
        // Show game over modal and prompt for leaderboard entry
        showModal(
            getLocalizedString('gameOver'),
            finalMessage,
            getLocalizedString('playAgain'),
            () => {
                closeModal();
                promptForLeaderboard(score);
            }
        );
    }

    function promptForLeaderboard(finalScore) {
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
    
        const nameInput = document.getElementById('player-name-input');
        const submitButton = document.getElementById('submit-score');
        const skipButton = document.getElementById('skip-leaderboard');
    
        if (nameInput && submitButton && skipButton) {
            nameInput.focus();
    
            submitButton.onclick = () => {
                const playerName = nameInput.value.trim();
                if (playerName) {
                    updateLeaderboard(playerName, finalScore);
                }
                closeModal();
                startNewGame();
            };
    
            skipButton.onclick = () => {
                closeModal();
                startNewGame();
            };
    
            nameInput.onkeypress = (e) => {
                if (e.key === 'Enter' && nameInput.value.trim()) {
                    submitButton.click();
                }
            };
        }
    }

    function startNewGame() {
        // Prevent starting a new game while one is being initialized
        if (isLoading) {
            console.warn('Game initialization already in progress');
            return;
        }
        
        try {
            isLoading = true;
            
            // Clear all timers and intervals
            clearInterval(timer);
            timer = null;
            timeLeft = 0;
            
            // Reset all game state variables
            currentQuestionIndex = 0;
            score = 0;
            streak = 0;
            highestStreak = Math.max(highestStreak || 0, 0); // Preserve highest streak across games
            triviaQuestions = [];
            
            // Clean up UI elements
            if (elements.nextQuestion) {
                elements.nextQuestion.onclick = null;
                elements.nextQuestion.classList.add('hidden');
                elements.nextQuestion.disabled = false;
                elements.nextQuestion.textContent = getLocalizedString('nextQuestion');
            }
            
            if (elements.answers) {
                elements.answers.innerHTML = '';
            }
            
            if (elements.question) {
                elements.question.innerHTML = '';
            }
            
            if (elements.feedback) {
                elements.feedback.textContent = '';
                elements.feedback.className = 'feedback';
            }
            
            if (elements.timeLeft) {
                elements.timeLeft.textContent = '';
                elements.timeLeft.className = '';
            }
            
            if (elements.progress) {
                elements.progress.style.width = '0%';
            }
            
            if (elements.questionNumber) {
                elements.questionNumber.textContent = '';
            }
            
            // Reset score display
            updateScore();
            
            // Clean up any modal that might be open
            closeModal();
            
            // Remove any existing keyboard event listeners
            document.removeEventListener('keydown', handleKeyPress);
            
            // Save current game settings
            saveGameState();
            
            // Show loading state
            showLoadingState(true);
            
            // Ensure we're on the trivia section
            showSection('trivia-center');
            
            // Reset keyboard shortcuts
            setupKeyboardShortcuts();
            
            // Add error handling for fetch
            fetchTriviaQuestions().catch(error => {
                console.error('Error starting new game:', error);
                showModal(
                    getLocalizedString('errorFetchingQuestions'),
                    error.message,
                    getLocalizedString('retry'),
                    () => {
                        isLoading = false;
                        startNewGame();
                    }
                );
            }).finally(() => {
                // Ensure loading state is reset even if there's an error
                isLoading = false;
                showLoadingState(false);
            });
            
            // Update the UI with current game settings
            updateUI();
            
            // Log game start for debugging
            console.log('New game started:', {
                language: gameLanguage,
                difficulty: gameDifficulty,
                category: gameCategory
            });
            
        } catch (error) {
            console.error('Error in startNewGame:', error);
            
            // Show error to user
            showModal(
                'Error',
                'Failed to start new game. Please try again.',
                'Retry',
                () => {
                    isLoading = false;
                    startNewGame();
                }
            );
        }
    }

    function updateLeaderboard(playerName, finalScore) {
        try {
            // Get existing leaderboard or create new one
            let leaderboard = [];
            try {
                leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
            } catch (e) {
                console.error('Error parsing leaderboard:', e);
                leaderboard = [];
            }
    
            // Create new entry
            const newEntry = {
                name: escapeHTML(playerName.substring(0, 20)), // Limit name length and escape HTML
                score: Number(finalScore.toFixed(1)), // Ensure score is a number with max 1 decimal
                language: gameLanguage,
                difficulty: gameDifficulty,
                highestStreak: highestStreak,
                date: new Date().toISOString()
            };
    
            // Add new entry and sort
            leaderboard.push(newEntry);
            leaderboard.sort((a, b) => b.score - a.score);
    
            // Keep only top entries
            leaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
    
            // Save to localStorage
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    
            // Update displayed leaderboard
            displayLeaderboard();
    
        } catch (error) {
            console.error('Error updating leaderboard:', error);
            showModal(
                'Error',
                'There was an error saving your score. Please try again.',
                'OK',
                closeModal
            );
        }
    }

    function displayLeaderboard() {
        if (!elements.leaderboardBody) return;

        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        elements.leaderboardBody.innerHTML = '';
        
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

    // Public API
    return { init };
})();

// Initialize the game when the page loads
window.addEventListener('load', TriviaGame.init);
