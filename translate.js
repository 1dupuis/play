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
            const response = await fetch(getRequestUrl(query, fromLang, toLang), {
                ...options,
                body: getRequestBody(query, fromLang, toLang)
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
            const translateButton = document.getElementById('translateButton');
            const fromLangInput = document.getElementById('fromLang');
            const toLangInput = document.getElementById('toLang');
            const queryInput = document.getElementById('queryText');
            const resultElement = document.getElementById('result');

            if (translateButton && fromLangInput && toLangInput && queryInput && resultElement) {
                translateButton.addEventListener('click', async () => {
                    const fromLang = fromLangInput.value;
                    const toLang = toLangInput.value;
                    const query = queryInput.value;

                    const translatedText = await translateText(fromLang, toLang, query);

                    if (translatedText) {
                        resultElement.textContent = translatedText;
                    } else {
                        resultElement.textContent = 'Translation failed. Please try again later.';
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
