const events = [
    // Sample events for testing
    {
        imageUrl: 'https://via.placeholder.com/150',
        title: 'French Language Workshop',
        description: 'Learn the basics of French in a fun and interactive workshop!',
        date: '2024-08-14',
        fullDescription: 'This workshop will cover basic French phrases, vocabulary, and grammar. Suitable for beginners!'
    },
    {
        imageUrl: 'https://via.placeholder.com/150',
        title: 'French Culture Day',
        description: 'A day to celebrate French culture with food, music, and art!',
        date: '2024-08-20',
        fullDescription: 'Enjoy a full day of activities dedicated to French culture, including cooking classes, music performances, and art exhibitions.'
    },
    {
        imageUrl: 'https://via.placeholder.com/150',
        title: 'Advanced French Grammar Session',
        description: 'Dive deep into advanced French grammar with our experts!',
        date: '2024-08-25',
        fullDescription: 'This session is designed for those who already have a basic understanding of French and want to improve their grammar skills.'
    }
];

function adjustTimezone(date) {
    const dateObj = new Date(date);
    const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(dateObj.getTime() - userTimezoneOffset);
    return adjustedDate.toISOString().split('T')[0];
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
        <p><strong>Date:</strong> ${new Date(adjustTimezone(event.date)).toLocaleDateString()}</p>
    `;

    return eventCard;
}

function renderEvents() {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = '';
    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
}

function createCalendar(monthOffset = 0, yearOffset = 0) {
    const calendarContainer = document.getElementById('calendar-container');
    calendarContainer.innerHTML = '';

    const now = new Date();
    const year = now.getFullYear() + yearOffset;
    const currentMonth = now.getMonth() + monthOffset;

    const targetDate = new Date(year, currentMonth, 1);
    const month = targetDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = targetDate.toLocaleString('default', { month: 'long' });

    let calendarHtml = `<h2>${monthName} ${year}</h2>`;
    calendarHtml += `
        <div class="calendar-nav">
            <button id="prev-year">&lt;&lt;</button>
            <button id="prev-month">&lt;</button>
            <button id="next-month">&gt;</button>
            <button id="next-year">&gt;&gt;</button>
        </div>
    `;

    calendarHtml += '<table><thead><tr>';
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        calendarHtml += `<th>${day}</th>`;
    });
    calendarHtml += '</tr></thead><tbody><tr>';

    const firstDay = targetDate.getDay();

    for (let i = 0; i < firstDay; i++) {
        calendarHtml += '<td></td>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        if ((firstDay + day - 1) % 7 === 0) {
            calendarHtml += '</tr><tr>';
        }

        const currentDate = new Date(year, month, day).toISOString().split('T')[0];
        const eventOnThisDay = events.find(event => adjustTimezone(event.date) === currentDate);

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
            const event = events.find(e => adjustTimezone(e.date) === date);
            if (event) {
                alert(`Event: ${event.title}\nDate: ${new Date(adjustTimezone(event.date)).toLocaleDateString()}\nDescription: ${event.fullDescription}`);
            } else {
                alert('No event on this date.');
            }
        });
    });

    document.getElementById('prev-month').addEventListener('click', () => {
        createCalendar(monthOffset - 1, yearOffset);
    });

    document.getElementById('next-month').addEventListener('click', () => {
        createCalendar(monthOffset + 1, yearOffset);
    });

    document.getElementById('prev-year').addEventListener('click', () => {
        createCalendar(monthOffset, yearOffset - 1);
    });

    document.getElementById('next-year').addEventListener('click', () => {
        createCalendar(monthOffset, yearOffset + 1);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createCalendar();
    renderEvents();
});
