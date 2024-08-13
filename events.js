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
addEvent(
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/France_Icon.svg/400px-France_Icon.svg.png', 
  'dupuis.lol!', 
  'Learn french while playing games!', 
  'August 12, 2024'
);
