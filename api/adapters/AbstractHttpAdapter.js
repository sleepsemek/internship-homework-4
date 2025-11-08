export class AbstractHttpAdapter {
    constructor() {
        if (new.target === AbstractHttpAdapter) throw new Error('Cant make an instance of an abstract class')
    }

    async get(url, config) {
        return this._makeRequest(url, this._prepareConfig(url, config, 'GET'))
    }

    async post(url, body, config = {}) {
        return this._makeRequest(url, this._prepareConfig(url, config, 'POST', body))
    }

    async delete(url, config = {}) {
        return this._makeRequest(url, this._prepareConfig(url, config, 'DELETE'))
    }

    async patch(url, body, config = {}) {
        return this._makeRequest(url, this._prepareConfig(url, config, 'PATCH', body))
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

    _makeRequest(url, config) {
        throw new Error('Method not implemented')
    }

}