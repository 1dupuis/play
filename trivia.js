/* trivia.js */
const TriviaGame = (function() {
    // Private variables with default values
    let currentQuestionIndex = 0;
    let score = 0;
    let triviaQuestions = [];
    let gameLanguage = 'en';
    let gameDifficulty = 'medium';
    let gameCategory = '9';
    let timeLeft = 0;
    let timer = null;
    let streak = 0;
    let highestStreak = 0;
    let isLoading = false;

    // Configurable constants
    const TIMER_DURATION = 20;
    const TIME_BONUS_THRESHOLD = 10;  // Additional points if answered before this threshold
    const TIME_BONUS_POINTS = 2;
    const STREAK_BONUS = 5;          // Additional points if streak >= 3
    const MAX_LEADERBOARD_ENTRIES = 10;

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

    // Cached DOM elements (will be filled in init())
    const elements = {};

    /**
     * ------------- Utility Functions -------------
     */
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
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
        throw lastError;
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

    /**
     * ------------- Main Trivia Logic -------------
     */
    function showLoadingState(loading) {
        isLoading = loading;
        if (elements.startGame) {
            elements.startGame.disabled = loading;
            elements.startGame.textContent = loading
                ? `${getLocalizedString('loading')}...`
                : getLocalizedString('startGame');
        }
    }

    async function fetchTriviaQuestions() {
        showLoadingState(true);
        try {
            const apiUrl =
                gameLanguage === 'fr'
                    ? 'https://quizzapi.jomoreschi.fr/api/v1/quiz?limit=10'
                    : `https://opentdb.com/api.php?amount=10&category=${gameCategory}&difficulty=${gameDifficulty}&type=multiple`;

            const data = await fetchWithRetry(apiUrl);

            if (gameLanguage === 'fr') {
                if (!Array.isArray(data.quizzes) || data.quizzes.length === 0) {
                    throw new Error('No questions received from French API');
                }
                triviaQuestions = data.quizzes.map(q => ({
                    question: decodeHTML(q.question),
                    answers: shuffleArray([q.answer, ...q.badAnswers]),
                    correctAnswer: q.answer
                }));
            } else {
                if (data.response_code !== 0 || !Array.isArray(data.results)) {
                    throw new Error('Failed to fetch questions from English API');
                }
                triviaQuestions = data.results.map(q => ({
                    question: decodeHTML(q.question),
                    answers: shuffleArray([...q.incorrect_answers, q.correct_answer]),
                    correctAnswer: q.correct_answer
                }));
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

    function shuffleArray(array) {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    function startGame() {
        // Reset game variables
        currentQuestionIndex = 0;
        score = 0;
        streak = 0;
        highestStreak = 0;

        // Update scoreboard and load first question
        updateScoreDisplay();
        loadQuestion();

        // Show the trivia section
        showSection('trivia-center');

        // Setup keyboard shortcuts for answering
        setupKeyboardShortcuts();
    }

    function loadQuestion() {
        // If we've reached or passed the last question, end the game
        if (currentQuestionIndex >= triviaQuestions.length) {
            endGame();
            return;
        }

        const questionObj = triviaQuestions[currentQuestionIndex];
        if (elements.questionNumber) {
            elements.questionNumber.textContent = `Question ${currentQuestionIndex + 1}/${triviaQuestions.length}`;
        }
        if (elements.question) {
            elements.question.textContent = decodeHTML(questionObj.question);
        }
        if (elements.answers) {
            elements.answers.innerHTML = '';
            questionObj.answers.forEach((answer, index) => {
                const btn = document.createElement('button');
                btn.textContent = `${index + 1}. ${decodeHTML(answer)}`;
                btn.addEventListener('click', () => checkAnswer(answer));
                elements.answers.appendChild(btn);
            });
        }
        if (elements.feedback) {
            elements.feedback.textContent = '';
        }

        // Hide the Next/Final Score button until user answers
        if (elements.nextQuestion) {
            elements.nextQuestion.classList.add('hidden');
        }

        // Update progress and start the question timer
        updateProgressBar();
        startTimer();
    }

    function checkAnswer(selectedAnswer) {
        clearInterval(timer);

        const questionObj = triviaQuestions[currentQuestionIndex];
        const isCorrect = (selectedAnswer === questionObj.correctAnswer);

        // Disable all answer buttons and highlight correct/incorrect
        const answerButtons = elements.answers.querySelectorAll('button');
        answerButtons.forEach(btn => {
            btn.disabled = true;
            const buttonText = btn.textContent.slice(3); // remove "1. " from display
            if (buttonText === questionObj.correctAnswer) {
                btn.classList.add('correct');
            } else if (buttonText === selectedAnswer) {
                btn.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
        });

        let bonusPoints = 0;
        let feedbackMsg = '';

        if (isCorrect) {
            streak++;
            highestStreak = Math.max(highestStreak, streak);
            score++;

            // Time bonus
            if (timeLeft > TIME_BONUS_THRESHOLD) {
                bonusPoints += TIME_BONUS_POINTS;
                feedbackMsg += `${getLocalizedString('timeBonus')}: +${TIME_BONUS_POINTS}<br>`;
            }
            // Streak bonus
            if (streak >= 3) {
                bonusPoints += STREAK_BONUS;
                feedbackMsg += `${getLocalizedString('streakBonus')}: +${STREAK_BONUS}<br>`;
            }

            score += bonusPoints;
            feedbackMsg = `${getLocalizedString('correct')}<br>${feedbackMsg}${getLocalizedString('currentStreak')}: ${streak}`;

            // Optional: confetti if correct
            /*
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 }
            });
            */
        } else {
            // Wrong answer => streak resets
            streak = 0;
            feedbackMsg = `${getLocalizedString('incorrect')}: ${decodeHTML(questionObj.correctAnswer)}`;
        }

        if (elements.feedback) {
            elements.feedback.innerHTML = feedbackMsg;
        }

        updateScoreDisplay();

        // Show the Next Question or Final Score button
        if (elements.nextQuestion) {
            elements.nextQuestion.classList.remove('hidden');
            if (currentQuestionIndex === triviaQuestions.length - 1) {
                // Last question => "final score" text
                elements.nextQuestion.textContent = getLocalizedString('finalScore');
            } else {
                elements.nextQuestion.textContent = getLocalizedString('nextQuestion');
            }
        }
    }

    function updateScoreDisplay() {
        if (elements.currentScore) {
            elements.currentScore.textContent = score;
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
                // Time's up => count as incorrect if not already answered
                checkAnswer(null);
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        if (elements.timeLeft) {
            elements.timeLeft.textContent = `${timeLeft}s`;
        }
    }

    function updateProgressBar() {
        if (!elements.progress) return;
        const progressPercent = ((currentQuestionIndex + 1) / triviaQuestions.length) * 100;
        elements.progress.style.width = `${progressPercent}%`;
    }

    /**
     * Ends the game after the final question is answered or skipped.
     */
    function endGame() {
        clearInterval(timer);

        // Disable leftover answer buttons
        const answerButtons = elements.answers.querySelectorAll('button');
        answerButtons.forEach(btn => (btn.disabled = true));

        // Hide "Next Question" if visible
        if (elements.nextQuestion) {
            elements.nextQuestion.classList.add('hidden');
        }

        // Calculate final stats
        const correctAnswers = Math.floor(score - (score % 1));
        const totalQuestions = triviaQuestions.length;
        const percentageScore = ((correctAnswers / totalQuestions) * 100).toFixed(1);
        const bonusPoints = (score - correctAnswers).toFixed(1); // any fractional points

        // Show final results in the modal
        const finalMsg = `
            ${getLocalizedString('finalScore')}: ${correctAnswers}/${totalQuestions} (${percentageScore}%)
            <br>${getLocalizedString('highestStreak')}: ${highestStreak}
            <br>${getLocalizedString('bonusPoints')}: ${bonusPoints}
        `.trim();
        
        showModal(
            getLocalizedString('gameOver'),
            finalMsg,
            getLocalizedString('playAgain'),
            () => promptForName(score)
        );

        // Try saving game stats
        try {
            const stats = {
                score,
                highestStreak,
                totalQuestions,
                language: gameLanguage,
                difficulty: gameDifficulty,
                date: new Date().toISOString()
            };
            localStorage.setItem('lastGameStats', JSON.stringify(stats));
        } catch (err) {
            console.warn('Could not save game stats:', err);
        }
    }

    /**
     * Prompt user for name to store in the leaderboard.
     */
    function promptForName(finalScore) {
        // Close the final results modal
        closeModal();

        // Create the name-prompt structure
        const promptHTML = `
            <div style="padding: 10px;">
                <h3>${getLocalizedString('enterName')}</h3>
                <input type="text" id="player-name-input" maxlength="20" placeholder="Your name" style="width: 90%; padding: 8px; margin: 10px 0;">
                <div>
                    <button id="submit-name" class="primary-button">${getLocalizedString('close')}</button>
                    <button id="skip-name" class="secondary-button">${getLocalizedString('playAgain')}</button>
                </div>
            </div>
        `;

        // Show new modal for name entry
        showModal(
            getLocalizedString('enterName'),
            promptHTML,
            null,
            null
        );

        // Wire up the new elements
        const nameInput = document.getElementById('player-name-input');
        const submitBtn = document.getElementById('submit-name');
        const skipBtn = document.getElementById('skip-name');

        if (nameInput) nameInput.focus();

        if (submitBtn) {
            submitBtn.onclick = () => {
                const nameVal = nameInput.value.trim();
                if (nameVal) {
                    updateLeaderboard(nameVal, finalScore);
                }
                startNewGame();
            };
        }
        if (skipBtn) {
            skipBtn.onclick = () => {
                startNewGame();
            };
        }
        if (nameInput) {
            nameInput.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                }
            });
        }
    }

    /**
     * Starts a new game after user finishes or skips the name prompt.
     */
    function startNewGame() {
        closeModal();
        currentQuestionIndex = 0;
        score = 0;
        streak = 0;
        highestStreak = 0;
        clearInterval(timer);

        // Fetch new question set
        fetchTriviaQuestions();
    }

    /**
     * ------------- Leaderboard Logic -------------
     */
    function updateLeaderboard(playerName, finalScore) {
        try {
            let leaderboard = [];
            try {
                leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
            } catch (err) {
                console.warn('Leaderboard parse error:', err);
                leaderboard = [];
            }

            const newEntry = {
                name: escapeHTML(playerName.substring(0, 20)),
                score: Number(finalScore.toFixed(1)),
                language: gameLanguage,
                difficulty: gameDifficulty,
                highestStreak,
                date: new Date().toISOString()
            };

            leaderboard.push(newEntry);
            // Sort descending by score
            leaderboard.sort((a, b) => b.score - a.score);
            // Keep top N
            leaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);

            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            displayLeaderboard(newEntry);
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

    function displayLeaderboard(latestEntry = null) {
        if (!elements.leaderboardBody) return;

        // Clear any "disabled" message or handle it as you wish
        // For now, removing references to "Temporarily Disabled" since we want it working.

        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        elements.leaderboardBody.innerHTML = '';

        leaderboard.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHTML(entry.name)}</td>
                <td>${entry.score}</td>
                <td>${entry.language.toUpperCase()}</td>
                <td>${entry.difficulty}</td>
            `;
            // Optionally, add a Highest Streak column:
            // <td>${entry.highestStreak || 0}</td>

            // Highlight if this is the newly added entry
            if (
                latestEntry &&
                entry.name === latestEntry.name &&
                entry.score === latestEntry.score &&
                entry.date === latestEntry.date
            ) {
                row.style.backgroundColor = '#ffefc5'; // highlight color
            }
            elements.leaderboardBody.appendChild(row);
        });
    }

    /**
     * ------------- Modal Logic -------------
     */
    function showModal(title, message, actionText, actionCallback) {
        if (elements.modalTitle) {
            elements.modalTitle.textContent = title;
        }
        if (elements.modalMessage) {
            // For safety, allow innerHTML only if we trust the content
            elements.modalMessage.innerHTML = message || '';
        }
        if (elements.modal) {
            elements.modal.style.display = 'block';
        }

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

        if (elements.modalClose) {
            elements.modalClose.onclick = closeModal;
        }
    }

    function closeModal() {
        if (elements.modal) {
            elements.modal.style.display = 'none';
        }
    }

    /**
     * ------------- Navigation & UI -------------
     */
    function setupNavigation() {
        const navLinks = document.querySelectorAll('header nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('href').replace('#', '');
                showSection(targetId);
            });
        });

        // Optional: Ctrl+1 => Home, Ctrl+2 => Trivia, Ctrl+3 => Leaderboard
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.altKey) {
                const num = parseInt(e.key, 10);
                if (num >= 1 && num <= 3) {
                    e.preventDefault();
                    const sections = ['home', 'trivia-center', 'leaderboard'];
                    showSection(sections[num - 1]);
                }
            }
        });
    }

    function showSection(sectionId) {
        // If user navigates away from Trivia, pause timer
        if (timer && sectionId !== 'trivia-center') {
            clearInterval(timer);
        }

        // Hide all sections
        const sections = document.querySelectorAll('main > section');
        sections.forEach(sec => {
            if (sec.id === sectionId) {
                sec.classList.remove('hidden-section');
                sec.classList.add('active-section');
            } else {
                sec.classList.add('hidden-section');
                sec.classList.remove('active-section');
            }
        });

        // Update nav link active states
        const navLinks = document.querySelectorAll('header nav ul li a');
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });

        // Remember last active section
        localStorage.setItem('lastActiveSection', sectionId);
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
                // It's an answer index
                const buttons = elements.answers.querySelectorAll('button');
                if (buttons[action] && !buttons[action].disabled) {
                    buttons[action].click();
                }
            } else if (action === 'nextQuestion' && !elements.nextQuestion.classList.contains('hidden')) {
                // If on the last question => endGame, else move to next question
                if (currentQuestionIndex >= triviaQuestions.length - 1) {
                    endGame();
                } else {
                    currentQuestionIndex++;
                    loadQuestion();
                }
            }
        }
    }

    function saveGameState() {
        const gameState = {
            gameLanguage,
            gameDifficulty,
            gameCategory,
        };
        localStorage.setItem('triviaGameSettings', JSON.stringify(gameState));
    }

    function loadGameState() {
        try {
            const saved = JSON.parse(localStorage.getItem('triviaGameSettings'));
            if (saved) {
                gameLanguage = saved.gameLanguage || 'en';
                gameDifficulty = saved.gameDifficulty || 'medium';
                gameCategory = saved.gameCategory || '9';
            }
        } catch (err) {
            console.warn('Could not parse saved game settings:', err);
        }
    }

    /**
     * ------------- Initialization -------------
     */
    function init() {
        // Map element references
        elements.startGame = document.getElementById('start-game');
        elements.questionNumber = document.getElementById('question-number');
        elements.currentScore = document.getElementById('current-score');
        elements.progress = document.getElementById('progress');
        elements.question = document.getElementById('question');
        elements.answers = document.getElementById('answers');
        elements.feedback = document.getElementById('feedback');
        elements.timeLeft = document.getElementById('time-left');
        elements.nextQuestion = document.getElementById('next-question');
        elements.leaderboardBody = document.getElementById('leaderboard-body');
        elements.modal = document.getElementById('modal');
        elements.modalTitle = document.getElementById('modal-title');
        elements.modalMessage = document.getElementById('modal-message');
        elements.modalClose = document.getElementById('modal-close');
        elements.modalAction = document.getElementById('modal-action');

        // Game settings inputs
        const langSelect = document.getElementById('game-language');
        const diffSelect = document.getElementById('game-difficulty');
        const catSelect = document.getElementById('game-category');

        // Safe event listener helper
        const safeAddEventListener = (elem, event, handler) => {
            if (elem) {
                elem.addEventListener(event, (...args) => {
                    try {
                        handler(...args);
                    } catch (err) {
                        console.error(`Error in ${event} handler:`, err);
                    }
                });
            }
        };

        // Link button actions
        safeAddEventListener(elements.startGame, 'click', fetchTriviaQuestions);
        safeAddEventListener(elements.nextQuestion, 'click', () => {
            // If on the last question => endGame, else move to next question
            if (currentQuestionIndex >= triviaQuestions.length - 1) {
                endGame();
            } else {
                currentQuestionIndex++;
                loadQuestion();
            }
        });
        safeAddEventListener(elements.modalClose, 'click', closeModal);

        // Drop-down changes
        safeAddEventListener(langSelect, 'change', e => {
            gameLanguage = e.target.value;
            saveGameState();
        });
        safeAddEventListener(diffSelect, 'change', e => {
            gameDifficulty = e.target.value;
            saveGameState();
        });
        safeAddEventListener(catSelect, 'change', e => {
            gameCategory = e.target.value;
            saveGameState();
        });

        // Load and apply previous game settings (if any)
        loadGameState();
        if (langSelect) langSelect.value = gameLanguage;
        if (diffSelect) diffSelect.value = gameDifficulty;
        if (catSelect) catSelect.value = gameCategory;

        // Init nav
        setupNavigation();

        // Display existing leaderboard (if any)
        displayLeaderboard();

        // Restore last active section or default to home
        const lastSection = localStorage.getItem('lastActiveSection') || 'home';
        showSection(lastSection);

        // Close modal on outside click
        window.addEventListener('click', e => {
            if (e.target === elements.modal) {
                closeModal();
            }
        });

        // Page visibility => pause/resume game timer
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && timer) {
                clearInterval(timer);
            } else if (!document.hidden && elements.timeLeft && timeLeft > 0 && currentQuestionIndex < triviaQuestions.length) {
                startTimer();
            }
        });

        // Cleanup on unload
        window.addEventListener('beforeunload', () => {
            // Save final state
            saveGameState();
            if (timer) {
                clearInterval(timer);
            }
        });
    }

    // Public API
    return { init };
})();

// Initialize on page load
window.addEventListener('load', TriviaGame.init);
