// Select elements from the DOM
const form = document.getElementById('todo-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const counter = document.getElementById('counter');
const emptyMsg = document.getElementById('empty-msg');

// State: an array of task objects, loaded from localStorage if saved
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Redraw the list from the tasks array
function render() {
  list.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' completed' : '');
    li.dataset.id = task.id;

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';

    li.append(text, deleteBtn);
    list.appendChild(li);
  });

  const remaining = tasks.filter((t) => !t.done).length;
  counter.textContent = `${remaining} task${remaining === 1 ? '' : 's'} left`;
  emptyMsg.hidden = tasks.length > 0;

  saveTasks();
}

// Add a task (works with the Add button and the Enter key)
form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from reloading

  const text = input.value.trim();
  if (text === '') return;

  tasks.push({ id: Date.now(), text: text, done: false });
  input.value = '';
  input.focus();
  render();
});

// Event delegation: one listener on the list handles all clicks
list.addEventListener('click', (event) => {
  const li = event.target.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (event.target.classList.contains('delete-btn')) {
    tasks = tasks.filter((t) => t.id !== id); // remove task
  } else {
    const task = tasks.find((t) => t.id === id);
    task.done = !task.done; // toggle complete
  }
  render();
});

render();