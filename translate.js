// Primary translation API endpoint
const primaryApiUrl = 'https://free-google-translator.p.rapidapi.com/external-api/free-google-translator';
// Secondary translation API endpoint
const secondaryApiUrl = 'https://simple-translate2.p.rapidapi.com/translate?source_lang=auto&target_lang=ja';

async function translateText(fromLang, toLang, query) {
    const primaryUrl = `${primaryApiUrl}?from=${fromLang}&to=${toLang}&query=${encodeURIComponent(query)}`;
    const primaryOptions = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
            'x-rapidapi-host': 'free-google-translator.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            translate: 'rapidapi'
        })
    };

    // Retry mechanic for primary API
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const response = await fetch(primaryUrl, primaryOptions);
            if (!response.ok) throw new Error(`Primary API failed on attempt ${attempt}`);
            const result = await response.text();
            return result;
        } catch (error) {
            console.error(error);
            if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
        }
    }

    // If all retries of the primary API fail, fallback to the secondary API
    const secondaryOptions = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
            'x-rapidapi-host': 'simple-translate2.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sourceText: query
        })
    };

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const secondaryResponse = await fetch(secondaryApiUrl, secondaryOptions);
            if (!secondaryResponse.ok) throw new Error(`Secondary API failed on attempt ${attempt}`);
            const secondaryResult = await secondaryResponse.text();
            return secondaryResult;
        } catch (secondaryError) {
            console.error(secondaryError);
            if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
        }
    }

    return null; // Return null if all retries fail
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
