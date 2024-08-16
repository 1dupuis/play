// news.js

document.addEventListener("DOMContentLoaded", function() {
    const loader = document.getElementById('loader');
    const newsContainer = document.getElementById('news-container');
    const citySelect = document.getElementById('city-select');
    
    async function fetchNews(city) {
        const url = `https://real-time-news-data.p.rapidapi.com/search?query=${encodeURIComponent(city)}&limit=25&time_published=anytime&country=FR&lang=fr`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'real-time-news-data.p.rapidapi.com',
                'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY' // Replace with your actual RapidAPI key
            }
        };

        console.log(`Fetching news for city: ${city}`);
        try {
            loader.style.display = 'block'; // Show loader
            const response = await fetch(url, options);
            console.log('Response received:', response);
            const data = await response.json();
            console.log('Data received:', data);

            if (data.status === 'OK' && data.data.length > 0) {
                displayNews(data.data);
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
                <h2><a href="${article.link}" target="_blank">${article.title}</a></h2>
                <p>${article.snippet}</p>
                <img src="${article.photo_url}" alt="${article.title}">
                <p><small>Published on: ${new Date(article.published_datetime_utc).toLocaleDateString('fr-FR')}</small></p>
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
        console.log(`City changed to: ${this.value}`);
        fetchNews(this.value);
    });

    // Initial fetch with default city or placeholder
    console.log('Initial news fetch');
    fetchNews('Paris'); // Default city, can be changed as needed
});
