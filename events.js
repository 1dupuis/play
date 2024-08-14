// Wrap everything in an IIFE to avoid global scope pollution
(function() {
    'use strict';

    // Configuration object for easy adjustments
    const config = {
        eventsContainerId: 'events-container',
        calendarContainerId: 'calendar-container',
        placeholderImageUrl: 'https://via.placeholder.com/150',
        dateFormat: { year: 'numeric', month: 'long', day: 'numeric' }
    };

    // Sample events (in production, this would likely come from an API)
    const events = [
        {
            id: 1,
            imageUrl: config.placeholderImageUrl,
            title: 'Test Announcement 1',
            description: 'This is a test description...',
            date: '2024-08-14',
            fullDescription: 'This is the long form of the test description...'
        },
        {
            id: 2,
            imageUrl: config.placeholderImageUrl,
            title: 'Test Announcement 2',
            description: 'This is another test description...',
            date: '2024-08-20',
            fullDescription: 'This is the long form of another test description...'
        },
        {
            id: 3,
            imageUrl: config.placeholderImageUrl,
            title: 'Test Announcement 3',
            description: 'Yet another test description...',
            date: '2024-09-05',
            fullDescription: 'This is the long form of yet another test description...'
        },
    ];

    // Utility functions
    const utils = {
        adjustTimezone: function(date) {
            const dateObj = new Date(date);
            const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
            return new Date(dateObj.getTime() - userTimezoneOffset);
        },
        formatDate: function(date) {
            return new Date(this.adjustTimezone(date)).toLocaleDateString(undefined, config.dateFormat);
        },
        createElement: function(tag, className, innerHTML) {
            const element = document.createElement(tag);
            if (className) element.className = className;
            if (innerHTML) element.innerHTML = innerHTML;
            return element;
        },
        getElement: function(id) {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`Element with id "${id}" not found`);
            }
            return element;
        }
    };

    // Event-related functions
    const eventFunctions = {
        createEventCard: function(event) {
            const eventCard = utils.createElement('div', 'event-card');
            eventCard.innerHTML = `
                <img src="${event.imageUrl}" alt="${event.title}" onerror="this.src='${config.placeholderImageUrl}'">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p><strong>Date:</strong> ${utils.formatDate(event.date)}</p>
            `;
            eventCard.addEventListener('click', () => this.showEventDetails(event));
            return eventCard;
        },
        renderEvents: function() {
            const eventsContainer = utils.getElement(config.eventsContainerId);
            if (!eventsContainer) return;

            eventsContainer.innerHTML = '';
            events.forEach(event => {
                eventsContainer.appendChild(this.createEventCard(event));
            });
        },
        showEventDetails: function(event) {
            alert(`Event: ${event.title}\nDate: ${utils.formatDate(event.date)}\nDescription: ${event.fullDescription}`);
        }
    };

    // Calendar-related functions
    const calendarFunctions = {
        createCalendar: function(monthOffset = 0, yearOffset = 0) {
            const calendarContainer = utils.getElement(config.calendarContainerId);
            if (!calendarContainer) return;

            const now = new Date();
            const year = now.getFullYear() + yearOffset;
            const month = now.getMonth() + monthOffset;

            const targetDate = new Date(year, month, 1);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = targetDate.getDay();

            const monthName = targetDate.toLocaleString('default', { month: 'long' });

            let calendarHtml = `
                <h2>${monthName} ${year}</h2>
                <div class="calendar-nav">
                    <button id="prev-year">&lt;&lt;</button>
                    <button id="prev-month">&lt;</button>
                    <button id="next-month">&gt;</button>
                    <button id="next-year">&gt;&gt;</button>
                </div>
                <table>
                    <thead>
                        <tr>${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `<th>${day}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
            `;

            let dayCount = 1;
            for (let i = 0; i < 6; i++) {
                calendarHtml += '<tr>';
                for (let j = 0; j < 7; j++) {
                    if ((i === 0 && j < firstDay) || dayCount > daysInMonth) {
                        calendarHtml += '<td></td>';
                    } else {
                        const currentDate = new Date(year, month, dayCount).toISOString().split('T')[0];
                        const eventOnThisDay = events.find(event => utils.adjustTimezone(event.date).toISOString().split('T')[0] === currentDate);
                        const eventIndicator = eventOnThisDay ? '<div class="event-indicator"></div>' : '';
                        calendarHtml += `<td class="calendar-day" data-date="${currentDate}">${dayCount}${eventIndicator}</td>`;
                        dayCount++;
                    }
                }
                calendarHtml += '</tr>';
                if (dayCount > daysInMonth) break;
            }

            calendarHtml += '</tbody></table>';
            calendarContainer.innerHTML = calendarHtml;

            this.addCalendarEventListeners(monthOffset, yearOffset);
        },
        addCalendarEventListeners: function(monthOffset, yearOffset) {
            document.querySelectorAll('.calendar-day').forEach(day => {
                day.addEventListener('click', function() {
                    const date = this.getAttribute('data-date');
                    const event = events.find(e => utils.adjustTimezone(e.date).toISOString().split('T')[0] === date);
                    if (event) {
                        eventFunctions.showEventDetails(event);
                    } else {
                        alert('No event on this date.');
                    }
                });
            });

            document.getElementById('prev-month').addEventListener('click', () => this.createCalendar(monthOffset - 1, yearOffset));
            document.getElementById('next-month').addEventListener('click', () => this.createCalendar(monthOffset + 1, yearOffset));
            document.getElementById('prev-year').addEventListener('click', () => this.createCalendar(monthOffset, yearOffset - 1));
            document.getElementById('next-year').addEventListener('click', () => this.createCalendar(monthOffset, yearOffset + 1));
        }
    };

    // Main initialization function
    function init() {
        console.log('Initializing events and calendar...');
        try {
            eventFunctions.renderEvents();
            console.log('Events rendered successfully');
        } catch (error) {
            console.error('Error rendering events:', error);
        }

        try {
            calendarFunctions.createCalendar();
            console.log('Calendar created successfully');
        } catch (error) {
            console.error('Error creating calendar:', error);
        }
    }

    // Run initialization when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose necessary functions to global scope if needed
    window.eventsApp = {
        renderEvents: eventFunctions.renderEvents,
        createCalendar: calendarFunctions.createCalendar
    };
})();
