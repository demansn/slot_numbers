import {API} from "./API.js";

export class ServerAPI extends API {
    constructor({url}) {
        super();
        this.url = url;
    }

    async loadSession({uid}) {
        const {data} = await this.get(this.url, {uid: uid});

        return data;
    }

    async spin({bet, uid}) {
        const {data} = await this.get(this.url, {bet, uid});

        return data;
    }

    async get(url, payload) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return await response.json();
    }
}
