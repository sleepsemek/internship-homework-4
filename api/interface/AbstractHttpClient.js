export class AbstractHttpClient {
    constructor() {
        if (new.target === AbstractHttpClient) throw new Error('Cant make an instance of an abstract class')
    }

    async get(url, config) {
        return this._makeRequest(url, {
            ...config,
            method: 'GET',
        })
    }

    async post(url, body, config = {}) {
        return this._makeRequest(url, {
            ...config,
            method: 'POST',
            body,
        })
    }

    async delete(url, config = {}) {
        return this._makeRequest(url, {
            ...config,
            method: 'DELETE',
        })
    }

    async patch(url, body, config = {}) {
        return this._makeRequest(url, {
            ...config,
            method: 'PATCH',
            body,
        })
    }

    _makeRequest(url, config) {
        throw new Error('Method not implemented')
    }

}