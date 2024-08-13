const questions = [
    { question: "How do you say 'Hello' in French?", answer: "bonjour" },
    { question: "What is the French word for 'Book'?", answer: "livre" },
    { question: "How do you say 'Thank you' in French?", answer: "merci" },
    { question: "What is the French word for 'Apple'?", answer: "pomme" },
    { question: "How do you say 'Goodbye' in French?", answer: "au revoir" },
    { question: "What is the French word for 'Cat'?", answer: "chat" },
    { question: "How do you say 'Please' in French?", answer: "s'il vous plaît" },
    { question: "What is the French word for 'Dog'?", answer: "chien" },
    { question: "How do you say 'Yes' in French?", answer: "oui" },
    { question: "What is the French word for 'House'?", answer: "maison" },
    // Add more questions as needed
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
const maxQuestions = questions.length;

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();

    document.getElementById('submitButton').addEventListener('click', handleSubmit);
    document.getElementById('answerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSubmit();
    });
});

function loadQuestion() {
    if (currentQuestionIndex >= maxQuestions) {
        endGame();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const conversation = document.getElementById('conversation');
    conversation.innerHTML += `<div class="message friend">Friend: ${currentQuestion.question}</div>`;
    document.getElementById('feedback').textContent = '';
    document.getElementById('answerInput').value = '';
    document.getElementById('time').textContent = timeLeft;
    document.getElementById('questionNumber').textContent = `Question: ${currentQuestionIndex + 1}`;
    document.getElementById('totalQuestions').textContent = `of ${maxQuestions}`;
    document.getElementById('questionHistory').innerHTML += `<li>${currentQuestion.question}</li>`;

    startTimer();
}

function handleSubmit() {
    const answer = document.getElementById('answerInput').value.trim().toLowerCase();
    const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();

    stopTimer();

    const conversation = document.getElementById('conversation');

    if (answer === correctAnswer) {
        document.getElementById('feedback').textContent = 'Correct!';
        document.getElementById('feedback').className = 'correct';
        conversation.innerHTML += `<div class="message user">You: ${answer}</div>`;
        conversation.innerHTML += `<div class="message friend">Friend: Well done!</div>`;
        score++;
    } else {
        document.getElementById('feedback').textContent = `Incorrect! The correct answer was: ${questions[currentQuestionIndex].answer}`;
        document.getElementById('feedback').className = 'incorrect';
        conversation.innerHTML += `<div class="message user">You: ${answer}</div>`;
        conversation.innerHTML += `<div class="message friend">Friend: The correct answer is ${questions[currentQuestionIndex].answer}.</div>`;
    }

    currentQuestionIndex++;
    setTimeout(loadQuestion, 2000);
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleSubmit();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timeLeft = 30; // reset timer for next question
}

function endGame() {
    const conversation = document.getElementById('conversation');
    conversation.innerHTML += `<div class="message friend">Friend: Game Over! Your final score is ${score}</div>`;
    document.getElementById('feedback').textContent = '';
    document.getElementById('controls').style.display = 'none';
    document.getElementById('progress').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('questionHistory').style.display = 'none';
}
