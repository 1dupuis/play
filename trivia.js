// Trivia Game Module
const TriviaGame = (function() {
    // Private variables
    let currentQuestionIndex = 0;
    let score = 0;
    let triviaQuestions = [];
    let gameLanguage = 'en';
    let gameDifficulty = 'medium';
    let gameCategory = '9';
    
    let timer;
    const TIMER_DURATION = 20; // Constant for timer duration

    // DOM elements
    const elements = {};

    // Localization
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
            addWord: 'Ajouter',
            translate: 'Traduire',
            enterName: 'Entrez votre nom pour le classement:',
            errorFetchingQuestions: 'Erreur lors de la récupération des questions. Veuillez réessayer.',
            retry: 'Réessayer',
            delete: 'Supprimer',
            translated: 'Traduit'
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
            addWord: 'Add',
            translate: 'Translate',
            enterName: 'Enter your name for the leaderboard:',
            errorFetchingQuestions: 'Error fetching questions. Please try again.',
            retry: 'Retry',
            delete: 'Delete',
            translated: 'Translated'
        }
    };

    // Fetch trivia questions from an API
    async function fetchTriviaQuestions() {
        try {
            let apiUrl;
            if (gameLanguage === 'fr') {
                // French trivia API
                apiUrl = 'https://quizzapi.jomoreschi.fr/api/v1/quiz?limit=10';
            } else {
                // English trivia API (Open Trivia Database)
                apiUrl = `https://opentdb.com/api.php?amount=10&category=${gameCategory}&difficulty=${gameDifficulty}&type=multiple`;
            }

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (gameLanguage === 'fr') {
                // Process French API data
                if (!Array.isArray(data.quizzes) || data.quizzes.length === 0) {
                    throw new Error('No questions received from French API');
                }
                triviaQuestions = data.quizzes.map(item => ({
                    question: decodeHTML(item.question),
                    answers: [item.answer, ...item.badAnswers].sort(() => Math.random() - 0.5),
                    correctAnswer: item.answer
                }));
            } else {
                // Process English API data
                if (data.response_code !== 0 || !Array.isArray(data.results)) {
                    throw new Error('Failed to fetch questions from English API');
                }
                triviaQuestions = data.results.map(question => ({
                    question: decodeHTML(question.question),
                    answers: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
                    correctAnswer: question.correct_answer
                }));
            }

            if (triviaQuestions.length === 0) {
                throw new Error('No questions received from API');
            }

            startGame();
        } catch (error) {
            console.error('Error fetching trivia questions:', error);
            showModal(getLocalizedString('errorFetchingQuestions'), getLocalizedString('retry'), fetchTriviaQuestions);
        }
    }
    
    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    // Start the game
    function startGame() {
        currentQuestionIndex = 0;
        score = 0;
        loadQuestion();
        updateUI();
        showSection('trivia-center');
    }

    // Load a question
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
                button.innerHTML = decodeHTML(answer);
                button.addEventListener('click', () => checkAnswer(answer));
                elements.answers.appendChild(button);
            });
        }

        if (elements.nextQuestion) {
            elements.nextQuestion.classList.add('hidden');
        }
        if (elements.feedback) {
            elements.feedback.textContent = '';
        }
        updateProgress();
        startTimer(); // Start the timer for the new question
    }

    // Check the selected answer
    function checkAnswer(selectedAnswer) {
        clearInterval(timer);
        const question = triviaQuestions[currentQuestionIndex];
        const buttons = elements.answers.getElementsByTagName('button');

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
            if (buttons[i].textContent === question.correctAnswer) {
                buttons[i].classList.add('correct');
            } else if (buttons[i].textContent === selectedAnswer) {
                buttons[i].classList.add('incorrect');
            }
        }

        if (selectedAnswer === question.correctAnswer) {
            score++;
            elements.feedback.textContent = getLocalizedString('correct');
            elements.feedback.classList.add('correct');
        } else {
            elements.feedback.innerHTML = `${getLocalizedString('incorrect')}: ${decodeHTML(question.correctAnswer)}`;
            elements.feedback.classList.add('incorrect');
        }

        updateScore();
        elements.nextQuestion.classList.remove('hidden');
    }

    // Load the next question
    function loadNextQuestion() {
        currentQuestionIndex++;
        loadQuestion();
    }

    // End the game
    function endGame() {
        showModal(
            getLocalizedString('gameOver'),
            `${getLocalizedString('finalScore')} ${score}/${triviaQuestions.length}`,
            getLocalizedString('playAgain'),
            startGame
        );
        updateLeaderboard(score);
    }

    // Update progress bar
    function updateProgress() {
        const progressPercentage = ((currentQuestionIndex + 1) / triviaQuestions.length) * 100;
        elements.progress.style.width = `${progressPercentage}%`;
        elements.questionNumber.textContent = `${currentQuestionIndex + 1}/${triviaQuestions.length}`;
    }

    // Start timer for each question
    function startTimer() {
        // Clear any existing timer
        if (timer) {
            clearInterval(timer);
        }

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

    // Update timer display
    function updateTimerDisplay() {
        if (elements.timeLeft) {
            elements.timeLeft.textContent = `${getLocalizedString('timeLeft')}: ${timeLeft}s`;
        }
    }
    // Update score display
    function updateScore() {
        elements.currentScore.textContent = `${getLocalizedString('score')}: ${score}`;
    }

    // Vocabulary feature
    function addVocabularyWord() {
        const word = elements.newWord.value.trim();
        const translation = elements.wordTranslation.value.trim();
        
        if (word && translation) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${escapeHTML(word)} - ${escapeHTML(translation)}</span>
                <button class="delete-word">${getLocalizedString('delete')}</button>
            `;
            li.querySelector('.delete-word').addEventListener('click', () => {
                li.remove();
                saveVocabulary();
            });
            elements.vocabList.appendChild(li);
            elements.newWord.value = '';
            elements.wordTranslation.value = '';
            saveVocabulary();
        }
    }

    // Save vocabulary to local storage
    function saveVocabulary() {
        const words = Array.from(elements.vocabList.children).map(li => {
            const [word, translation] = li.querySelector('span').textContent.split(' - ');
            return { word, translation };
        });
        localStorage.setItem('vocabulary', JSON.stringify(words));
    }

    // Load vocabulary from local storage
    function loadVocabulary() {
        const words = JSON.parse(localStorage.getItem('vocabulary')) || [];
        words.forEach(({ word, translation }) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${escapeHTML(word)} - ${escapeHTML(translation)}</span>
                <button class="delete-word">${getLocalizedString('delete')}</button>
            `;
            li.querySelector('.delete-word').addEventListener('click', () => {
                li.remove();
                saveVocabulary();
            });
            elements.vocabList.appendChild(li);
        });
    }

    // Translation feature (mock implementation)
    function translateText() {
        const text = elements.textToTranslate.value.trim();
        const fromLang = elements.translateFrom.value;
        const toLang = elements.translateTo.value;
        if (text) {
            // In a real application, you would call an API here
            elements.translationResult.textContent = `${getLocalizedString('translated')} (${fromLang} to ${toLang}): ${text}`;
        }
    }

    // Leaderboard feature
    function updateLeaderboard(newScore) {
        const playerName = prompt(getLocalizedString('enterName'));
        if (playerName) {
            const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
            leaderboard.push({ 
                name: playerName, 
                score: newScore, 
                language: gameLanguage, 
                difficulty: gameDifficulty 
            });
            leaderboard.sort((a, b) => b.score - a.score);
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
            displayLeaderboard();
        }
    }

    // Display leaderboard
    function displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        elements.leaderboardBody.innerHTML = '';
        leaderboard.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHTML(entry.name)}</td>
                <td>${entry.score}</td>
                <td>${entry.language}</td>
                <td>${entry.difficulty}</td>
            `;
            elements.leaderboardBody.appendChild(row);
        });
    }

    // Show modal
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
    }

    // Close modal
    function closeModal() {
        elements.modal.style.display = 'none';
    }

    // Utility function to decode HTML entities
    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    // Utility function to escape HTML entities
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Get localized string
    function getLocalizedString(key) {
        return localizations[gameLanguage][key] || key;
    }

    // Setup navigation
    function setupNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').slice(1);
                showSection(targetId);
            });
        });
    }

    // Show selected section
    function showSection(sectionId) {
        const sections = document.querySelectorAll('main > section');
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.remove('hidden-section');
                section.classList.add('active-section');
            } else {
                section.classList.add('hidden-section');
                section.classList.remove('active-section');
            }
        });

        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Update UI elements based on selected language
    function updateUI() {
        if (elements.startGame) elements.startGame.textContent = getLocalizedString('startGame');
        if (elements.nextQuestion) elements.nextQuestion.textContent = getLocalizedString('nextQuestion');
        if (elements.addWord) elements.addWord.textContent = getLocalizedString('addWord');
        if (elements.translateBtn) elements.translateBtn.textContent = getLocalizedString('translate');
        if (elements.modalClose) elements.modalClose.textContent = getLocalizedString('close');
        // Update other UI elements as needed

        // Hide or show difficulty and category selectors based on language
        if (elements.gameDifficulty && elements.gameCategory) {
            if (gameLanguage === 'fr') {
                elements.gameDifficulty.parentElement.style.display = 'none';
                elements.gameCategory.parentElement.style.display = 'none';
            } else {
                elements.gameDifficulty.parentElement.style.display = '';
                elements.gameCategory.parentElement.style.display = '';
            }
        }
    }
    
    // Initialize the game
    function init() {
        // Initialize elements object
        const elementIds = [
            'game-language', 'game-difficulty', 'game-category', 'start-game', 'question-number',
            'current-score', 'progress', 'question', 'answers', 'feedback', 'time-left',
            'next-question', 'leaderboard-body', 'modal', 'modal-title', 'modal-message',
            'modal-close', 'modal-action', 'new-word', 'word-translation', 'add-word',
            'vocab-list', 'text-to-translate', 'translate-from', 'translate-to', 'translate-btn',
            'translation-result', 'notes'
        ];

        elementIds.forEach(id => {
            elements[id.replace(/-./g, x => x[1].toUpperCase())] = document.getElementById(id);
        });

        // Add event listeners only if elements exist
        if (elements.startGame) elements.startGame.addEventListener('click', fetchTriviaQuestions);
        if (elements.nextQuestion) elements.nextQuestion.addEventListener('click', loadNextQuestion);
        if (elements.addWord) elements.addWord.addEventListener('click', addVocabularyWord);
        if (elements.translateBtn) elements.translateBtn.addEventListener('click', translateText);
        if (elements.modalClose) elements.modalClose.addEventListener('click', closeModal);
        if (elements.gameLanguage) {
            elements.gameLanguage.addEventListener('change', (e) => {
                gameLanguage = e.target.value;
                updateUI();
            });
        }
        if (elements.gameDifficulty) {
            elements.gameDifficulty.addEventListener('change', (e) => {
                gameDifficulty = e.target.value;
            });
        }
        if (elements.gameCategory) {
            elements.gameCategory.addEventListener('change', (e) => {
                gameCategory = e.target.value;
            });
        }

        loadVocabulary();
        displayLeaderboard();
        setupNavigation();
        updateUI();

        // Save notes automatically
        if (elements.notes) {
            elements.notes.addEventListener('input', () => {
                localStorage.setItem('userNotes', elements.notes.value);
            });

            // Load saved notes
            const savedNotes = localStorage.getItem('userNotes');
            if (savedNotes) {
                elements.notes.value = savedNotes;
            }
        }

        // Set initial language
        if (elements.gameLanguage) {
            elements.gameLanguage.addEventListener('change', (e) => {
                gameLanguage = e.target.value;
                updateUI();
                // Refetch questions when language changes
                fetchTriviaQuestions();
            });
        }

        // Set initial difficulty
        if (elements.gameDifficulty) {
            gameDifficulty = elements.gameDifficulty.value;
        }

        // Set initial category
        if (elements.gameCategory) {
            gameCategory = elements.gameCategory.value;
        }

        // Show initial section
        showSection('home');
    }

    // Public methods
    return {
        init: init
    };
})();

// Initialize the game when the page loads
window.addEventListener('load', TriviaGame.init);
