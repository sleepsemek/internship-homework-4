import {AbstractHttpClient} from "../interface/AbstractHttpClient";

class FetchHttpAdapter extends AbstractHttpClient {
    constructor() {
        super()
    }

    async _makeRequest(url, config) {
        const response = await fetch(url, config)

        if (!response.ok) {
            throw (response.status) // будет reject
        }

        return response.headers.get('Content-Type')?.includes('application/json')
            ? response.json()
            : response.text()
    }
}