let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function showTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center animate-task";

    const today = new Date().toISOString().split("T")[0];
    const isOverdue = task.dueDate && task.dueDate < today;

    item.innerHTML = `
      <div>
        <input type="checkbox" class="form-check-input me-2" ${task.completed ? "checked" : ""} onclick="toggleComplete(${index})">
        <span class="${task.completed ? 'text-decoration-line-through text-muted' : ''}">
          ${task.name}
        </span>
        ${task.dueDate ? `<small class="d-block text-muted ${isOverdue && !task.completed ? 'text-danger fw-bold' : ''}">Due: ${task.dueDate}</small>` : ""}
      </div>
      <div>
        <button class="btn btn-sm btn-warning me-2" onclick="editTask(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    list.appendChild(item);
  });

  updateDashboard();
}

function addTask() {
  const input = document.getElementById("task-input");
  const dateInput = document.getElementById("task-date");
  const name = input.value.trim();
  const dueDate = dateInput.value;

  if (name) {
    tasks.push({
      name,
      dueDate: dueDate || null,
      completed: false
    });

    input.value = "";
    dateInput.value = "";

    saveTasks();
    showTasks();
  }
}

function deleteTask(index) {
  const listItem = document.querySelectorAll("#task-list li")[index];
  listItem.classList.add("fade-out");

  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    showTasks();
  }, 300);
}

function editTask(index) {
  const newName = prompt("Edit task:", tasks[index].name);
  const newDate = prompt("Edit due date (YYYY-MM-DD):", tasks[index].dueDate || "");

  if (newName !== null && newName.trim()) {
    tasks[index].name = newName.trim();
    tasks[index].dueDate = newDate || null;
    saveTasks();
    showTasks();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  showTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateDashboard() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById("total-tasks").textContent = total;
  document.getElementById("completed-tasks").textContent = completed;
  document.getElementById("pending-tasks").textContent = pending;
}

showTasks();
