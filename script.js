document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const saveTaskBtn = document.getElementById('save-task');
    const taskList = document.getElementById('task-list');

    // Carregar tarefas salvas
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToList(task);
    });

    // Abrir modal
    addTaskBtn.addEventListener('click', () => {
        taskModal.style.display = 'flex';
    });

    // Fechar modal
    closeModalBtn.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });

    // Salvar tarefa
    saveTaskBtn.addEventListener('click', () => {
        const taskName = document.getElementById('task-name').value;
        const taskColor = document.getElementById('task-color').value;
        const taskDate = document.getElementById('task-date').value;
        const taskTime = document.getElementById('task-time').value;
        const taskPriority = document.getElementById('task-priority').value;

        if (taskName === '') return;

        const task = { name: taskName, color: taskColor, date: taskDate, time: taskTime, priority: taskPriority, completed: false };
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addTaskToList(task);

        taskModal.style.display = 'none';
    });

    // Adicionar tarefa à lista
    function addTaskToList(task) {
        const taskItem = document.createElement('li');
        taskItem.style.borderLeft = `10px solid ${task.color}`;
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.innerHTML = `
            <span>${task.name} - ${task.date} ${task.time} [${task.priority}]</span>
            <input type="checkbox" class="complete-task" ${task.completed ? 'checked' : ''}>
        `;
        taskList.appendChild(taskItem);
    }

    // Marcar tarefa como concluída
    taskList.addEventListener('change', (event) => {
        if (event.target.classList.contains('complete-task')) {
            const taskItem = event.target.parentElement;
            const taskName = taskItem.querySelector('span').textContent.trim();
            const isChecked = event.target.checked;

            taskItem.classList.toggle('completed', isChecked);

            // Atualizar a tarefa no armazenamento local
            const taskIndex = tasks.findIndex(task => task.name === taskName);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = isChecked;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            // Reordenar tarefas para manter concluídas no final
            reorderTasks();
        }
    });

    // Reordenar tarefas para manter concluídas no final
    function reorderTasks() {
        const items = Array.from(taskList.querySelectorAll('li'));
        items.sort((a, b) => {
            return a.classList.contains('completed') ? 1 : -1;
        });
        items.forEach(item => taskList.appendChild(item));
    }
});