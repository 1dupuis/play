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

// Initial events data
document.addEventListener('DOMContentLoaded', () => {
    addEvent(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/France_Icon.svg/400px-France_Icon.svg.png', 
        'Paris Fashion Week', 
        'Experience the latest trends and styles from top designers around the world.', 
        'September 28, 2024',
        'Full Description of Paris Fashion Week. This is where you can put detailed information about the event, such as the schedule, guest speakers, ticket information, etc.'
    );

    addEvent(
        'https://upload.wikimedia.org/wikipedia/commons/4/47/Parade_in_Paris_%28France%29_14.jpg',
        'Bastille Day Parade',
        'Celebrate French national pride with a grand parade on the Champs-Élysées.',
        'July 14, 2024',
        'The Bastille Day Parade is a major event in France, featuring a grand military parade, fireworks, and celebrations all over the country.'
    );

    // Add more events here
});
