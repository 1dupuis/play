const questions = [
    { question: "What do you like to do in your free time?", answer: "temps libre" },
    { question: "What is your favorite French dish?", answer: "plat préféré" },
    { question: "Have you visited any other countries?", answer: "d'autres pays" },
    { question: "Do you prefer the beach or the mountains?", answer: "plage ou montagne" },
    { question: "What’s your favorite French city and why?", answer: "ville préférée" },
    { question: "Do you have any pets?", answer: "animaux de compagnie" },
    { question: "What kind of music do you enjoy?", answer: "genre de musique" },
    { question: "What are your plans for the weekend?", answer: "plans pour week-end" },
    { question: "Do you prefer coffee or tea?", answer: "café ou thé" },
    { question: "How do you usually celebrate your birthday?", answer: "célébrer anniversaire" },
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
            document.getElementById('feedback').textContent = 'Time is up!';
            document.getElementById('feedback').className = 'incorrect';
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
    const conversation = document.getElementById('conversation');
    conversation.innerHTML += `<div class="message friend">Friend: Great chatting with you! Your final score is ${score}/${maxQuestions}.</div>`;
    document.getElementById('answerInput').style.display = 'none';
    document.getElementById('submitButton').style.display = 'none';
    document.getElementById('progress').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
}
