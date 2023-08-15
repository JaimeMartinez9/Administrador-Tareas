const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

addTaskButton.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    addTask(taskText);
    taskInput.value = "";
  }
});

function addTask(taskText) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${taskText}</span>
    <button class="completeButton">Completada ✅</button>
    <button class="editButton">📝 Editar</button>
    <button class="deleteButton">🗑️ Eliminar</button>
  `;
  taskList.appendChild(li);

  const completeButton = li.querySelector('.completeButton');
  const deleteButton = li.querySelector('.deleteButton');
  const editButton = li.querySelector('.editButton');

  completeButton.addEventListener('click', () => {
    li.classList.toggle('completed');
  });

  deleteButton.addEventListener('click', () => {
    taskList.removeChild(li);
  });

  editButton.addEventListener('click', () => {
    const newText = prompt('Lo que se empieza, hay que acabarlo!!!', taskText);
    if (newText !== null) {
      taskText = newText.trim();
      li.querySelector('span').textContent = taskText;
    }
  });
}
