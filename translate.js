// Primary and secondary translation API endpoints
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
        url: 'https://simple-translate2.p.rapidapi.com/translate?source_lang=auto&target_lang=ja',
        options: {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'simple-translate2.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            getRequestBody: (query) => JSON.stringify({ sourceText: query }),
            getRequestUrl: () => apiEndpoints.secondary.url
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
        result = await translateWithRetry(apiEndpoints.secondary, query);
    }

    return result;
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('translateButton').addEventListener('click', async () => {
        const fromLang = document.getElementById('fromLang').value;
        const toLang = document.getElementById('toLang').value;
        const query = document.getElementById('queryText').value;

        const translatedText = await translateText(fromLang, toLang, query);

        if (translatedText) {
            document.getElementById('result').textContent = translatedText;
        } else {
            document.getElementById('result').textContent = 'Translation failed. Please try again later.';
        }
    });
});
