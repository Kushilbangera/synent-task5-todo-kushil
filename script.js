// ========================================
// TaskFlow - Productivity Dashboard
// ========================================


// ========================================
// DOM Elements
// ========================================

const taskForm = document.getElementById("task-form");

const taskInput = document.getElementById("task-input");

const taskList = document.getElementById("task-list");

const emptyState = document.getElementById("empty-state");

const taskCount = document.getElementById("task-count");

const totalTasks = document.getElementById("total-tasks");

const activeTasks = document.getElementById("active-tasks");

const completedTasks =
    document.getElementById("completed-tasks");

const clearCompletedBtn =
    document.getElementById("clear-completed");

const progressFill =
    document.getElementById("progress-fill");

const progressPercentage =
    document.getElementById("progress-percentage");

const filterButtons =
    document.querySelectorAll(".filter-btn");


// ========================================
// Load Tasks
// ========================================

let tasks = JSON.parse(
    localStorage.getItem("taskflowTasks")
) || [];


// Current Filter

let currentFilter = "all";


// ========================================
// Save Tasks
// ========================================

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );
}


// ========================================
// Add Task
// ========================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const taskText =
            taskInput.value.trim();

        if (taskText === "") {
            return;
        }

        const task = {

            id: Date.now(),

            text: taskText,

            completed: false

        };

        tasks.push(task);

        saveTasks();

        renderTasks();

        taskInput.value = "";

        taskInput.focus();
    }
);


// ========================================
// Render Tasks
// ========================================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;


    // Apply Filter

    if (currentFilter === "active") {

        filteredTasks =
            tasks.filter(function (task) {

                return !task.completed;

            });

    }


    if (currentFilter === "completed") {

        filteredTasks =
            tasks.filter(function (task) {

                return task.completed;

            });

    }
// ========================================
// Theme Toggle
// ========================================

const themeToggle =
    document.getElementById("theme-toggle");


// Load saved theme

const savedTheme =
    localStorage.getItem("taskflowTheme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-theme");

    themeToggle.textContent = "☀️";

}


// Toggle theme

themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-theme"
        );


        const isDark =
            document.body.classList.contains(
                "dark-theme"
            );


        if (isDark) {

            themeToggle.textContent = "☀️";

            localStorage.setItem(
                "taskflowTheme",
                "dark"
            );

        } else {

            themeToggle.textContent = "🌙";

            localStorage.setItem(
                "taskflowTheme",
                "light"
            );

        }

    }
);

    // Empty State

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

        if (tasks.length > 0) {

            emptyState.querySelector("h3").textContent =
                "No matching tasks";

            emptyState.querySelector("p").textContent =
                "Try switching to another filter.";

        } else {

            emptyState.querySelector("h3").textContent =
                "No tasks yet";

            emptyState.querySelector("p").textContent =
                "Add your first task and start getting things done.";

        }

    } else {

        emptyState.style.display = "none";


        // Create Task Cards

        filteredTasks.forEach(function (task) {

            const taskItem =
                document.createElement("li");

            taskItem.className =
                "task-item";


            if (task.completed) {

                taskItem.classList.add(
                    "completed"
                );

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

    updateProgress();

}


// ========================================
// Complete / Uncomplete Task
// ========================================

taskList.addEventListener(
    "change",
    function (event) {

        if (
            !event.target.classList.contains(
                "task-checkbox"
            )
        ) {

            return;

        }


        const taskId =
            Number(event.target.dataset.id);


        const task =
            tasks.find(function (task) {

                return task.id === taskId;

            });


        if (task) {

            task.completed =
                event.target.checked;

            saveTasks();

        }


        renderTasks();

    }
);


// ========================================
// Delete Task
// ========================================

taskList.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.classList.contains(
                "delete-btn"
            )
        ) {

            return;

        }


        const taskId =
            Number(event.target.dataset.id);


        tasks =
            tasks.filter(function (task) {

                return task.id !== taskId;

            });


        saveTasks();

        renderTasks();

    }
);


// ========================================
// Clear Completed
// ========================================

clearCompletedBtn.addEventListener(
    "click",
    function () {

        tasks =
            tasks.filter(function (task) {

                return !task.completed;

            });


        saveTasks();

        renderTasks();

    }
);


// ========================================
// Filter Tasks
// ========================================

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter;


                // Update active button

                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                renderTasks();

            }
        );

    }
);


// ========================================
// Update Statistics
// ========================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    const active =
        total - completed;


    taskCount.textContent =
        total;


    totalTasks.textContent =
        total;


    activeTasks.textContent =
        active;


    completedTasks.textContent =
        completed;
}


// ========================================
// Update Progress
// ========================================

function updateProgress() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressPercentage.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${percentage}%`;
}


// ========================================
// Security Helper
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


// ========================================
// Initial Render
// ========================================

renderTasks();