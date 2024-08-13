const questions = [
    {
        question: "What is the capital of France?",
        answers: ["Paris", "Lyon", "Marseille", "Toulouse"],
        correct: "Paris"
    },
    {
        question: "What is the French national motto?",
        answers: ["Liberty, Equality, Fraternity", "Liberty, Justice, Unity", "Freedom, Equality, Brotherhood", "Justice, Liberty, Equality"],
        correct: "Liberty, Equality, Fraternity"
    },
    {
        question: "Which famous French landmark is known as the Iron Lady?",
        answers: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Versailles"],
        correct: "Eiffel Tower"
    },
    {
        question: "Which French region is famous for its wine?",
        answers: ["Bordeaux", "Normandy", "Brittany", "Alsace"],
        correct: "Bordeaux"
    },
    {
        question: "What is the name of the French flag?",
        answers: ["Tricolore", "Banderole", "Drapeau", "Pavillon"],
        correct: "Tricolore"
    },
    {
        question: "What is the popular French pastry filled with almond cream?",
        answers: ["Galette des Rois", "Croissant", "Éclair", "Macaron"],
        correct: "Galette des Rois"
    },
    {
        question: "Which French artist is known for the painting 'Starry Night'?",
        answers: ["Vincent van Gogh", "Claude Monet", "Paul Cézanne", "Henri Matisse"],
        correct: "Vincent van Gogh"
    },
    {
        question: "What is the traditional French dish made from beef stew?",
        answers: ["Boeuf Bourguignon", "Coq au Vin", "Ratatouille", "Bouillabaisse"],
        correct: "Boeuf Bourguignon"
    },
    {
        question: "What is the French word for 'cheese'?",
        answers: ["Fromage", "Pain", "Beurre", "Vin"],
        correct: "Fromage"
    },
    {
        question: "Which French city is known for its annual film festival?",
        answers: ["Cannes", "Paris", "Lyon", "Nice"],
        correct: "Cannes"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
const timeLimit = 30;

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    const q = questions[currentQuestionIndex];
    document.getElementById('question').textContent = q.question;
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        btn.textContent = q.answers[index];
        btn.onclick = () => checkAnswer(q.answers[index], q.correct);
    });

    startTimer();
}

function checkAnswer(selected, correct) {
    stopTimer();
    const feedback = document.getElementById('feedback');
    if (selected === correct) {
        feedback.textContent = 'Correct!';
        feedback.className = 'feedback correct';
        score++;
    } else {
        feedback.textContent = `Incorrect! The correct answer was "${correct}".`;
        feedback.className = 'feedback incorrect';
    }
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 2000);
}

function startTimer() {
    let timeLeft = timeLimit;
    document.getElementById('time').textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            stopTimer();
            document.getElementById('feedback').textContent = 'Time is up!';
            document.getElementById('feedback').className = 'feedback incorrect';
            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion();
            }, 2000);
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function endGame() {
    const finalScore = document.getElementById('score');
    finalScore.textContent = `Final Score: ${score}`;
    document.getElementById('gameOverScreen').classList.remove('hidden');
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
}

document.getElementById('restartButton').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('timer').style.display = 'block';
    loadQuestion();
});

window.onload = () => loadQuestion();
