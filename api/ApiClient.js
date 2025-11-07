import {AbstractHttpClient} from "./interface/AbstractHttpClient";

export class ApiClient extends AbstractHttpClient {
    constructor(httpClientImplementation) {
        super()
        this._client = httpClientImplementation
    }

    async get(url, config) {
        return await this._client.get(url, config)
    }

    async post(url, body, config) {
        return await this._client.post(url, body, config)
    }

    async delete(url, config) {
        return await this._client.delete(url, config)
    }

    async patch(url, body, config) {
        return await this._client.patch(url, body, config)
    }
}