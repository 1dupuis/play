const questions = [
    { question: "What is your name?", answer: "Quel est ton nom?" },
    { question: "How are you?", answer: "Comment ça va?" },
    { question: "Where do you live?", answer: "Où habites-tu?" },
    { question: "What time is it?", answer: "Quelle heure est-il?" }
];

let score = 0;
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answerInput');
const submitButton = document.getElementById('submitAnswer');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');

function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

function displayNewQuestion() {
    const { question } = getRandomQuestion();
    questionElement.textContent = question;
    answerInput.value = '';
    feedbackElement.textContent = '';
}

function checkAnswer() {
    const answer = answerInput.value.trim();
    const correctAnswer = questions.find(q => q.question === questionElement.textContent).answer;
    
    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
        feedbackElement.textContent = 'Correct!';
        feedbackElement.className = 'correct';
        score++;
    } else {
        feedbackElement.textContent = `Incorrect! The correct answer is: ${correctAnswer}`;
        feedbackElement.className = 'incorrect';
    }
    
    scoreElement.textContent = `Score: ${score}`;
    displayNewQuestion();
}

submitButton.addEventListener('click', checkAnswer);
window.addEventListener('load', displayNewQuestion);
