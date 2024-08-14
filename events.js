const events = [
    {
        imageUrl: 'https://via.placeholder.com/150',
        title: 'Test Announcement 1',
        description: 'Test!',
        date: '2024-08-14',
        fullDescription: 'Test!!!'
    },
    {
        imageUrl: 'https://via.placeholder.com/150',
        title: 'Test Announcement 2',
        description: 'Test!',
        date: '2024-08-20',
        fullDescription: 'Test!!!'
    },
    {
        imageUrl: 'https://via.placeholder.com/150',
        title: 'Test Announcement 3',
        description: 'Test!',
        date: '2024-08-25',
        fullDescription: 'Test!!!'
    }
];

function correctDate(dateString) {
    // Create a Date object and extract the date in a reliable way, ensuring no timezone issues
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Adjust for timezone difference
    return date.toISOString().split('T')[0];
}

function createEventCard(event) {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.onclick = () => {
        window.location.href = `event-detail?id=${events.indexOf(event)}`;
    };

    eventCard.innerHTML = `
        <img src="${event.imageUrl}" alt="${event.title}">
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${new Date(correctDate(event.date)).toLocaleDateString()}</p>
    `;

    return eventCard;
}

function renderEvents() {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = ''; // Clear existing events to avoid duplication
    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
}

function createCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = now.toLocaleString('default', { month: 'long' });

    let calendarHtml = `<h2>${monthName} ${year}</h2>`;
    calendarHtml += `
        <div class="calendar-nav">
            <button id="prev-month">&lt;</button>
            <button id="next-month">&gt;</button>
        </div>
    `;
    calendarHtml += '<table><thead><tr>';
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        calendarHtml += `<th>${day}</th>`;
    });
    calendarHtml += '</tr></thead><tbody><tr>';

    const firstDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDay; i++) {
        calendarHtml += '<td></td>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        if ((firstDay + day - 1) % 7 === 0) {
            calendarHtml += '</tr><tr>';
        }

        const currentDate = new Date(year, month, day).toISOString().split('T')[0];
        const eventOnThisDay = events.find(event => correctDate(event.date) === currentDate);

        calendarHtml += `<td class="calendar-day" data-date="${currentDate}">${day}`;
        if (eventOnThisDay) {
            calendarHtml += `<div class="event-indicator"></div>`;
        }
        calendarHtml += `</td>`;
    }
    calendarHtml += '</tr></tbody></table>';

    calendarContainer.innerHTML = calendarHtml;

    document.querySelectorAll('.calendar-day').forEach(day => {
        day.addEventListener('click', function () {
            const date = this.getAttribute('data-date');
            const event = events.find(e => correctDate(e.date) === date);
            if (event) {
                alert(`Event: ${event.title}\nDate: ${new Date(correctDate(event.date)).toLocaleDateString()}\nDescription: ${event.fullDescription}`);
            } else {
                alert('No event on this date.');
            }
        });
    });

    document.getElementById('prev-month').addEventListener('click', () => {
        changeMonth(-1);
    });

    document.getElementById('next-month').addEventListener('click', () => {
        changeMonth(1);
    });
}

function changeMonth(offset) {
    const calendarContainer = document.getElementById('calendar-container');
    let date = new Date(calendarContainer.getAttribute('data-date') || new Date());
    date.setMonth(date.getMonth() + offset);
    calendarContainer.setAttribute('data-date', date.toISOString());
    createCalendar();
}

document.addEventListener('DOMContentLoaded', () => {
    createCalendar();
    renderEvents();
});
