// Data structures
const LOCAL_STORAGE_KEYS = {
  FLASHCARDS: 'flashcards',
  QUIZZES: 'quizzes',
  NOTES: 'notes'
};

let flashcards = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.FLASHCARDS)) || [];
let quizzes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.QUIZZES)) || [];
let notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.NOTES)) || [];

let currentCardIndex = 0;
let isShowingQuestion = true;
let studyMode = 'all';
let currentQuizIndex = 0;
let currentQuizScore = 0;

// DOM Elements
const appContainer = document.getElementById('app-container');
const navBar = document.getElementById('nav-bar');
const contentArea = document.getElementById('content-area');

// Navigation
const navItems = [
    { id: 'flashcards', label: 'Flashcards', icon: 'card' },
    { id: 'quizzes', label: 'Quizzes', icon: 'clipboard' },
    { id: 'notes', label: 'Notes', icon: 'book' },
    { id: 'stats', label: 'Statistics', icon: 'bar-chart' }
];

function renderNavBar() {
    navBar.innerHTML = navItems.map(item => `
        <button id="${item.id}-btn" class="nav-btn">
            <i class="icon-${item.icon}"></i>
            ${item.label}
        </button>
    `).join('');

    navItems.forEach(item => {
        document.getElementById(`${item.id}-btn`).addEventListener('click', () => showSection(item.id));
    });
}

function showSection(sectionId) {
    navItems.forEach(item => {
        document.getElementById(`${item.id}-btn`).classList.toggle('active', item.id === sectionId);
    });
    
    contentArea.innerHTML = '';
    switch (sectionId) {
        case 'flashcards':
            renderFlashcardSection();
            break;
        case 'quizzes':
            renderQuizSection();
            break;
        case 'notes':
            renderNotesSection();
            break;
        case 'stats':
            renderStatsSection();
            break;
        default:
            console.error(`Unknown section: ${sectionId}`);
    }
}

// Flashcard functionality
function renderFlashcardSection() {
    contentArea.innerHTML = `
        <h2>Flashcards</h2>
        <div id="flashcard-controls">
            <select id="study-mode-select">
                <option value="all">All Cards</option>
                <option value="low">Low Confidence</option>
                <option value="medium">Medium Confidence</option>
                <option value="high">High Confidence</option>
            </select>
            <button id="new-card-btn">New Card</button>
        </div>
        <div id="flashcard-container">
            <div id="flashcard">
                <div id="question"></div>
                <div id="answer" class="hidden"></div>
            </div>
            <div id="confidence-rating" class="hidden">
                <button class="confidence-btn" data-score="1">Low</button>
                <button class="confidence-btn" data-score="2">Medium</button>
                <button class="confidence-btn" data-score="3">High</button>
            </div>
        </div>
        <div id="flashcard-navigation">
            <button id="prev-btn">Previous</button>
            <button id="flip-btn">Flip</button>
            <button id="next-btn">Next</button>
        </div>
    `;

    const studyModeSelect = document.getElementById('study-mode-select');
    const newCardBtn = document.getElementById('new-card-btn');
    const flashcardEl = document.getElementById('flashcard');
    const questionEl = document.getElementById('question');
    const answerEl = document.getElementById('answer');
    const confidenceRatingEl = document.getElementById('confidence-rating');
    const prevBtn = document.getElementById('prev-btn');
    const flipBtn = document.getElementById('flip-btn');
    const nextBtn = document.getElementById('next-btn');

    studyModeSelect.addEventListener('change', (e) => {
        studyMode = e.target.value;
        currentCardIndex = 0;
        showCard();
    });

    newCardBtn.addEventListener('click', createNewCard);
    prevBtn.addEventListener('click', prevCard);
    flipBtn.addEventListener('click', flipCard);
    nextBtn.addEventListener('click', nextCard);

    confidenceRatingEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('confidence-btn')) {
            const score = parseInt(e.target.dataset.score, 10);
            flashcards[currentCardIndex].confidence = score;
            flashcards[currentCardIndex].lastReviewed = new Date().toISOString();
            saveFlashcards();
            nextCard();
        }
    });

    showCard();
}

function showCard() {
    const filteredCards = filterFlashcards();
    if (filteredCards.length === 0) {
        document.getElementById('flashcard-container').innerHTML = '<p>No cards match the current study mode. Try a different mode or create new cards!</p>';
        return;
    }

    const card = filteredCards[currentCardIndex];
    const questionEl = document.getElementById('question');
    const answerEl = document.getElementById('answer');
    const flashcardEl = document.getElementById('flashcard');
    const confidenceRatingEl = document.getElementById('confidence-rating');

    if (questionEl && answerEl && flashcardEl && confidenceRatingEl) {
        questionEl.textContent = card.question;
        answerEl.textContent = card.answer;
        isShowingQuestion = true;
        flashcardEl.style.transform = 'rotateY(0deg)';
        questionEl.classList.remove('hidden');
        answerEl.classList.add('hidden');
        confidenceRatingEl.classList.add('hidden');
    } else {
        console.error('Required DOM elements not found');
    }
}

function filterFlashcards() {
    switch (studyMode) {
        case 'low':
            return flashcards.filter(card => card.confidence < 2);
        case 'medium':
            return flashcards.filter(card => card.confidence === 2);
        case 'high':
            return flashcards.filter(card => card.confidence > 2);
        default:
            return flashcards;
    }
}

function flipCard() {
    const flashcardEl = document.getElementById('flashcard');
    const questionEl = document.getElementById('question');
    const answerEl = document.getElementById('answer');
    const confidenceRatingEl = document.getElementById('confidence-rating');

    if (flashcardEl && questionEl && answerEl && confidenceRatingEl) {
        flashcardEl.style.transform = isShowingQuestion ? 'rotateY(180deg)' : 'rotateY(0deg)';
        isShowingQuestion = !isShowingQuestion;
        questionEl.classList.toggle('hidden');
        answerEl.classList.toggle('hidden');
        confidenceRatingEl.classList.toggle('hidden');
    } else {
        console.error('Required DOM elements not found');
    }
}

function nextCard() {
    const filteredCards = filterFlashcards();
    currentCardIndex = (currentCardIndex + 1) % filteredCards.length;
    showCard();
}

function prevCard() {
    const filteredCards = filterFlashcards();
    currentCardIndex = (currentCardIndex - 1 + filteredCards.length) % filteredCards.length;
    showCard();
}

function createNewCard() {
    const newQuestion = prompt('Enter the question:');
    const newAnswer = prompt('Enter the answer:');
    
    if (newQuestion && newAnswer) {
        const newCard = {
            id: Date.now(),
            question: newQuestion.trim(),
            answer: newAnswer.trim(),
            confidence: 0,
            lastReviewed: null
        };
        flashcards.push(newCard);
        saveFlashcards();
        showNotification('New flashcard added successfully!');
        showCard();
    } else {
        showNotification('Please provide both question and answer.', 'error');
    }
}

function saveFlashcards() {
    safelySetItem(LOCAL_STORAGE_KEYS.FLASHCARDS, JSON.stringify(flashcards));
}

// Quiz functionality
function renderQuizSection() {
    contentArea.innerHTML = `
        <h2>Quizzes</h2>
        <div id="quiz-controls">
            <button id="new-quiz-btn">Create New Quiz</button>
            <select id="quiz-select">
                <option value="">Select a quiz</option>
                ${quizzes.map(quiz => `<option value="${quiz.id}">${quiz.title}</option>`).join('')}
            </select>
        </div>
        <div id="quiz-container"></div>
    `;

    document.getElementById('new-quiz-btn').addEventListener('click', createNewQuiz);
    document.getElementById('quiz-select').addEventListener('change', (e) => {
        if (e.target.value) {
            startQuiz(parseInt(e.target.value, 10));
        }
    });
}

function createNewQuiz() {
    const title = prompt('Enter the quiz title:');
    if (title) {
        const newQuiz = {
            id: Date.now(),
            title: title.trim(),
            questions: []
        };
        quizzes.push(newQuiz);
        saveQuizzes();
        showNotification('New quiz created. Add questions to it!');
        promptForQuizQuestions(newQuiz);
    } else {
        showNotification('Please provide a title for the quiz.', 'error');
    }
}

function promptForQuizQuestions(quiz) {
    const addQuestion = () => {
        const questionText = prompt('Enter the question:');
        if (questionText) {
            const options = [];
            for (let i = 0; i < 4; i++) {
                const option = prompt(`Enter option ${i + 1}:`);
                if (option) {
                    options.push(option.trim());
                } else {
                    break;
                }
            }
            if (options.length < 2) {
                showNotification('A question must have at least 2 options.', 'error');
                return;
            }
            const correctIndex = parseInt(prompt(`Enter the index of the correct answer (1-${options.length}):`), 10) - 1;
            if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
                showNotification('Invalid correct answer index.', 'error');
                return;
            }
            quiz.questions.push({
                text: questionText.trim(),
                options: options,
                correctIndex: correctIndex
            });
            saveQuizzes();
            if (confirm('Question added. Do you want to add another question?')) {
                addQuestion();
            } else {
                renderQuizSection();
            }
        } else {
            renderQuizSection();
        }
    };
    addQuestion();
}

function startQuiz(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz || quiz.questions.length === 0) {
        showNotification('This quiz has no questions yet.', 'error');
        return;
    }

    currentQuizIndex = 0;
    currentQuizScore = 0;
    showQuizQuestion(quiz);
}

function showQuizQuestion(quiz) {
    const question = quiz.questions[currentQuizIndex];
    const quizContainer = document.getElementById('quiz-container');
    
    if (quizContainer) {
        quizContainer.innerHTML = `
            <h3>${quiz.title} - Question ${currentQuizIndex + 1}/${quiz.questions.length}</h3>
            <p>${question.text}</p>
            <div id="quiz-options">
                ${question.options.map((option, index) => `
                    <button class="quiz-option" data-index="${index}">${option}</button>
                `).join('')}
            </div>
        `;

        const quizOptions = document.getElementById('quiz-options');
        if (quizOptions) {
            quizOptions.addEventListener('click', (e) => {
                if (e.target.classList.contains('quiz-option')) {
                    checkQuizAnswer(quiz, question, parseInt(e.target.dataset.index, 10));
                }
            });
        } else {
            console.error('Quiz options container not found');
        }
    } else {
        console.error('Quiz container not found');
    }
}

function checkQuizAnswer(quiz, question, selectedIndex) {
    const isCorrect = selectedIndex === question.correctIndex;
    if (isCorrect) {
        currentQuizScore++;
    }

    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        quizContainer.innerHTML += `
            <p class="${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? 'Correct!' : 'Incorrect. The correct answer was: ' + question.options[question.correctIndex]}
            </p>
            <button id="next-question-btn">Next Question</button>
        `;

        document.getElementById('next-question-btn').addEventListener('click', () => {
            currentQuizIndex++;
            if (currentQuizIndex < quiz.questions.length) {
                showQuizQuestion(quiz);
            } else {
                showQuizResults(quiz);
            }
        });
    } else {
        console.error('Quiz container not found');
    }
}

function showQuizResults(quiz) {
    const quizContainer = document.getElementById('quiz-container');
    const percentage = (currentQuizScore / quiz.questions.length) * 100;
    
    if (quizContainer) {
        quizContainer.innerHTML = `
            <h3>Quiz Results: ${quiz.title}</h3>
            <p>You scored ${currentQuizScore} out of ${quiz.questions.length} (${percentage.toFixed(2)}%)</p>
            <button id="retake-quiz-btn">Retake Quiz</button>
        `;

        document.getElementById('retake-quiz-btn').addEventListener('click', () => startQuiz(quiz.id));
    } else {
        console.error('Quiz container not found');
    }
}

function saveQuizzes() {
    safelySetItem(LOCAL_STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
}

// Notes functionality
function renderNotesSection() {
    contentArea.innerHTML = `
        <h2>Notes</h2>
        <div id="notes-controls">
            <button id="new-note-btn">New Note</button>
        </div>
        <div id="notes-list"></div>
    `;

    document.getElementById('new-note-btn').addEventListener('click', createNewNote);
    renderNotesList();
}

function createNewNote() {
    const title = prompt('Enter note title:');
    if (title) {
        const newNote = {
            id: Date.now(),
            title: title.trim(),
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        notes.push(newNote);
        saveNotes();
        showNotification('New note created!');
        renderNotesList();
    } else {
        showNotification('Please provide a title for the note.', 'error');
    }
}

function renderNotesList() {
    const notesList = document.getElementById('notes-list');
    if (notesList) {
        notesList.innerHTML = notes.map(note => `
            <div class="note-item">
                <h3>${escapeHtml(note.title)}</h3>
                <p>Last updated: ${new Date(note.updatedAt).toLocaleString()}</p>
                <button class="edit-note-btn" data-id="${note.id}">Edit</button>
                <button class="delete-note-btn" data-id="${note.id}">Delete</button>
            </div>
        `).join('');

        notesList.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-note-btn')) {
                editNote(parseInt(e.target.dataset.id, 10));
            } else if (e.target.classList.contains('delete-note-btn')) {
                deleteNote(parseInt(e.target.dataset.id, 10));
            }
        });
    } else {
        console.error('Notes list container not found');
    }
}

function editNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        const newContent = prompt('Edit your note:', note.content);
        if (newContent !== null) {
            note.content = newContent.trim();
            note.updatedAt = new Date().toISOString();
            saveNotes();
            showNotification('Note updated successfully!');
            renderNotesList();
        }
    } else {
        console.error(`Note with id ${noteId} not found`);
    }
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(n => n.id !== noteId);
        saveNotes();
        showNotification('Note deleted successfully!');
        renderNotesList();
    }
}

function saveNotes() {
    safelySetItem(LOCAL_STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

// Statistics functionality
function renderStatsSection() {
    contentArea.innerHTML = `
        <h2>Study Statistics</h2>
        <div id="stats-summary"></div>
        <canvas id="confidence-chart"></canvas>
        <canvas id="study-time-chart"></canvas>
    `;

    updateStatsSummary();
    renderConfidenceChart();
    renderStudyTimeChart();
}

function updateStatsSummary() {
    const totalCards = flashcards.length;
    const reviewedCards = flashcards.filter(card => card.lastReviewed).length;
    const avgConfidence = totalCards > 0 ? flashcards.reduce((sum, card) => sum + card.confidence, 0) / totalCards : 0;

    const statsSummary = document.getElementById('stats-summary');
    if (statsSummary) {
        statsSummary.innerHTML = `
            <div class="stat-item">Total Flashcards: ${totalCards}</div>
            <div class="stat-item">Reviewed Cards: ${reviewedCards}</div>
            <div class="stat-item">Average Confidence: ${avgConfidence.toFixed(2)}</div>
            <div class="stat-item">Total Quizzes: ${quizzes.length}</div>
            <div class="stat-item">Total Notes: ${notes.length}</div>
        `;
    } else {
        console.error('Stats summary container not found');
    }
}

function renderConfidenceChart() {
    const ctx = document.getElementById('confidence-chart');
    if (ctx) {
        const confidenceLevels = [0, 1, 2, 3];
        const confidenceCounts = confidenceLevels.map(level => 
            flashcards.filter(card => card.confidence === level).length
        );

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Not Reviewed', 'Low', 'Medium', 'High'],
                datasets: [{
                    label: 'Confidence Levels',
                    data: confidenceCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Cards'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Flashcard Confidence Levels'
                    }
                }
            }
        });
    } else {
        console.error('Confidence chart canvas not found');
    }
}

function renderStudyTimeChart() {
    const ctx = document.getElementById('study-time-chart');
    if (ctx) {
        const last7Days = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const studyTimeCounts = last7Days.map(date => 
            flashcards.filter(card => card.lastReviewed && card.lastReviewed.startsWith(date)).length
        );

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Cards Studied',
                    data: studyTimeCounts,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Cards'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Study Activity (Last 7 Days)'
                    }
                }
            }
        });
    } else {
        console.error('Study time chart canvas not found');
    }
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('notification', type);
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Initialize the app
function init() {
    renderNavBar();
    showSection('flashcards');
}

// Event listener for DOMContentLoaded to ensure the DOM is fully loaded before initializing
document.addEventListener('DOMContentLoaded', init);

// Error handling for localStorage
function safelySetItem(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        showNotification('Error saving data. Please check your browser settings.', 'error');
    }
}

// Update save functions to use safelySetItem
function saveFlashcards() {
    safelySetItem(LOCAL_STORAGE_KEYS.FLASHCARDS, JSON.stringify(flashcards));
}

function saveQuizzes() {
    safelySetItem(LOCAL_STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
}

function saveNotes() {
    safelySetItem(LOCAL_STORAGE_KEYS.NOTES, JSON.stringify(notes));
}
