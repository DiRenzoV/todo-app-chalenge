const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const taskContainer = document.querySelector('[data-tasks-container]')
const taskTemplate = document.getElementById('task-template')
const deleteCompletedButton = document.querySelector('[data-delete-completed-button]')
const filters = document.querySelectorAll('.btn-filter')
const taskCount = document.querySelector('[data-task-count]')
const themeSwitch = document.querySelector('[data-theme-switch]')
console.log(themeSwitch)


const LOCAL_STORAGE_TASK_KEY = 'todo.tasks'
const LOCAL_STORAGE_DARK_MODE_KEY = 'todo.darkMode'

let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_KEY)) || [] 
let darkMode = localStorage.getItem(LOCAL_STORAGE_DARK_MODE_KEY)

newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  newTaskInput.value = null

  const task = createTask(taskName)
  tasks.push(task)
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

filters.forEach(btn => btn.addEventListener('click', () => {
  document.querySelector('.active').classList.remove('active')
  btn.classList.add('active')

  if (btn.innerText === 'Completed') {
    let newTasks = [...tasks]
   completedTasks = newTasks.filter(task => task.complete)
   console.log(tasks, completedTasks)
  }

  if (btn.innerText === 'Active') {
    const newTasks = [...tasks]
    activeTasks = newTasks.filter(task => !task.complete)
    console.log(tasks, activeTasks)
    clearElement(taskContainer)
    taskContainer.append(activeTasks)
  }

  if (btn.innerText === "All") {
    console.log(tasks)
    
  }
}))



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




function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}


function clearElement(element) {
  while (element.firstChild) element.removeChild(element.firstChild)
}




function renderTasks() {

  tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete

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
