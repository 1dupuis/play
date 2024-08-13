document.addEventListener('DOMContentLoaded', () => {
    // Convert usernames to lowercase for comparison
    const validUsernames = ['username1', 'username2', 'username3'].map(username => username.toLowerCase());

    const verifiedUser = localStorage.getItem('verifiedUser');
    const currentPath = window.location.pathname;

    // Check if the current page is the homepage
    const isOnHomepage = currentPath.endsWith('homepage.html');
    const isOnVerificationPage = currentPath.endsWith('index.html');

    // Prevent continuous redirection by using session storage
    const hasRedirected = sessionStorage.getItem('hasRedirected');

    // If the user is already verified and is not on the verification page
    if (verifiedUser && !isOnVerificationPage) {
        if (!isOnHomepage && !hasRedirected) {
            sessionStorage.setItem('hasRedirected', 'true');
            window.location.href = 'homepage.html'; // Redirect to homepage.html
        }
        return;
    }

    // If the user is on the verification page
    if (isOnVerificationPage) {
        const usernameInput = document.getElementById('username-input');
        const verifyButton = document.getElementById('verify-button');
        const errorMessage = document.getElementById('error-message');

        verifyButton.addEventListener('click', () => {
            const enteredUsername = usernameInput.value.trim().toLowerCase();

            if (validUsernames.includes(enteredUsername)) {
                localStorage.setItem('verifiedUser', enteredUsername);
                sessionStorage.setItem('hasRedirected', 'true');
                window.location.href = 'homepage.html'; // Redirect to homepage.html
            } else {
                errorMessage.style.display = 'block';
            }
        });
    }
});
