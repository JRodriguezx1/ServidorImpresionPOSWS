import { WebSocket } from "ws";
import { ConnectionManager } from "@infrastructure/websocket/ConnectionManager.js";
import { RegisterPrinterWSMessage } from "../contracts/RegisterPrinterWSMessage.js";

////////   EQUIVALENTE A UN CONTROLADOR   ///////////
export class RegisterPrinterHandler {

    private connectionManager: ConnectionManager
    constructor(connectionManager: ConnectionManager) {
        this.connectionManager = connectionManager;
    }

    //no llamada a a caso de uso, pasa directo a ifrastructure
    async handleRegister(message: RegisterPrinterWSMessage, ws: WebSocket) {
        const payload = message.payload;
        this.connectionManager.registerPrinter( payload.businessId, payload.sucursal, payload.printerName, ws);

        ws.send(JSON.stringify({
            type: "registered",
            payload: {
                success: true
            }
        }));

    }

}