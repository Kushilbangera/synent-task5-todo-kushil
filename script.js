// ========================================
// TaskFlow - Add & Delete Functionality
// ========================================

// DOM Elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const taskCount = document.getElementById("task-count");


// Store tasks temporarily
let tasks = [];


// ========================================
// Add Task
// ========================================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Prevent empty tasks
    if (taskText === "") {
        return;
    }

    // Create new task
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    // Display tasks
    renderTasks();

    // Clear input
    taskInput.value = "";

    // Focus input again
    taskInput.focus();
});


// ========================================
// Display Tasks
// ========================================

function renderTasks() {

    // Clear existing tasks
    taskList.innerHTML = "";

    // Show empty state if no tasks
    if (tasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

        tasks.forEach(function (task) {

            const taskItem = document.createElement("li");

            taskItem.className = "task-item";

            taskItem.innerHTML = `
                <input
                    type="checkbox"
                    class="task-checkbox"
                    data-id="${task.id}"
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

    updateTaskCount();
}


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
// Update Task Count
// ========================================

function updateTaskCount() {

    taskCount.textContent = tasks.length;
}


// ========================================
// Security Helper
// Prevent HTML Injection
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