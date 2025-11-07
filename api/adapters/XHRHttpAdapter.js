import {AbstractHttpClient} from "../interface/AbstractHttpClient";

class XHRHttpAdapter extends AbstractHttpClient {
    constructor() {
        super()
    }

    async _makeRequest(url, config) {
        return new Promise((resolve, reject) => {
            const httpRequest = new XMLHttpRequest()
            httpRequest.open(config.method, url, true)

            if (config.headers) {
                for (const [name, value] of Object.entries(config.headers)) {
                    httpRequest.setRequestHeader(name, value)
                }
            }

            httpRequest.onload = () => {
                const responseBody = httpRequest.responseText
                resolve(httpRequest.getResponseHeader('Content-Type')?.includes('application/json')
                    ? JSON.parse(responseBody)
                    : responseBody
                )
            }

            httpRequest.onerror = () => {
                reject(httpRequest.status)
            }

            httpRequest.send(config.body)
        })
    }
}