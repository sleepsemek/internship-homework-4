export class TasksModel {
    constructor(apiClient, baseUrl) {
        this.apiClient = apiClient
        this.baseUrl = baseUrl

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

        this.listeners = {
            tasksUpdated: []
        }
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = []

        this.listeners[event].push(callback)
    }

    emit(event, data) {
        if (!this.listeners[event]) return

        for (const callback of this.listeners[event]) {
            callback(data)
        }
    }

    setSearchName(value) {
        this.state.filters.name_like = value || null
    }

    setSearchImportantCheckbox(value) {
        this.state.filters.isImportant = value || null
    }

    setSearchCompletedCheckbox(value) {
        this.state.filters.isCompleted = value || null
    }

    async createTask(data) {
        try {
            await this.apiClient.post(`${this.baseUrl}/tasks`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            await this.fetchTasks()
        } catch (error) {
            throw error
        }
    }

    async deleteTask(id) {
        try {
            await this.apiClient.delete(`${this.baseUrl}/tasks/${id}`)

            await this.fetchTasks()
        } catch (error) {
            throw error
        }
    }

    async updateTask(id, data) {
        try {
            await this.apiClient.patch(`${this.baseUrl}/tasks/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            await this.fetchTasks()
        } catch (error) {
            throw error
        }
    }

    async fetchTasks() {
        try {
            const {isImportant, name_like, isCompleted} = this.state.filters
            const urlSearchParams = new URLSearchParams()

            if (isImportant) urlSearchParams.append('isImportant', isImportant)
            if (name_like) urlSearchParams.append('name_like', name_like)
            if (isCompleted) urlSearchParams.append('isCompleted', isCompleted)

            this.state.tasks = await this.apiClient.get(`${this.baseUrl}/tasks?${urlSearchParams}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            this.emit('tasksUpdated', this.state.tasks)
        } catch (error) {
            throw error
        }
    }
}