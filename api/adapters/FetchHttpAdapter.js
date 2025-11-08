import {AbstractHttpAdapter} from "./AbstractHttpAdapter.js";

export class FetchHttpAdapter extends AbstractHttpAdapter {
    constructor() {
        super()
    }

    async _makeRequest(url, config) {
        // if (config.body
        //     && config.headers?.["Content-Type"]?.includes('application/json')
        //     && typeof config.body === 'object'
        // ) {
        //     config.body = JSON.stringify(config.body)
        // }

        const response = await fetch(url, config)

        if (!response.ok) {
            throw (response.status)
        }

        return response.headers.get('Content-Type')?.includes('application/json')
            ? response.json()
            : response.text()
    }
}