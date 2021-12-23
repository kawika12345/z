import React from 'react';

import Config from './ClientConfig';

class Socket {
    constructor() {
        this.socket = null
        this.subscriptions = {}
        this.listening = false
    }

    async connect() {
        return new Promise((resolve, reject) => {
            if (this.socket === null || (this.socket !== null && this.socket.readyState !== 1)) {
                try {
                    console.log("connecting")
                    this.socket = new WebSocket(Config.WEBSOCKET_URL);
                    console.log(this.socket)
                    this.socket.onopen = (event) => {
                        console.log("opened")
                        console.log(this.socket)
                        this.messageHandler()
                        return resolve();
                    }
                } catch (error) {
                    console.log(error)
                    console.log("rip")
                    this.socket = null
                    return reject();
                }
            } else {
                return resolve();
            }
        })
    }

    async send(data) {
        if (this.socket !== null) {
            try {
                // console.log(`sending request for ${data.request}`)
                this.socket.send(JSON.stringify(data));
            } catch {
                console.log("you fucking moron this state should never occur")
            }
        } else {

        }
    }

    async request(data, callback) {
        if (this.socket !== null) {
            try {
                // console.log(`sending request for ${data.request}`)
                this.socket.send(JSON.stringify(data));
            } catch {
                console.log("you fucking moron this state should never occur")
                return false;
            }

            this.subscribe(data.request, callback, true)
        } else {
            return false
        }
    }

    subscribe(event, callback, removable = false, type = "message") {
        if (this.subscriptions[event] === undefined) {
            this.subscriptions[event] = []
        }
        this.subscriptions[event].push({
            "callback": callback,
            "removable": removable,
            "type": type,
        })
        console.log(this.subscriptions)
    }
    unsubscribe(event, callback) {
        if (this.subscriptions[event] !== undefined) {
            this.subscriptions[event] = this.subscriptions[event].filter(action => action.callback !== callback)
        }
        if (this.subscriptions[event].length === 0) {
            delete this.subscriptions[event]
        }
    }

    messageHandler() {
        if (!this.listening) {
            this.listening = true
            this.socket.onmessage = async (event) => {
                const response = JSON.parse(event.data);
                Object.keys(this.subscriptions).forEach(subscribedEvent => {
                    if (response.event === subscribedEvent) {
                        for (const action of this.subscriptions[subscribedEvent]) {
                            if (action.type === "message") {
                                console.log(response)
                                action.callback(response.data)
                                if (action.removable) {
                                    this.unsubscribe(subscribedEvent, action.callback)
                                }
                            }
                        }
                    }
                })
            }
            this.socket.onclose = async (event) => {
                const response = JSON.parse(event.data);
                for (const action of this.subscriptions["onclose"]) {
                    if (action.type === "onclose") {
                        console.log(response)
                        action.callback(response.data)
                        if (action.removable) {
                            this.unsubscribe("onclose", action.callback)
                        }
                    }
                }
            }
        }
    }
}

var socket = new Socket()
export default socket