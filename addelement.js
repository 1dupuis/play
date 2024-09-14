class ButtonManager {
    constructor() {
        this.config = {
            defaultButtonId: 'homeButton',
            defaultButtonText: 'Home',
            defaultButtonLink: 'search.html',
            defaultButtonPatterns: [/\/search/, /\/search\.html/],
            defaultButtonStyles: {
                position: 'fixed',
                top: '10px',
                left: '10px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                fontFamily: '"Arial", sans-serif',
                overflow: 'hidden'
            },
            defaultButtonHoverStyles: {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
            },
            defaultIconClass: 'fa-home' // Font Awesome home icon class
        };

        this.init();
    }

    // Initialize the manager
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.checkAndCreateButton();
        });
    }

    // Function to create and style a button
    createButton(config) {
        // Ensure the button does not already exist
        if (document.getElementById(config.buttonId)) {
            return;
        }

        const button = document.createElement('button');
        button.id = config.buttonId;
        button.innerHTML = `<i class="fas ${config.iconClass || this.config.defaultIconClass}"></i> ${config.buttonText || this.config.defaultButtonText}`;
        button.title = 'Go to Home'; // Accessibility improvement
        button.onclick = () => {
            window.location.href = config.buttonLink || this.config.defaultButtonLink;
        };

        // Apply button styles
        Object.assign(button.style, config.buttonStyles || this.config.defaultButtonStyles);

        // Add hover effect directly in JavaScript
        button.addEventListener('mouseover', () => {
            this.applyHoverStyles(button, config.buttonHoverStyles || this.config.defaultButtonHoverStyles);
        });
        button.addEventListener('mouseout', () => {
            this.removeHoverStyles(button);
        });

        // Append button to the body
        document.body.appendChild(button);
    }

    // Function to apply hover styles
    applyHoverStyles(button, hoverStyles) {
        button.style.transform = hoverStyles.transform;
        button.style.boxShadow = hoverStyles.boxShadow;
    }

    // Function to remove hover styles
    removeHoverStyles(button) {
        button.style.transform = '';
        button.style.boxShadow = '';
    }

    // Function to check if any link matches the desired patterns
    checkForExistingLink(patterns) {
        try {
            const anchors = document.querySelectorAll('a[href]');
            return Array.from(anchors).some(anchor => {
                const href = anchor.getAttribute('href') || '';
                return patterns.some(pattern => pattern.test(href));
            });
        } catch (error) {
            console.error('Failed to check for existing links:', error);
            return false;
        }
    }

    // Function to check if a button already exists
    checkForExistingButton(buttonId) {
        return !!document.getElementById(buttonId);
    }

    // Function to check and create the default button if needed
    checkAndCreateButton() {
        if (!this.checkForExistingButton(this.config.defaultButtonId) &&
            !this.checkForExistingLink(this.config.defaultButtonPatterns)) {
            this.createButton({
                buttonId: this.config.defaultButtonId,
                buttonText: this.config.defaultButtonText,
                buttonLink: this.config.defaultButtonLink,
                buttonPatterns: this.config.defaultButtonPatterns,
                buttonStyles: this.config.defaultButtonStyles,
                buttonHoverStyles: this.config.defaultButtonHoverStyles,
                iconClass: this.config.defaultIconClass
            });
        }
    }

    // Public method to allow creating custom buttons
    addCustomButton(config) {
        this.createButton(config);
    }
}

// Instantiate the ButtonManager
const buttonManager = new ButtonManager();
