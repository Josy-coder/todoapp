document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('tasks');
  
    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    // Render tasks
    renderTasks();
  
    // Function to render tasks
    function renderTasks() {
      taskList.innerHTML = '';
      tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <span class="task-name" contenteditable="true" onblur="editTask(${index})">${task.name}</span>
          <span class="subtasks">${task.subtasks ? `(${task.subtasks} subtasks)` : ''}</span>
          <span class="priority">Priority: 
            <select onchange="editPriority(${index}, this.value)">
              <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
              <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
            </select>
          </span>
          <span class="deadline">Deadline: 
            <input type="date" value="${task.deadline || ''}" onchange="editDeadline(${index}, this.value)">
          </span>
          <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        `;
        listItem.draggable = true;
        listItem.addEventListener('dragstart', (e) => handleDragStart(e, index));
        listItem.addEventListener('dragover', (e) => handleDragOver(e));
        listItem.addEventListener('drop', (e) => handleDrop(e, index));
        taskList.appendChild(listItem);
      });
      updateLocalStorage();
    }
  
    // Function to add a new task
    window.addTask = function () {
      const newTaskInput = document.getElementById('new-task');
      const newTaskName = newTaskInput.value.trim();
      if (newTaskName) {
        const newTask = {
          name: newTaskName,
          subtasks: 0,
          priority: 'Medium',
          deadline: ''
        };
        tasks.push(newTask);
        renderTasks();
        newTaskInput.value = '';
      }
    };
  
    // Function to edit a task name
    window.editTask = function (index) {
      const editedName = document.getElementsByClassName('task-name')[index].innerText.trim();
      tasks[index].name = editedName;
      renderTasks();
    };
  
    // Function to edit priority
    window.editPriority = function (index, priority) {
      tasks[index].priority = priority;
      renderTasks();
    };
  
    // Function to edit deadline
    window.editDeadline = function (index, deadline) {
      tasks[index].deadline = deadline;
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
    }
  
    function handleDrop(e, dropIndex) {
      e.preventDefault();
      const draggedTask = tasks[dragIndex];
      tasks.splice(dragIndex, 1);
      tasks.splice(dropIndex, 0, draggedTask);
      renderTasks();
    }
  
    // Function to update local storage
    function updateLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  });
  