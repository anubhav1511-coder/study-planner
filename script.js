let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");
const modal = document.getElementById("modal");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {

    const searchText = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filter = document.getElementById("filter").value;

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        const matchesFilter =
            filter === "all" ||
            (filter === "completed" && task.completed) ||
            (filter === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    filteredTasks.forEach(task => {

        const div = document.createElement("div");

        div.className = "task";

        if (task.completed) {
            div.classList.add("completed");
        }

        div.innerHTML = `
            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <div class="task-info">
                <div class="task-title">${task.title}</div>
                <span class="subject">${task.subject}</span>
            </div>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
            >
                🗑
            </button>
        `;

        taskList.appendChild(div);
    });

    updateStats();
}

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending = total - completed;

    const percentage =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    progress.textContent = percentage + "%";
    progressBar.style.width = percentage + "%";
}

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

/* Modal */

document
    .getElementById("addTaskBtn")
    .addEventListener("click", () => {

        modal.style.display = "flex";
    });

document
    .getElementById("closeModal")
    .addEventListener("click", () => {

        modal.style.display = "none";
    });

document
    .getElementById("saveTask")
    .addEventListener("click", () => {

        const title =
            document.getElementById("taskTitle").value.trim();

        const subject =
            document.getElementById("subject").value;

        const dueDate =
            document.getElementById("dueDate").value;

        const description =
            document.getElementById("description").value;

        if (title === "") {
            alert("Please enter a task title.");
            return;
        }

                const newTask = {

            id: Date.now(),

            title: title,

            subject: subject,

            dueDate: dueDate,

            description: description,

            completed: false
        };

        tasks.push(newTask);

        saveTasks();

        renderTasks();

        document.getElementById("taskTitle").value = "";
        document.getElementById("description").value = "";

        modal.style.display = "none";
    });

/* Search */

document
    .getElementById("search")
    .addEventListener("input", renderTasks);

document
    .getElementById("filter")
    .addEventListener("change", renderTasks);


/* Timer */

let timeLeft = 25 * 60;
let timerInterval = null;

const timerDisplay = document.getElementById("timer");

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

document
    .getElementById("startBtn")
    .addEventListener("click", function () {

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;

            this.textContent = "▶ Start";
            return;
        }

        this.textContent = "Ⅱ Pause";

        timerInterval = setInterval(() => {

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;

                alert("Study session completed! 🎉");

                document.getElementById("startBtn").textContent =
                    "▶ Start";

                return;
            }

            timeLeft--;

            updateTimer();

        }, 1000);
    });


document
    .getElementById("resetBtn")
    .addEventListener("click", () => {

        clearInterval(timerInterval);

        timerInterval = null;

        timeLeft = 25 * 60;

        document.getElementById("startBtn").textContent =
            "▶ Start";

        updateTimer();
    });


/* Timer presets */

document.querySelectorAll(".time-btn").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".time-btn")
            .forEach(btn =>
                btn.classList.remove("active")
            );

        button.classList.add("active");

        clearInterval(timerInterval);

        timerInterval = null;

        const minutes =
            Number(button.dataset.time);

        timeLeft = minutes * 60;

        document.getElementById("startBtn").textContent =
            "▶ Start";

        updateTimer();
    });
});


/* Dark / Light button */

document
    .getElementById("themeBtn")
    .addEventListener("click", () => {

        document.body.classList.toggle("light");

    });


/* Start */

renderTasks();
updateTimer();

// Sidebar navigation
document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {

        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const text = button.textContent.trim();

        if (text.includes("Add Task")) {
            document.getElementById("addTaskBtn").click();
        }

        if (text.includes("Study Timer")) {
            document.getElementById("timer-section").scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});