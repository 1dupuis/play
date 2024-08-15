// Translation API endpoints
const translationEndpoints = {
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
        getRequestUrl: (fromLang, toLang, query) => `${translationEndpoints.primary.url}?from=${fromLang}&to=${toLang}&query=${encodeURIComponent(query)}`,
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
        getRequestUrl: (fromLang, toLang) => `${translationEndpoints.secondary.url}?api-version=3.0&from=${fromLang}&to=${toLang}`,
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
        getRequestUrl: (fromLang, toLang) => `${translationEndpoints.tertiary.url}?source_lang=${fromLang}&target_lang=${toLang}`,
        getRequestBody: (query) => JSON.stringify({ sourceText: query })
    }
};

// Text-to-speech API endpoints
const ttsEndpoints = {
    primary: {
        url: 'https://open-ai-text-to-speech1.p.rapidapi.com/',
        options: {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'open-ai-text-to-speech1.p.rapidapi.com',
                'Content-Type': 'application/json'
            }
        },
        getRequestBody: (text) => JSON.stringify({
            model: 'tts-1',
            input: text,
            voice: 'alloy'
        })
    },
    secondary: {
        url: 'https://natural-text-to-speech-converter-at-lowest-price.p.rapidapi.com/backend/ttsNewDemo',
        options: {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'natural-text-to-speech-converter-at-lowest-price.p.rapidapi.com',
                'Content-Type': 'application/json'
            }
        },
        getRequestBody: (text) => JSON.stringify({
            ttsService: 'polly',
            audioKey: 'ff63037e-6994-4c50-9861-3e162ee56468',
            storageService: 's3',
            text: `<speak><p>${text}</p></speak>`,
            voice: {
                value: 'en-US_Kevin',
                lang: 'en-US'
            },
            audioOutput: {
                fileFormat: 'mp3',
                sampleRate: 24000
            }
        })
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
            const translation = extractTranslation(data, endpoint === translationEndpoints.primary ? 'primary' :
                                                         endpoint === translationEndpoints.secondary ? 'secondary' :
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
    let result = await translateWithRetry(translationEndpoints.primary, query, fromLang, toLang);

    if (!result) {
        result = await translateWithRetry(translationEndpoints.secondary, query, fromLang, toLang);
    }

    if (!result) {
        result = await translateWithRetry(translationEndpoints.tertiary, query, fromLang, toLang);
    }

    return result;
}

// Function to perform text-to-speech with retry mechanism
async function ttsWithRetry(endpoint, text, retries = 3) {
    const { url, options, getRequestBody } = endpoint;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                ...options,
                body: getRequestBody(text)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle different response types for each API
            if (endpoint === ttsEndpoints.primary) {
                const audioBlob = await response.blob();
                return URL.createObjectURL(audioBlob);
            } else {
                const data = await response.json();
                if (data.audioUrl) {
                    return data.audioUrl;
                } else {
                    throw new Error('Audio URL not found in response');
                }
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

// Function to handle text-to-speech
async function textToSpeech(text) {
    let audioUrl = await ttsWithRetry(ttsEndpoints.primary, text);

    if (!audioUrl) {
        audioUrl = await ttsWithRetry(ttsEndpoints.secondary, text);
    }

    if (audioUrl) {
        const audio = new Audio(audioUrl);
        await audio.play();
    } else {
        throw new Error('Failed to generate speech from both APIs');
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

        try {
            const translatedText = await translateText(fromLang, toLang, query);

            if (translatedText) {
                resultContainer.textContent = translatedText;
                voiceButton.style.display = 'inline-block';
            } else {
                throw new Error('Translation failed');
            }
        } catch (error) {
            console.error('Translation error:', error);
            resultContainer.textContent = 'Translation failed. Please try again later.';
        }
    });

    voiceButton.addEventListener('click', async () => {
        const textToSpeak = resultContainer.textContent;
        if (textToSpeak && textToSpeak !== 'Translating...' && textToSpeak !== 'Translation failed. Please try again later.') {
            voiceButton.disabled = true;
            voiceButton.textContent = '🔊 Playing...';
            try {
                await textToSpeech(textToSpeak);
            } catch (error) {
                console.error('Text-to-speech failed:', error);
                alert('Failed to generate speech. Please try again.');
            } finally {
                voiceButton.disabled = false;
                voiceButton.textContent = '🔊';
            }
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
