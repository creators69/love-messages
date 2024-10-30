export class LoveMessageApp {
    constructor() {
        this.messages = [
            "Every time I see you smile, my heart skips a beat ❤️",
            "i miss you every minute of my life ",
            "you are so intelligent ",
            "Every moment with you is a moment I treasure forever 💝"
        ];

        this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        this.nextRevealTime = Number(localStorage.getItem('nextRevealTime')) || 0;
        this.history = JSON.parse(localStorage.getItem('messageHistory')) || [];

        this.initializeElements();
        this.attachEventListeners();
        
        if (!this.isAuthenticated) {
            this.showPasswordPrompt();
        } else {
            this.showMainContent();
        }

        setInterval(() => this.updateTimer(), 1000);
    }

    initializeElements() {
        this.revealButton = document.getElementById('revealButton');
        this.timerDisplay = document.getElementById('timer');
        this.messageDisplay = document.getElementById('messageDisplay');
        this.menuButton = document.getElementById('menuButton');
        this.closeMenu = document.getElementById('closeMenu');
        this.menu = document.getElementById('menu');
        this.messageHistory = document.getElementById('messageHistory');
        this.clearHistory = document.getElementById('clearHistory');
        this.container = document.querySelector('.container');
    }

    showPasswordPrompt() {
        this.container.style.display = 'none';
        this.menuButton.style.display = 'none';
        this.menu.style.display = 'none';

        const promptDiv = document.createElement('div');
        promptDiv.className = 'password-prompt';
        promptDiv.innerHTML = `
            <div class="password-container">
                <h2>Enter Code to Access Messages</h2>
                <input type="password" id="passwordInput" placeholder="Enter code">
                <button id="submitPassword">Submit</button>
                <p id="errorMessage" style="color: #e91e63; display: none;">Incorrect code. Try again!</p>
            </div>
        `;
        document.body.appendChild(promptDiv);

        const submitButton = document.getElementById('submitPassword');
        const passwordInput = document.getElementById('passwordInput');
        const errorMessage = document.getElementById('errorMessage');

        submitButton.addEventListener('click', () => {
            if (passwordInput.value === 'love69') {
                localStorage.setItem('isAuthenticated', 'true');
                promptDiv.remove();
                this.showMainContent();
            } else {
                errorMessage.style.display = 'block';
                passwordInput.value = '';
            }
        });

        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
    }

    showMainContent() {
        this.container.style.display = 'block';
        this.menuButton.style.display = 'block';
        this.menu.style.display = 'block';
        this.updateTimer();
        this.updateHistory();
    }

    attachEventListeners() {
        this.revealButton.addEventListener('click', () => this.revealMessage());
        this.menuButton.addEventListener('click', () => this.toggleMenu());
        this.closeMenu.addEventListener('click', () => this.toggleMenu());
        this.clearHistory.addEventListener('click', () => this.clearMessageHistory());
    }

    createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 3000);
    }

    revealMessage() {
        const now = Date.now();
        if (now < this.nextRevealTime) return;

        const message = this.messages[Math.floor(Math.random() * this.messages.length)];
        this.messageDisplay.innerHTML = `<div class="message">${message}</div>`;
        this.nextRevealTime = now + 60000;
        localStorage.setItem('nextRevealTime', this.nextRevealTime);

        this.history.push({
            message,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('messageHistory', JSON.stringify(this.history));
        this.updateHistory();

        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.createHeart(), i * 300);
        }
    }

    updateTimer() {
        const now = Date.now();
        if (now < this.nextRevealTime) {
            const seconds = Math.ceil((this.nextRevealTime - now) / 1000);
            this.timerDisplay.textContent = `Next message in ${seconds}s`;
            this.revealButton.disabled = true;
        } else {
            this.timerDisplay.textContent = '';
            this.revealButton.disabled = false;
        }
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
    }

    updateHistory() {
        this.messageHistory.innerHTML = this.history
            .map(item => `
                <div class="history-item">
                    <div>${item.message}</div>
                    <small>${new Date(item.timestamp).toLocaleString()}</small>
                </div>
            `)
            .join('');
    }

    clearMessageHistory() {
        this.history = [];
        localStorage.removeItem('messageHistory');
        this.updateHistory();
    }
}