// --- 1. CORE VARIABLES & LOCALSTORAGE ---
let points = parseInt(localStorage.getItem('userXP')) || 0;
let level = parseInt(localStorage.getItem('userLevel')) || 1;
let isDark = localStorage.getItem('theme') === 'dark';
let streak = parseInt(localStorage.getItem('userStreak')) || 0;
let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
let totalTasksCount = parseInt(localStorage.getItem('totalTasksCount')) || 0;
let dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || [0, 0, 0, 0, 0, 0, 0];
const pointsPerLevel = 100;

// --- 2. DOM ELEMENTS ---
const taskInput = document.getElementById('task-input');
const taskTime = document.getElementById('task-time');
const isDaily = document.getElementById('is-daily');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const pointsDisplay = document.getElementById('user-points');
const levelDisplay = document.getElementById('user-level');
const successSound = document.getElementById('success-sound');
const themeIcon = document.getElementById('theme-icon');
const noteArea = document.getElementById('personal-note');
const colorPicker = document.getElementById('bg-color-picker');

// --- 3. INITIAL SETUP ---
successSound.src = "applepay.mp3";
pointsDisplay.innerText = points;
levelDisplay.innerText = level;

window.onload = () => {
    // Identity Restore
    const savedName = localStorage.getItem('userName');
    const savedAvatar = localStorage.getItem('userAvatar');
    if(savedName) document.getElementById('display-name').innerText = savedName;
    if(savedAvatar) document.getElementById('user-avatar').src = savedAvatar;
    
    // Notes & Theme Restore
    if(noteArea) {
        noteArea.value = localStorage.getItem('userNote') || "";
        noteArea.style.backgroundColor = localStorage.getItem('noteBg') || "#ffffff";
        noteArea.addEventListener('input', () => localStorage.setItem('userNote', noteArea.value));
    }
    if(isDark) document.body.classList.add('dark-theme');
    
    const savedBg = localStorage.getItem('customColor');
    if(savedBg) document.body.style.backgroundColor = savedBg;

    loadTasks();
    updateLeaderboard();
    initChart();
};

// --- 4. IDENTITY & THEME LOGIC ---
window.editName = function() {
    const newName = prompt("Apna naam enter karein:", document.getElementById('display-name').innerText);
    if(newName) {
        document.getElementById('display-name').innerText = newName;
        localStorage.setItem('userName', newName);
    }
}

window.uploadAvatar = function(event) {
    const reader = new FileReader();
    reader.onload = () => {
        document.getElementById('user-avatar').src = reader.result;
        localStorage.setItem('userAvatar', reader.result);
    }
    reader.readAsDataURL(event.target.files);
}

window.toggleDarkMode = function() {
    isDark = !isDark;
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if(themeIcon) themeIcon.innerText = isDark ? 'light_mode' : 'dark_mode';
}

if(colorPicker) {
    colorPicker.addEventListener('input', (e) => {
        document.body.style.backgroundColor = e.target.value;
        localStorage.setItem('customColor', e.target.value);
    });
}

window.changeNoteColor = function(color) {
    if(noteArea) {
        noteArea.style.backgroundColor = color;
        localStorage.setItem('noteBg', color);
    }
}

// --- 5. TASK & STREAK LOGIC (DAY-WISE FIX) ---
function addTask(text, timeValue, dailyCheck, isCompleted = false, wasNotified = false) {
    if (!text) return;
    const li = document.createElement('li');
    li.dataset.notified = wasNotified; 
    li.dataset.time = timeValue || "";
    
    li.innerHTML = `
        <div class="task-info">
            <input type="checkbox" class="task-check" ${isCompleted ? 'checked' : ''}>
            <span class="task-text ${isCompleted ? 'completed' : ''}">${text}</span>
            <small class="task-meta">${timeValue ? '⏰ ' + formatTime12h(timeValue) : ''}</small>
        </div>
        <button class="delete-btn"><span class="material-symbols-outlined">delete</span></button>
    `;

    li.querySelector('.task-check').addEventListener('change', (e) => {
        const span = li.querySelector('.task-text');
        if (e.target.checked) {
            span.classList.add('completed');
            updateXP(20); 
            playSound();
            totalTasksCount++;
            updateStreak(); 
            trackWeeklyProgress();
            createFloatingText(e.pageX, e.pageY, "+20 XP");
        } else {
            span.classList.remove('completed');
            updateXP(-20);
        }
        saveData();
        updateLeaderboard();
    });

    li.querySelector('.delete-btn').onclick = () => {
        if(confirm("Delete kar dein?")) { li.remove(); saveData(); }
    };
    taskList.appendChild(li);
    saveData();
}

function updateStreak() {
    const today = new Date().toDateString(); 
    const lastDate = localStorage.getItem('lastDateTrack');

    if (lastDate === today) return; 

    streak++; 
    localStorage.setItem('userStreak', streak);
    localStorage.setItem('lastDateTrack', today); 

    if(document.getElementById('user-streak')) {
        document.getElementById('user-streak').innerText = streak;
    }
    
    if (streak > bestStreak) {
        bestStreak = streak;
        localStorage.setItem('bestStreak', bestStreak);
    }
}

// --- 6. CHART & STATS ---
let myChart;
function initChart() {
    const ctx = document.getElementById('weeklyChart');
    if(!ctx) return;
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Tasks Done',
                data: dailyStats,
                borderColor: '#4caf50',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(76, 175, 80, 0.1)'
            }]
        }
    });
}

function trackWeeklyProgress() {
    const day = new Date().getDay();
    const index = (day === 0) ? 6 : day - 1;
    dailyStats[index]++;
    localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
    if(myChart) myChart.update();
}

// --- 7. HELPERS ---
function formatTime12h(time24) {
    if(!time24) return "";
    let [h, m] = time24.split(':');
    let p = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m} ${p}`;
}

function updateXP(amount) {
    points += amount;
    if (points < 0) points = 0;
    let newLevel = Math.floor(points / pointsPerLevel) + 1;
    if (newLevel > level) { level = newLevel; showLevelUp(); }
    pointsDisplay.innerText = points;
    levelDisplay.innerText = level;
    saveData();
}

function saveData() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        const span = li.querySelector('.task-text');
        tasks.push({ text: span.innerText, time: li.dataset.time, completed: span.classList.contains('completed'), notified: li.dataset.notified === "true" });
    });
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    localStorage.setItem('userXP', points); 
    localStorage.setItem('userLevel', level);
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('myTasks')) || [];
    saved.forEach(t => addTask(t.text, t.time, false, t.completed, t.notified));
}

function updateLeaderboard() {
    if(document.getElementById('best-streak')) document.getElementById('best-streak').innerText = bestStreak;
    if(document.getElementById('total-tasks')) document.getElementById('total-tasks').innerText = totalTasksCount;
    if(document.getElementById('user-streak')) document.getElementById('user-streak').innerText = streak;
}

function createFloatingText(x, y, text) {
    const el = document.createElement('div');
    el.className = 'xp-float'; el.innerText = text;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function showLevelUp() {
    document.getElementById('pop-level').innerText = level;
    document.getElementById('level-popup').style.display = 'block';
    if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

window.closePopup = () => { document.getElementById('level-popup').style.display = 'none'; }

function playSound() { successSound.currentTime = 0; successSound.play().catch(() => {}); }

// --- 8. EVENTS (ENTER KEY SUPPORT ADDED) ---
addBtn.addEventListener('click', () => {
    addTask(taskInput.value.trim(), taskTime.value, isDaily.checked);
    taskInput.value = ''; taskTime.value = ''; playSound();
});

// PC Enter Key functionality
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput.value.trim(), taskTime.value, isDaily.checked);
        taskInput.value = ''; taskTime.value = ''; playSound();
    }
});

setInterval(() => {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    document.querySelectorAll('#taskList li').forEach(task => {
        if (task.dataset.time === currentTime && task.dataset.notified === "false") {
            playSound();
            alert("⏰ Reminder: " + task.querySelector('.task-text').innerText);
            task.dataset.notified = "true"; saveData();
        }
    });
}, 1000);
