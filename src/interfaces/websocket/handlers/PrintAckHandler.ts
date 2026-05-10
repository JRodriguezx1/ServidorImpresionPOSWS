import { PrintAckMessage } from "../contracts/PrintAckMessage.js";

export class PrintAckHandler {

    async handleAck(message: PrintAckMessage) {
        console.log("ACK recibido:", message.payload);

        // aquí luego:
        // guardar DB
        // notificar POS
        // logs
        // métricas

    }

}