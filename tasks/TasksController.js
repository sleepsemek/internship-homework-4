import {createTaskItem} from "./taskItem.js";

export class TasksController {
    selectors = {
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

    constructor(rootElement, taskModel) {
        this.tasksModel = taskModel

        this.tasksListElement = rootElement.querySelector(this.selectors.tasksList)
        this.nameInput = rootElement.querySelector(this.selectors.filters.nameInputElement)
        this.importantCheckbox = rootElement.querySelector(this.selectors.filters.importantCheckboxInputElement)
        this.completedCheckbox = rootElement.querySelector(this.selectors.filters.completedCheckboxInputElement)
        this.createTaskForm = rootElement.querySelector(this.selectors.createTaskForm.form)
        this.createTaskFormSubmitButton = rootElement.querySelector(this.selectors.createTaskForm.submitButton)

        this.bindEvents()
        this.tasksModel.fetchTasks()
    }

    bindEvents() {
        this.nameInput.addEventListener('input', event => this.handleNameInput(event))
        this.importantCheckbox.addEventListener('change', event => this.handleImportantCheckboxChange(event))
        this.completedCheckbox.addEventListener('change', event => this.handleCompletedCheckboxChange(event))
        this.createTaskForm.addEventListener('submit', event => this.handleFormSubmit(event))
        this.tasksListElement.addEventListener('click', event => this.handleTaskClick(event))

        this.tasksModel.on('tasksUpdated', (tasks) => this.renderTasks(tasks))
    }

    handleNameInput(event) {
        this.tasksModel.setSearchName(event.target.value.trim())
    }

    handleImportantCheckboxChange(event) {
        this.tasksModel.setSearchImportantCheckbox(event.target.checked)
    }

    handleCompletedCheckboxChange(event) {
        this.tasksModel.setSearchCompletedCheckbox(event.target.checked)
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
            await this.tasksModel.createTask(data)
            this.createTaskForm.reset()
        } catch (e) {
            console.log('Error creating task:', e)
        } finally {
            this.createTaskFormSubmitButton.disabled = false
        }
    }

    async handleTaskClick(event) {
        const taskItem = event.target.closest(this.selectors.taskItem.id)
        const id = taskItem?.dataset.taskId

        if (!id) return

        if (event.target.closest(this.selectors.taskItem.deleteButton)) {
            try {
                await this.tasksModel.deleteTask(id)
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
            await this.tasksModel.updateTask(id, {
                [matchedCheckbox.field]: event.target.checked
            })
        } catch (e) {
            console.log('Error updating task:', e)
        }
    }

    renderTasks(tasks) {
        this.tasksListElement.innerHTML = ''

        tasks.forEach(task => {
            this.tasksListElement.appendChild(createTaskItem(task))
        })
    }

}