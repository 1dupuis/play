document.addEventListener('DOMContentLoaded', () => {
    // Function to get query parameters from the URL
    function getQueryParams() {
        const queryParams = new URLSearchParams(window.location.search);
        return {
            id: queryParams.get('id')
        };
    }

    // Function to display event details
    function displayEventDetails(event) {
        const container = document.getElementById('event-detail-container');
        container.innerHTML = `
            <img src="${event.imageUrl}" alt="${event.title}">
            <h1>${event.title}</h1>
            <p><strong>Date:</strong> ${event.date}</p>
            <p>${event.fullDescription}</p>
        `;
    }

    // Function to load event details
    function loadEventDetails() {
        const { id } = getQueryParams();
        if (id === null || isNaN(id)) {
            displayError('Invalid event ID.');
            return;
        }

        const eventId = parseInt(id, 10);
        const event = getEventById(eventId);

        if (event) {
            displayEventDetails(event);
        } else {
            displayError('Event not found.');
        }
    }

    // Function to display an error message
    function displayError(message) {
        document.getElementById('event-detail-container').innerHTML = `<p>${message}</p>`;
    }

    // Function to retrieve event by ID from local storage
    function getEventById(id) {
        // Retrieve the events array from local storage
        const eventsJSON = localStorage.getItem('events');
        if (!eventsJSON) {
            return null;
        }

        const events = JSON.parse(eventsJSON);
        return events[id] || null;
    }

    // Load event details on page load
    loadEventDetails();
});
