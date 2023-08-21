// Obtener referencias a elementos del DOM
const taskInput = document.getElementById("taskInput"); // Obtener el elemento de entrada de tareas
const taskDescripcionInput = document.getElementById("taskDescripcionInput"); // Obtener el elemento de entrada de descripción
const addTaskButton = document.getElementById("addTaskButton"); // Obtener el botón de "Apuntar"
const taskList = document.getElementById("taskList"); // Obtener la lista de tareas

// Agregar un evento al botón "Apuntar"
addTaskButton.addEventListener("click", async () => {
  // Obtener el texto de la tarea y limpiar espacios en blanco
  const taskText = taskInput.value.trim();
  // Obtener la descripción de la tarea
  const taskDescripcion = taskDescripcionInput.value.trim();

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
      }),
    });

    if (response.ok) {
      // Si la solicitud POST es exitosa, agregar la nueva tarea a la lista en la interfaz
      const newTask = await response.json();
      addTask(newTask);
    }

    // Limpiar los campos de entrada
    taskInput.value = "";
    taskDescripcionInput.value = "";
  }
});

// Función para agregar una tarea a la lista en la interfaz
function addTask(task) {
  const li = document.createElement("li"); // Crear un nuevo elemento de lista
  li.innerHTML = `
    <h1>${task.title}</h1> <!-- Mostrar el título de la tarea -->
    <h3>${task.descripcion}</h3> <!-- Mostrar la descripción de la tarea -->
    <button class="completeButton">Completada ✅</button> <!-- Botón de Completada -->
    <button class="editButton">📝 Editar</button> <!-- Botón de Editar -->
    <button class="deleteButton" data-taskid="${task.id}">🗑️ Eliminar</button> <!-- Botón de Eliminar -->
  `;
  taskList.appendChild(li); // Agregar la tarea a la lista de tareas en la interfaz

  const completeButton = li.querySelector(".completeButton"); // Obtener el botón Completada
  const deleteButton = li.querySelector(".deleteButton"); // Obtener el botón Eliminar
  const editButton = li.querySelector(".editButton"); // Obtener el botón Editar

  // Agregar evento al botón "Completada"
  completeButton.addEventListener("click", () => {
    li.classList.toggle("completed"); // Alternar la clase "completed" para marcar la tarea como completada
  });

  // Agregar evento al botón "Eliminar"
  deleteButton.addEventListener("click", async () => {
    taskList.removeChild(li); // Quitar la tarea de la lista en la interfaz
    // Enviar solicitud DELETE al servidor para eliminar la tarea correspondiente
    await fetch(`http://localhost:3000/tareas/${task.id}`, {
      method: "DELETE",
    });
  });

  // Agregar evento al botón "Editar"
  editButton.addEventListener("click", async () => {
    // Mostrar una ventana emergente para editar el título de la tarea
    const newText = prompt("Editar tarea:", task.title);
    if (newText !== null) {
      // Enviar solicitud PUT al servidor para actualizar el título de la tarea
      const response = await fetch(`http://localhost:3000/tareas/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newText.trim(),
          descripcion: task.descripcion,
        }),
      });

      if (response.ok) {
        task.title = newText.trim(); // Actualizar el título en el objeto de la tarea
        li.querySelector("span").textContent = newText.trim(); // Actualizar el título en la interfaz
      }
    }
  });
}

// Función para crear y mostrar las tareas en la interfaz
async function createHtml() {
  taskList.innerHTML = ""; // Limpiar la lista antes de rellenarla
  
  // Obtener tareas del servidor y agregarlas a la lista
  let response = await fetch("http://localhost:3000/tareas");
  let data = await response.json();

  data.forEach((task) => {
    addTask(task); // Agregar cada tarea a la interfaz
  });
}

// Esperar a que se cargue el contenido antes de crear la interfaz
document.addEventListener("DOMContentLoaded", () => {
  createHtml(); // Llamar a la función para crear y mostrar las tareas
});
