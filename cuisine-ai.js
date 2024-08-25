// cuisine-ai.js

const foodOptions = [
    { name: "Coq au Vin", attributes: { sweet: 3, spicy: 2, seafood: 0, rich: 7, presentation: 6, vegetarian: false, traditional: 8 } },
    { name: "Bouillabaisse", attributes: { sweet: 2, spicy: 5, seafood: 8, rich: 6, presentation: 7, vegetarian: false, traditional: 9 } },
    { name: "Ratatouille", attributes: { sweet: 3, spicy: 1, seafood: 0, rich: 4, presentation: 8, vegetarian: true, traditional: 7 } },
    { name: "Boeuf Bourguignon", attributes: { sweet: 1, spicy: 2, seafood: 0, rich: 8, presentation: 6, vegetarian: false, traditional: 9 } },
    { name: "Quiche Lorraine", attributes: { sweet: 2, spicy: 2, seafood: 0, rich: 6, presentation: 7, vegetarian: false, traditional: 8 } },
    { name: "Cassoulet", attributes: { sweet: 1, spicy: 4, seafood: 0, rich: 9, presentation: 5, vegetarian: false, traditional: 10 } },
    { name: "Duck Confit", attributes: { sweet: 1, spicy: 3, seafood: 0, rich: 9, presentation: 7, vegetarian: false, traditional: 9 } },
    { name: "Escargot", attributes: { sweet: 1, spicy: 2, seafood: 2, rich: 6, presentation: 8, vegetarian: false, traditional: 10 } },
    { name: "Salmon en Papillote", attributes: { sweet: 3, spicy: 3, seafood: 8, rich: 5, presentation: 9, vegetarian: false, traditional: 6 } },
    { name: "Beef Tartare", attributes: { sweet: 1, spicy: 4, seafood: 0, rich: 7, presentation: 7, vegetarian: false, traditional: 8 } },
    { name: "Chateaubriand", attributes: { sweet: 1, spicy: 2, seafood: 0, rich: 9, presentation: 8, vegetarian: false, traditional: 9 } },
    { name: "Soupe à l'Oignon", attributes: { sweet: 4, spicy: 1, seafood: 0, rich: 5, presentation: 6, vegetarian: false, traditional: 9 } },
    { name: "Salade Niçoise", attributes: { sweet: 2, spicy: 1, seafood: 5, rich: 4, presentation: 8, vegetarian: false, traditional: 8 } },
    { name: "Steak Frites", attributes: { sweet: 1, spicy: 2, seafood: 0, rich: 7, presentation: 6, vegetarian: false, traditional: 7 } },
    { name: "Pot-au-Feu", attributes: { sweet: 2, spicy: 1, seafood: 0, rich: 6, presentation: 5, vegetarian: false, traditional: 10 } },
    { name: "Moules Marinières", attributes: { sweet: 2, spicy: 2, seafood: 9, rich: 5, presentation: 7, vegetarian: false, traditional: 8 } },
    { name: "Blanquette de Veau", attributes: { sweet: 2, spicy: 1, seafood: 0, rich: 7, presentation: 6, vegetarian: false, traditional: 9 } },
    { name: "Sole Meunière", attributes: { sweet: 1, spicy: 1, seafood: 9, rich: 6, presentation: 8, vegetarian: false, traditional: 8 } },
    { name: "Gratin Dauphinois", attributes: { sweet: 2, spicy: 1, seafood: 0, rich: 8, presentation: 7, vegetarian: true, traditional: 8 } },
    { name: "Confit de Canard", attributes: { sweet: 2, spicy: 2, seafood: 0, rich: 9, presentation: 7, vegetarian: false, traditional: 9 } },
    { name: "Piperade", attributes: { sweet: 4, spicy: 5, seafood: 0, rich: 4, presentation: 7, vegetarian: true, traditional: 8 } },
    { name: "Hachis Parmentier", attributes: { sweet: 2, spicy: 2, seafood: 0, rich: 7, presentation: 6, vegetarian: false, traditional: 8 } },
    { name: "Croque Monsieur", attributes: { sweet: 2, spicy: 1, seafood: 0, rich: 6, presentation: 5, vegetarian: false, traditional: 7 } },
    { name: "Tartiflette", attributes: { sweet: 2, spicy: 2, seafood: 0, rich: 8, presentation: 6, vegetarian: false, traditional: 8 } },
    { name: "Pissaladière", attributes: { sweet: 3, spicy: 2, seafood: 2, rich: 5, presentation: 7, vegetarian: false, traditional: 8 } },
    { name: "Jambon-Beurre", attributes: { sweet: 1, spicy: 1, seafood: 0, rich: 5, presentation: 4, vegetarian: false, traditional: 7 } },
    { name: "Gougères", attributes: { sweet: 2, spicy: 1, seafood: 0, rich: 6, presentation: 7, vegetarian: true, traditional: 7 } },
    { name: "Pâté en Croûte", attributes: { sweet: 2, spicy: 2, seafood: 0, rich: 8, presentation: 8, vegetarian: false, traditional: 9 } },
    { name: "Flamiche", attributes: { sweet: 2, spicy: 1, seafood: 0, rich: 6, presentation: 6, vegetarian: true, traditional: 8 } },
    { name: "Andouillette", attributes: { sweet: 1, spicy: 3, seafood: 0, rich: 7, presentation: 5, vegetarian: false, traditional: 9 } }
];

const dessertOptions = [
    { name: "Crème Brûlée", attributes: { sweet: 9, rich: 9, texture: ["Creamy"], presentation: 8, traditional: 9 } },
    { name: "Éclair", attributes: { sweet: 8, rich: 7, texture: ["Creamy"], presentation: 9, traditional: 8 } },
    { name: "Madeleines", attributes: { sweet: 7, rich: 6, texture: ["Soft"], presentation: 7, traditional: 9 } },
    { name: "Tarte Tatin", attributes: { sweet: 9, rich: 8, texture: ["Soft"], presentation: 8, traditional: 8 } },
    { name: "Macarons", attributes: { sweet: 9, rich: 5, texture: ["Crunchy"], presentation: 10, traditional: 7 } },
    { name: "Profiteroles", attributes: { sweet: 8, rich: 7, texture: ["Creamy"], presentation: 8, traditional: 8 } },
    { name: "Mille-Feuille", attributes: { sweet: 8, rich: 7, texture: ["Crunchy", "Creamy"], presentation: 9, traditional: 9 } },
    { name: "Choux à la Crème", attributes: { sweet: 8, rich: 7, texture: ["Creamy"], presentation: 8, traditional: 8 } },
    { name: "Gâteau au Chocolat", attributes: { sweet: 9, rich: 9, texture: ["Soft"], presentation: 7, traditional: 7 } },
    { name: "Paris-Brest", attributes: { sweet: 8, rich: 8, texture: ["Creamy"], presentation: 9, traditional: 9 } },
    { name: "Gâteau Basque", attributes: { sweet: 7, rich: 6, texture: ["Soft"], presentation: 7, traditional: 10 } },
    { name: "Flognarde", attributes: { sweet: 7, rich: 5, texture: ["Soft"], presentation: 7, traditional: 9 } },
    { name: "Galette des Rois", attributes: { sweet: 8, rich: 8, texture: ["Soft"], presentation: 8, traditional: 10 } },
    { name: "Baba au Rhum", attributes: { sweet: 8, rich: 8, texture: ["Soft"], presentation: 7, traditional: 9 } },
    { name: "Soufflé au Chocolat", attributes: { sweet: 9, rich: 9, texture: ["Soft"], presentation: 8, traditional: 8 } },
    { name: "Crêpes Suzette", attributes: { sweet: 9, rich: 6, texture: ["Soft"], presentation: 9, traditional: 8 } },
    { name: "Îles Flottantes", attributes: { sweet: 8, rich: 5, texture: ["Creamy", "Soft"], presentation: 8, traditional: 9 } },
    { name: "Tarte au Citron", attributes: { sweet: 7, rich: 6, texture: ["Creamy"], presentation: 8, traditional: 8 } },
    { name: "Clafoutis", attributes: { sweet: 7, rich: 5, texture: ["Soft"], presentation: 6, traditional: 9 } },
    { name: "Canelés", attributes: { sweet: 8, rich: 7, texture: ["Crunchy", "Soft"], presentation: 7, traditional: 9 } },
    { name: "Pain Perdu", attributes: { sweet: 8, rich: 7, texture: ["Soft"], presentation: 6, traditional: 8 } },
    { name: "Kouign-Amann", attributes: { sweet: 9, rich: 9, texture: ["Crunchy", "Soft"], presentation: 7, traditional: 10 } },
    { name: "Religieuse", attributes: { sweet: 8, rich: 8, texture: ["Creamy"], presentation: 9, traditional: 8 } },
    { name: "Far Breton", attributes: { sweet: 7, rich: 5, texture: ["Soft"], presentation: 6, traditional: 10 } },
    { name: "Financier", attributes: { sweet: 7, rich: 7, texture: ["Soft"], presentation: 7, traditional: 8 } },
    { name: "Tarte aux Fraises", attributes: { sweet: 8, rich: 6, texture: ["Soft"], presentation: 9, traditional: 7 } },
    { name: "Crème Caramel", attributes: { sweet: 8, rich: 7, texture: ["Creamy"], presentation: 7, traditional: 8 } },
    { name: "Pithiviers", attributes: { sweet: 7, rich: 8, texture: ["Crunchy"], presentation: 8, traditional: 9 } },
    { name: "Riz au Lait", attributes: { sweet: 6, rich: 5, texture: ["Creamy"], presentation: 5, traditional: 9 } },
    { name: "Palmier", attributes: { sweet: 7, rich: 6, texture: ["Crunchy"], presentation: 6, traditional: 8 } }
];

const questions = [
    { text: "How much do you like sweet foods?", type: "range", min: 0, max: 10, step: 1 },
    { text: "How much do you like spicy foods?", type: "range", min: 0, max: 10, step: 1 },
    { text: "Do you like seafood?", type: "checkbox" },
    { text: "How much do you like rich foods?", type: "range", min: 0, max: 10, step: 1 },
    { text: "How important is food presentation to you?", type: "range", min: 0, max: 10, step: 1 },
    { text: "Are you a vegetarian?", type: "checkbox" },
    { text: "How do you feel about creamy textures?", type: "range", min: 0, max: 10, step: 1 },
    { text: "How do you feel about crunchy textures?", type: "range", min: 0, max: 10, step: 1 },
    { text: "Do you prefer soft textures?", type: "range", min: 0, max: 10, step: 1 },
    { text: "Do you enjoy fruits in your desserts?", type: "checkbox" },
    { text: "How do you feel about chocolate flavors?", type: "range", min: 0, max: 10, step: 1 },
    { text: "How much do you like nut flavors?", type: "range", min: 0, max: 10, step: 1 },
    { text: "Are you open to trying unusual combinations?", type: "checkbox" },
    { text: "How do you feel about traditional versus modern desserts?", type: "range", min: 0, max: 10, step: 1, labels: ["Traditional", "Modern"] },
    { text: "How important is the origin of ingredients to you?", type: "range", min: 0, max: 10, step: 1 }
];

let currentQuestionIndex = 0;
const userPreferences = {};

function renderQuestion() {
    const questionContainer = document.getElementById("questions-container");
    const inputContainer = document.getElementById("input-container");
    const question = questions[currentQuestionIndex];
    
    if (!questionContainer || !inputContainer) {
        console.error("Required DOM elements not found");
        return;
    }
    
    questionContainer.innerHTML = `<p>${question.text}</p>`;
    inputContainer.innerHTML = '';

    let input;
    if (question.type === "range") {
        input = document.createElement("input");
        input.type = "range";
        input.min = question.min;
        input.max = question.max;
        input.step = question.step;
        input.value = (question.max - question.min) / 2; // Set default to middle value
        input.oninput = (e) => {
            const valueDisplay = document.getElementById("value-display");
            if (valueDisplay) {
                valueDisplay.innerText = e.target.value;
            }
        };

        if (question.labels) {
            const labels = document.createElement("div");
            labels.className = "range-labels";
            labels.innerHTML = `<span>${question.labels[0]}</span><span>${question.labels[1]}</span>`;
            inputContainer.appendChild(labels);
        }
    } else if (question.type === "checkbox") {
        input = document.createElement("input");
        input.type = "checkbox";
        const label = document.createElement("label");
        label.appendChild(input);
        label.appendChild(document.createTextNode("Yes"));
        inputContainer.appendChild(label);
    }

    input.id = `question-${currentQuestionIndex}`;
    inputContainer.insertBefore(input, inputContainer.firstChild);

    const valueDisplay = document.getElementById("value-display");
    if (valueDisplay) {
        valueDisplay.innerText = input.type === "range" ? input.value : "";
    }
    
    updateNextButtonState();
}

function nextQuestion() {
    const question = questions[currentQuestionIndex];
    const answerElement = document.getElementById(`question-${currentQuestionIndex}`);

    if (!answerElement) {
        console.error("Answer element not found");
        return;
    }

    let answer;
    if (question.type === "range") {
        answer = parseInt(answerElement.value);
    } else if (question.type === "checkbox") {
        answer = answerElement.checked;
    }

    userPreferences[question.text] = answer;

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
        updateProgress();
    } else {
        showResults();
    }
}

function updateProgress() {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
        progressBar.value = ((currentQuestionIndex + 1) / questions.length) * 100;
    }
}

function updateNextButtonState() {
    const nextButton = document.getElementById("next-btn");
    if (nextButton) {
        nextButton.innerText = currentQuestionIndex === questions.length - 1 ? "Show Results" : "Next";
    }
}

function calculateMatchScore(optionAttributes, preferences) {
    let score = 0;
    let maxScore = 0;
    let matchedAttributes = 0;
    let totalAttributes = 0;

    for (const [key, value] of Object.entries(optionAttributes)) {
        totalAttributes++;
        const preferenceKey = Object.keys(preferences).find(k => k.toLowerCase().includes(key.toLowerCase()));
        const preference = preferences[preferenceKey];

        if (preference !== undefined) {
            maxScore += 10;
            matchedAttributes++;

            if (typeof value === 'boolean') {
                score += value === preference ? 10 : 0;
            } else if (Array.isArray(value)) {
                // Handle texture preferences
                const textureScore = value.reduce((sum, texture) => {
                    const texturePreference = preferences[`How do you feel about ${texture.toLowerCase()} textures?`];
                    return sum + (texturePreference !== undefined ? texturePreference : 5);
                }, 0) / value.length;
                score += textureScore;
            } else {
                // For numeric values, calculate the similarity
                const similarity = 10 - Math.abs(value - preference);
                score += similarity;
            }
        }
    }

    // Handle special cases
    if (preferences["Are you a vegetarian?"] === true && optionAttributes.vegetarian === false) {
        score = 0;
        maxScore = 1; // Avoid division by zero
    }

    if (preferences["Do you like seafood?"] === false && optionAttributes.seafood > 0) {
        score -= optionAttributes.seafood * 2; // Penalize seafood dishes if user doesn't like seafood
    }

    // Calculate confidence based on the number of matched attributes
    const confidence = (matchedAttributes / totalAttributes) * 100;

    // Ensure the score is between 0 and 100
    const normalizedScore = Math.max(0, Math.min(100, (score / maxScore) * 100));

    return { score: normalizedScore, confidence };
}

function findBestMatches(options, preferences, count = 3) {
    return options.map(option => {
        const { score, confidence } = calculateMatchScore(option.attributes, preferences);
        return { ...option, score, confidence };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

function showResults() {
    const foodMatches = findBestMatches(foodOptions, userPreferences);
    const dessertMatches = findBestMatches(dessertOptions, userPreferences);

    const resultContainer = document.getElementById("result-container");
    if (!resultContainer) {
        console.error("Result container not found");
        return;
    }

    resultContainer.innerHTML = `
        <h2>Your Personalized Recommendations</h2>
        <div class="recommendations-container">
            <div class="recommendation-section">
                <h3>Food Recommendations</h3>
                ${generateRecommendationCards(foodMatches, "food")}
            </div>
            <div class="recommendation-section">
                <h3>Dessert Recommendations</h3>
                ${generateRecommendationCards(dessertMatches, "dessert")}
            </div>
        </div>
        ${generateOverallResults(foodMatches, dessertMatches)}
    `;

    resultContainer.classList.remove("hidden");
    hideQuestionElements();
    showRestartButton();
}

function generateRecommendationCards(matches, type) {
    return matches.map((match, index) => `
        <div class="recommendation-card">
            <h4>${index + 1}. ${match.name}</h4>
            <div class="match-details">
                <div class="match-score">
                    <span>Match Score:</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${match.score}%;"></div>
                    </div>
                    <span>${match.score.toFixed(2)}%</span>
                </div>
                <div class="confidence">
                    <span>Confidence:</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${match.confidence}%;"></div>
                    </div>
                    <span>${match.confidence.toFixed(2)}%</span>
                </div>
            </div>
            <div class="reasoning">
                <h5>Why we recommended this:</h5>
                <ul>
                    ${generateReasoningList(match, type)}
                </ul>
            </div>
        </div>
    `).join('');
}

function generateReasoningList(match, type) {
    const relevantPreferences = Object.entries(userPreferences).filter(([key, value]) => 
        match.attributes.hasOwnProperty(key.toLowerCase().split(" ").pop()) || 
        (key.includes("texture") && match.attributes.texture)
    );

    return relevantPreferences.map(([key, value]) => {
        const attributeKey = key.toLowerCase().split(" ").pop();
        const attributeValue = match.attributes[attributeKey];
        
        if (attributeValue !== undefined) {
            if (typeof attributeValue === 'boolean') {
                return `<li>${key}: ${value ? "Yes" : "No"}</li>`;
            } else if (Array.isArray(attributeValue)) {
                return `<li>${key}: ${attributeValue.join(", ")}</li>`;
            } else {
                return `<li>${key}: ${attributeValue}/10</li>`;
            }
        }
        return '';
    }).join('');
}

function generateOverallResults(foodMatches, dessertMatches) {
    const overallAccuracy = (foodMatches[0].score + dessertMatches[0].score) / 2;
    const overallConfidence = (foodMatches[0].confidence + dessertMatches[0].confidence) / 2;
    
    return `
        <div class="overall-results">
            <h3>Overall Results</h3>
            <div class="overall-score">
                <span>Match Accuracy:</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${overallAccuracy}%;"></div>
                </div>
                <span>${overallAccuracy.toFixed(2)}%</span>
            </div>
            <div class="overall-confidence">
                <span>Recommendation Confidence:</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${overallConfidence}%;"></div>
                </div>
                <span>${overallConfidence.toFixed(2)}%</span>
            </div>
        </div>
    `;
}

function hideQuestionElements() {
    const elementsToHide = [
        "questions-container",
        "input-container",
        "next-btn",
        "value-display"
    ];
    
    elementsToHide.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add("hidden");
    });
}

function showRestartButton() {
    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) restartBtn.classList.remove("hidden");
}

function restart() {
    currentQuestionIndex = 0;
    Object.keys(userPreferences).forEach(key => delete userPreferences[key]);
    renderQuestion();
    updateProgress();
    
    const resultContainer = document.getElementById("result-container");
    const questionsContainer = document.getElementById("questions-container");
    const inputContainer = document.getElementById("input-container");
    const nextBtn = document.getElementById("next-btn");
    const valueDisplay = document.getElementById("value-display");
    const restartBtn = document.getElementById("restart-btn");

    if (resultContainer) resultContainer.classList.add("hidden");
    if (questionsContainer) questionsContainer.classList.remove("hidden");
    if (inputContainer) inputContainer.classList.remove("hidden");
    if (nextBtn) nextBtn.classList.remove("hidden");
    if (valueDisplay) valueDisplay.classList.remove("hidden");
    if (restartBtn) restartBtn.classList.add("hidden");
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById("next-btn");
    const restartBtn = document.getElementById("restart-btn");

    if (nextBtn) {
        nextBtn.addEventListener("click", nextQuestion);
    } else {
        console.error("Next button not found");
    }

    if (restartBtn) {
        restartBtn.addEventListener("click", restart);
    } else {
        console.error("Restart button not found");
    }

    // Initialize the application
    renderQuestion();
    updateProgress();
});

// Error handling wrapper
function safelyExecute(fn, errorMessage) {
    try {
        fn();
    } catch (error) {
        console.error(`${errorMessage}: ${error.message}`);
        // You could also display an error message to the user here
    }
}
