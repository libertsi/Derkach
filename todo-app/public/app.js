document.getElementById('addTaskButton').addEventListener('click', addTask);

async function loadTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <div class="task-text">${task.text}</div>
            <div class="task-buttons">
                <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText) {
        const newTask = { text: taskText, completed: false };
        await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });
        taskInput.value = '';
        loadTasks();
    }
}

async function toggleComplete(index) {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    const task = tasks[index];
    task.completed = !task.completed;
    await fetch(`/tasks/${index}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    loadTasks();
}

async function deleteTask(index) {
    await fetch(`/tasks/${index}`, {
        method: 'DELETE'
    });
    loadTasks();
}

window.onload = loadTasks;