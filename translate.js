const MAX_RETRIES = 3; // Maximum number of retries
const RETRY_DELAY = 2000; // Delay between retries in milliseconds
const OLD_API_KEY = 'OnKRZVRuo23GtI7HjtViOl1I0FFtI1CH'; // Old API key
const OLD_API_URL = 'https://api.apilayer.com/language_translation/translate?target='; // Old API URL
const LIBRE_TRANSLATE_URL = 'https://libretranslate.com/translate'; // New API URL
const MAX_TRANSLATIONS_PER_DAY = 15; // Maximum translations allowed per day

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

async function translateText(text, targetLang, retries, onComplete) {
    try {
        // Attempt to use LibreTranslate API
        const response = await fetch(LIBRE_TRANSLATE_URL, {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: 'auto',
                target: targetLang,
                format: 'text',
                alternatives: 3,
                api_key: '' // LibreTranslate does not require an API key
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error(`LibreTranslate HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (data.translatedText) {
            document.getElementById('translatedText').innerText = data.translatedText;
            updateTranslationQuota();
        } else {
            throw new Error('No translation data available from LibreTranslate');
        }
    } catch (error) {
        console.error('LibreTranslate error:', error);
        if (retries > 0) {
            console.log(`Retrying LibreTranslate in ${RETRY_DELAY / 1000} seconds... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => translateText(text, targetLang, retries - 1, onComplete), RETRY_DELAY);
        } else {
            // Fallback to old API
            console.log('Using old API due to failure of LibreTranslate');
            translateTextWithOldAPI(text, targetLang, retries, onComplete);
        }
    } finally {
        // Call the onComplete callback to re-enable the button
        if (onComplete) {
            onComplete();
        }
    }
}

async function translateTextWithOldAPI(text, targetLang, retries, onComplete) {
    const url = `${OLD_API_URL}${targetLang}`;
    const myHeaders = new Headers();
    myHeaders.append("apikey", OLD_API_KEY);

    const requestBody = {
        q: text
    };

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(requestBody),
        redirect: 'follow'
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error(`Old API HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (data.translations && data.translations.length > 0) {
            const translatedText = data.translations[0].translation;
            document.getElementById('translatedText').innerText = translatedText;
            updateTranslationQuota();
        } else {
            throw new Error('No translation data available from old API');
        }
    } catch (error) {
        console.error('Old API error:', error);
        if (retries > 0) {
            console.log(`Retrying old API in ${RETRY_DELAY / 1000} seconds... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => translateTextWithOldAPI(text, targetLang, retries - 1, onComplete), RETRY_DELAY);
        } else {
            displayError('Translation failed after multiple attempts. Please try again later.');
        }
    } finally {
        // Call the onComplete callback to re-enable the button
        if (onComplete) {
            onComplete();
        }
    }
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
