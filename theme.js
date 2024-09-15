class AIDarkModeManager {
    constructor() {
        this.darkTheme = {
          '--dark-backgroundColor': '#121212',
          '--dark-containerBackgroundColor': '#1e1e1e',
          '--dark-textColor': '#e0e0e0',
          '--dark-linkColor': '#bb86fc',
          '--dark-borderColor': '#3a3a3a',
          '--dark-buttonBackgroundColor': '#3700B3',
          '--dark-buttonTextColor': '#ffffff',
          '--dark-progressBarColor': '#03DAC6',
          '--dark-accentColor': '#CF6679',
          '--dark-headerBackgroundColor': '#2d2d2d',
          '--dark-footerBackgroundColor': '#2b2b2b',
          '--dark-inputBackgroundColor': '#2d2d2d',
          '--dark-inputTextColor': '#e0e0e0',
          '--dark-placeholderTextColor': '#757575',
          '--dark-hoverColor': '#333333',
          '--dark-shadowColor': 'rgba(0, 0, 0, 0.5)',
          '--dark-cardBackgroundColor': '#1e1e1e',
          '--dark-cardBorderColor': '#444444',
          '--dark-tooltipBackgroundColor': '#333333',
          '--dark-tooltipTextColor': '#ffffff',
          '--dark-toggleSwitchColor': '#03DAC6',
          '--dark-gameContainerBackgroundColor': '#2e2e2e',
          '--dark-gameContainerBorderColor': '#4a4a4a',
          '--dark-gameContainerTextColor': '#e0e0e0',
          '--dark-gameButtonBackgroundColor': '#6200ea',
          '--dark-gameButtonTextColor': '#ffffff',
          '--dark-gameHeaderBackgroundColor': '#3d3d3d',
          '--dark-gameFooterBackgroundColor': '#3b3b3b'
        };

        this.lightTheme = {
          '--light-backgroundColor': '#ffffff',
          '--light-containerBackgroundColor': '#f0f0f0',
          '--light-textColor': '#333333',
          '--light-linkColor': '#1a73e8',
          '--light-borderColor': '#d1d1d1',
          '--light-buttonBackgroundColor': '#1a73e8',
          '--light-buttonTextColor': '#ffffff',
          '--light-progressBarColor': '#1a73e8',
          '--light-accentColor': '#d93025',
          '--light-headerBackgroundColor': '#f8f8f8',
          '--light-footerBackgroundColor': '#e5e5e5',
          '--light-inputBackgroundColor': '#ffffff',
          '--light-inputTextColor': '#333333',
          '--light-placeholderTextColor': '#888888',
          '--light-hoverColor': '#eaeaea',
          '--light-shadowColor': 'rgba(0, 0, 0, 0.1)',
          '--light-cardBackgroundColor': '#f0f0f0',
          '--light-cardBorderColor': '#e0e0e0',
          '--light-tooltipBackgroundColor': '#f7f7f7',
          '--light-tooltipTextColor': '#333333',
          '--light-toggleSwitchColor': '#1a73e8',
          '--light-gameContainerBackgroundColor': '#f9f9f9',
          '--light-gameContainerBorderColor': '#e0e0e0',
          '--light-gameContainerTextColor': '#333333',
          '--light-gameButtonBackgroundColor': '#1a73e8',
          '--light-gameButtonTextColor': '#ffffff',
          '--light-gameHeaderBackgroundColor': '#f1f1f1',
          '--light-gameFooterBackgroundColor': '#e9e9e9'
        };

        this.transitionDuration = 300; // ms
        this.isDarkMode = false;
        this.userPreferences = {
            scheduledDarkMode: false,
            darkModeStartTime: '20:00',
            darkModeEndTime: '06:00',
            autoDarkMode: true,
            lightSensor: false,
            eyeStrainPrevention: false
        };
        this.mlModel = new DarkModePredictor();
        this.init();
    }

    init() {
        this.createStyleElement();
        this.loadPreferences();
        this.applyTheme();
        this.setupEventListeners();
        this.startBackgroundTasks();
        this.setupToggle();
    }

    createStyleElement() {
        this.styleElement = document.createElement('style');
        document.head.appendChild(this.styleElement);
    }

    setupToggle() {
      if (this.getLocalStorage('theme') === 'dark') {
        const toggle = document.createElement('button');
        toggle.id = 'ai-dark-mode-toggle';
        toggle.textContent = 'AI Theme';
        toggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background-color: var(--buttonBackgroundColor);
            color: var(--buttonTextColor);
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        `;
        document.body.appendChild(toggle);
      }
    }

    loadPreferences() {
        const savedPreferences = this.getLocalStorage('aiThemePreferences');
        if (savedPreferences) {
            this.userPreferences = JSON.parse(savedPreferences);
        }
        this.isDarkMode = this.getLocalStorage('theme') === 'dark';
    }

    setupEventListeners() {
        const toggle = document.getElementById('ai-dark-mode-toggle');
        if (toggle) {
            toggle.addEventListener('click', this.toggleTheme.bind(this));
        }
        window.matchMedia('(prefers-color-scheme: dark)').addListener(this.handleSystemPreferenceChange.bind(this));
        document.addEventListener('DOMContentLoaded', this.applyTheme.bind(this));
        window.addEventListener('scroll', this.throttle(this.updateScrollDepth.bind(this), 200));
        document.addEventListener('mousemove', this.throttle(this.updateMouseActivity.bind(this), 1000));
        window.addEventListener('online', this.updateNetworkType.bind(this));
        window.addEventListener('offline', this.updateNetworkType.bind(this));
    }

    startBackgroundTasks() {
        this.scheduleTask(this.checkScheduledTheme.bind(this), 60000);
        this.scheduleTask(this.updateBatteryStatus.bind(this), 300000);
        this.scheduleTask(this.updateTimeOnPage.bind(this), 60000);
        this.scheduleTask(this.predictTheme.bind(this), 300000);
        
        if (this.userPreferences.lightSensor) {
            this.setupLightSensor();
        }
        
        if (this.userPreferences.eyeStrainPrevention) {
            this.scheduleTask(this.checkEyeStrain.bind(this), 600000);
        }
    }

    scheduleTask(task, interval) {
        setInterval(task, interval);
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.setLocalStorage('aiTheme', this.isDarkMode ? 'dark' : 'light');
        this.applyTheme();
        this.logUserAction('manual_toggle');
    }

    applyTheme() {
        requestAnimationFrame(() => {
            this.updateCSSVariables();
            this.updateGlobalStyles();
        });
    }

    updateCSSVariables() {
        const theme = this.isDarkMode ? this.darkTheme : this.lightTheme;
        const cssVariables = Object.entries(theme)
            .map(([key, value]) => `${key.replace('dark-', '').replace('light-', '')}: ${value};`)
            .join('\n');
        this.styleElement.textContent = `
            :root {
                ${cssVariables}
            }
            
            body, body * {
                transition: background-color ${this.transitionDuration}ms, color ${this.transitionDuration}ms, border-color ${this.transitionDuration}ms;
            }
            
            ${this.generateThemeStyles()}
        `;
    }

    generateThemeStyles() {
        return `
            body {
                background-color: var(--backgroundColor);
                color: var(--textColor);
            }
            
            a {
                color: var(--linkColor);
            }
            
            button, .button {
                background-color: var(--buttonBackgroundColor);
                color: var(--buttonTextColor);
                border: none;
                border-radius: 4px;
                padding: 8px 16px;
                cursor: pointer;
            }
            
            input, textarea, select {
                background-color: var(--containerBackgroundColor);
                color: var(--textColor);
                border: 1px solid var(--borderColor);
            }
            
            .progress-bar, progress {
                background-color: var(--progressBarColor);
                height: 8px;
                border-radius: 4px;
            }
            
            .game-container {
                background-color: var(--containerBackgroundColor);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border: 1px solid var(--borderColor);
            }
            
            .heart {
                color: var(--accentColor);
            }
            
            .game-text {
                color: var(--textColor);
            }
        `;
    }

    updateGlobalStyles() {
        document.body.classList.toggle('ai-dark-mode', this.isDarkMode);
    }

    handleSystemPreferenceChange(e) {
        if (!this.getLocalStorage('aiTheme')) {
            this.isDarkMode = e.matches;
            this.applyTheme();
            this.logUserAction('system_preference_change');
        }
    }

    checkScheduledTheme() {
        if (this.userPreferences.scheduledDarkMode) {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const startTime = this.timeStringToMinutes(this.userPreferences.darkModeStartTime);
            const endTime = this.timeStringToMinutes(this.userPreferences.darkModeEndTime);

            const newDarkMode = startTime < endTime
                ? (currentTime >= startTime && currentTime < endTime)
                : (currentTime >= startTime || currentTime < endTime);

            if (newDarkMode !== this.isDarkMode) {
                this.isDarkMode = newDarkMode;
                this.applyTheme();
                this.logUserAction('scheduled_change');
            }
        }
    }

    timeStringToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    updateScrollDepth() {
        const scrollDepth = window.scrollY || document.documentElement.scrollTop;
        this.setLocalStorage('scrollDepth', scrollDepth);
    }

    updateMouseActivity() {
        const mouseMovement = new Date().getTime();
        this.setLocalStorage('mouseActivity', mouseMovement);
    }

    updateNetworkType() {
        const networkType = navigator.onLine ? 'online' : 'offline';
        this.setLocalStorage('networkType', networkType);
    }

    updateBatteryStatus() {
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                this.setLocalStorage('batteryLevel', battery.level);
            });
        }
    }

    updateTimeOnPage() {
        const timeOnPage = (this.getLocalStorage('timeOnPage') || 0) + 1;
        this.setLocalStorage('timeOnPage', timeOnPage);
    }

    checkEyeStrain() {
        // Notify the user to take a break every 20 minutes (standard eye-strain prevention rule)
        const timeOnPage = this.getLocalStorage('timeOnPage') || 0;
        if (timeOnPage >= 20) {
            alert('It\'s time to take a break to prevent eye strain.');
        }
    }

    predictTheme() {
        const userContext = {
            scrollDepth: this.getLocalStorage('scrollDepth'),
            mouseActivity: this.getLocalStorage('mouseActivity'),
            batteryLevel: this.getLocalStorage('batteryLevel'),
            timeOnPage: this.getLocalStorage('timeOnPage'),
            networkType: this.getLocalStorage('networkType')
        };
        const predictedDarkMode = this.mlModel.predictDarkMode(userContext);

        if (predictedDarkMode !== this.isDarkMode) {
            this.isDarkMode = predictedDarkMode;
            this.applyTheme();
            this.logUserAction('ml_prediction');
        }
    }

    setupLightSensor() {
        if ('AmbientLightSensor' in window) {
            try {
                const sensor = new AmbientLightSensor();
                sensor.addEventListener('reading', () => {
                    if (sensor.illuminance < 50 && !this.isDarkMode) {
                        this.isDarkMode = true;
                        this.applyTheme();
                    } else if (sensor.illuminance >= 50 && this.isDarkMode) {
                        this.isDarkMode = false;
                        this.applyTheme();
                    }
                    this.setLocalStorage('ambientLight', sensor.illuminance);
                });
                sensor.start();
            } catch (e) {
                console.error('Ambient Light Sensor not supported:', e);
            }
        }
    }

    logUserAction(action) {
        console.log(`User performed action: ${action}`);
    }

    getLocalStorage(key) {
        return localStorage.getItem(key);
    }

    setLocalStorage(key, value) {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }

    throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function () {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
}

// Sample DarkModePredictor class
class DarkModePredictor {
    predictDarkMode(userContext) {
        // Simple prediction logic, could be replaced with more complex ML model
        const { scrollDepth, mouseActivity, batteryLevel, timeOnPage, networkType } = userContext;

        if (scrollDepth > 200 || timeOnPage > 15 || networkType === 'offline' || batteryLevel < 0.2) {
            return true; // Predict dark mode
        }
        return false; // Predict light mode
    }
}

// Initialize the manager
const aiDarkModeManager = new AIDarkModeManager();
