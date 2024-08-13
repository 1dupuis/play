const events = [];

function addEvent(imageUrl, title, description, date, fullDescription) {
    const eventId = events.length;
    events.push({ imageUrl, title, description, date, fullDescription });

    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.setAttribute('data-id', eventId);
    eventCard.onclick = () => {
        window.location.href = `event-detail.html?id=${eventId}`;
    };

    eventCard.innerHTML = `
        <img src="${imageUrl}" alt="${title}">
        <h3>${title}</h3>
        <p>${description}</p>
        <p><strong>Date:</strong> ${date}</p>
    `;

    document.getElementById('events-container').appendChild(eventCard);
}

// Save events to local storage
function saveEventsToLocalStorage() {
    localStorage.setItem('events', JSON.stringify(events));
}

// Initial events data
document.addEventListener('DOMContentLoaded', () => {
    addEvent(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/France_Icon.svg/400px-France_Icon.svg.png', 
        'More Soon!', 
        'Stay updated on the latest posts and events!', 
        'August 12, 2024',
        'Full description.'
    );

    // Save to local storage
    saveEventsToLocalStorage();
});
