import {FetchHttpAdapter, XHRHttpAdapter} from './api/adapters'
import {ApiClient} from './api/ApiClient.js'
import {createTaskItem} from "./ui/taskItem.js";

const BASE_URL = 'https://tasks-service-maks1394.amvera.io'

const fetchAdapter = new FetchHttpAdapter()
const xhrHttpAdapter = new XHRHttpAdapter()

const apiClient = new ApiClient(fetchAdapter)

const selectors = {
    tasksList: '[data-tasks-list]',
    filters: {
        nameInputElement: '[data-filter-name]',
        importantCheckboxInputElement: '[data-filter-important]',
        completedCheckboxInputElement: '[data-filter-completed]',
    },
    createTaskForm: {
        form: '[data-create-task-form]',
        submitButton: '[data-create-task-form-submit-button]',
    },
    taskItem: {
        id: '[data-task-id]',
        importantCheckbox: '[data-important-checkbox]',
        completeCheckbox: '[data-complete-checkbox]',
        deleteButton: '[data-delete-button]',
    }
}

const tasksListElement = document.querySelector(selectors.tasksList)
const nameInput = document.querySelector(selectors.filters.nameInputElement)
const importantCheckbox = document.querySelector(selectors.filters.importantCheckboxInputElement)
const completedCheckbox = document.querySelector(selectors.filters.completedCheckboxInputElement)
const createTaskForm = document.querySelector(selectors.createTaskForm.form)
const createTaskFormSubmitButton = document.querySelector(selectors.createTaskForm.submitButton)

const filtersProxy = new Proxy({
    isImportant: null,
    name_like: null,
    isCompleted: null,
}, {
    set(target, p, newValue) {
        if (target[p] === newValue) return true

        target[p] = newValue
        fetchTasks()
        return true
    }
})

const state = {
    tasks: [],
    filters: filtersProxy
}

init()

function init() {
    bindEvents()
    fetchTasks()
}

function bindEvents() {
    nameInput.addEventListener('input', handleNameInput)
    importantCheckbox.addEventListener('change', handleImportantCheckboxChange)
    completedCheckbox.addEventListener('change', handleCompletedCheckboxChange)
    createTaskForm.addEventListener('submit', handleFormSubmit)
    tasksListElement.addEventListener('click', handleTaskClick)
}

function handleNameInput(event) {
    const value = event.target.value.trim()
    state.filters.name_like = value || null
}

function handleImportantCheckboxChange(event) {
    state.filters.isImportant = event.target.checked || null
}

function handleCompletedCheckboxChange(event) {
    state.filters.isCompleted = event.target.checked || null
}

async function handleFormSubmit(event) {
    event.preventDefault()

    const formData = new FormData(createTaskForm)

    const data = {
        name: formData.get('name'),
        info: formData.get('info'),
        isImportant: !!formData.get('isImportant'),
        isCompleted: false
    }

    createTaskFormSubmitButton.disabled = true

    try {
        await createNewTask(data)
    } catch (e) {
        console.log('Error creating task:', e)
    } finally {
        createTaskFormSubmitButton.disabled = false
    }
}

async function handleTaskClick(event) {
    event.preventDefault()

    const taskItem = event.target.closest(selectors.taskItem.id)

    const id = taskItem?.dataset.taskId

    if (!id) return

    if (event.target.closest(selectors.taskItem.deleteButton)) {
        try {
            await deleteTask(id)
        } catch (e) {
            console.log('Error deleting task:', e)
        }
        return
    }

    const importantCheckbox = event.target.closest(selectors.taskItem.importantCheckbox)
    if (importantCheckbox) {
        try {
            await updateTask(id, {
                isImportant: importantCheckbox.checked
            })
        } catch (e) {
            console.log('Error updating task:', e)
        }
        return
    }

    const completeCheckbox = event.target.closest(selectors.taskItem.completeCheckbox)
    if (completeCheckbox) {
        try {
            await updateTask(id, {
                isCompleted: completeCheckbox.checked
            })
        } catch (e) {
            console.log('Error updating task:', e)
        }
    }
}

async function createNewTask(data) {
    await apiClient.post(`${BASE_URL}/tasks`, data, {
        headers: { 'Content-Type': 'application/json' }
    })

    fetchTasks()
}

async function deleteTask(id) {
    await apiClient.delete(`${BASE_URL}/tasks/${id}`)

    fetchTasks()
}

async function updateTask(id, data) {
    await apiClient.patch(`${BASE_URL}/tasks/${id}`, data, {
        headers: {'Content-Type': 'application/json'}
    })

    fetchTasks()
}

function fetchTasks() {
    const { isImportant, name_like, isCompleted } = state.filters
    const urlSearchParams = new URLSearchParams()

    isImportant && urlSearchParams.append('isImportant', isImportant)
    name_like && urlSearchParams.append('name_like', name_like)
    isCompleted && urlSearchParams.append('isCompleted', isCompleted)

    apiClient.get(`${BASE_URL}/tasks?${urlSearchParams}`, {
        headers: { 'Content-Type': 'application/json' }
    }).then(results => {
        renderTasks(results)
    })
}

function renderTasks(newTasks) {
    const oldTasksMap = new Map(state.tasks.map(t => [t.id, t]))
    const newTasksMap = new Map(newTasks.map(t => [t.id, t]))

    const fragment = document.createDocumentFragment()

    state.tasks.forEach(task => {
        if (!newTasksMap.has(task.id)) {
            const taskElement = tasksListElement.querySelector(`[data-task-id="${task.id}"]`)
            taskElement?.remove()
        }
    })

    newTasks.forEach(task => {
        const oldTask = oldTasksMap.get(task.id)

        if (!oldTask) {
            fragment.appendChild(createTaskItem(task))
        } else if (
            oldTask.name !== task.name ||
            oldTask.isCompleted !== task.isCompleted ||
            oldTask.isImportant !== task.isImportant
        ) {
            const taskElement = tasksListElement.querySelector(`[data-task-id="${task.id}"]`)
            if (taskElement) {
                const newTaskElement = createTaskItem(task)
                tasksListElement.replaceChild(newTaskElement, taskElement)
            }
        }
    })

    tasksListElement.appendChild(fragment)
    state.tasks = newTasks
}



