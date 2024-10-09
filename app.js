// Obtener elementos del DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tagSelect = document.getElementById('tag-select');
const prioritySelect = document.getElementById('priority-select');
const taskList = document.getElementById('task-list');
const filterSelect = document.getElementById('filter-select');

// Cargar tareas desde el almacenamiento local
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Función para guardar tareas en el almacenamiento local
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Evento para agregar una nueva tarea
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTaskText = taskInput.value.trim();
    const newTaskTag = tagSelect.value;
    const newTaskPriority = prioritySelect.value;

    if (newTaskText !== '') {
        tasks.push({
            text: newTaskText,
            completed: false,
            tag: newTaskTag,
            priority: newTaskPriority,
            date: new Date().toISOString()
        });
        saveTasks();
        renderTasks();
        taskInput.value = '';
        tagSelect.selectedIndex = 0;
        prioritySelect.selectedIndex = 0;
    }
});

// Evento para cambiar el filtro
filterSelect.addEventListener('change', () => {
    renderTasks();
});

// Función para renderizar las tareas en el DOM
function renderTasks() {
    taskList.innerHTML = '';
    const filterValue = filterSelect.value;
    tasks.forEach((task, index) => {
        if (filterValue === 'Todas' || task.tag === filterValue) {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';

            // Asignar color según la etiqueta
            let tagColor;
            switch (task.tag) {
                case 'Personal':
                    tagColor = '#007bff';
                    break;
                case 'Trabajo':
                    tagColor = '#28a745';
                    break;
                case 'Urgente':
                    tagColor = '#dc3545';
                    break;
                case 'Otro':
                    tagColor = '#6c757d';
                    break;
                default:
                    tagColor = '#6c757d';
            }

            li.style.borderLeftColor = tagColor;

            // Formatear la fecha
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const taskDate = new Date(task.date).toLocaleDateString('es-ES', options);

            li.innerHTML = `
                <div class="task-text">
                    ${task.tag ? `<span class="tag" style="background-color: ${tagColor};">${task.tag}</span>` : ''}
                    <span>${task.text}</span>
                    ${task.priority ? `<span class="priority ${task.priority}">${task.priority}</span>` : ''}
                </div>
                <small>Creado el: ${taskDate}</small>
                <div class="task-actions">
                    <button class="complete" title="Completar/Desmarcar">&#10003;</button>
                    <button class="edit" title="Editar">&#9998;</button>
                    <button class="delete" title="Eliminar">&#10005;</button>
                </div>
            `;

            // Evento para completar tarea
            li.querySelector('.complete').addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });

            // Evento para editar tarea
            li.querySelector('.edit').addEventListener('click', () => {
                editTask(index);
            });

            // Evento para eliminar tarea
            li.querySelector('.delete').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(li);
        }
    });
}

// Función para editar una tarea
function editTask(index) {
    const newTaskText = prompt('Editar tarea:', tasks[index].text);
    if (newTaskText !== null && newTaskText.trim() !== '') {
        tasks[index].text = newTaskText.trim();
        saveTasks();
        renderTasks();
    }
}

// Inicializar la aplicación y Sortable.js
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();

    // Inicializar Sortable para arrastrar y soltar
    new Sortable(taskList, {
        animation: 150,
        onEnd: function (evt) {
            // Actualizar el orden de las tareas
            const movedTask = tasks.splice(evt.oldIndex, 1)[0];
            tasks.splice(evt.newIndex, 0, movedTask);
            saveTasks();
        },
    });
});
