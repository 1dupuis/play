document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('translationForm');
    const textInput = document.getElementById('textInput');
    const sourceLanguage = document.getElementById('sourceLanguage');
    const targetLanguage = document.getElementById('targetLanguage');
    const translatedText = document.getElementById('translatedText');

    const API_KEYS = {
        LIBRE_TRANSLATE: "",
        APILAYER: "OnKRZVRuo23GtI7HjtViOl1I0FFtI1CH"
    };

    const TRANSLATION_URLS = {
        LIBRE_TRANSLATE: "https://libretranslate.com/translate",
        APILAYER: "https://api.apilayer.com/language_translation/translate?target="
    };

    const MAX_TRANSLATIONS_PER_DAY = 15;
    const QUOTA_KEY = 'translationQuota';
    const LAST_RESET_KEY = 'lastQuotaReset';

    const getQuotaData = () => {
        const data = JSON.parse(localStorage.getItem(QUOTA_KEY)) || { count: 0, lastReset: Date.now() };
        return data;
    };

    const resetQuotaIfNeeded = () => {
        const quotaData = getQuotaData();
        const now = Date.now();
        if (now - quotaData.lastReset >= 24 * 60 * 60 * 1000) {
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
        try {
            let response = await fetch(TRANSLATION_URLS.LIBRE_TRANSLATE, {
                method: "POST",
                body: JSON.stringify({
                    q: inputText,
                    source: sourceLang,
                    target: targetLang,
                    format: "text",
                    alternatives: 3,
                    api_key: API_KEYS.LIBRE_TRANSLATE
                }),
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error('LibreTranslate API request failed');

            const data = await response.json();
            return data.translatedText || 'No translation available';
        } catch (error) {
            console.error('LibreTranslate failed, trying fallback API...', error);

            try {
                let fallbackResponse = await fetch(TRANSLATION_URLS.APILAYER + targetLang, {
                    method: 'POST',
                    body: JSON.stringify({ q: inputText, source: sourceLang }),
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": API_KEYS.APILAYER
                    }
                });

                if (!fallbackResponse.ok) throw new Error('Fallback API request failed');

                const fallbackData = await fallbackResponse.json();
                return fallbackData.translations[0].translation || 'No translation available';
            } catch (fallbackError) {
                console.error('Fallback API also failed.', fallbackError);
                return 'Error: Unable to fetch translation';
            }
        }
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!checkQuota()) {
            translatedText.textContent = 'Daily quota exceeded. Please try again tomorrow.';
            return;
        }

        const button = form.querySelector('button');
        button.disabled = true;
        button.textContent = 'Translating...';

        const inputText = textInput.value;
        const sourceLang = sourceLanguage.value;
        const targetLang = targetLanguage.value;

        try {
            const resultText = await translateText(inputText, sourceLang, targetLang);
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
