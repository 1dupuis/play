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
            <img src="${event.imageUrl}" alt="${event.title}" />
            <h1>${event.title}</h1>
            <p><strong>Date:</strong> ${event.date}</p>
            <p>${event.fullDescription}</p>
        `;
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
        return events.find(event => event.id === id) || null;
    }

    // Function to load event details
    function loadEventDetails() {
        const { id } = getQueryParams();
        if (!id) {
            displayError('Invalid event ID.');
            return;
        }

        const event = getEventById(id);

        if (event) {
            displayEventDetails(event);
            enableCommentForm(); // Enable the comment form after event details are loaded
            loadComments(id);  // Load comments specific to this event
        } else {
            displayError('Event not found.');
            disableCommentForm(); // Disable the comment form if the event is not found
        }
    }

    // Function to enable the comment form
    function enableCommentForm() {
        document.getElementById('comment-form').style.display = 'block';
    }

    // Function to disable the comment form
    function disableCommentForm() {
        document.getElementById('comment-form').style.display = 'none';
    }

    // Handle comment form submission
    const commentForm = document.getElementById('comment-form');
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addComment();
    });

    // Function to add a comment
    function addComment() {
        const username = document.getElementById('username').value.trim();
        const commentText = document.getElementById('comment').value.trim();

        if (!username || !commentText) {
            alert("Please fill out both the username and comment fields.");
            return;
        }

        const { id } = getQueryParams();
        const comments = getComments(id);

        const newComment = {
            username,
            comment: commentText,
            timestamp: new Date().toISOString()
        };

        comments.push(newComment);
        saveComments(id, comments);
        displayComments(comments);

        // Clear the form
        commentForm.reset();
    }

    // Function to display comments
    function displayComments(comments) {
        const commentsContainer = document.getElementById('comments-container');
        commentsContainer.innerHTML = '';
        comments.forEach((comment, index) => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p><strong>${comment.username}</strong> <em>${new Date(comment.timestamp).toLocaleString()}</em></p>
                <p>${comment.comment}</p>
                <button class="delete-button" data-index="${index}">Delete</button>
            `;
            commentsContainer.appendChild(commentElement);
        });

        // Attach delete event listeners to each delete button
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                deleteComment(index);
            });
        });
    }

    // Function to delete a comment
    function deleteComment(index) {
        const { id } = getQueryParams();
        const comments = getComments(id);
        comments.splice(index, 1);
        saveComments(id, comments);
        displayComments(comments);
    }

    // Function to get comments from local storage
    function getComments(eventId) {
        const commentsJSON = localStorage.getItem(`comments_${eventId}`);
        return commentsJSON ? JSON.parse(commentsJSON) : [];
    }

    // Function to save comments to local storage
    function saveComments(eventId, comments) {
        localStorage.setItem(`comments_${eventId}`, JSON.stringify(comments));
    }

    // Load and display comments for the current event
    function loadComments(eventId) {
        const comments = getComments(eventId);
        displayComments(comments);
    }

    // Load event details on page load
    loadEventDetails();
});
