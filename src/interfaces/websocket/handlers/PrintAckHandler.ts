import { PrintJobStore } from "@infrastructure/database/PrintJobStore.js";
import { PrintAckMessage } from "../contracts/PrintAckMessage.js";

////////   EQUIVALENTE A UN CONTROLADOR   ///////////
export class PrintAckHandler {

    constructor( private readonly store: PrintJobStore) {

    }

    async handleAck(message: PrintAckMessage) {
        //console.log("ACK recibido:", message.payload);

        const job = this.store.get(message.payload.jobId); //obtenemos el trabajo de impresion de la base de datos en memoria usando el ID del ACK
        if (!job)return;
        switch(message.payload.status){
            case "received":
                job.markAsReceived(); //actualizamos el estado del trabajo de impresion segun el status del ACK
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