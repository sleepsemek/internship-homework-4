import {createTaskItem} from "../components/taskItem.js";

export class TaskManager {
    constructor(selectors, apiClient, base_url) {
        this.apiClient = apiClient
        this.selectors = selectors
        this.base_url = base_url

        this.tasksListElement = document.querySelector(this.selectors.tasksList)
        this.nameInput = document.querySelector(this.selectors.filters.nameInputElement)
        this.importantCheckbox = document.querySelector(this.selectors.filters.importantCheckboxInputElement)
        this.completedCheckbox = document.querySelector(this.selectors.filters.completedCheckboxInputElement)
        this.createTaskForm = document.querySelector(this.selectors.createTaskForm.form)
        this.createTaskFormSubmitButton = document.querySelector(this.selectors.createTaskForm.submitButton)

        this.state = {
            tasks: [],
            filters: new Proxy({
                isImportant: null,
                name_like: null,
                isCompleted: null,
            }, {
                set: (target, prop, value) => {
                    if (target[prop] === value) return true
                    target[prop] = value
                    this.fetchTasks()
                    return true
                }
            })
        }

        this.init()
    }

    init() {
        this.bindEvents()
        this.fetchTasks()
    }

    bindEvents() {
        this.nameInput.addEventListener('input', this.handleNameInput.bind(this))
        this.importantCheckbox.addEventListener('change', this.handleImportantCheckboxChange.bind(this))
        this.completedCheckbox.addEventListener('change', this.handleCompletedCheckboxChange.bind(this))
        this.createTaskForm.addEventListener('submit', this.handleFormSubmit.bind(this))
        this.tasksListElement.addEventListener('click', this.handleTaskEvents.bind(this))
        this.tasksListElement.addEventListener('change', this.handleTaskEvents.bind(this))
    }

    handleNameInput(event) {
        const value = event.target.value.trim()
        this.state.filters.name_like = value || null
    }

    handleImportantCheckboxChange(event) {
        this.state.filters.isImportant = event.target.checked || null
    }

    handleCompletedCheckboxChange(event) {
        this.state.filters.isCompleted = event.target.checked || null
    }

    async handleFormSubmit(event) {
        event.preventDefault()

        const formData = new FormData(this.createTaskForm)

        const data = {
            name: formData.get('name'),
            info: formData.get('info'),
            isImportant: Boolean(formData.get('isImportant')),
            isCompleted: false
        }

        this.createTaskFormSubmitButton.disabled = true

        try {
            await this.createNewTask(data)
        } catch (e) {
            console.log('Error creating task:', e)
        } finally {
            this.createTaskFormSubmitButton.disabled = false
        }
    }

    async handleTaskEvents(event) {
        const taskItem = event.target.closest(this.selectors.taskItem.id)
        const id = taskItem?.dataset.taskId

        if (!id) return

        if (event.target.closest(this.selectors.taskItem.deleteButton)) {
            try {
                await this.deleteTask(id)
            } catch (e) {
                console.log('Error deleting task:', e)
            }
            return
        }

        const checkboxMap = [
            {
                selector: this.selectors.taskItem.importantCheckbox,
                field: 'isImportant',
            },
            {
                selector: this.selectors.taskItem.completeCheckbox,
                field: 'isCompleted',
            }
        ]

        const matchedCheckbox = checkboxMap.find(checkbox => event.target.matches(checkbox.selector))
        if (!matchedCheckbox) return

        event.preventDefault()

        try {
            await this.updateTask(id, {
                [matchedCheckbox.field]: event.target.checked
            })
        } catch (e) {
            console.log('Error updating task:', e)
        }

    }

    async createNewTask(data) {
        await this.apiClient.post(`${this.base_url}/tasks`, data, {
            headers: { 'Content-Type': 'application/json' }
        })

        this.fetchTasks()
    }

    async deleteTask(id) {
        await this.apiClient.delete(`${this.base_url}/tasks/${id}`)

        this.fetchTasks()
    }

    async updateTask(id, data) {
        await this.apiClient.patch(`${this.base_url}/tasks/${id}`, data, {
            headers: {'Content-Type': 'application/json'}
        })

        this.fetchTasks()
    }

    fetchTasks() {
        const { isImportant, name_like, isCompleted } = this.state.filters
        const urlSearchParams = new URLSearchParams()

        isImportant && urlSearchParams.append('isImportant', isImportant)
        name_like && urlSearchParams.append('name_like', name_like)
        isCompleted && urlSearchParams.append('isCompleted', isCompleted)

        this.apiClient.get(`${this.base_url}/tasks?${urlSearchParams}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(results => {
            this.state.tasks = results
            this.renderTasks()
        })
    }

    renderTasks() {
        this.tasksListElement.innerHTML = ''

        this.state.tasks.forEach(task => {
            this.tasksListElement.appendChild(createTaskItem(task))
        })
    }

}