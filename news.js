// news.js
document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById('loader');
    const newsContainer = document.getElementById('news-container');
    const citySelect = document.getElementById('city-select');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const statusMessage = document.getElementById('status-message');

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second

    async function fetchWithRetry(url, retries = MAX_RETRIES) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (retries > 0) {
                console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return fetchWithRetry(url, retries - 1);
            }
            throw error;
        }
    }

    async function fetchNews(query) {
        const city = citySelect.value;
        const searchTerm = searchInput.value.trim();
        const apiUrl = `https://newsdata.io/api/1/news?apikey=pub_5106560bd34659959ca3d7b9383ee80e06524&category=education,environment,food,sports,tourism&q=${encodeURIComponent(searchTerm || query)}&country=fr&language=en`;

        console.log(`Fetching news with query: ${searchTerm || query}`);
        loader.style.display = 'block';
        statusMessage.textContent = 'Fetching news...';

        try {
            const data = await fetchWithRetry(apiUrl);
            const news = data.results;

            if (news && news.length > 0) {
                displayNews(news);
                statusMessage.textContent = `News loaded successfully for ${city || 'France'}`;
            } else {
                displayError('No news articles found.');
                statusMessage.textContent = 'No news found';
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            displayError('Failed to fetch news. Please try again later.');
            statusMessage.textContent = 'Failed to load news';
        } finally {
            loader.style.display = 'none';
        }
    }

    function displayNews(articles) {
        console.log('Displaying news articles');
        newsContainer.innerHTML = '';
        articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('news-article');
            articleElement.innerHTML = `
                <h2><a href="${article.link}" target="_blank">${article.title}</a></h2>
                <p>${article.description || 'No summary available.'}</p>
                ${article.image_url ? `<img src="${article.image_url}" alt="${article.title}">` : ''}
                <p><small>Published on: ${new Date(article.pubDate).toLocaleDateString('fr-FR')}</small></p>
                <p><small>Source: ${article.source_id || 'Unknown'}</small></p>
            `;
            newsContainer.appendChild(articleElement);
        });
    }

    function displayError(message) {
        console.error(message);
        newsContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }

    function performSearch() {
        const searchTerm = searchInput.value.trim();
        const selectedCity = citySelect.value;
        const query = searchTerm || selectedCity || 'France';
        fetchNews(query);
    }

    citySelect.addEventListener('change', performSearch);
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Initialize news feed
    const defaultQuery = 'France';
    console.log('Initial news fetch');
    fetchNews(defaultQuery);
});
