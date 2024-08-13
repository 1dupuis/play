// Function to add an event
function addEvent(imageUrl, title, description, date) {
    const eventsContainer = document.getElementById('eventsContainer');

    const event = document.createElement('div');
    event.classList.add('event');

    event.innerHTML = `
        <img src="${imageUrl}" alt="${title}">
        <div class="event-details">
            <h2 class="event-title">${title}</h2>
            <p class="event-date">${date}</p>
            <p class="event-description">${description}</p>
        </div>
    `;

    eventsContainer.appendChild(event);
}

// Add events using the function
addEvent('https://via.placeholder.com/400', 'Paris Fashion Week', 'Experience the latest trends and styles from top designers around the world.', 'September 28, 2024');
addEvent('https://via.placeholder.com/400', 'Bastille Day Celebration', 'Join us for the Bastille Day parade and fireworks in the heart of Paris.', 'July 14, 2024');
addEvent('https://via.placeholder.com/400', 'Louvre Art Exhibition', 'Explore the masterpieces of art at the Louvre with special guided tours.', 'October 10, 2024');
addEvent('https://via.placeholder.com/400', 'French Wine Tasting', 'Sample some of the finest wines from various regions of France.', 'November 5, 2024');
addEvent('https://via.placeholder.com/400', 'Christmas Markets', 'Discover the magic of Christmas in France with festive markets and decorations.', 'December 1, 2024');
addEvent('https://via.placeholder.com/400', 'Cannes Film Festival', 'Attend the prestigious Cannes Film Festival and enjoy world-class cinema.', 'May 17, 2024');
addEvent('https://via.placeholder.com/400', 'Tour de France', 'Watch the world\'s best cyclists compete in the iconic Tour de France race.', 'July 7, 2024');
addEvent('https://via.placeholder.com/400', 'French Open', 'Catch the thrilling action of the French Open tennis tournament in Paris.', 'May 26, 2024');
addEvent('https://via.placeholder.com/400', 'Paris Marathon', 'Participate in the Paris Marathon and run through the beautiful streets of the city.', 'April 7, 2024');
addEvent('https://via.placeholder.com/400', 'Nice Jazz Festival', 'Enjoy live jazz performances at the famous Nice Jazz Festival on the French Riviera.', 'July 20, 2024');
