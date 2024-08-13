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

function displayEventDetails(eventId) {
    const event = events[eventId];
    if (!event) {
        document.getElementById('event-detail-container').innerHTML = '<p>Event not found.</p>';
        return;
    }

    const container = document.getElementById('event-detail-container');
    
    container.innerHTML = `
        <img src="${event.imageUrl}" alt="${event.title}">
        <h1>${event.title}</h1>
        <p><strong>Date:</strong> ${event.date}</p>
        <p>${event.fullDescription}</p>
    `;
}

function goBack() {
    window.history.back();
}
