document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('translationForm');
    const textInput = document.getElementById('textInput');
    const sourceLanguage = document.getElementById('sourceLanguage');
    const targetLanguage = document.getElementById('targetLanguage');
    const translatedText = document.getElementById('translatedText');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Disable the button while processing
        const button = form.querySelector('button');
        button.disabled = true;
        button.textContent = 'Translating...';

        const inputText = textInput.value;
        const sourceLang = sourceLanguage.value;
        const targetLang = targetLanguage.value;

        try {
            let response;
            try {
                // Try to fetch from LibreTranslate API
                response = await fetch("https://libretranslate.com/translate", {
                    method: "POST",
                    body: JSON.stringify({
                        q: inputText,
                        source: sourceLang,
                        target: targetLang,
                        format: "text",
                        alternatives: 3,
                        api_key: ""
                    }),
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) throw new Error('LibreTranslate API request failed');

                const data = await response.json();
                translatedText.textContent = data.translatedText || 'No translation available';
            } catch (error) {
                console.error('LibreTranslate failed, trying fallback API...', error);

                // Fallback to Apilayer API
                response = await fetch("https://api.apilayer.com/language_translation/translate?target=" + targetLang, {
                    method: 'POST',
                    body: JSON.stringify({ q: inputText, source: sourceLang }),
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": "OnKRZVRuo23GtI7HjtViOl1I0FFtI1CH"
                    }
                });

                if (!response.ok) throw new Error('Fallback API request failed');

                const data = await response.json();
                translatedText.textContent = data.translations[0].translation || 'No translation available';
            }
        } catch (error) {
            translatedText.textContent = 'Error: ' + error.message;
        } finally {
            // Re-enable the button and reset text
            button.disabled = false;
            button.textContent = 'Translate';
        }
    });

    // Check and manage daily translation quota
    const MAX_TRANSLATIONS_PER_DAY = 15;
    const quotaKey = 'translationQuota';
    const lastResetKey = 'lastQuotaReset';
    
    const getQuotaData = () => {
        const data = JSON.parse(localStorage.getItem(quotaKey)) || { count: 0, lastReset: Date.now() };
        return data;
    };

    const resetQuotaIfNeeded = () => {
        const quotaData = getQuotaData();
        const now = Date.now();

        // Reset quota if a day has passed
        if (now - quotaData.lastReset >= 24 * 60 * 60 * 1000) {
            quotaData.count = 0;
            quotaData.lastReset = now;
            localStorage.setItem(quotaKey, JSON.stringify(quotaData));
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
        localStorage.setItem(quotaKey, JSON.stringify(quotaData));
    };

    // Modify form submit handler to include quota check
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!checkQuota()) {
            translatedText.textContent = 'Daily quota exceeded. Please try again tomorrow.';
            return;
        }

        // Proceed with translation
        const button = form.querySelector('button');
        button.disabled = true;
        button.textContent = 'Translating...';

        const inputText = textInput.value;
        const sourceLang = sourceLanguage.value;
        const targetLang = targetLanguage.value;

        try {
            let response;
            try {
                response = await fetch("https://libretranslate.com/translate", {
                    method: "POST",
                    body: JSON.stringify({
                        q: inputText,
                        source: sourceLang,
                        target: targetLang,
                        format: "text",
                        alternatives: 3,
                        api_key: ""
                    }),
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) throw new Error('LibreTranslate API request failed');

                const data = await response.json();
                translatedText.textContent = data.translatedText || 'No translation available';
            } catch (error) {
                console.error('LibreTranslate failed, trying fallback API...', error);

                response = await fetch("https://api.apilayer.com/language_translation/translate?target=" + targetLang, {
                    method: 'POST',
                    body: JSON.stringify({ q: inputText, source: sourceLang }),
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": "OnKRZVRuo23GtI7HjtViOl1I0FFtI1CH"
                    }
                });

                if (!response.ok) throw new Error('Fallback API request failed');

                const data = await response.json();
                translatedText.textContent = data.translations[0].translation || 'No translation available';
            }

            incrementQuota();
        } catch (error) {
            translatedText.textContent = 'Error: ' + error.message;
        } finally {
            button.disabled = false;
            button.textContent = 'Translate';
        }
    });
});
