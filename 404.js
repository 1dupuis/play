document.addEventListener("DOMContentLoaded", () => {
    const errorDetails = document.getElementById("error-details");

    // Display URL of the page that caused the error
    if (window.location) {
        errorDetails.innerHTML = `<p>The URL that caused this error was: <strong>${window.location.href}</strong></p>`;
    }

    // Reload button functionality
    const reloadBtn = document.getElementById("reload-btn");
    reloadBtn.addEventListener("click", () => {
        window.location.reload();
    });
});
