document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = 'https://real-time-news-data.p.rapidapi.com/search';
    const apiKey = '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5';
    const apiHost = 'real-time-news-data.p.rapidapi.com';

    const statusMessageElement = document.getElementById('status-message');

    const updateStatus = (message, color = '#ffffff') => {
        statusMessageElement.textContent = message;
        statusMessageElement.style.color = color;
    };

    const fetchNews = async (query = 'France') => {
        updateStatus('Connecting to API...', '#ffa500'); // Orange color for connecting
        showLoader(true);

        try {
            const url = `${baseUrl}?query=${encodeURIComponent(query)}&limit=25&time_published=anytime&country=FR&lang=fr`;

            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': apiHost
                }
            };

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();

            if (!result || !result.articles || result.articles.length === 0) {
                updateStatus('No news articles found.', '#ff0000'); // Red color for error
                displayError("No news articles found.");
            } else {
                updateStatus('News fetched successfully!', '#00ff00'); // Green color for success
                displayNews(result.articles);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            updateStatus('Failed to connect to API.', '#ff0000'); // Red color for error
            displayError("Failed to fetch news. Please try again later.");
        } finally {
            showLoader(false);
        }
    };

    const displayNews = (articles) => {
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = ''; // Clear previous news

        articles.forEach(article => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';

            const img = document.createElement('img');
            img.src = article.image_url || 'default-news-image.jpg'; // Fallback image
            img.alt = article.title;

            const content = document.createElement('div');
            content.className = 'content';

            const title = document.createElement('h3');
            title.className = 'title';
            title.textContent = article.title;

            const description = document.createElement('p');
            description.className = 'description';
            description.textContent = article.description || 'No description available';

            content.appendChild(title);
            content.appendChild(description);
            newsCard.appendChild(img);
            newsCard.appendChild(content);
            newsContainer.appendChild(newsCard);
        });
    };

    const displayError = (message) => {
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = `<p style="text-align: center; color: red;">${message}</p>`;
    };

    const showLoader = (visible) => {
        const loader = document.getElementById('loader');
        loader.style.display = visible ? 'block' : 'none';
    };

    const validateCityInput = (city) => {
        // Sanitize the city input to prevent issues with the API request
        return city.trim().replace(/[^a-zA-Z\s]/g, '');
    };

    // Initial load for default query (e.g., 'France')
    fetchNews();

    document.getElementById('search-button').addEventListener('click', () => {
        const searchQuery = document.getElementById('search-input').value.trim();
        let selectedCity = document.getElementById('city-select').value;
        selectedCity = validateCityInput(selectedCity);

        const query = searchQuery || selectedCity;
        fetchNews(query);
    });
});
