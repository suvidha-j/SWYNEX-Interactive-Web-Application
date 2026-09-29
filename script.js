let tasks = [];
let editingTaskId = null;

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const category = document.getElementById("category");

const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const taskError = document.getElementById("taskError");

const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");


/* ADD / EDIT TASK */

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        taskError.textContent = "Please enter a task name.";
        taskInput.focus();
        return;
    }

    if (taskName.length < 3) {
        taskError.textContent =
            "Task name must contain at least 3 characters.";
        taskInput.focus();
        return;
    }

    taskError.textContent = "";


    if (editingTaskId !== null) {

        const task = tasks.find(
            task => task.id === editingTaskId
        );

        if (task) {
            task.name = taskName;
            task.priority = priority.value;
            task.category = category.value;
        }

        editingTaskId = null;

    } else {

        const newTask = {
            id: Date.now(),
            name: taskName,
            priority: priority.value,
            category: category.value,
            completed: false
        };

        tasks.push(newTask);
    }


    taskForm.reset();

    priority.value = "Medium";

    renderTasks();
});


/* DISPLAY TASKS */

function renderTasks() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const filter = filterSelect.value;


    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.name.toLowerCase().includes(searchText);

        const matchesFilter =
            filter === "all" ||
            (filter === "active" && !task.completed) ||
            (filter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }


    filteredTasks.forEach(task => {

        const taskItem = document.createElement("div");

        taskItem.className = "task-item";


        const priorityClass =
            task.priority.toLowerCase();


        taskItem.innerHTML = `

            <div class="task-info">

                <div class="task-title ${
                    task.completed ? "completed" : ""
                }">
                    ${escapeHTML(task.name)}
                </div>

                <div class="task-meta">

                    ${escapeHTML(task.category)}

                    <span class="priority ${priorityClass}">
                        ${escapeHTML(task.priority)}
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">

                    ${task.completed ? "↩ Undo" : "✓ Done"}

                </button>


                <button
                    onclick="editTask(${task.id})">

                    ✏ Edit

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">

                    🗑 Delete

                </button>

            </div>
        `;


        taskList.appendChild(taskItem);
    });


    updateDashboard();
}


/* COMPLETE / UNCOMPLETE */

function toggleTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (task) {
        task.completed = !task.completed;
    }

    renderTasks();
}


/* EDIT */

function editTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {
        return;
    }

    taskInput.value = task.name;
    priority.value = task.priority;
    category.value = task.category;

    editingTaskId = id;

    taskInput.focus();
}


/* DELETE */

function deleteTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {
        return;
    }


    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );


    if (confirmed) {

        tasks = tasks.filter(
            task => task.id !== id
        );

        renderTasks();
    }
}


/* DASHBOARD */

function updateDashboard() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const active = total - completed;


    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;


    taskCount.textContent =
        `${total} ${total === 1 ? "task" : "tasks"}`;
}


/* SECURITY */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* SEARCH */

searchInput.addEventListener(
    "input",
    renderTasks
);


/* FILTER */

filterSelect.addEventListener(
    "change",
    renderTasks
);


/* INITIAL LOAD */

renderTasks();