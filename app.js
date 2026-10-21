// Remmy Interactive Web App Logic

let streakCount = 14;
let timerSeconds = 25 * 60;
let timerInterval = null;
let isTimerRunning = false;

function toggleTaskComplete(checkbox) {
  const row = checkbox.closest('.task-row');
  if (checkbox.checked) {
    row.classList.add('completed');
    streakCount++;
    const streakEl = document.getElementById('streakCount');
    if (streakEl) streakEl.textContent = streakCount;
  } else {
    row.classList.remove('completed');
  }
}

function deleteTask(btn) {
  const row = btn.closest('.task-row');
  if (row) {
    row.remove();
    updateTotalCount();
  }
}

function updateTotalCount() {
  const rows = document.querySelectorAll('.task-row');
  const countEl = document.getElementById('totalTaskCount');
  if (countEl) countEl.textContent = rows.length;
}

document.addEventListener('DOMContentLoaded', () => {
  // Add task form
  const addTaskForm = document.getElementById('addTaskForm');
  const taskInput = document.getElementById('taskInput');
  const categorySelect = document.getElementById('taskCategorySelect');
  const tasksList = document.getElementById('tasksList');

  if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = taskInput.value.trim();
      const cat = categorySelect.value;
      if (!text) return;

      const newRow = document.createElement('div');
      newRow.className = 'task-row';
      newRow.setAttribute('data-type', cat.toLowerCase());
      newRow.innerHTML = `
        <input type="checkbox" class="task-check" onchange="toggleTaskComplete(this)">
        <div class="task-info">
          <span class="task-title">${text}</span>
          <small class="task-meta">${cat === 'Focus' ? '🎯' : cat === 'Habit' ? '🌱' : '☕'} ${cat} • Just now</small>
        </div>
        <button class="task-delete" onclick="deleteTask(this)">&times;</button>
      `;

      tasksList.prepend(newRow);
      taskInput.value = '';
      updateTotalCount();
    });
  }

  // Filter tabs
  const tabs = document.querySelectorAll('.task-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-tab');
      const rows = document.querySelectorAll('.task-row');
      rows.forEach(row => {
        const type = row.getAttribute('data-type');
        const isCompleted = row.classList.contains('completed');

        if (filter === 'all') {
          row.style.display = 'flex';
        } else if (filter === 'habits') {
          row.style.display = (type === 'habit' || type === 'habits') ? 'flex' : 'none';
        } else if (filter === 'completed') {
          row.style.display = isCompleted ? 'flex' : 'none';
        }
      });
    });
  });

  // Pomodoro Focus Timer
  const clockEl = document.getElementById('pomodoroClock');
  const startBtn = document.getElementById('startTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');
  const statusTag = document.getElementById('timerStatusTag');

  function renderClock() {
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    clockEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (!isTimerRunning) {
        isTimerRunning = true;
        startBtn.textContent = 'Pause Focus';
        statusTag.textContent = '⚡ Deep Focus Sprint in Progress — Notifications Muted';
        timerInterval = setInterval(() => {
          if (timerSeconds > 0) {
            timerSeconds--;
            renderClock();
          } else {
            clearInterval(timerInterval);
            isTimerRunning = false;
            startBtn.textContent = 'Start Focus';
            alert('🎉 Pomodoro Completed! Take a 5-minute restorative breath.');
          }
        }, 1000);
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        startBtn.textContent = 'Resume Focus';
        statusTag.textContent = 'Sprint Paused';
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerSeconds = 25 * 60;
      renderClock();
      startBtn.textContent = 'Start Focus';
      statusTag.textContent = 'Ready for 25-minute deep sprint';
    });
  }
});
