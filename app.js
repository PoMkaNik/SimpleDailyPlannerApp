$(document).ready(() => {
  $('#addTaskForm').on('submit', (e) => {
    saveTaskToLocalStorage(addTask(e));
  });
  $('#editTaskForm').on('submit', (e) => {
    const oldTaskId = $('#inputTaskID').val();
    updateTaskInLocalStorage(addTask(e), oldTaskId);
  });
});

function addTask(e) {
  // add unique ID
  const newDate = new Date();
  const id = newDate.getTime();

  const taskName = $('#inputTaskName').val();
  const taskPriority = $('#selectTaskPriority').val();
  const taskDate = $('#inputTaskDate').val();
  const taskTime = $('#inputTaskTime').val();

  // simple validation
  if (taskName == '') {
    alert('Task is required');
    e.preventDefault();
  } else if (taskDate == '') {
    alert('Task Date is required');
    e.preventDefault();
  } else if (taskPriority == '') {
    taskPriority = 'normal';
  }

  return {
    id,
    taskName,
    taskPriority,
    taskDate,
    taskTime,
  };
}

function deleteOldTask(id) {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  return tasks.filter((task) => task.id !== parseInt(id));
}

function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    const newTasksArray = deleteOldTask(id);
    localStorage.setItem('tasks', JSON.stringify(newTasksArray));
    location.reload();
    return;
  }
}

function saveTaskToLocalStorage(task) {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  if (!tasks) {
    tasks = [];
  }
  tasks.push(task);

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInLocalStorage(task, oldTaskId) {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  if (!tasks) {
    alert('You should add task before editing it!');
    window.location.replace('addTask.html');
    return;
  }
  // remove old task for DRY code and to use addTask function
  const newTasksArray = deleteOldTask(oldTaskId);
  // add new task
  newTasksArray.push(task);
  localStorage.setItem('tasks', JSON.stringify(newTasksArray));
}

function fillInTheForm(e) {
  // get required task
  const urlParams = new URLSearchParams(window.location.search);
  const editedTaskID = urlParams.get('id');

  if (!editedTaskID) {
    alert('Select the task to edit!');
    window.location.replace('index.html');
    return;
  }

  let tasks = JSON.parse(localStorage.getItem('tasks'));
  if (tasks) {
    const editedTask = tasks.find((task) => task.id === parseInt(editedTaskID));

    $('#inputTaskID').val(editedTask.id);
    $('#inputTaskName').val(editedTask.taskName);
    $('#selectTaskPriority').val(editedTask.taskPriority);
    $('#inputTaskDate').val(editedTask.taskDate);
    $('#inputTaskTime').val(editedTask.taskTime);
  }
}

function displayTasks() {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  // sort tasks list by date
  if (tasks) {
    tasks = tasks.sort(sortByDate);

    tasks.forEach((task) => {
      const container = document.getElementById('tasksList');
      const newSection = document.createElement('section');
      newSection.classList.add('border');
      newSection.classList.add('m-1');
      newSection.innerHTML = showOneTask(task);
      container.appendChild(newSection);
    });
  }
}

function sortByDate(a, b) {
  // transform 2020-09-04 -> 20200904 to compare
  const aDate = a.taskDate.split('-').join('');
  const bDate = b.taskDate.split('-').join('');
  return aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
  // the same as:
  // if (aDate < bDate) {
  //   return -1;
  // } else if (aDate > bDate) {
  //   return 1;
  // } else {
  //   return 0;
  // }
}

function showOneTask(task) {
  const priorityIcon = (task) => {
    if (task.taskPriority === 'high') {
      return `<!-- HIGH -->
      <svg
        width="1.5em"
        height="1.5em"
        viewBox="0 0 16 16"
        class="bi bi-exclamation-circle-fill text-danger"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
        />
      </svg>`;
    } else if (task.taskPriority === 'normal') {
      return `<!-- NORMAL -->
      <svg
        width="1.5em"
        height="1.5em"
        viewBox="0 0 16 16"
        class="bi bi-dash-circle-fill text-primary"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"
        />
      </svg>`;
    } else {
      return `<!-- LOW -->
      <svg
        width="1.5em"
        height="1.5em"
        viewBox="0 0 16 16"
        class="bi bi-arrow-down-circle-fill text-warning"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"
        />
      </svg>`;
    }
  };

  // transform YYYY-MM-DD -> DD/MM/YY
  function fixDatePresentation(task) {
    return task.taskDate.slice(2).split('-').reverse().join('/');
  }

  return `<div class="row py-1 m-0">
  <div class="col-1 px-1 align-self-center">
    <div class="d-flex align-self-center">
    <!-- Priority icon -->
    ${priorityIcon(task)}
    </div>
  </div>
  <div class="col px-1 taskTitle">${task.taskName}</div>
</div>
<div class="row py-1 m-0">
  <div class="col px-1 align-self-center">
    <div class="d-flex align-self-center">
      <svg
        width="1.5em"
        height="1.5em"
        viewBox="0 0 16 16"
        class="bi bi-calendar-event"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"
        />
        <path
          d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"
        /></svg
      ><span class="px-1">${fixDatePresentation(task)}</span>
    </div>
  </div>
  <div class="col px-1 align-self-center">
    <div class="d-flex align-self-center">
      <svg
        width="1.5em"
        height="1.5em"
        viewBox="0 0 16 16"
        class="bi bi-alarm"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z"
        /></svg
      ><span class="px-1">${task.taskTime}</span>
    </div>
  </div>
  <div class="col px-1">
    <button type="button" class="btn btn-info btn-block" onclick="location.href='editTask.html?id=${
      task.id
    }'" >Edit</button>
  </div>
  <div class="col px-1">
    <button type="button" id="removeTaskBtn" class="btn btn-danger btn-block" onclick="deleteTask(${
      task.id
    })">
      Delete
    </button>
  </div>
</div>`;
}
