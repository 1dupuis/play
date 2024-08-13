document.addEventListener('DOMContentLoaded', () => {
    const verifiedUser = localStorage.getItem('verifiedUser');

    // If the user is already verified, redirect them to the homepage
    if (verifiedUser) {
        window.location.href = 'homepage.html';
        return;
    }

    // If not verified, redirect to the verification page
    window.location.href = 'verify.html';
});
