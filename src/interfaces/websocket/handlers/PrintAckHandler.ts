import { PrintJobStore } from "@infrastructure/database/PrintJobStore.js";
import { PrintAckMessage } from "../contracts/PrintAckMessage.js";

export class PrintAckHandler {

    constructor( private readonly store: PrintJobStore) {

    }

    async handleAck(message: PrintAckMessage) {
        console.log("ACK recibido:", message.payload);

        const job = this.store.get(message.payload.jobId);

        if (!job)return;

        switch(message.payload.status){
            case "received":
                job.markAsReceived();
                break;
            case "printing":
                job.markAsPrinting();
                break;
            case "printed":
                job.markAsPrinted();
                break;
            case "failed":
                job.markAsFailed();
                break;
        }

        // aquí luego:
        // guardar DB
        // notificar POS
        // logs
        // métricas

    }

}