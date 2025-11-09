/*
    Абстрактный класс адаптера, от которого будут наследоваться два других
    Конкретной реализации не имеет, но инкапсулирует часть общей логики псевдоприватными методами
    Логирование тут
*/

export class AbstractHttpAdapter {
    constructor() {
        if (new.target === AbstractHttpAdapter) throw new Error('Cant make an instance of an abstract class')
    }

    async get(url, config) {
        return this._logRequest('GET', url, undefined, config)
    }

    async post(url, body, config = {}) {
        return this._logRequest('POST', url, body, config)
    }

    async delete(url, config = {}) {
        return this._logRequest('DELETE', url, undefined, config)
    }

    async patch(url, body, config = {}) {
        return this._logRequest('PATCH', url, body, config)
    }

    _prepareConfig(url, config, method, body) {
        const newConfig = {
            ...config,
            method,
        }

        if (body !== undefined) {
            newConfig.body = this._prepareRequestBody(body, newConfig.headers)
        }

        return newConfig
    }

    _prepareRequestBody(body, headers = {}) {
        if (body
            && headers?.['Content-Type']?.includes('application/json')
            && typeof body === 'object')
        {
            return JSON.stringify(body)
        }
        return body
    }

    async _logRequest(method, url, body, config) {
        const preparedConfig = this._prepareConfig(url, config, method, body)
        console.log('ЗАПРОС:', url, preparedConfig)
        const result = await this._makeRequest(url, preparedConfig)
        console.log('ОТВЕТ:', url, result)
        return result
    }

    _makeRequest(url, config) {
        throw new Error('Method not implemented')
    }

}