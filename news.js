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

    async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (retries > 0) {
                console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return fetchWithRetry(url, options, retries - 1);
            }
            throw error;
        }
    }

    async function fetchNews(query) {
        const primaryUrl = 'https://newsnow.p.rapidapi.com/';
        const secondaryUrl = 'https://seeking-alpha.p.rapidapi.com/news/v2/list';
        
        const primaryOptions = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'newsnow.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: `${query} France`,
                region: 'fr',
                max_results: 10
            })
        };

        const secondaryOptions = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'seeking-alpha.p.rapidapi.com'
            }
        };

        console.log(`Fetching news with query: ${query}`);
        loader.style.display = 'block';
        statusMessage.textContent = 'Fetching news...';

        try {
            // Try primary API
            const primaryData = await fetchWithRetry(primaryUrl, primaryOptions);
            if (primaryData.news && primaryData.news.length > 0) {
                displayNews(primaryData.news);
                statusMessage.textContent = 'News loaded successfully from primary source';
                return;
            }

            // If primary API fails or returns no results, try secondary API
            statusMessage.textContent = 'Trying alternate news source...';
            const secondaryData = await fetchWithRetry(`${secondaryUrl}?query=${encodeURIComponent(query + ' France')}`, secondaryOptions);
            if (secondaryData.data && secondaryData.data.length > 0) {
                const formattedNews = secondaryData.data.map(item => ({
                    title: item.attributes.title,
                    url: item.links.self,
                    body: item.attributes.summary,
                    date: item.attributes.publishOn,
                    image: item.attributes.gettyImageUrl,
                    source: item.attributes.gettyImageUrl
                }));
                displayNews(formattedNews);
                statusMessage.textContent = 'News loaded successfully from secondary source';
            } else {
                displayError('No news articles found from either source.');
                statusMessage.textContent = 'No news found';
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            displayError('An error occurred while fetching the news from both sources.');
            statusMessage.textContent = 'Error fetching news';
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
                <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
                <p>${article.body || 'No summary available.'}</p>
                ${article.image ? `<img src="${article.image}" alt="${article.title}">` : ''}
                <p><small>Published on: ${new Date(article.date).toLocaleDateString('fr-FR')}</small></p>
                <p><small>Source: ${article.source || 'Unknown'}</small></p>
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
        const query = searchTerm || selectedCity;
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
