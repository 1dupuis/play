const MAX_RETRIES = 3; // Maximum number of retries
const RETRY_DELAY = 2000; // Delay between retries in milliseconds
const API_KEY = 'OnKRZVRuo23GtI7HjtViOl1I0FFtI1CH'; // Your API key

document.getElementById('translateButton').addEventListener('click', () => {
    const sourceText = document.getElementById('sourceText').value.trim();
    const targetLang = document.getElementById('languageSelect').value;

    if (!sourceText) {
        alert('Please enter text to translate.');
        return;
    }

    // Clear any previous translation or error messages
    document.getElementById('translatedText').innerText = '';
    document.getElementById('translatedText').classList.remove('error');

    translateText(sourceText, targetLang, MAX_RETRIES);
});

function translateText(text, targetLang, retries) {
    const url = `https://api.apilayer.com/language_translation/translate?target=${targetLang}`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}` // Use the API key for authorization
        },
        body: JSON.stringify({
            q: text
        })
    })
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
        } else {
            throw new Error('No translation data available');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        if (retries > 0) {
            console.log(`Retrying in ${RETRY_DELAY / 1000} seconds... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => translateText(text, targetLang, retries - 1), RETRY_DELAY);
        } else {
            displayError('Translation failed after multiple attempts. Please try again later.');
        }
    });
}

function displayError(message) {
    const translatedTextElement = document.getElementById('translatedText');
    translatedTextElement.innerText = message;
    translatedTextElement.classList.add('error');
}
