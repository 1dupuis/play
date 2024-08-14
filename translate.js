const MAX_RETRIES = 3; // Maximum number of retries
const RETRY_DELAY = 2000; // Delay between retries in milliseconds
const API_KEY = 'OnKRZVRuo23GtI7HjtViOl1I0FFtI1CH'; // Your API key
const MAX_TRANSLATIONS_PER_DAY = 5; // Maximum translations allowed per day

document.addEventListener('DOMContentLoaded', () => {
    updateButtonState();

    document.getElementById('translateButton').addEventListener('click', () => {
        const sourceText = document.getElementById('sourceText').value.trim();
        const targetLang = document.getElementById('languageSelect').value;

        if (!sourceText) {
            alert('Please enter text to translate.');
            return;
        }

        const translateButton = document.getElementById('translateButton');
        translateButton.disabled = true; // Disable button while processing

        // Clear previous translation or error messages
        const translatedTextElement = document.getElementById('translatedText');
        translatedTextElement.innerText = '';
        translatedTextElement.classList.remove('error');

        translateText(sourceText, targetLang, MAX_RETRIES, () => {
            // Re-enable the button after processing
            translateButton.disabled = false;
            updateButtonState();
        });
    });
});

function translateText(text, targetLang, retries, onComplete) {
    const url = `https://api.apilayer.com/language_translation/translate?target=${targetLang}`;
    const myHeaders = new Headers();
    myHeaders.append("apikey", API_KEY);

    const requestBody = {
        q: text
    };

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(requestBody),
        redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.translations && data.translations.length > 0) {
                const translatedText = data.translations[0].translation;
                document.getElementById('translatedText').innerText = translatedText;

                // Update translation quota
                updateTranslationQuota();
            } else {
                throw new Error('No translation data available');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (retries > 0) {
                console.log(`Retrying in ${RETRY_DELAY / 1000} seconds... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
                setTimeout(() => translateText(text, targetLang, retries - 1, onComplete), RETRY_DELAY);
            } else {
                displayError('Translation failed after multiple attempts. Please try again later.');
            }
        })
        .finally(() => {
            // Call the onComplete callback to re-enable the button
            if (onComplete) {
                onComplete();
            }
        });
}

function displayError(message) {
    const translatedTextElement = document.getElementById('translatedText');
    translatedTextElement.innerText = message;
    translatedTextElement.classList.add('error');
}

function checkTranslationQuota() {
    const today = new Date().toDateString();
    const quotaKey = 'translationQuota';
    const lastUpdateKey = 'lastUpdate';

    let quota = localStorage.getItem(quotaKey);
    let lastUpdate = localStorage.getItem(lastUpdateKey);

    if (lastUpdate !== today) {
        // Reset quota if a new day has started
        localStorage.setItem(quotaKey, MAX_TRANSLATIONS_PER_DAY);
        localStorage.setItem(lastUpdateKey, today);
        return MAX_TRANSLATIONS_PER_DAY;
    }

    return parseInt(quota, 10) || MAX_TRANSLATIONS_PER_DAY;
}

function updateTranslationQuota() {
    const quotaKey = 'translationQuota';
    let currentQuota = parseInt(localStorage.getItem(quotaKey), 10);

    if (currentQuota > 0) {
        localStorage.setItem(quotaKey, currentQuota - 1);
    }

    // Notify user if quota is reached
    if (currentQuota - 1 <= 0) {
        document.getElementById('translateButton').disabled = true;
        displayError('You have reached your daily translation limit.');
    }
}

function updateButtonState() {
    const remainingTranslations = checkTranslationQuota();
    const translateButton = document.getElementById('translateButton');
    if (remainingTranslations <= 0) {
        translateButton.disabled = true;
        displayError('You have reached your daily translation limit.');
    }
}
