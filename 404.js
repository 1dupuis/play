document.addEventListener("DOMContentLoaded", () => {
    const errorDetails = document.getElementById("error-details");

    if (window.location) {
        errorDetails.innerHTML = `<p>The URL that caused this error was: <strong>${window.location.href}</strong></p>`;
    }

    const reloadBtn = document.getElementById("reload-btn");
    reloadBtn.addEventListener("click", () => {
        window.location.href = '/';
    });
});
