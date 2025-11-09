import {FetchHttpAdapter, XHRHttpAdapter} from './api/adapters';
import {ApiClient} from './api/ApiClient.js';
import {TasksController} from "./tasks/TasksController.js";
import {TasksModel} from "./tasks/TasksModel.js";

const tasksSelector = '[data-tasks]'
const BASE_URL = 'https://tasks-service-maks1394.amvera.io'

const fetchAdapter = new FetchHttpAdapter()
const xhrHttpAdapter = new XHRHttpAdapter()

const apiClient = new ApiClient(fetchAdapter) //Можно передать другую реализацию

new TasksController(
    document.querySelector(tasksSelector),
    new TasksModel(apiClient, BASE_URL)
)
