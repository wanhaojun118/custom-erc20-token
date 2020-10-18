export class WebFirebaseConnector {

    private realtimeDatabase = 'https://blockchain-playgound.firebaseio.com'

    async get(path: string, id?: string) {
        const finalUrl = !id ? `${this.realtimeDatabase}/${path}/.json` : `${this.realtimeDatabase}/${path}/${id}/.json`
        const response = await fetch(finalUrl, { method: 'GET' })
        return await response.json()
    }

    async post(path: string, id?: string, object = {}) {
        const finalUrl = !id ? `${this.realtimeDatabase}/${path}/.json` : `${this.realtimeDatabase}/${path}/${id}/.json`
        const response = await fetch(finalUrl, { method: 'POST', body: JSON.stringify(object) })
        return await response.json()
    }

    async put(path: string, id: string, value: string | number) {
        const finalUrl = `${this.realtimeDatabase}/${path}/${id}/.json`
        const response = await fetch(finalUrl, { method: 'PUT', body: JSON.stringify(value) })
        return await response.json()
    }

    async patch(path: string, id?: string, object = {}) {
        const finalUrl = !id ? `${this.realtimeDatabase}/${path}/.json` : `${this.realtimeDatabase}/${path}/${id}/.json`
        const response = await fetch(finalUrl, { method: 'PATCH', body: JSON.stringify(object) })
        return await response.json()
    }

    async delete(path: string, id?: string) {
        const finalUrl = !id ? `${this.realtimeDatabase}/${path}/.json` : `${this.realtimeDatabase}/${path}/${id}/.json`
        const response = await fetch(finalUrl, { method: 'DELETE' })
        return await response.json()
    }
}