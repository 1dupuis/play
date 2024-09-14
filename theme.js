class ThemeManager {
    constructor() {
        this.darkModeBase = {
            backgroundColor: '#121212',
            containerBackgroundColor: '#1e1e1e',
            textColor: '#e0e0e0',
            linkColor: '#bb86fc',
            borderColor: '#3a3a3a',
            minContrastRatio: 4.5,
        };
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('theme') === 'dark') {
                if (this.shouldAskForExperimentalDarkMode()) {
                    this.showExperimentalPrompt();
                } else {
                    this.applyTheme();
                }
                this.showHoverButton();
            } else {
                this.applyLightTheme(); // Optionally handle light theme
            }
        });
    }

    showExperimentalPrompt() {
        // Create prompt container
        const promptDiv = document.createElement('div');
        promptDiv.id = 'experimentPrompt';
        promptDiv.style.display = 'block';
        promptDiv.style.position = 'fixed';
        promptDiv.style.bottom = '20px';
        promptDiv.style.left = '20px';
        promptDiv.style.backgroundColor = '#333';
        promptDiv.style.color = '#fff';
        promptDiv.style.padding = '20px';
        promptDiv.style.borderRadius = '12px';
        promptDiv.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
        promptDiv.style.zIndex = '1000';
        promptDiv.style.maxWidth = '300px';
        promptDiv.style.textAlign = 'center';
        promptDiv.innerHTML = `
            <p>Would you like to try the experimental dark mode?</p>
            <button class="yes-button" style="margin: 5px; padding: 10px 20px; border: none; border-radius: 8px; background-color: #4caf50; color: white; cursor: pointer;">Yes</button>
            <button class="no-button" style="margin: 5px; padding: 10px 20px; border: none; border-radius: 8px; background-color: #f44336; color: white; cursor: pointer;">No</button>
        `;

        // Append to body
        document.body.appendChild(promptDiv);

        // Add button event listeners
        document.querySelector('#experimentPrompt .yes-button').addEventListener('click', () => this.handleUserResponse(true));
        document.querySelector('#experimentPrompt .no-button').addEventListener('click', () => this.handleUserResponse(false));
    }

    handleUserResponse(accepted) {
        const currentTime = Date.now();
        localStorage.setItem('experimentalDarkModeResponse', accepted ? 'yes' : 'no');
        localStorage.setItem('experimentalDarkModeTimestamp', currentTime);
        const promptDiv = document.getElementById('experimentPrompt');
        if (promptDiv) promptDiv.remove();

        if (accepted) {
            this.applyTheme();
        } else {
            this.resetToOriginalStyles(); // Reset to original styles
        }
    }

    shouldAskForExperimentalDarkMode() {
        const response = localStorage.getItem('experimentalDarkModeResponse');
        const timestamp = localStorage.getItem('experimentalDarkModeTimestamp');
        const currentTime = Date.now();

        if (response === 'yes' || response === 'no') {
            if (timestamp) {
                return (currentTime - parseInt(timestamp, 10)) > 2 * 24 * 60 * 60 * 1000;
            }
            return true; // Ask if no timestamp is available
        }
        return true; // Ask if no response is available
    }

    applyTheme() {
        this.convertLightToDark();
    }

    applyLightTheme() {
        //this.resetToOriginalStyles();
    }

    resetToOriginalStyles() {
        // Reset to original light mode styles
        document.body.style.transition = '';
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        this.convertElementStyles('*', 'backgroundColor', 'color', 'borderColor');
        document.querySelectorAll('*').forEach(element => {
            element.style.backgroundColor = '';
            element.style.color = '';
            element.style.borderColor = '';
        });
        localStorage.setItem('theme', 'light');
        window.location.reload(); // Refresh the page to apply changes
    }

    convertLightToDark() {
        this.applyBaseStyles();
        this.convertElementStyles('*', 'backgroundColor', 'color', 'borderColor');
        this.convertInlineStyles();
        this.adjustShadows();
        this.convertBackgroundImages();
        this.handlePseudoElements();
        this.handleSVGs();
    }

    applyBaseStyles() {
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        document.body.style.backgroundColor = this.darkModeBase.backgroundColor;
        document.body.style.color = this.darkModeBase.textColor;
    }

    convertElementStyles(selector, ...styles) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            styles.forEach(style => {
                const currentStyle = window.getComputedStyle(element)[style];
                if (currentStyle) {
                    const adjustedStyle = this.adjustColorForDarkMode(currentStyle, style);
                    element.style[style] = adjustedStyle;

                    if (style === 'backgroundColor' && element.tagName !== 'BODY') {
                        element.style.backgroundColor = this.darkModeBase.containerBackgroundColor;
                    }

                    if (style === 'color') {
                        const contrastTextColor = this.ensureContrast(adjustedStyle, this.darkModeBase.containerBackgroundColor);
                        element.style.color = contrastTextColor;
                    }

                    if (style === 'borderColor') {
                        element.style.borderColor = this.darkModeBase.borderColor;
                    }
                }
            });
        });
    }

    convertInlineStyles() {
        const elements = document.querySelectorAll('*[style]');
        elements.forEach(element => {
            const inlineStyles = element.getAttribute('style');
            const stylesToAdjust = ['color', 'backgroundColor', 'borderColor'];
            stylesToAdjust.forEach(style => {
                const regex = new RegExp(`${style}\\s*:\\s*([^;]+);?`, 'i');
                const match = inlineStyles.match(regex);
                if (match) {
                    const adjustedColor = this.adjustColorForDarkMode(match[1], style);
                    element.style[style] = adjustedColor;
                }
            });
        });
    }

    adjustShadows() {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const boxShadow = window.getComputedStyle(element)['boxShadow'];
            const textShadow = window.getComputedStyle(element)['textShadow'];

            if (boxShadow) {
                element.style.boxShadow = this.modifyShadowForDarkMode(boxShadow);
            }

            if (textShadow) {
                element.style.textShadow = this.modifyShadowForDarkMode(textShadow);
            }
        });
    }

    modifyShadowForDarkMode(shadow) {
        const shadowParts = shadow.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d*)?\)/);
        if (shadowParts) {
            let [_, r, g, b, a = 1] = shadowParts.map(Number);
            [r, g, b] = this.darkenRGB(r, g, b, 0.8);
            return `rgba(${r}, ${g}, ${b}, ${a})`;
        }
        return shadow;
    }

    darkenRGB(r, g, b, factor) {
        return [
            Math.max(0, Math.floor(r * factor)),
            Math.max(0, Math.floor(g * factor)),
            Math.max(0, Math.floor(b * factor))
        ];
    }

    convertBackgroundImages() {
        const images = document.querySelectorAll('img, div[style*="background-image"]');
        images.forEach(image => {
            image.style.filter = 'brightness(0.7)';
        });
    }

    handlePseudoElements() {
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
            *::before, *::after {
                background-color: ${this.darkModeBase.containerBackgroundColor} !important;
                color: ${this.darkModeBase.textColor} !important;
            }
        `, styleSheet.cssRules.length);
    }

    handleSVGs() {
        const svgElements = document.querySelectorAll('svg');
        svgElements.forEach(svg => {
            svg.style.fill = this.ensureContrast(svg.style.fill || this.darkModeBase.textColor, this.darkModeBase.backgroundColor);
            svg.style.stroke = this.ensureContrast(svg.style.stroke || this.darkModeBase.textColor, this.darkModeBase.backgroundColor);
        });
    }

    adjustColorForDarkMode(color, style) {
        if (style === 'color') {
            return this.ensureContrast(color, this.darkModeBase.containerBackgroundColor);
        } else if (style === 'backgroundColor') {
            return this.darkenColor(color);
        } else {
            return this.convertColor(color);
        }
    }

    ensureContrast(foregroundColor, backgroundColor) {
        const contrastRatio = this.calculateContrast(foregroundColor, backgroundColor);
        if (contrastRatio < this.darkModeBase.minContrastRatio) {
            return this.brightenColor(foregroundColor, (this.darkModeBase.minContrastRatio - contrastRatio) * 50);
        }
        return foregroundColor;
    }

    calculateContrast(fgColor, bgColor) {
        const fgLuminance = this.calculateLuminance(fgColor);
        const bgLuminance = this.calculateLuminance(bgColor);
        return (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
    }

    calculateLuminance(color) {
        const rgb = this.colorToRGB(color);
        const [r, g, b] = rgb.map(x => {
            x = x / 255;
            return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
        });
        return r * 0.2126 + g * 0.7152 + b * 0.0722;
    }

    colorToRGB(color) {
        if (color.startsWith('#')) {
            let r = parseInt(color.slice(1, 3), 16);
            let g = parseInt(color.slice(3, 5), 16);
            let b = parseInt(color.slice(5, 7), 16);
            return [r, g, b];
        } else {
            let [r, g, b] = color.match(/\d+/g).map(Number);
            return [r, g, b];
        }
    }

    darkenColor(color) {
        const rgb = this.colorToRGB(color);
        const factor = 0.2; // Adjust this factor to control darkness
        const darkened = rgb.map(x => Math.max(x - factor * 255, 0));
        return `rgb(${darkened.join(',')})`;
    }

    brightenColor(color, amount) {
        const rgb = this.colorToRGB(color);
        const brightened = rgb.map(x => Math.min(x + amount, 255));
        return `rgb(${brightened.join(',')})`;
    }

    convertColor(color) {
        // Placeholder for more advanced color conversion
        return color;
    }

    showHoverButton() {
        const hoverButton = document.createElement('div');
        hoverButton.id = 'hoverButton';
        hoverButton.style.position = 'fixed';
        hoverButton.style.bottom = '20px';
        hoverButton.style.right = '20px';
        hoverButton.style.backgroundColor = '#333';
        hoverButton.style.color = '#fff';
        hoverButton.style.padding = '10px 20px';
        hoverButton.style.borderRadius = '12px';
        hoverButton.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
        hoverButton.style.cursor = 'pointer';
        hoverButton.innerHTML = 'Change Experimental Dark Mode Setting';
        hoverButton.style.zIndex = '1000';

        hoverButton.addEventListener('mouseover', () => {
            hoverButton.style.backgroundColor = '#555';
        });

        hoverButton.addEventListener('mouseout', () => {
            hoverButton.style.backgroundColor = '#333';
        });

        hoverButton.addEventListener('click', () => {
            const currentChoice = localStorage.getItem('experimentalDarkModeResponse');
            const newChoice = currentChoice === 'yes' ? 'no' : 'yes';
            this.handleUserResponse(newChoice === 'yes');
        });

        document.body.appendChild(hoverButton);
    }
}

// Initialize ThemeManager
const themeManager = new ThemeManager();
