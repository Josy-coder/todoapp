document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('tasks');
    const taskForm = document.getElementById('task-form');
    let currentTab = 'not-started';
  
    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    // Render tasks
    renderTasks();
  
    // Function to render tasks
    function renderTasks() {
      taskList.innerHTML = '';
      tasks.forEach((task, index) => {
        if (
          (currentTab === 'not-started' && task.status === 'Not Started') ||
          (currentTab === 'started' && task.status === 'Started') ||
          (currentTab === 'completed' && task.status === 'Completed')
        ) {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <span class="task-name" contenteditable="true" onblur="editTaskName(${index})">${task.name}</span>
            <span class="subtasks">${task.subtasks ? `(${task.subtasks} subtasks)` : ''}</span>
            <span class="priority">Priority: ${task.priority}</span>
            <span class="deadline">Deadline: ${task.deadline || 'Not set'}</span>
            <span class="status">Status: ${task.status}</span>
            <button class="complete-btn" onclick="toggleTaskStatus(${index})">${
              task.status === 'Not Started' ? 'Start' : 'Complete'
            }</button>
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
          `;
          listItem.draggable = true;
          listItem.addEventListener('dragstart', (e) => handleDragStart(e, index));
          listItem.addEventListener('dragover', (e) => handleDragOver(e));
          listItem.addEventListener('drop', (e) => handleDrop(e, index));
          taskList.appendChild(listItem);
        }
      });
      updateLocalStorage();
    }
  
    // Function to add a new task
    window.addTask = function () {
      const newTaskName = document.getElementById('task-name').value.trim();
      if (newTaskName) {
        const newTask = {
          name: newTaskName,
          subtasks: document.getElementById('subtasks').value.trim(),
          priority: document.getElementById('priority').value,
          deadline: document.getElementById('deadline').value,
          status: 'Not Started',
        };
        tasks.push(newTask);
        renderTasks();
        taskForm.reset();
      }
    };
  
    // Function to edit a task name
    window.editTaskName = function (index) {
      const editedName = document.getElementsByClassName('task-name')[index].innerText.trim();
      tasks[index].name = editedName;
      renderTasks();
    };
  
    // Function to toggle task status (Start/Complete)
    window.toggleTaskStatus = function (index) {
      const task = tasks[index];
      task.status = task.status === 'Not Started' ? 'Started' : 'Completed';
      renderTasks();
    };
  
    // Function to delete a task
    window.deleteTask = function (index) {
      if (confirm(`Are you sure you want to delete "${tasks[index].name}"?`)) {
        tasks.splice(index, 1);
        renderTasks();
      }
    };
  
    // Drag and drop functionality
    let dragIndex;
  
    function handleDragStart(e, index) {
      dragIndex = index;
      e.dataTransfer.effectAllowed = 'move';
    }
  
    function handleDragOver(e) {
      e.preventDefault();
      const draggedOverItem = e.target.closest('li');
      if (draggedOverItem) {
        draggedOverItem.classList.add('dragged-over');
      }
    }
  
    function handleDrop(e, dropIndex) {
      e.preventDefault();
      const draggedOverItem = e.target.closest('li');
      if (draggedOverItem) {
        draggedOverItem.classList.remove('dragged-over');
      }
      const draggedTask = tasks[dragIndex];
      tasks.splice(dragIndex, 1);
      tasks.splice(dropIndex, 0, draggedTask);
      renderTasks();
    }
  
    // Function to show tasks based on tab selection
    window.showTab = function (tab) {
      currentTab = tab;
      renderTasks();
    };
  
    // Function to update local storage
    function updateLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  });
  