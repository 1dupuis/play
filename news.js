// news.js

document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById('loader');
    const newsContainer = document.getElementById('news-container');
    const citySelect = document.getElementById('city-select');

    async function fetchNews(query) {
        const url = 'https://newsnow.p.rapidapi.com/';
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '967cd1f2a5mshb7398c461b5826ep1579f3jsnbb0fa76416d5',
                'x-rapidapi-host': 'newsnow.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: query,
                region: 'wt-wt', // 'wt-wt' for worldwide, adjust as needed
                max_results: 25
            })
        };

        console.log(`Fetching news with query: ${query}`);
        try {
            loader.style.display = 'block'; // Show loader
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json(); // Changed to JSON parsing
            console.log('Data received:', data);

            if (data && data.articles && data.articles.length > 0) {
                displayNews(data.articles);
            } else {
                displayError('No news articles found.');
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            displayError('An error occurred while fetching the news.');
        } finally {
            loader.style.display = 'none'; // Hide loader
        }
    }

    function displayNews(articles) {
        console.log('Displaying news articles');
        newsContainer.innerHTML = ''; // Clear previous content
        articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('news-article');
            articleElement.innerHTML = `
                <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
                <p>${article.summary || 'No summary available.'}</p>
                ${article.image_url ? `<img src="${article.image_url}" alt="${article.title}">` : ''}
                <p><small>Published on: ${new Date(article.published_at).toLocaleDateString('fr-FR')}</small></p>
            `;
            newsContainer.appendChild(articleElement);
        });
    }

    function displayError(message) {
        console.error(message);
        newsContainer.innerHTML = `<p>${message}</p>`;
    }

    // Add event listener to city select dropdown
    citySelect.addEventListener('change', function() {
        const selectedCity = this.value;
        console.log(`City changed to: ${selectedCity}`);
        fetchNews(selectedCity);
    });

    // Initial fetch with default query or placeholder
    const defaultQuery = 'Top news'; // Default query
    console.log('Initial news fetch');
    fetchNews(defaultQuery);
});
