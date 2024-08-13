const events = [];

function addEvent(imageUrl, title, description, date, fullDescription) {
    const eventId = events.length;
    events.push({ imageUrl, title, description, date, fullDescription });

    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.setAttribute('data-id', eventId);
    eventCard.onclick = () => {
        window.location.href = `event-detail?id=${eventId}`;
    };

    eventCard.innerHTML = `
        <img src="${imageUrl}" alt="${title}">
        <h3>${title}</h3>
        <p>${description}</p>
        <p><strong>Date:</strong> ${date}</p>
    `;

    document.getElementById('events-container').appendChild(eventCard);
}

function saveEventsToLocalStorage() {
    localStorage.setItem('events', JSON.stringify(events));
}

function loadEventsFromLocalStorage() {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        parsedEvents.forEach(event => {
            addEvent(event.imageUrl, event.title, event.description, event.date, event.fullDescription);
        });
    }
}

function createCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();

    let calendarHtml = `<h2>${month} ${year}</h2>`;
    calendarHtml += '<table><tr>';
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        calendarHtml += `<th>${day}</th>`;
    });
    calendarHtml += '</tr><tr>';

    const firstDay = new Date(year, now.getMonth(), 1).getDay();

    for (let i = 0; i < firstDay; i++) {
        calendarHtml += '<td></td>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        if ((firstDay + day - 1) % 7 === 0) {
            calendarHtml += '</tr><tr>';
        }
        calendarHtml += `<td class="calendar-day" data-date="${year}-${now.getMonth() + 1}-${day}">${day}</td>`;
    }
    calendarHtml += '</tr></table>';

    calendarContainer.innerHTML = calendarHtml;

    document.querySelectorAll('.calendar-day').forEach(day => {
        day.addEventListener('click', function () {
            const date = this.getAttribute('data-date');
            const event = prompt('Enter event title:');
            if (event) {
                addEvent(
                    'https://via.placeholder.com/150',
                    event,
                    'No description available',
                    date,
                    'No full description was set.'
                );
                saveEventsToLocalStorage();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createCalendar();
    loadEventsFromLocalStorage();

    // Example of adding an initial event
    addEvent(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/France_Icon.svg/400px-France_Icon.svg.png', 
        'More Soon!', 
        'Stay updated on the latest posts and events!', 
        'August 12, 2024',
        'No full description was set.'
    );

    saveEventsToLocalStorage();
});
