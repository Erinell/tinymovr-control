import { console } from "./Components/Console";

enum EventPhase {
    none,
    capturing,
    target,
    bubbling,
    error
}

export class WebSocketManager {
    url: string;
    socket: WebSocket | null;
    keyCallbacks: any;
    autoconnect: boolean;
    onConnectHandler: () => void;
    onCloseHandler: () => void;
    onUpdateHandler: (data: any) => void;
    onErrorHandler: (eventPhase: number) => void;

    constructor(url: string) {
        this.url = url;
        this.socket = null;
        this.keyCallbacks = {};
        this.autoconnect = false;
        this.onConnectHandler = () => { };
        this.onCloseHandler = () => { };
        this.onUpdateHandler = () => { };
        this.onErrorHandler = (eventPhase: number) => { };
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(`ws://${this.url}`);
            this.socket.onopen = () => {
                console.info(`[WebSocket] Connected to the server`);
                resolve(true);
                this.onConnectHandler();
            };

            this.socket.onmessage = (event) => {
                this.handleMessage(event.data);
            };

            this.socket.onclose = (event) => {
                this.onCloseHandler();
                if (event.code === 1000) {
                    console.info(`[WebSocket] Disconnected from the server`);

                } else if (this.autoconnect) {
                    console.error(`[WebSocket] Connection lost. Reconnecting...`);
                    setTimeout(() => {
                        this.connect();
                    }, 1000);
                }

            };

            this.socket.onerror = (error) => {
                switch (error.eventPhase) {
                    case EventPhase.target:
                        console.error(`[WebSocket] (${EventPhase[error.eventPhase]}) Unable to connect to the server`);
                        break;
                    default:
                        console.error(`[WebSocket] (${EventPhase[error.eventPhase]})`);
                        break;
                }
                this.onErrorHandler(error.eventPhase);
                reject(error);
            };
        });
    }

    send(key: string, value: string | number | null, callback: any) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN)
            return console.error(`[WebSocket] (${this.socket?.readyState}) Unable to send request`);

        if (this.socket.readyState === WebSocket.OPEN) {
            const keyId = String(Math.floor(Math.random() * 100000000000 + 999999999999));
            this.keyCallbacks[keyId] = callback;
            const keyWithId = { id: keyId, key, value };
            this.socket.send(JSON.stringify(keyWithId));
        }
    }

    handleMessage(key: string) {
        try {
            const parsedKey = JSON.parse(key);
            const { id, data } = parsedKey;
            const callback = this.keyCallbacks[id];

            if (callback) {
                try {
                    callback(JSON.parse(data));
                    this.onUpdateHandler(JSON.parse(data));
                } catch (error) {
                    callback(data);
                    this.onUpdateHandler(data);
                }

                delete this.keyCallbacks[id];
            } else {
                this.onUpdateHandler(data);
            }
        } catch (error) {
            console.error(`[WebSocket] Unable to handle the data received`);
        }
    }

    close(code: number) {
        if (this.socket) {
            this.socket.close(code);
        }
    }
}

export const websocket = new WebSocketManager("192.168.1.42:8000");