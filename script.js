const inputBox = document.getElementById("input-box");
const addButton = document.getElementById("add-button");
const listContainer = document.getElementById("list-container");
const counterElement = document.getElementById("counter");
const clearButton = document.getElementById("clear-button");
let tasks = [];

function addTask() {
  const taskText = inputBox.value.trim();
  if (taskText === "") {
    return;
  }

  let task = {
    text: taskText,
    completed: false
  };

  tasks.push(task);
  renderTask(task);

  inputBox.value = "";
  inputBox.focus();
  addButton.style.display = "none";
  updateAndSaveData();
  updateCounter();
}

function renderTask(task) {
  let li = document.createElement("li");

  let input = document.createElement("input");
  input.value = task.text;
  li.appendChild(input);

  if (task.completed) {
    li.classList.add("checked");
  }

  let span = document.createElement("span");
  span.innerHTML = "";
  span.classList.add("x-icon");
  li.appendChild(span);

  let edit = document.createElement("button");
  edit.innerHTML = "Edit";
  edit.onclick = editTask;
  li.appendChild(edit);

  let save = document.createElement("button");
  save.innerHTML = "Save";
  save.onclick = saveTask;
  li.appendChild(save);

  save.style.display = "none";
  input.readOnly = true;

  edit.dataset.state = "show";
  save.dataset.state = "hide";

  listContainer.appendChild(li);

  task.li = li;
  task.originalText = task.text;
  task.editing = false;
}

function editTask(e) {
  let li = e.target.parentElement;
  let input = li.firstChild;
  input.readOnly = false;

  let save = e.target.nextElementSibling;
  let edit = e.target;
  save.style.display = "inline-block";
  edit.style.display = "none";

  edit.dataset.state = "hide";
  save.dataset.state = "show";

  let index = Array.from(listContainer.children).indexOf(li);
  tasks[index].editing = true;
}

function saveTask(e) {
  let li = e.target.parentElement;
  let input = li.firstChild;
  let text = input.value;

  input.value = text;

  let edit = e.target.previousElementSibling;
  let save = e.target;
  edit.style.display = "inline-block";
  save.style.display = "none";

  input.readOnly = true;
  edit.dataset.state = "show";
  save.dataset.state = "hide";

  let index = Array.from(listContainer.children).indexOf(li);
  tasks[index].text = text;
  tasks[index].editing = false;

  updateAndSaveData();
}

function updateTaskStatus(li) {
  let index = Array.from(listContainer.children).indexOf(li);
  tasks[index].completed = li.classList.contains("checked");
}

function deleteTask(li) {
  let index = Array.from(listContainer.children).indexOf(li);
  if (index !== -1) {
    tasks.splice(index, 1);
    li.remove();
    updateAndSaveData();
    updateCounter();
  }
}

function updateAndSaveData() {
  let existingTasks = Array.from(listContainer.children);

  tasks = tasks.filter((task) => {
    if (!existingTasks.includes(task.li)) {
      return false;
    } else {
      task.text = task.li.firstChild.value;
      task.completed = task.li.classList.contains("checked");
      return true;
    }
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("counter", tasks.length);
}

function loadData() {
  let data = localStorage.getItem("tasks");
  let counter = localStorage.getItem("counter");

  if (data && counter) {
    tasks = JSON.parse(data);
    tasks.forEach((task) => {
      renderTask(task);
    });
    updateCounter();
  }
}

function updateCounter() {
  let completedTasks = tasks.filter((task) => task.completed).length;
  counterElement.textContent = `${completedTasks}/${tasks.length}`;
}

function clearAllTasks() {
  let confirmation = confirm("Be carefull!!!");
  if (confirmation) {
    tasks = [];
    listContainer.innerHTML = "";
    updateAndSaveData();
    updateCounter();
  }
}

addButton.addEventListener("click", addTask);
inputBox.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    addTask();
  }
});

inputBox.addEventListener("input", function () {
  addButton.style.display = this.value.trim() === "" ? "none" : "inline-block";
});

listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    updateTaskStatus(e.target);
    updateAndSaveData();
    updateCounter();
  } else if (e.target.tagName === "SPAN") {
    let li = e.target.parentElement;
    deleteTask(li);
  }
});

clearButton.addEventListener("click", clearAllTasks);

loadData();
updateCounter();
