const questions = [
    { question: "What is your name?", answer: "Quel est ton nom?", hint: "It's a common phrase for asking someone's identity." },
    { question: "How are you?", answer: "Comment ça va?", hint: "It's a common greeting." },
    { question: "Where do you live?", answer: "Où habites-tu?", hint: "It's about asking someone's residence." },
    { question: "What time is it?", answer: "Quelle heure est-il?", hint: "It's a question about time." }
];

let score = 0;
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answerInput');
const submitButton = document.getElementById('submitAnswer');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const hintElement = document.getElementById('hint');
const hintButton = document.getElementById('hintButton');
const exampleAnswerElement = document.getElementById('exampleAnswer');

function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function displayNewQuestion() {
    const { question, hint } = getRandomQuestion();
    questionElement.textContent = question;
    answerInput.value = '';
    feedbackElement.textContent = '';
    hintElement.textContent = ''; // Clear hint
    hintButton.disabled = false; // Enable hint button
    exampleAnswerElement.textContent = hint;
}

function checkAnswer() {
    const answer = normalizeString(answerInput.value.trim());
    const correctAnswer = normalizeString(questions.find(q => q.question === questionElement.textContent).answer);
    
    if (answer === correctAnswer) {
        feedbackElement.textContent = 'Correct!';
        feedbackElement.className = 'correct';
        score++;
    } else {
        feedbackElement.textContent = `Incorrect! The correct answer is: ${questions.find(q => q.question === questionElement.textContent).answer}`;
        feedbackElement.className = 'incorrect';
    }
    
    scoreElement.textContent = `Score: ${score}`;
    displayNewQuestion();
}

function showHint() {
    const hint = questions.find(q => q.question === questionElement.textContent).hint;
    hintElement.textContent = hint;
    hintButton.disabled = true; // Disable hint button after use
}

submitButton.addEventListener('click', checkAnswer);
hintButton.addEventListener('click', showHint);
window.addEventListener('load', displayNewQuestion);
