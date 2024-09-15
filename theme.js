// theme.js
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
      if (localStorage.getItem('theme') === 'dark') {
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
        const savedPreferences = this.getCookie('aiThemePreferences');
        if (savedPreferences) {
            this.userPreferences = JSON.parse(savedPreferences);
        }
        this.isDarkMode = localStorage.getItem('theme') === 'dark'
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
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light', 365);
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
    if (!this.isDarkMode) {
        // If it's light mode, stop the script.
        return;
    }
    
    const theme = this.darkTheme;
    const cssVariables = Object.entries(theme)
        .map(([key, value]) => `${key.replace('dark-', '').replace('light-', '')}: ${value};`)
        .join('\n');

    this.styleElement.textContent = `
        :root {
            ${cssVariables}
        }

        body, body * {
            transition: background-color ${this.transitionDuration}ms, 
                        color ${this.transitionDuration}ms, 
                        border-color ${this.transitionDuration}ms;
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
        if (!this.getCookie('aiTheme')) {
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
        const scrollDepth = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        this.mlModel.updateFeature('scrollDepth', scrollDepth);
    }

    updateMouseActivity() {
        this.mlModel.updateFeature('mouseActivity', Date.now());
    }

    updateNetworkType() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            this.mlModel.updateFeature('networkType', connection.type);
        }
    }

    updateBatteryStatus() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.mlModel.updateFeature('batteryLevel', battery.level * 100);
            });
        }
    }

    updateTimeOnPage() {
        if (!this.pageLoadTime) {
            this.pageLoadTime = Date.now();
        }
        const timeOnPage = (Date.now() - this.pageLoadTime) / 1000 / 60; // in minutes
        this.mlModel.updateFeature('timeOnPage', timeOnPage);
    }

    setupLightSensor() {
        if ('AmbientLightSensor' in window) {
            const sensor = new AmbientLightSensor();
            sensor.addEventListener('reading', () => {
                this.mlModel.updateFeature('deviceLight', sensor.illuminance);
                this.checkLightLevels(sensor.illuminance);
            });
            sensor.start();
        }
    }

    checkLightLevels(illuminance) {
        if (this.userPreferences.autoDarkMode) {
            const shouldBeDark = illuminance < 10; // 10 lux as a threshold for dark environments
            if (shouldBeDark !== this.isDarkMode) {
                this.isDarkMode = shouldBeDark;
                this.applyTheme();
                this.logUserAction('light_sensor_change');
            }
        }
    }

    checkEyeStrain() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const timeOnPage = this.mlModel.getFeatureValue('timeOnPage');

        if (timeOnPage > 30 && currentTime > this.timeStringToMinutes('22:00')) {
            this.isDarkMode = true;
            this.applyTheme();
            this.logUserAction('eye_strain_prevention');
            this.showNotification('Eye strain prevention activated. Taking a break is recommended.');
        }
    }

    predictTheme() {
        if (this.userPreferences.autoDarkMode) {
            const prediction = this.mlModel.predict();
            
            if (prediction !== this.isDarkMode) {
                this.isDarkMode = prediction;
                this.applyTheme();
                this.logUserAction('ml_prediction');
            }
        }
    }

    logUserAction(action) {
        this.mlModel.train(this.isDarkMode ? 1 : 0);
        
        // Log action for future analysis
        const actions = JSON.parse(this.getCookie('aiThemeActions') || '[]');
        actions.push({ action, timestamp: Date.now(), isDarkMode: this.isDarkMode });
        this.setCookie('aiThemeActions', JSON.stringify(actions), 365);
    }

    showNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('AI Theme', { body: message });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('AI Theme', { body: message });
                }
            });
        }
    }

    throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }

    setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    }

    getCookie(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    }
}

class DarkModePredictor {
    constructor() {
        this.features = [
            'time', 'deviceLight', 'batteryLevel', 'networkType',
            'scrollDepth', 'timeOnPage', 'mouseActivity'
        ];
        this.weights = new Array(this.features.length).fill(0);
        this.bias = 0;
        this.learningRate = 0.01;
        this.loadModel();
    }

    updateFeature(feature, value) {
        if (this.features.includes(feature)) {
            localStorage.setItem(`aiTheme_${feature}`, value.toString());
        }
    }

    getFeatureValue(feature) {
        const value = localStorage.getItem(`aiTheme_${feature}`);
        return value ? parseFloat(value) : 0;
    }

    predict() {
        const features = this.features.map(feature => this.getFeatureValue(feature));
        const logit = features.reduce((sum, feature, index) => sum + feature * this.weights[index], 0) + this.bias;
        return 1 / (1 + Math.exp(-logit)) > 0.5;
    }

    train(label) {
        const features = this.features.map(feature => this.getFeatureValue(feature));
        const prediction = this.predict();
        const error = label - prediction;

        this.weights = this.weights.map((weight, index) => 
            weight + this.learningRate * error * features[index]
        );
        this.bias += this.learningRate * error;

        this.saveModel();
    }

    loadModel() {
        const savedModel = localStorage.getItem('aiThemeModel');
        if (savedModel) {
            const { weights, bias } = JSON.parse(savedModel);
            this.weights = weights;
            this.bias = bias;
        }
    }

    saveModel() {
        localStorage.setItem('aiThemeModel', JSON.stringify({
            weights: this.weights,
            bias: this.bias
        }));
    }
}

// Initialize AIDarkModeManager
const aiDarkModeManager = new AIDarkModeManager();
