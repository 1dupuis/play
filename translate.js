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
            },
            getRequestBody: (query, fromLang, toLang) => JSON.stringify({ translate: 'rapidapi' }),
            getRequestUrl: (query, fromLang, toLang) => `${apiEndpoints.primary.url}?from=${fromLang}&to=${toLang}&query=${encodeURIComponent(query)}`
        }
    },
    secondary: {
        url: 'https://microsoft-translator-text.p.rapidapi.com/languages?api-version=3.0',
        options: {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com'
            },
            getRequestUrl: () => apiEndpoints.secondary.url,
            getRequestBody: () => null
        }
    },
    tertiary: {
        url: 'https://simple-translate2.p.rapidapi.com/translate?source_lang=auto&target_lang=ja',
        options: {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'simple-translate2.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            getRequestBody: (query) => JSON.stringify({ sourceText: query }),
            getRequestUrl: () => apiEndpoints.tertiary.url
        }
    }
};

async function translateWithRetry(endpoint, query, fromLang, toLang, retries = 3) {
    const { options, getRequestUrl, getRequestBody } = endpoint;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const url = getRequestUrl ? getRequestUrl(query, fromLang, toLang) : undefined;
            const response = await fetch(url, {
                ...options,
                body: getRequestBody ? getRequestBody(query, fromLang, toLang) : undefined
            });

            if (response.ok) {
                return await response.text();
            } else {
                console.error(`Attempt ${attempt} failed: ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Attempt ${attempt} failed: ${error.message}`);
        }

        if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
        }
    }

    return null; // Return null if all retries fail
}

async function translateText(fromLang, toLang, query) {
    let result = await translateWithRetry(apiEndpoints.primary, query, fromLang, toLang);

    if (!result) {
        result = await translateWithRetry(apiEndpoints.secondary, query, fromLang, toLang);
    }

    if (!result) {
        result = await translateWithRetry(apiEndpoints.tertiary, query);
    }

    return result;
}

async function initializeDOMWithRetry(retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const translationForm = document.getElementById('translationForm');
            const sourceLanguageSelect = document.getElementById('sourceLanguage');
            const targetLanguageSelect = document.getElementById('targetLanguage');
            const textInput = document.getElementById('textInput');
            const resultContainer = document.getElementById('translatedText');

            if (translationForm && sourceLanguageSelect && targetLanguageSelect && textInput && resultContainer) {
                translationForm.addEventListener('submit', async (event) => {
                    event.preventDefault(); // Prevent form submission

                    const fromLang = sourceLanguageSelect.value;
                    const toLang = targetLanguageSelect.value;
                    const query = textInput.value;

                    const translatedText = await translateText(fromLang, toLang, query);

                    if (translatedText) {
                        resultContainer.textContent = translatedText;
                    } else {
                        resultContainer.textContent = 'Translation failed. Please try again later.';
                    }
                });
                console.log("DOM initialized successfully.");
                return;
            } else {
                throw new Error('One or more elements are missing from the DOM.');
            }
        } catch (error) {
            console.error(`DOM initialization attempt ${attempt} failed: ${error.message}`);
        }

        if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
        }
    }

    console.error('Failed to initialize DOM after multiple attempts.');
}

// Run the DOM initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDOMWithRetry();
});
