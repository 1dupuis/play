// script.js

// Function to dynamically add instructions based on the user's OS
function generateInstructions() {
    const instructionsContainer = document.getElementById('instructions');

    // Get user agent to determine OS
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions;

    if (userAgent.indexOf('win') !== -1) {
        instructions = `
            <h2>Windows</h2>
            <ol>
                <li>Click the "Download Now" button above.</li>
                <li>Save the <strong>dupuis-extension.zip</strong> file to your computer.</li>
                <li>Extract the contents of the .zip file.</li>
                <li>Open Chrome and go to <a href="chrome://extensions/" target="_blank">chrome://extensions/</a>.</li>
                <li>Enable "Developer mode" in the top right corner.</li>
                <li>Click "Load unpacked" and select the extracted folder.</li>
                <li>The extension will now be installed!</li>
            </ol>
        `;
    } else if (userAgent.indexOf('mac') !== -1) {
        instructions = `
            <h2>MacOS</h2>
            <ol>
                <li>Click the "Download Now" button above.</li>
                <li>Save the <strong>dupuis-extension.zip</strong> file to your computer.</li>
                <li>Extract the contents of the .zip file.</li>
                <li>Open Chrome and go to <a href="chrome://extensions/" target="_blank">chrome://extensions/</a>.</li>
                <li>Enable "Developer mode" in the top right corner.</li>
                <li>Click "Load unpacked" and select the extracted folder.</li>
                <li>The extension will now be installed!</li>
            </ol>
        `;
    } else if (userAgent.indexOf('linux') !== -1) {
        instructions = `
            <h2>Linux</h2>
            <ol>
                <li>Click the "Download Now" button above.</li>
                <li>Save the <strong>dupuis-extension.zip</strong> file to your computer.</li>
                <li>Extract the contents of the .zip file.</li>
                <li>Open Chrome and go to <a href="chrome://extensions/" target="_blank">chrome://extensions/</a>.</li>
                <li>Enable "Developer mode" in the top right corner.</li>
                <li>Click "Load unpacked" and select the extracted folder.</li>
                <li>The extension will now be installed!</li>
            </ol>
        `;
    } else {
        instructions = `
            <h2>Unsupported OS</h2>
            <p>We are unable to detect your operating system. Please follow general instructions:</p>
            <ol>
                <li>Click the "Download Now" button above.</li>
                <li>Save the <strong>dupuis-extension.zip</strong> file to your computer.</li>
                <li>Extract the contents of the .zip file.</li>
                <li>Open Chrome and go to <a href="chrome://extensions/" target="_blank">chrome://extensions/</a>.</li>
                <li>Enable "Developer mode" in the top right corner.</li>
                <li>Click "Load unpacked" and select the extracted folder.</li>
                <li>The extension will now be installed!</li>
            </ol>
        `;
    }

    instructionsContainer.innerHTML = instructions;
}

// Call function on page load
document.addEventListener('DOMContentLoaded', generateInstructions);
