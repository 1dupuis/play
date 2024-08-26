const blockedUrls = ['/contact','/extension'];
const blockedPage = '/blocked-page';

function isUrlBlocked(url) {
    return blockedUrls.some(blockedUrl => url.startsWith(blockedUrl));
}

function handleNavigation() {
    const currentPath = window.location.pathname;
    if (isUrlBlocked(currentPath) && currentPath !== blockedPage) {
        const redirectUrl = `${blockedPage}?from=${encodeURIComponent(currentPath)}`;
        window.location.href = redirectUrl;
    } else if (currentPath === blockedPage) {
        const params = new URLSearchParams(window.location.search);
        const fromPage = params.get('from');
        if (fromPage) {
            const messageElement = document.querySelector('p');
            if (messageElement) {
                messageElement.textContent = `Access to "${fromPage}" is restricted.`;
            }
        }
    }
}

// Handle navigation on page load
handleNavigation();

// Handle browser history navigation
window.addEventListener('popstate', handleNavigation);

// Intercept link clicks
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        const href = e.target.getAttribute('href');
        if (href && isUrlBlocked(href)) {
            e.preventDefault();
            window.location.href = `${blockedPage}?from=${encodeURIComponent(href)}`;
        }
    }
});
