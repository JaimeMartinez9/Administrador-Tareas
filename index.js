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

  // Crear elementos para mostrar la tarea y descripción
  const taskTitle = document.createElement("h2");
  const taskDescripcion = document.createElement("h4");

  // Configurar el contenido inicial
  taskTitle.textContent = task.title;
  taskDescripcion.textContent = task.descripcion;

  // Crear botones para completar, editar y eliminar
  const completeButton = document.createElement("button");
  completeButton.textContent = "Completada ✅";
  completeButton.className = "completeButton";

  const editButton = document.createElement("button");
  editButton.textContent = "📝 Editar";
  editButton.className = "editButton";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑️ Eliminar";
  deleteButton.className = "deleteButton";
  deleteButton.dataset.taskid = task.id;

  // Agregar eventos a los botones
  completeButton.addEventListener("click", () => {
    li.classList.toggle("completed");
  });

  deleteButton.addEventListener("click", async () => {
    taskList.removeChild(li);
    await fetch(`http://localhost:3000/tareas/${task.id}`, {
      method: "DELETE",
    });
  });

  editButton.addEventListener("click", () => {
    // Crear un área de texto editable para la descripción
    const descriptionTextarea = document.createElement("textarea");
    descriptionTextarea.value = task.descripcion;

    // Crear un botón para guardar los cambios
    const saveButton = document.createElement("button");
    saveButton.textContent = "Guardar";
    saveButton.addEventListener("click", async () => {
      // Obtener el valor editado de la descripción
      const newDescripcion = descriptionTextarea.value.trim();

      // Actualizar la descripción en la interfaz
      taskDescripcion.textContent = newDescripcion;

      // Enviar una solicitud PUT al servidor para actualizar la descripción
      const response = await fetch(`http://localhost:3000/tareas/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          descripcion: newDescripcion,
        }),
      });

      if (response.ok) {
        task.descripcion = newDescripcion;
      }
    });

    // Reemplazar el contenido actual del elemento de descripción con el área de texto
    taskDescripcion.innerHTML = "";
    taskDescripcion.appendChild(descriptionTextarea);
    taskDescripcion.appendChild(saveButton);
  });

  // Agregar elementos a la lista
  li.appendChild(taskTitle);
  li.appendChild(taskDescripcion);
  li.appendChild(completeButton);
  li.appendChild(editButton);
  li.appendChild(deleteButton);

  // Agregar la tarea a la lista de tareas en la interfaz
  taskList.appendChild(li);
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
