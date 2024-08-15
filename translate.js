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
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&profanityAction=NoAction&textType=plain',
        options: {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                'Content-Type': 'application/json'
            }
        },
        getRequestUrl: () => apiEndpoints.secondary.url,
        getRequestBody: (query) => JSON.stringify([{ Text: query }])
    },
    tertiary: {
        url: 'https://simple-translate2.p.rapidapi.com/translate?source_lang=auto&target_lang=ja',
        options: {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'simple-translate2.p.rapidapi.com',
                'Content-Type': 'application/json'
            }
        },
        getRequestUrl: () => apiEndpoints.tertiary.url,
        getRequestBody: (query) => JSON.stringify({ sourceText: query })
    }
};

// Function to extract translation text from the API response
function extractTranslation(response, api) {
    try {
        switch (api) {
            case 'primary':
                // Adjust extraction based on the actual response structure
                return response && response.translation ? response.translation : null;
            case 'secondary':
                // Microsoft API response usually returns an array
                return response && response[0] && response[0].Text ? response[0].Text : null;
            case 'tertiary':
                // Simple Translate API response structure
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
async function translateWithRetry(endpoint, query, fromLang = '', toLang = '', retries = 3) {
    const { options, getRequestUrl, getRequestBody } = endpoint;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const url = getRequestUrl ? getRequestUrl(fromLang, toLang, query) : undefined;
            const body = getRequestBody ? getRequestBody(query) : undefined;

            if (!url) {
                throw new Error('URL is undefined.');
            }

            const response = await fetch(url, {
                ...options,
                body: body
            });

            if (response.ok) {
                const data = await response.json();
                return extractTranslation(data, endpoint === apiEndpoints.primary ? 'primary' :
                                           endpoint === apiEndpoints.secondary ? 'secondary' :
                                           'tertiary') || JSON.stringify(data); // Show entire response if extraction fails
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

// Function to handle text translation
async function translateText(fromLang, toLang, query) {
    let result = await translateWithRetry(apiEndpoints.primary, query, fromLang, toLang);

    if (!result) {
        result = await translateWithRetry(apiEndpoints.secondary, query);
    }

    if (!result) {
        result = await translateWithRetry(apiEndpoints.tertiary, query);
    }

    return result;
}

// Function to initialize DOM elements and add event listeners with retry mechanism
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
