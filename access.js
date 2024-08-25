const blockedUrls = ['/cafe', '/page2', '/admin', '/private'];
const secretCode = '/access';
const blockedPage = '/blocked-page';

function isUrlBlocked(url) {
    return blockedUrls.some(blockedUrl => {
        // Check if the URL starts with a blocked URL and doesn't end with the secret code
        const isBlockedBase = url === blockedUrl || (url.startsWith(blockedUrl) && !url.endsWith(secretCode));
        const isExactMatch = url === blockedUrl;
        return isBlockedBase && !url.startsWith(blockedUrl + secretCode) && !isExactMatch;
    });
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

// Intercept link clicks, including those without href attributes
document.addEventListener('click', function(e) {
    let target = e.target;
    
    // Traverse up the DOM tree to find the nearest anchor tag, in case the click target is nested within one
    while (target && target.tagName !== 'A') {
        target = target.parentNode;
    }
    
    if (target && target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href && isUrlBlocked(href)) {
            e.preventDefault();
            window.location.href = `${blockedPage}?from=${encodeURIComponent(href)}`;
        }
    }
});

// Monitor dynamically loaded content for clicks
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            document.addEventListener('click', function(e) {
                let target = e.target;
                
                while (target && target.tagName !== 'A') {
                    target = target.parentNode;
                }
                
                if (target && target.tagName === 'A') {
                    const href = target.getAttribute('href');
                    if (href && isUrlBlocked(href)) {
                        e.preventDefault();
                        window.location.href = `${blockedPage}?from=${encodeURIComponent(href)}`;
                    }
                }
            });
        }
    });
});

// Observe the entire document for changes
observer.observe(document.body, { childList: true, subtree: true });
