import {AbstractHttpAdapter} from "./AbstractHttpAdapter.js";

export class XHRHttpAdapter extends AbstractHttpAdapter {
    constructor() {
        super()
    }

    async _makeRequest(url, config) {
        return new Promise((resolve, reject) => {
            const httpRequest = new XMLHttpRequest()

            httpRequest.responseType = config.headers?.["Content-Type"]?.includes('application/json') ? 'json' : ''

            httpRequest.open(config.method, url, true)

            if (config.headers) {
                for (const [name, value] of Object.entries(config.headers)) {
                    httpRequest.setRequestHeader(name, value)
                }
            }

            httpRequest.onload = () => {
                const requestStatus = httpRequest.status
                if (requestStatus < 200 || requestStatus > 299) {
                    reject(requestStatus)
                    return
                }

                resolve(httpRequest.response)
            }

            httpRequest.onerror = () => {
                reject(httpRequest.status)
            }

            httpRequest.send(config.body)
        })
    }
}