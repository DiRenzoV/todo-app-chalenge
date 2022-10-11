const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const taskContainer = document.querySelector('[data-tasks-container]')
const taskTemplate = document.getElementById('task-template')
const deleteCompletedButton = document.querySelector('[data-delete-completed-button]')
const filters = document.querySelectorAll('.btn-filter')
const taskCount = document.querySelector('[data-task-count]')
const themeSwitch = document.querySelector('[data-theme-switch]')

// Define KEYS to Local Storage
const LOCAL_STORAGE_TASK_KEY = 'todo.tasks'
const LOCAL_STORAGE_DARK_MODE_KEY = 'todo.darkMode'


// Gets data from local storage
let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_KEY)) || [] 
let darkMode = localStorage.getItem(LOCAL_STORAGE_DARK_MODE_KEY)

newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  newTaskInput.value = null

  const task = createTask(taskName)
  tasks.unshift(task)
  saveAndRender()
})

taskContainer.addEventListener('click', e => {
  const selectedTask = tasks.find(task => task.id === e.target.id)
  selectedTask.complete = e.target.checked
  save()
  RenderTaskCount()
})

deleteCompletedButton.addEventListener('click', e => {
  tasks = tasks.filter(task => !task.complete)
  saveAndRender()
  RenderTaskCount()
})


// --- Dark Mode ---
const enableDarkMode = () => {
  document.body.classList.add('dark-mode')
  localStorage.setItem(LOCAL_STORAGE_DARK_MODE_KEY, 'enabled')
}

const disableDarkMode = () => {
  document.body.classList.remove('dark-mode')
  localStorage.setItem(LOCAL_STORAGE_DARK_MODE_KEY, null)
}

if (darkMode === 'enabled') {
  enableDarkMode()
}

themeSwitch.addEventListener('click', () => {
  darkMode = localStorage.getItem(LOCAL_STORAGE_DARK_MODE_KEY)
  if (darkMode !== 'enabled') {
    enableDarkMode()
  } 
  else {
    disableDarkMode()
  }

})


// --- Drag and Drop ---
taskContainer.addEventListener('dragover', e => {
  e.preventDefault()
  const afterElement = getDragAfterElement(taskContainer, e.clientY)
  const draggable = document.querySelector('.dragging')
  if (afterElement == null) {
    taskContainer.appendChild(draggable)
  } else {
    taskContainer.insertBefore(draggable, afterElement)
  }
})


// --- Filters ---

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.active').classList.remove('active')
    btn.classList.add('active')

    switch (btn.innerText.toLowerCase()) {
      case 'all':
        console.log('all')
        console.log(tasks)

        break

      case 'active':
        console.log('active')
        const activeTasks = tasks.filter(task => !task.complete)
        console.log(activeTasks)
        
        break

      case 'completed':
        console.log('completed')
        const completedTasks = tasks.filter(task => task.complete)
        console.log(completedTasks)
        break
    }
  })
})



function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

// Creates task
function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function clearElement(element) {
  while (element.firstChild) element.removeChild(element.firstChild)
}

function renderTasks() {

  tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const draggables = taskElement.querySelectorAll('.task')
    draggables.forEach(draggable => {
      draggable.classList.add('draggable')
      draggable.setAttribute('draggable', 'true')      

      draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
      })

      draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
      })

    })
    
    const checkbox = taskElement.querySelector('input')
    checkbox.checked = task.complete
    checkbox.id = task.id
    
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    
    const deleteTaskButton = taskElement.querySelector('.close')
    deleteTaskButton.id = task.id
    deleteTaskButton.addEventListener('click', e => {
      itemIndex = tasks.findIndex(task => task.id === deleteTaskButton.id)
      tasks.splice(itemIndex, 1)
      saveAndRender()
      RenderTaskCount()
    })

    taskContainer.appendChild(taskElement)
    
    RenderTaskCount()
  })
}



function RenderTaskCount() {
  let incompleteTasks = tasks.filter(task => !task.complete).length
  let taskString = incompleteTasks === 1 ? 'task' : 'tasks'
  taskCount.innerText = `${incompleteTasks} ${taskString} remaining.`
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_TASK_KEY, JSON.stringify(tasks))
}

function render() {
  clearElement(taskContainer)
  renderTasks()
}

render()
