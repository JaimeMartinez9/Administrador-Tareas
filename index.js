// Obtener referencias a elementos del DOM
const taskInput = document.getElementById("taskInput"); // Obtener el elemento de entrada de tareas
const taskDescripcionInput = document.getElementById("taskDescripcionInput"); // Obtener el elemento de entrada de descripción
const startDateInput = document.getElementById("startDateInput"); // Obtener el campo de entrada de fecha de inicio
const dueDateInput = document.getElementById("dueDateInput"); // Obtener el campo de entrada de fecha de vencimiento
const addTaskButton = document.getElementById("addTaskButton"); // Obtener el botón de "Apuntar"
const taskList = document.getElementById("taskList"); // Obtener la lista de tareas

// Botones para ordenar las tareas
const sortByStartDateButton = document.getElementById("sortByStartDateButton");
const sortByDueDateButton = document.getElementById("sortByDueDateButton");

let tasks = []; // Array para almacenar las tareas

// Agregar un evento al botón "Apuntar"
addTaskButton.addEventListener("click", async () => {
  // Obtener el texto de la tarea y limpiar espacios en blanco
  const taskText = taskInput.value.trim();
  // Obtener la descripción de la tarea
  const taskDescripcion = taskDescripcionInput.value.trim();
  // Obtener las fechas de inicio y vencimiento
  const startDate = startDateInput.value;
  const dueDate = dueDateInput.value;

  if (taskText !== "") {
    // Enviar la nueva tarea al fake API a través de una solicitud POST
    const response = await fetch("http://localhost:3000/tareas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: taskText,
        descripcion: taskDescripcion, // Incluir la descripción
        startDate, // Incluir la fecha de inicio
        dueDate,
        completed: false // Incluir la fecha de vencimiento
      }),
    });

    if (response.ok) {
      // Si la solicitud POST es exitosa, agregar la nueva tarea a la lista en la interfaz
      const newTask = await response.json();
      tasks.push(newTask);
      addTask(newTask);
    }

    // Limpiar los campos de entrada
    taskInput.value = "";
    taskDescripcionInput.value = "";
    startDateInput.value = "";
    dueDateInput.value = "";
  }
});

// Función para agregar una tarea a la lista en la interfaz
function addTask(task) {
  const li = document.createElement("li"); // Crear un nuevo elemento de lista

  // Crear elementos para mostrar la tarea y descripción
  const taskTitle = document.createElement("h2");
  taskTitle.contentEditable = true; // Permitir la edición del título directamente en la interfaz
  taskTitle.textContent = task.title;

  const taskDescripcion = document.createElement("h3");
  taskDescripcion.contentEditable = true; // Permitir la edición de la descripción directamente en la interfaz
  taskDescripcion.textContent = task.descripcion;

  // Crear elementos para mostrar las fechas
  const startDateElement = document.createElement("h4");
  startDateElement.textContent = "Fecha de Inicio: " + task.startDate;

  const dueDateElement = document.createElement("h4");
  dueDateElement.textContent = "Fecha de Vencimiento: " + task.dueDate;

  // Crear botones para completar, eliminar y guardar
  const completeButton = document.createElement("button");
  completeButton.textContent = "Completada ✅";
  completeButton.className = "completeButton";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "❌ Eliminar";
  deleteButton.className = "deleteButton";
  deleteButton.dataset.taskid = task.id;

  const saveButton = document.createElement("button");
  saveButton.textContent = "Guardar 🆗";
  saveButton.className = "saveButton";

  // Agregar eventos a los botones
  completeButton.addEventListener("click", async () => {
    // Marcar la tarea como completada en la interfaz
    li.classList.toggle("completed");

    // Actualizar el estado de completado en el servidor a través de una solicitud PUT al Fake API
    task.completed = !task.completed;
    await updateTask(task);
  });

  deleteButton.addEventListener("click", async () => {
    taskList.removeChild(li);
    await fetch(`http://localhost:3000/tareas/${task.id}`, {
      method: "DELETE",
    });
    // Eliminar la tarea del array de tareas
    tasks = tasks.filter((t) => t.id !== task.id);
  });

  // Agregar evento para guardar cambios
  saveButton.addEventListener("click", async () => {
    task.title = taskTitle.textContent; // Actualizar el título en el objeto de la tarea
    task.descripcion = taskDescripcion.textContent; // Actualizar la descripción en el objeto de la tarea
    await updateTask(task);
  });

  // Si la tarea está completada, marcarla como completada en la interfaz
  if (task.completed) {
    li.classList.add("completed");
  }

  // Agregar elementos a la lista
  li.appendChild(taskTitle);
  li.appendChild(taskDescripcion);
  li.appendChild(startDateElement);
  li.appendChild(dueDateElement);
  li.appendChild(completeButton);
  li.appendChild(deleteButton);
  li.appendChild(saveButton);

  // Agregar la tarea a la lista de tareas en la interfaz
  taskList.appendChild(li);
}

// Función para crear y mostrar las tareas en la interfaz
async function createHtml() {
  taskList.innerHTML = ""; // Limpiar la lista antes de rellenarla

  // Obtener tareas del servidor y agregarlas a la lista
  let response = await fetch("http://localhost:3000/tareas");
  tasks = await response.json();

  tasks.forEach((task) => {
    addTask(task); // Agregar cada tarea a la interfaz
  });
}

// Función para enviar una solicitud PUT al servidor para actualizar una tarea
async function updateTask(task) {
  const response = await fetch(`http://localhost:3000/tareas/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    console.error("Error al actualizar la tarea en el servidor.");
  }
}

// Función para ordenar las tareas por fecha de inicio
function sortByStartDate() {
  tasks.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  updateTaskList();
}

// Función para ordenar las tareas por fecha de vencimiento
function sortByDueDate() {
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  updateTaskList();
}

// Función para actualizar la lista de tareas en la interfaz
function updateTaskList() {
  taskList.innerHTML = ""; // Limpiar la lista antes de rellenarla
  tasks.forEach((task) => {
    addTask(task); // Agregar cada tarea a la interfaz
  });
}

// Esperar a que se cargue el contenido antes de crear la interfaz
document.addEventListener("DOMContentLoaded", () => {
  createHtml(); // Llamar a la función para crear y mostrar las tareas
  sortByStartDateButton.addEventListener("click", sortByStartDate);
  sortByDueDateButton.addEventListener("click", sortByDueDate);
});
