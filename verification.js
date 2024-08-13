document.addEventListener('DOMContentLoaded', () => {
    const verifiedUser = localStorage.getItem('verifiedUser');
    const validUsernames = ['username1', 'username2', 'username3']; // Replace with actual usernames

    // If the user is already verified, redirect them to the homepage
    if (verifiedUser) {
        window.location.href = 'homepage.html'; // Redirect to homepage.html
        return;
    }

    const usernameInput = document.getElementById('username-input');
    const verifyButton = document.getElementById('verify-button');
    const errorMessage = document.getElementById('error-message');

    verifyButton.addEventListener('click', () => {
        const enteredUsername = usernameInput.value.trim().toLowerCase();

        if (validUsernames.includes(enteredUsername)) {
            localStorage.setItem('verifiedUser', enteredUsername);
            window.location.href = 'homepage.html'; // Redirect to homepage.html
        } else {
            errorMessage.style.display = 'block';
        }
    });
});