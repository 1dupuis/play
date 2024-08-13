document.addEventListener('DOMContentLoaded', () => {
    const verifiedUser = localStorage.getItem('verifiedUser');
    const validUsernames = ['username1', 'username2', 'username3']; // Replace with actual usernames

    // Check if the user is on the verification page
    const isOnVerificationPage = window.location.pathname.endsWith('index.html');
    // Check if the user is already verified
    const isVerified = !!verifiedUser;

    // If the user is already verified and is not on the verification page, redirect them to the homepage
    if (isVerified && !isOnVerificationPage) {
        window.location.href = 'homepage.html'; // Redirect to homepage.html
        return;
    }

    // Proceed with verification if the user is on the verification page
    if (isOnVerificationPage) {
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
    }
});
