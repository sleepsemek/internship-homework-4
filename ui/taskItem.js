export function createTaskItem(
    {
        id,
        name,
        info,
        isImportant,
        isCompleted
    }
) {
    const li = Object.assign(document.createElement('li'), {
        className: 'tasks__item task'
    })

    li.dataset.taskId = id
    li.innerHTML = `
        <header class="task__header">
            <h3 class="task__title">${name}</h3>
            <p class="task__description">${info}</p>
        </header>
        <div class="task__controls">
            <label class="task__controls-label label">
                <input class="task__controls-input input" type="checkbox" ${isImportant ? 'checked' : ''} data-important-checkbox>
                Важная
            </label>
            <label class="task__controls-label label">
                <input class="task__controls-input input" type="checkbox" ${isCompleted ? 'checked' : ''} data-complete-checkbox>
                Выполнена
            </label>
        </div>
        <button class="task__controls-button button button--delete" type="button" data-delete-button>Удалить</button>
    `
    return li
}