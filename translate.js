// Primary, secondary, and tertiary translation API endpoints
const apiEndpoints = {
    primary: {
        url: 'https://free-google-translator.p.rapidapi.com/external-api/free-google-translator',
        options: {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'free-google-translator.p.rapidapi.com',
                'Content-Type': 'application/json'
            }
        },
        getRequestUrl: (fromLang, toLang, query) => `${apiEndpoints.primary.url}?from=${fromLang}&to=${toLang}&query=${encodeURIComponent(query)}`,
        getRequestBody: () => JSON.stringify({ translate: 'rapidapi' })
    },
    secondary: {
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        options: {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                'Content-Type': 'application/json'
            }
        },
        getRequestUrl: (fromLang, toLang) => `${apiEndpoints.secondary.url}?api-version=3.0&from=${fromLang}&to=${toLang}`,
        getRequestBody: (query) => JSON.stringify([{ Text: query }])
    },
    tertiary: {
        url: 'https://simple-translate2.p.rapidapi.com/translate',
        options: {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'simple-translate2.p.rapidapi.com',
                'Content-Type': 'application/json'
            }
        },
        getRequestUrl: (fromLang, toLang) => `${apiEndpoints.tertiary.url}?source_lang=${fromLang}&target_lang=${toLang}`,
        getRequestBody: (query) => JSON.stringify({ sourceText: query })
    }
};

// Function to extract translation text from the API response
function extractTranslation(response, api) {
    try {
        switch (api) {
            case 'primary':
                return response && response.translation ? response.translation : null;
            case 'secondary':
                return response && response[0] && response[0].translations && response[0].translations[0].text
                    ? response[0].translations[0].text
                    : null;
            case 'tertiary':
                return response && response.translation ? response.translation : null;
            default:
                return null;
        }
    } catch (error) {
        console.error('Error extracting translation:', error);
        return null;
    }
}

// Function to perform translation with retry mechanism
async function translateWithRetry(endpoint, query, fromLang, toLang, retries = 3) {
    const { options, getRequestUrl, getRequestBody } = endpoint;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const url = getRequestUrl(fromLang, toLang, query);
            const body = getRequestBody(query);

            const response = await fetch(url, {
                ...options,
                body: body
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const translation = extractTranslation(data, endpoint === apiEndpoints.primary ? 'primary' :
                                                         endpoint === apiEndpoints.secondary ? 'secondary' :
                                                         'tertiary');
            
            if (translation) {
                return translation;
            } else {
                console.error(`Attempt ${attempt}: Failed to extract translation`);
            }
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);
        }

        if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
        }
    }

    return null; // Return null if all retries fail
}

// Function to handle text translation
async function translateText(fromLang, toLang, query) {
    let result = await translateWithRetry(apiEndpoints.primary, query, fromLang, toLang);

    if (!result) {
        result = await translateWithRetry(apiEndpoints.secondary, query, fromLang, toLang);
    }

    if (!result) {
        result = await translateWithRetry(apiEndpoints.tertiary, query, fromLang, toLang);
    }

    return result;
}

// Function to handle text-to-speech
async function textToSpeech(text) {
    const url = 'https://open-ai-text-to-speech1.p.rapidapi.com/';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
            'x-rapidapi-host': 'open-ai-text-to-speech1.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'tts-1',
            input: text,
            voice: 'alloy'
        })
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        await audio.play();
    } catch (error) {
        console.error('Error in text-to-speech:', error);
        alert('Failed to generate speech. Please try again.');
    }
}

// Function to initialize DOM elements and add event listeners
function initializeDOM() {
    const translationForm = document.getElementById('translationForm');
    const sourceLanguageSelect = document.getElementById('sourceLanguage');
    const targetLanguageSelect = document.getElementById('targetLanguage');
    const textInput = document.getElementById('textInput');
    const resultContainer = document.getElementById('translatedText');
    const voiceButton = document.getElementById('voiceButton');

    if (!translationForm || !sourceLanguageSelect || !targetLanguageSelect || !textInput || !resultContainer || !voiceButton) {
        throw new Error('One or more elements are missing from the DOM.');
    }

    translationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        voiceButton.style.display = 'none';
        resultContainer.textContent = 'Translating...';

        const fromLang = sourceLanguageSelect.value;
        const toLang = targetLanguageSelect.value;
        const query = textInput.value;

        const translatedText = await translateText(fromLang, toLang, query);

        if (translatedText) {
            resultContainer.textContent = translatedText;
            voiceButton.style.display = 'inline-block';
        } else {
            resultContainer.textContent = 'Translation failed. Please try again later.';
        }
    });

    voiceButton.addEventListener('click', () => {
        const textToSpeak = resultContainer.textContent;
        if (textToSpeak && textToSpeak !== 'Translating...' && textToSpeak !== 'Translation failed. Please try again later.') {
            voiceButton.disabled = true;
            voiceButton.textContent = '🔊 Playing...';
            textToSpeech(textToSpeak).finally(() => {
                voiceButton.disabled = false;
                voiceButton.textContent = '🔊';
            });
        }
    });
}

// Run the DOM initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeDOM();
        console.log("DOM initialized successfully.");
    } catch (error) {
        console.error('Failed to initialize DOM:', error);
    }
});
