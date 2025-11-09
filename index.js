import {FetchHttpAdapter, XHRHttpAdapter} from './api/adapters';
import {ApiClient} from './api/ApiClient.js';
import {TaskManager} from "./managers/TaskManager.js";

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

const BASE_URL = 'https://tasks-service-maks1394.amvera.io'

const fetchAdapter = new FetchHttpAdapter()
const xhrHttpAdapter = new XHRHttpAdapter()

const apiClient = new ApiClient(fetchAdapter) //Можно передать другую реализацию

new TaskManager(selectors, apiClient, BASE_URL)
