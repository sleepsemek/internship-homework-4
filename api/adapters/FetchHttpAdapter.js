import {AbstractHttpAdapter} from "./AbstractHttpAdapter.js";

/*
Конкретная реализация адаптера с использованием Fetch API
*/

export class FetchHttpAdapter extends AbstractHttpAdapter {
    constructor() {
        super()
    }

    async _makeRequest(url, config) {
        const response = await fetch(url, config)

        if (!response.ok) {
            throw (response.status)
        }

        return response.headers.get('Content-Type')?.includes('application/json')
            ? response.json()
            : response.text()
    }
}