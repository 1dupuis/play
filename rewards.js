const gemCount = document.getElementById('gemCount');
const chupachupCount = document.getElementById('chupachupCount');
const rewardButton = document.getElementById('rewardButton');
const timer = document.getElementById('timer');
const streakCount = document.getElementById('streakCount');
const multiplierValue = document.getElementById('multiplierValue');
const shopButton = document.getElementById('shopButton');
const shopModal = document.getElementById('shopModal');
const shopItems = document.getElementById('shopItems');
const achievementsButton = document.getElementById('achievementsButton');
const achievementsModal = document.getElementById('achievementsModal');
const achievementsList = document.getElementById('achievementsList');
const closeButtons = document.getElementsByClassName('close');
const receiveChupachupButton = document.getElementById('receiveChupachupButton');

let gems = parseInt(localStorage.getItem('gems')) || 0;
let chupachups = parseInt(localStorage.getItem('chupachups')) || 0;
let lastClaimTime = parseInt(localStorage.getItem('lastClaimTime')) || 0;
let streak = parseInt(localStorage.getItem('streak')) || 0;

const shopInventory = [
    { name: 'Chupa Chup', cost: 1500, effect: () => { buyChupachup(); }, highlight: true },
    { name: 'Double Gems (24h)', cost: 1000, effect: () => { applyMultiplier(2, 24 * 60 * 60 * 1000); } },
    { name: 'Triple Gems (12h)', cost: 2000, effect: () => { applyMultiplier(3, 12 * 60 * 60 * 1000); } },
    { name: 'Instant Reward', cost: 500, effect: () => { claimReward(true); } },
    { name: 'Streak Saver', cost: 1500, effect: () => { buyStreakSaver(); } },
];

const achievements = [
    { name: 'Gem Collector', description: 'Collect 1,000 gems', check: () => gems >= 1000, reward: 100 },
    { name: 'Dedicated Player', description: 'Achieve a 7-day streak', check: () => streak >= 7, reward: 200 },
    { name: 'Shopaholic', description: 'Make 5 purchases from the shop', check: () => purchases >= 5, reward: 300 },
    { name: 'Gem Hoarder', description: 'Collect 10,000 gems', check: () => gems >= 10000, reward: 500 },
    { name: 'Chupa Chup Lover', description: 'Buy 5 Chupa Chups', check: () => chupachupsPurchased >= 5, reward: 1000 },
];

let currentMultiplier = parseFloat(localStorage.getItem('currentMultiplier')) || 1;
let multiplierEndTime = parseInt(localStorage.getItem('multiplierEndTime')) || 0;
let purchases = parseInt(localStorage.getItem('purchases')) || 0;
let streakSaver = parseInt(localStorage.getItem('streakSaver')) || 0;
let unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
let chupachupsPurchased = parseInt(localStorage.getItem('chupachupsPurchased')) || 0;

function updateGemCount() {
    gemCount.textContent = gems.toLocaleString();
    localStorage.setItem('gems', gems);
}

function updateChupachupCount() {
    chupachupCount.textContent = chupachups.toLocaleString();
    localStorage.setItem('chupachups', chupachups);
}

function updateStreak() {
    streakCount.textContent = streak;
    localStorage.setItem('streak', streak);
}

function getRewardAmount() {
    let baseReward;
    if (streak <= 6) {
        baseReward = Math.floor(Math.random() * 51) + 50;
    } else if (streak <= 13) {
        baseReward = Math.floor(Math.random() * 101) + 100;
    } else if (streak <= 20) {
        baseReward = Math.floor(Math.random() * 201) + 200;
    } else {
        baseReward = Math.floor(Math.random() * 401) + 400;
    }
    return Math.floor(baseReward * currentMultiplier);
}

function claimReward(instant = false) {
    const now = Date.now();
    if (!instant && now - lastClaimTime < 24 * 60 * 60 * 1000) {
        alert('You can only claim one reward per day!');
        return;
    }

    const rewardAmount = getRewardAmount();
    gems += rewardAmount;
    updateGemCount();
    
    if (!instant) {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const threeHoursInMs = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
       if (now - lastClaimTime <= oneDayInMs + threeHoursInMs) { // 3 hours grace period
            streak++;
        } else if (streakSaver > 0) {
            streakSaver--;
            localStorage.setItem('streakSaver', streakSaver);
            showRewardNotification('Streak Saver used!');
        } else {
            streak = 1;
        }
        updateStreak();
        lastClaimTime = now;
        localStorage.setItem('lastClaimTime', lastClaimTime);
    }
    
    showRewardNotification(`+${rewardAmount.toLocaleString()} gems!`);
    updateButtonState();
    checkAchievements();
}

function showRewardNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transition = 'opacity 0.5s';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 2500);
}

function updateButtonState() {
    const now = Date.now();
    const timeElapsed = now - lastClaimTime;
    const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (timeElapsed >= cooldownPeriod) {
        rewardButton.disabled = false;
        timer.textContent = 'Reward is ready!';
        timer.style.color = '#4CAF50';
    } else {
        rewardButton.disabled = true;
        const timeRemaining = cooldownPeriod - timeElapsed;
        const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
        const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
        const secondsRemaining = Math.floor((timeRemaining % (60 * 1000)) / 1000);
        timer.textContent = `Next reward in ${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s`;
        timer.style.color = '#666';
    }
}

function applyMultiplier(multiplier, duration) {
    currentMultiplier = multiplier;
    multiplierEndTime = Date.now() + duration;
    localStorage.setItem('multiplierEndTime', multiplierEndTime);
    localStorage.setItem('currentMultiplier', currentMultiplier);
    updateMultiplierDisplay();
}

function updateMultiplierDisplay() {
    const now = Date.now();
    if (now < multiplierEndTime) {
        const remainingTime = Math.ceil((multiplierEndTime - now) / 1000 / 60); // in minutes
        multiplierValue.textContent = `${currentMultiplier}x (${remainingTime} min)`;
    } else {
        currentMultiplier = 1;
        multiplierValue.textContent = '1x';
        localStorage.setItem('currentMultiplier', currentMultiplier);
    }
}

function populateShop() {
    shopItems.innerHTML = '';
    shopInventory.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = `shop-item ${item.highlight ? 'chupa-chup' : ''}`;
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>Cost: ${item.cost} gems</p>
            <button onclick="purchaseItem(${index})">Purchase</button>
        `;
        shopItems.appendChild(itemElement);
    });
}

function purchaseItem(index) {
    const item = shopInventory[index];
    if (gems >= item.cost) {
        gems -= item.cost;
        updateGemCount();
        item.effect();
        purchases++;
        localStorage.setItem('purchases', purchases);
        showRewardNotification(`Purchased ${item.name}`);
        checkAchievements();
    } else {
        alert('Not enough gems to purchase this item!');
    }
}

function buyStreakSaver() {
    streakSaver++;
    localStorage.setItem('streakSaver', streakSaver);
    showRewardNotification('Streak Saver purchased!');
}

function buyChupachup() {
    chupachups++;
    chupachupsPurchased++;
    updateChupachupCount();
    localStorage.setItem('chupachupsPurchased', chupachupsPurchased);
    showRewardNotification('Chupa Chup purchased! Enjoy your lollipop!');
}

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!unlockedAchievements.includes(achievement.name) && achievement.check()) {
            unlockedAchievements.push(achievement.name);
            gems += achievement.reward;
            updateGemCount();
            localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
            showRewardNotification(`Achievement unlocked: ${achievement.name}! +${achievement.reward} gems`);
        }
    });
    updateAchievementsList();
}

function updateAchievementsList() {
    achievementsList.innerHTML = '';
    achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${unlockedAchievements.includes(achievement.name) ? 'unlocked' : 'locked'}`;
        achievementElement.innerHTML = `
            <h3>${achievement.name}</h3>
            <p>${achievement.description}</p>
            <p>Reward: ${achievement.reward} gems</p>
        `;
        achievementsList.appendChild(achievementElement);
    });
}

function receiveChupachup() {
    if (chupachups > 0) {
        chupachups--;
        updateChupachupCount();
        alert('You successfully claimed a Chupa Chup! Show this to your teacher. 🍭');
    } else {
        alert('You don\'t have any Chupa Chups to receive! ❌');
    }
}

rewardButton.addEventListener('click', () => claimReward());

shopButton.addEventListener('click', () => {
    populateShop();
    shopModal.style.display = 'block';
});

achievementsButton.addEventListener('click', () => {
    updateAchievementsList();
    achievementsModal.style.display = 'block';
});

receiveChupachupButton.addEventListener('click', receiveChupachup);

Array.from(closeButtons).forEach(button => {
    button.addEventListener('click', () => {
        shopModal.style.display = 'none';
        achievementsModal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target == shopModal) {
        shopModal.style.display = 'none';
    }
    if (event.target == achievementsModal) {
        achievementsModal.style.display = 'none';
    }
});

// Initialize
updateGemCount();
updateChupachupCount();
updateStreak();
updateButtonState();
updateMultiplierDisplay();
checkAchievements();

// Update timer and multiplier every second
setInterval(() => {
    updateButtonState();
    updateMultiplierDisplay();
}, 1000);
