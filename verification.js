document.addEventListener('DOMContentLoaded', () => {
    const validUsernames = ['loellen'].map(username => username.toLowerCase());

    // Check if the user is verified
    const verifiedUser = localStorage.getItem('verifiedUser');
    const currentPath = window.location.pathname;
    
    // Define the actual paths
    const isOnVerificationPage = currentPath === '/index.html' || currentPath === '/';
    const isOnHomepage = currentPath === '/homepage' || currentPath === '/homepage.html';

    // Prevent continuous redirection by using session storage
    const hasRedirected = sessionStorage.getItem('hasRedirected');

    // If the user is already verified and is not on the verification page
    if (verifiedUser && !isOnVerificationPage) {
        if (!isOnHomepage && !hasRedirected) {
            sessionStorage.setItem('hasRedirected', 'true');
            window.location.href = 'homepage'; // Redirect to homepage.html
        }
        return;
    }

    // If the user is on the verification page
    if (isOnVerificationPage) {
        const usernameInput = document.getElementById('username-input');
        const verifyButton = document.getElementById('verify-button');
        const errorMessage = document.getElementById('error-message');
        const loadingIndicator = document.getElementById('loading-indicator');

        // Function to display error messages
        function displayError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }

        // Hide error message
        function hideError() {
            errorMessage.style.display = 'none';
        }

        verifyButton.addEventListener('click', () => {
            const enteredUsername = usernameInput.value.trim().toLowerCase();

            // Validate user input
            if (!enteredUsername) {
                displayError('Username cannot be empty.');
                return;
            }
            if (/[^a-zA-Z0-9_]/.test(enteredUsername)) {
                displayError('Username can only contain letters, numbers, and underscores.');
                return;
            }

            // Show loading indicator
            loadingIndicator.style.display = 'block';

            // Simulate a delay to mimic processing (e.g., server request)
            setTimeout(() => {
                hideError();
                if (validUsernames.includes(enteredUsername)) {
                    localStorage.setItem('verifiedUser', enteredUsername);
                    sessionStorage.setItem('hasRedirected', 'true');
                    window.location.href = 'homepage.html'; // Redirect to homepage.html
                } else {
                    displayError('Username not recognized.');
                }
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
            }, 500); // Simulate processing delay
        });
    }
});
