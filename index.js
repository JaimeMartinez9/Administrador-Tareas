// Obtener referencias a elementos del DOM
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

// Agregar un evento al botón "Apuntar"
addTaskButton.addEventListener("click", async () => {
  // Obtener el texto de la tarea y limpiar espacios en blanco
  const taskText = taskInput.value.trim();
  
  if (taskText !== "") {
    // Enviar la nueva tarea al fake API a través de una solicitud POST
    const response = await fetch("http://localhost:3000/tareas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: taskText,
        descripcion: taskDescripcion,
      })
    });

    if (response.ok) {
      // Si la solicitud POST es exitosa, agregar la nueva tarea a la lista en la interfaz
      const newTask = await response.json();
      addTask(newTask);
    }

    // Limpiar el campo de entrada
    taskInput.value = "";
    taskDescripcionInput.value = "";
  }
});

// Función para agregar una tarea a la lista en la interfaz
function addTask(task) {
  const li = document.createElement("li");
  li.innerHTML = `
    <h1>${task.title}</h1>
  <span>${task.descripcion}</span>
  <button class="completeButton">Completada ✅</button>
  <button class="editButton">📝 Editar</button>
  <button class="deleteButton" data-taskid="${task.id}">🗑️ Eliminar</button>
</li>
  `;
  taskList.appendChild(li);

  const completeButton = li.querySelector(".completeButton");
  const deleteButton = li.querySelector(".deleteButton");
  const editButton = li.querySelector(".editButton");

  // Agregar evento al botón "Completada"
  completeButton.addEventListener("click", () => {
    li.classList.toggle("completed");
  });

  // Agregar evento al botón "Eliminar"
  deleteButton.addEventListener("click", async () => {
    taskList.removeChild(li);
    // Enviar solicitud DELETE al servidor para eliminar la tarea correspondiente
    await fetch(`http://localhost:3000/tareas/${task.id}`, {
      method: "DELETE",
    });
  });

  // Agregar evento al botón "Editar"
  editButton.addEventListener("click", async () => {
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
        task.title = newText.trim();
        li.querySelector("span").textContent = newText.trim();
      }
    }
  });
}

// Función para crear y mostrar las tareas en la interfaz
async function createHtml() {
  // Limpiar la lista antes de rellenarla
  taskList.innerHTML = "";
  
  // Obtener tareas del servidor y agregarlas a la lista
  let response = await fetch("http://localhost:3000/tareas");
  let data = await response.json();

  data.forEach((task) => {
    addTask(task);
  });
}

// Cargar las tareas al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  createHtml();
});
