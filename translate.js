document.getElementById('translateButton').addEventListener('click', () => {
    const sourceText = document.getElementById('sourceText').value.trim();
    const targetLang = document.getElementById('languageSelect').value;

    if (!sourceText) {
        alert('Please enter text to translate.');
        return;
    }

    fetch('https://translation.googleapis.com/language/translate/v2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'  // Use Authorization header instead of key in the query string
        },
        body: JSON.stringify({
            q: sourceText,
            target: targetLang
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.data && data.data.translations) {
            const translatedText = data.data.translations[0].translatedText;
            document.getElementById('translatedText').innerText = translatedText;
        } else {
            throw new Error('Translation failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while translating. Please try again.');
    });
});
