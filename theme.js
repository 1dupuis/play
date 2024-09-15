// AIDarkModeManager.js

class AIDarkModeManager {
    constructor() {
        this.darkTheme = {
            '--backgroundColor': '#121212',
            '--containerBackgroundColor': '#1e1e1e',
            '--textColor': '#e0e0e0',
            '--linkColor': '#bb86fc',
            '--borderColor': '#3a3a3a',
            '--buttonBackgroundColor': '#3700B3',
            '--buttonTextColor': '#ffffff',
            '--progressBarColor': '#03DAC6',
            '--accentColor': '#CF6679',
            '--headerBackgroundColor': '#2d2d2d',
            '--footerBackgroundColor': '#2b2b2b',
            '--inputBackgroundColor': '#2d2d2d',
            '--inputTextColor': '#e0e0e0',
            '--placeholderTextColor': '#757575',
            '--hoverColor': '#333333',
            '--shadowColor': 'rgba(0, 0, 0, 0.5)',
            '--cardBackgroundColor': '#1e1e1e',
            '--cardBorderColor': '#444444',
            '--tooltipBackgroundColor': '#333333',
            '--tooltipTextColor': '#ffffff',
            '--toggleSwitchColor': '#03DAC6',
            '--codeBackgroundColor': '#2b2b2b',
            '--codeTextColor': '#f8f8f2',
            '--tableHeaderBackgroundColor': '#2d2d2d',
            '--tableRowEvenBackgroundColor': '#262626',
            '--tableRowOddBackgroundColor': '#1e1e1e',
            '--scrollbarThumbColor': '#555555',
            '--scrollbarTrackColor': '#2d2d2d',
            '--gameContainerBackgroundColor': '#1a1a1a',
            '--gameBorderColor': '#4a4a4a',
            '--gameTextColor': '#f0f0f0',
            '--modalBackgroundColor': 'rgba(0, 0, 0, 0.8)',
            '--modalContentBackgroundColor': '#2a2a2a',
            '--sidebarBackgroundColor': '#1c1c1c',
            '--sidebarTextColor': '#d0d0d0',
            '--chartBackgroundColor': '#242424',
            '--chartLineColor': '#bb86fc',
            '--chartGridColor': '#3a3a3a'
        };

        this.transitionDuration = 300; // ms
        this.theme = 'light';
        this.userPreferences = {
            scheduledDarkMode: false,
            darkModeStartTime: '20:00',
            darkModeEndTime: '06:00',
            autoDarkMode: false,
            lightSensor: true,
            eyeStrainPrevention: true,
            contrastMode: false,
            backgroundLearning: true,
            continuousTraining: true
        };
        this.features = [
            'time', 'deviceLight', 'batteryLevel', 'isCharging', 'isOnline',
            'scrollDepth', 'timeOnPage', 'mouseActivity', 'dayOfWeek', 'tabActive'
        ];
        this.mlModel = new EnhancedDarkModePredictor(this.features);
        this.trainingInterval = null;
        this.trainingTheme = null; // New property to store the theme during training
        this.pageLoadTime = Date.now();
        this.init();
    }
    
    initializeFeatures() {
        this.updateTime();
        this.updateDayOfWeek();
        this.updateOnlineStatus();
        this.updateTabActive();
        this.updateScrollDepth();
        this.updateTimeOnPage();
        this.updateBatteryStatus();
        this.updateLightSensor();
        
        // Initialize mouseActivity and scrollDepth to 0
        this.mlModel.updateFeature('mouseActivity', 0);
        this.mlModel.updateFeature('scrollDepth', 0);
    }
    
    updateTime() {
        const now = new Date();
        const minutes = now.getHours() * 60 + now.getMinutes();
        this.mlModel.updateFeature('time', minutes / 1440); // Normalize to [0, 1]
    }

    updateDayOfWeek() {
        const dayOfWeek = new Date().getDay();
        this.mlModel.updateFeature('dayOfWeek', dayOfWeek / 7); // Normalize to [0, 1]
    }

    updateOnlineStatus() {
        this.mlModel.updateFeature('isOnline', navigator.onLine ? 1 : 0);
    }

    updateTabActive() {
        this.mlModel.updateFeature('tabActive', document.hidden ? 0 : 1);
    }

    updateScrollDepth() {
        const scrollDepth = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        this.mlModel.updateFeature('scrollDepth', scrollDepth / 100); // Normalize to [0, 1]
    }

    updateTimeOnPage() {
        const timeOnPage = (Date.now() - this.pageLoadTime) / 1000 / 60; // in minutes
        this.mlModel.updateFeature('timeOnPage', Math.min(timeOnPage / 60, 1)); // Normalize to [0, 1], cap at 1 hour
    }

    updateBatteryStatus() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.mlModel.updateFeature('batteryLevel', battery.level);
                this.mlModel.updateFeature('isCharging', battery.charging ? 1 : 0);
            });
        } else {
            // If battery status is not available, set default values
            this.mlModel.updateFeature('batteryLevel', 1);
            this.mlModel.updateFeature('isCharging', 1);
        }
    }

    updateLightSensor() {
        if ('AmbientLightSensor' in window) {
            const sensor = new AmbientLightSensor();
            sensor.addEventListener('reading', () => {
                const normalizedLight = Math.min(sensor.illuminance / 1000, 1); // Normalize to [0, 1], cap at 1000 lux
                this.mlModel.updateFeature('deviceLight', normalizedLight);
            });
            sensor.start();
        } else {
            // If light sensor is not available, set a default value
            this.mlModel.updateFeature('deviceLight', 0.5);
        }
    }

    init() {
        this.createStyleElement();
        this.loadPreferences();
        this.applyTheme();
        this.setupEventListeners();
        this.startBackgroundTasks();
        this.setupTrainButton();
        this.initBackgroundLearning();
    }

    createStyleElement() {
        this.styleElement = document.createElement('style');
        document.head.appendChild(this.styleElement);
    }

    setupTrainButton() {
      if (this.theme === 'dark') {
        const trainButton = document.createElement('button');
        trainButton.id = 'ai-dark-mode-train';
        trainButton.textContent = 'Train Dark Mode AI';
        trainButton.style.cssText = `
            position: fixed;
            bottom: 5px;
            right: 5px;
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
        document.body.appendChild(trainButton);
        trainButton.addEventListener('click', this.toggleContinuousTraining.bind(this));
      }
    }

    loadPreferences() {
        try {
            const savedPreferences = localStorage.getItem('aiDarkModePreferences');
            if (savedPreferences) {
                this.userPreferences = { ...this.userPreferences, ...JSON.parse(savedPreferences) };
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
            // If there's an error, we'll use the default preferences
        }
        this.theme = localStorage.getItem('theme') || 'light';
    }

    savePreferences() {
        try {
            localStorage.setItem('aiDarkModePreferences', JSON.stringify(this.userPreferences));
            localStorage.setItem('theme', this.theme);
        } catch (error) {
            console.error('Error saving preferences:', error);
            this.showNotification('Unable to save preferences. Please check your browser settings.');
        }
    }

    setupEventListeners() {
        const toggle = document.getElementById('ai-dark-mode-toggle');
        if (toggle) {
            toggle.addEventListener('click', this.toggleTheme.bind(this));
        }
        window.addEventListener('online', this.updateOnlineStatus.bind(this));
        window.addEventListener('offline', this.updateOnlineStatus.bind(this));
        document.addEventListener('visibilitychange', this.updateTabActive.bind(this));
        window.addEventListener('scroll', this.throttle(this.updateScrollDepth.bind(this), 200));
        document.addEventListener('mousemove', this.throttle(() => {
            this.mlModel.updateFeature('mouseActivity', Date.now());
        }, 1000));

        // Update time-based features periodically
        setInterval(() => {
            this.updateTime();
            this.updateDayOfWeek();
            this.updateTimeOnPage();
        }, 60000); // Every minute

        // Update battery status periodically
        setInterval(this.updateBatteryStatus.bind(this), 300000); // Every 5 minutes
    }

    startBackgroundTasks() {
        this.scheduleTask(this.checkScheduledTheme.bind(this), 60000);
        this.scheduleTask(this.updateBatteryStatus.bind(this), 300000);
        this.scheduleTask(this.updateTimeOnPage.bind(this), 60000);
        this.scheduleTask(this.predictTheme.bind(this), 300000);
        this.scheduleTask(this.gatherUserBehaviorData.bind(this), 600000);
        
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
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.savePreferences();
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
        const cssVariables = Object.entries(this.darkTheme)
            .map(([key, value]) => `${key}: ${this.theme === 'dark' ? value : 'initial'};`)
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
                background-color: var(--inputBackgroundColor);
                color: var(--inputTextColor);
                border: 1px solid var(--borderColor);
            }
            
            ::placeholder {
                color: var(--placeholderTextColor);
            }
            
            .progress-bar, progress {
                background-color: var(--progressBarColor);
            }
            
            .card {
                background-color: var(--cardBackgroundColor);
                border: 1px solid var(--cardBorderColor);
            }
            
            code, pre {
                background-color: var(--codeBackgroundColor);
                color: var(--codeTextColor);
            }
            
            table {
                border-collapse: collapse;
            }
            
            th {
                background-color: var(--tableHeaderBackgroundColor);
            }
            
            tr:nth-child(even) {
                background-color: var(--tableRowEvenBackgroundColor);
            }
            
            tr:nth-child(odd) {
                background-color: var(--tableRowOddBackgroundColor);
            }
            
            ::-webkit-scrollbar {
                width: 12px;
            }
            
            ::-webkit-scrollbar-thumb {
                background-color: var(--scrollbarThumbColor);
            }
            
            ::-webkit-scrollbar-track {
                background-color: var(--scrollbarTrackColor);
            }

            .game-container {
                background-color: var(--gameContainerBackgroundColor);
                border: 1px solid var(--gameBorderColor);
                color: var(--gameTextColor);
            }

            .modal {
                background-color: var(--modalBackgroundColor);
            }

            .modal-content {
                background-color: var(--modalContentBackgroundColor);
            }

            .sidebar {
                background-color: var(--sidebarBackgroundColor);
                color: var(--sidebarTextColor);
            }

            .chart {
                background-color: var(--chartBackgroundColor);
            }

            .chart-line {
                stroke: var(--chartLineColor);
            }

            .chart-grid {
                stroke: var(--chartGridColor);
            }
        `;
    }

    updateGlobalStyles() {
        document.body.classList.toggle('ai-dark-mode', this.theme === 'dark');
    }

    handleSystemPreferenceChange(e) {
        if (this.userPreferences.autoDarkMode) {
            this.theme = e.matches ? 'dark' : 'light';
            this.savePreferences();
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

            const shouldBeDark = startTime < endTime
                ? (currentTime >= startTime && currentTime < endTime)
                : (currentTime >= startTime || currentTime < endTime);

            const newTheme = shouldBeDark ? 'dark' : 'light';

            if (newTheme !== this.theme) {
                this.theme = newTheme;
                this.savePreferences();
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

    updateNetworkStatus() {
        this.mlModel.updateFeature('isOnline', navigator.onLine);
    }

    updateBatteryStatus() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.mlModel.updateFeature('batteryLevel', battery.level * 100);
                this.mlModel.updateFeature('isCharging', battery.charging);
            });
        }
    }

    updateTimeOnPage() {
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
            const newTheme = shouldBeDark ? 'dark' : 'light';
            if (newTheme !== this.theme) {
                this.theme = newTheme;
                this.savePreferences();
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
            this.theme = 'dark';
            this.savePreferences();
            this.applyTheme();
            this.logUserAction('eye_strain_prevention');
            this.showNotification('Eye strain prevention activated. Taking a break is recommended.');
        }
    }

    predictTheme() {
        if (this.userPreferences.autoDarkMode) {
            const prediction = this.mlModel.predict();
            const newTheme = prediction ? 'dark' : 'light';
            
            if (newTheme !== this.theme) {
                this.theme = newTheme;
                this.savePreferences();
                this.applyTheme();
                this.logUserAction('ml_prediction');
            }
        }
    }

    logUserAction(action) {
        this.mlModel.train(this.theme === 'dark' ? 1 : 0);
        
        try {
            const actions = JSON.parse(localStorage.getItem('aiDarkModeActions') || '[]');
            actions.push({ action, timestamp: Date.now(), theme: this.theme });
            localStorage.setItem('aiDarkModeActions', JSON.stringify(actions));

            // Limit stored actions to last 100
            if (actions.length > 100) {
                actions.splice(0, actions.length - 100);
                localStorage.setItem('aiDarkModeActions', JSON.stringify(actions));
            }
        } catch (error) {
            console.error('Error logging user action:', error);
        }
    }

    showNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('AI Dark Mode', { body: message });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('AI Dark Mode', { body: message });
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

    handleVisibilityChange() {
        if (document.hidden) {
            this.mlModel.updateFeature('tabActive', false);
        } else {
            this.mlModel.updateFeature('tabActive', true);
            this.updateTimeOnPage();
        }
    }

    initBackgroundLearning() {
        if (this.userPreferences.backgroundLearning) {
            try {
                this.backgroundLearningWorker = new Worker('backgroundLearning.js');
                this.backgroundLearningWorker.onmessage = (event) => {
                    if (event.data.type === 'modelUpdate') {
                        this.mlModel.updateModel(event.data.model);
                    }
                };
            } catch (error) {
                console.error('Error initializing background learning:', error);
                this.showNotification('Unable to start background learning. Some features may be limited.');
            }
        }
    }

    gatherUserBehaviorData() {
        const behaviorData = {
            theme: this.theme,
            timeOnPage: this.mlModel.getFeatureValue('timeOnPage'),
            scrollDepth: this.mlModel.getFeatureValue('scrollDepth'),
            mouseActivity: this.mlModel.getFeatureValue('mouseActivity'),
            tabActive: this.mlModel.getFeatureValue('tabActive'),
            timestamp: Date.now()
        };

        try {
            let behaviorHistory = JSON.parse(localStorage.getItem('aiDarkModeBehaviorHistory') || '[]');
            behaviorHistory.push(behaviorData);

            // Keep only the last 100 entries to prevent localStorage from growing too large
            if (behaviorHistory.length > 100) {
                behaviorHistory = behaviorHistory.slice(-100);
            }

            localStorage.setItem('aiDarkModeBehaviorHistory', JSON.stringify(behaviorHistory));

            if (this.userPreferences.backgroundLearning && this.backgroundLearningWorker) {
                this.backgroundLearningWorker.postMessage({
                    type: 'newData',
                    data: behaviorData
                });
            }
        } catch (error) {
            console.error('Error gathering user behavior data:', error);
        }
    }

    toggleContinuousTraining() {
        this.userPreferences.continuousTraining = !this.userPreferences.continuousTraining;
        this.savePreferences();

        const trainButton = document.getElementById('ai-dark-mode-train');
        if (trainButton) {
            if (this.userPreferences.continuousTraining) {
                trainButton.textContent = 'Stop Training';
                this.startContinuousTraining();
            } else {
                trainButton.textContent = 'Train Dark Mode AI';
                this.stopContinuousTraining();
            }
        }
    }

    startContinuousTraining() {
        if (!this.trainingInterval) {
            this.trainingTheme = this.theme; // Set the training theme
            this.trainingInterval = setInterval(() => {
                this.trainIteration();
            }, 1000);
        }
    }

    stopContinuousTraining() {
        if (this.trainingInterval) {
            clearInterval(this.trainingInterval);
            this.trainingInterval = null;
            this.trainingTheme = null; // Reset the training theme
            this.applyModelPrediction(); // Apply the model's prediction after training
        }
    }

    trainIteration() {
        if (this.trainingTheme === null) {
            this.trainingTheme = this.theme; // Store the current theme when training starts
        }

        // Randomly adjust CSS properties for training
        this.adjustRandomCSSProperty();

        // Train the model based on the current state
        const currentState = this.getCurrentState();
        const label = this.trainingTheme === 'dark' ? 1 : 0;
        this.mlModel.train(currentState, label);

        // Don't apply the model's prediction during training
        // Instead, ensure the training theme is applied
        this.theme = this.trainingTheme;
        this.applyTheme();
    }
    
    adjustRandomCSSProperty() {
        const properties = Object.keys(this.darkTheme);
        const randomProperty = properties[Math.floor(Math.random() * properties.length)];
        const randomValue = this.generateRandomColor();
        
        // Store the original value
        const originalValue = this.darkTheme[randomProperty];
        
        // Apply the random value temporarily
        this.darkTheme[randomProperty] = randomValue;
        this.applyTheme();
        
        // Revert to the original value after a short delay
        setTimeout(() => {
            this.darkTheme[randomProperty] = originalValue;
            this.applyTheme();
        }, 100); // Adjust this delay as needed
    }

    applyModelPrediction() {
        const currentState = this.getCurrentState();
        const prediction = this.mlModel.predict(currentState);
        const newTheme = prediction > 0.5 ? 'dark' : 'light';
        
        if (newTheme !== this.theme) {
            this.theme = newTheme;
            localStorage.setItem('theme', this.theme);
            this.applyTheme();
        }
    }

    generateRandomColor() {
        return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    }

    getCurrentState() {
        return this.features.reduce((state, feature) => {
            state[feature] = this.mlModel.getFeatureValue(feature);
            return state;
        }, {});
    }

    getUserFeedback() {
        // For simplicity, we'll use a random feedback. In a real application, you'd want to get actual user feedback.
        return Math.random() > 0.5 ? 1 : 0;
    }
}

class EnhancedDarkModePredictor {
    constructor() {
        this.features = [
            'time', 'deviceLight', 'batteryLevel', 'isCharging', 'isOnline',
            'scrollDepth', 'timeOnPage', 'mouseActivity', 'dayOfWeek', 'tabActive'
        ];
        this.weights = {};
        this.bias = 0;
        this.learningRate = 0.01;
        this.initializeModel();
        this.loadModel();
    }

    initializeModel() {
        this.features.forEach(feature => {
            this.weights[feature] = Math.random() - 0.5;
        });
        this.bias = Math.random() - 0.5;
    }

    updateFeature(feature, value) {
        if (this.features.includes(feature)) {
            try {
                localStorage.setItem(`aiDarkMode_${feature}`, value.toString());
            } catch (error) {
                console.error(`Error updating feature ${feature}:`, error);
            }
        }
    }

    getFeatureValue(feature) {
        if (feature === 'time') {
            const now = new Date();
            return (now.getHours() * 60 + now.getMinutes()) / 1440; // Normalize to [0, 1]
        } else if (feature === 'dayOfWeek') {
            return new Date().getDay() / 7; // Normalize to [0, 1]
        } else {
            try {
                const value = localStorage.getItem(`aiDarkMode_${feature}`);
                return value ? parseFloat(value) : 0;
            } catch (error) {
                console.error(`Error getting feature value for ${feature}:`, error);
                return 0;
            }
        }
    }

    predict(features) {
        const logit = Object.keys(features).reduce((sum, feature) => {
            return sum + features[feature] * this.weights[feature];
        }, 0) + this.bias;
        return 1 / (1 + Math.exp(-logit));
    }

    train(features, label) {
        const prediction = this.predict(features);
        const error = label - prediction;

        Object.keys(features).forEach(feature => {
            this.weights[feature] += this.learningRate * error * features[feature];
        });
        this.bias += this.learningRate * error;

        this.saveModel();
    }

    loadModel() {
        try {
            const savedModel = localStorage.getItem('aiDarkModeModel');
            if (savedModel) {
                const { weights, bias } = JSON.parse(savedModel);
                if (typeof weights === 'object' && typeof bias === 'number') {
                    this.weights = weights;
                    this.bias = bias;
                } else {
                    throw new Error('Invalid model data');
                }
            }
        } catch (error) {
            console.error('Error loading model:', error);
            this.initializeModel();
        }
    }

    saveModel() {
        try {
            localStorage.setItem('aiDarkModeModel', JSON.stringify({
                weights: this.weights,
                bias: this.bias
            }));
        } catch (error) {
            console.error('Error saving model:', error);
        }
    }

    updateModel(newModel) {
        if (typeof newModel.weights === 'object' && typeof newModel.bias === 'number') {
            this.weights = newModel.weights;
            this.bias = newModel.bias;
            this.saveModel();
        } else {
            console.error('Invalid model update data');
        }
    }
}

// Initialize AIDarkModeManager

setTimeout(() => {
    const aiDarkModeManager = new AIDarkModeManager();
}, 0);
