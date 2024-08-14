document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('translationForm');
    const textInput = document.getElementById('textInput');
    const sourceLanguage = document.getElementById('sourceLanguage');
    const targetLanguage = document.getElementById('targetLanguage');
    const translatedText = document.getElementById('translatedText');
    const button = form.querySelector('button');

    const API_KEYS = [
        "OnKRZVRuo23GtI7HjtViOl1I0FFtI1CH", // Primary API key
        "IafN7z6mrnWF2FzLq3sq44dBsEkILhKz", // Secondary API key
        "F30h11MrZt3c9j7r0MClhbU7x6bj6gGc"  // Tertiary API key
    ];

    const TRANSLATION_URL = "https://api.apilayer.com/language_translation/translate";
    const MAX_TRANSLATIONS_PER_DAY = 15;
    const QUOTA_KEY = 'translationQuota';

    const getQuotaData = () => {
        return JSON.parse(localStorage.getItem(QUOTA_KEY)) || { count: 0, lastReset: Date.now() };
    };

    const resetQuotaIfNeeded = () => {
        const quotaData = getQuotaData();
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (now - quotaData.lastReset >= oneDay) {
            quotaData.count = 0;
            quotaData.lastReset = now;
            localStorage.setItem(QUOTA_KEY, JSON.stringify(quotaData));
        }
        return quotaData;
    };

    const checkQuota = () => {
        const quotaData = resetQuotaIfNeeded();
        return quotaData.count < MAX_TRANSLATIONS_PER_DAY;
    };

    const incrementQuota = () => {
        const quotaData = getQuotaData();
        quotaData.count += 1;
        localStorage.setItem(QUOTA_KEY, JSON.stringify(quotaData));
    };

    const translateText = async (inputText, sourceLang, targetLang) => {
        let translation = '';
        let lastError = null;

        for (const apiKey of API_KEYS) {
            try {
                const myHeaders = new Headers();
                myHeaders.append("apikey", apiKey);

                const raw = JSON.stringify({
                    q: inputText,
                    source: sourceLang,
                    target: targetLang
                });

                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                const response = await fetch(`${TRANSLATION_URL}?target=${targetLang}`, requestOptions);

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                translation = data.translations[0].translation || 'No translation available';
                return translation;

            } catch (error) {
                console.error(`Error with API key ${apiKey}:`, error);
                lastError = error;
            }
        }

        return `Error: Unable to fetch translation. Last error: ${lastError.message}`;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!checkQuota()) {
            translatedText.textContent = 'Daily quota exceeded. Please try again tomorrow.';
            return;
        }

        const inputText = textInput.value.trim();
        if (!inputText) {
            translatedText.textContent = 'Please enter text to translate.';
            return;
        }

        button.disabled = true;
        button.textContent = 'Translating...';

        try {
            const resultText = await translateText(inputText, sourceLanguage.value, targetLanguage.value);
            translatedText.textContent = resultText;
            incrementQuota();
        } catch (error) {
            translatedText.textContent = 'Error: ' + error.message;
        } finally {
            button.disabled = false;
            button.textContent = 'Translate';
        }
    });
});
