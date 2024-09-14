class ThemeManager {
    constructor() {
        // Base dark mode colors
        this.darkModeBase = {
            backgroundColor: '#121212',
            color: '#e0e0e0',
            linkColor: '#bb86fc'
        };

        // Initialize the ThemeManager
        this.init();
    }

    // Initialize the ThemeManager
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            try {
                this.applyTheme();
            } catch (error) {
                console.error('Error applying theme:', error);
            }
        });
    }

    // Apply the theme based on current styles
    applyTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            this.convertLightToDark();
        }
    }

    // Convert light mode styles to dark mode dynamically
    convertLightToDark() {
        this.applyDarkModeBaseStyles();
        this.convertElementStyles('button', 'backgroundColor', 'color');
        this.convertElementStyles('a', 'color');
        this.convertElementStyles('header, footer, section, article', 'backgroundColor', 'color');
        this.convertBackgroundImages();
    }

    // Apply base dark mode styles to the page
    applyDarkModeBaseStyles() {
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        document.body.style.backgroundColor = this.darkModeBase.backgroundColor;
        document.body.style.color = this.darkModeBase.color;
    }

    // Convert element styles from light to dark mode
    convertElementStyles(selector, ...styles) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            styles.forEach(style => {
                const currentStyle = window.getComputedStyle(element)[style];
                if (currentStyle) {
                    const convertedStyle = this.convertColor(currentStyle);
                    element.style[style] = convertedStyle;
                }
            });
        });
    }

    // Convert background images (if any) to darker tones
    convertBackgroundImages() {
        const images = document.querySelectorAll('img');
        images.forEach(image => {
            const src = image.src;
            if (src) {
                image.style.filter = 'brightness(0.7)'; // Darken image
            }
        });
    }

    // Convert color from light to dark mode
    convertColor(color) {
        if (!color || color === 'rgba(0, 0, 0, 0)') return this.darkModeBase.backgroundColor;

        // Handle different color formats
        const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        const hexMatch = color.match(/^#([0-9a-fA-F]{6})$/);
        const hslMatch = color.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);

        if (rgbMatch) {
            let [_, r, g, b] = rgbMatch.map(Number);
            return this.darkenRGB(r, g, b);
        } else if (hexMatch) {
            let hex = hexMatch[1];
            let [r, g, b] = [0, 1, 2].map(i => parseInt(hex.substr(i * 2, 2), 16));
            return this.darkenRGB(r, g, b);
        } else if (hslMatch) {
            let [_, h, s, l] = hslMatch.map(Number);
            return this.hslToRgb(h, s, Math.max(0, l - 20));
        }

        return this.darkModeBase.backgroundColor; // Default dark color if format is unknown
    }

    // Darken RGB color by reducing brightness
    darkenRGB(r, g, b) {
        const factor = 0.6; // Darkening factor
        r = Math.max(0, Math.min(255, Math.round(r * factor)));
        g = Math.max(0, Math.min(255, Math.round(g * factor)));
        b = Math.max(0, Math.min(255, Math.round(b * factor)));
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Convert HSL to RGB
    hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let [r, g, b] = [0, 0, 0];

        if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
        else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
        else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
        else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
        else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
        else if (300 <= h && h < 360) [r, g, b] = [c, 0, x];

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return `rgb(${r}, ${g}, ${b})`;
    }
}

// Instantiate the ThemeManager
const themeManager = new ThemeManager();
