// ========================================
// TaskFlow - Task Management
// ========================================

// DOM Elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");

const taskCount = document.getElementById("task-count");
const totalTasks = document.getElementById("total-tasks");
const activeTasks = document.getElementById("active-tasks");
const completedTasks = document.getElementById("completed-tasks");

const clearCompletedBtn = document.getElementById("clear-completed");


// Store tasks
let tasks = [];


// ========================================
// Add Task
// ========================================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    renderTasks();

    taskInput.value = "";

    taskInput.focus();
});


// ========================================
// Render Tasks
// ========================================

function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

        tasks.forEach(function (task) {

            const taskItem = document.createElement("li");

            taskItem.className = "task-item";

            if (task.completed) {
                taskItem.classList.add("completed");
            }

            taskItem.innerHTML = `
                <input
                    type="checkbox"
                    class="task-checkbox"
                    data-id="${task.id}"
                    ${task.completed ? "checked" : ""}
                >

                <span class="task-text">
                    ${escapeHTML(task.text)}
                </span>

                <button
                    class="delete-btn"
                    data-id="${task.id}"
                    type="button"
                    aria-label="Delete task"
                >
                    ✕
                </button>
            `;

            taskList.appendChild(taskItem);
        });
    }

    updateStatistics();
}


// ========================================
// Complete / Uncomplete Task
// ========================================

taskList.addEventListener("change", function (event) {

    if (!event.target.classList.contains("task-checkbox")) {
        return;
    }

    const taskId = Number(event.target.dataset.id);

    const task = tasks.find(function (task) {
        return task.id === taskId;
    });

    if (task) {
        task.completed = event.target.checked;
    }

    renderTasks();
});


// ========================================
// Delete Task
// ========================================

taskList.addEventListener("click", function (event) {

    if (!event.target.classList.contains("delete-btn")) {
        return;
    }

    const taskId = Number(event.target.dataset.id);

    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    renderTasks();
});


// ========================================
// Clear Completed Tasks
// ========================================

clearCompletedBtn.addEventListener("click", function () {

    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    renderTasks();
});


// ========================================
// Update Statistics
// ========================================

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const active = total - completed;

    // Header counter
    taskCount.textContent = total;

    // Statistics cards
    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;
}


// ========================================
// Security Helper
// ========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ========================================
// Initial Render
// ========================================

renderTasks();