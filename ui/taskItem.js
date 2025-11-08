export function createTaskItem(
    {
        id,
        name,
        info,
        isImportant,
        isCompleted
    }
) {
    const li = document.createElement('li')

    li.dataset.taskId = id
    li.innerHTML = `
        <div>
            <label for="${id}">${name}</label>
            <p>${info}</p>
        </div>
        <div>
            <div>
                <input type="checkbox" id="important_${id}" ${isImportant ? 'checked' : ''} data-important-checkbox>
                <label for="important_${id}">Важная</label>
            </div>
            <div>
                <input type="checkbox" id="complete_${id}" ${isCompleted ? 'checked' : ''} data-complete-checkbox>
                <label for="complete_${id}">Выполнена</label>
            </div>
        </div>
        <button type="button" data-delete-button>Удалить</button>
    `
    return li
}