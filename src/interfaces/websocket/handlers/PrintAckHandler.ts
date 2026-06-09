import { PrintJobStore } from "@infrastructure/database/PrintJobStore.js";
import { PrintAckMessage } from "../contracts/PrintAckMessage.js";
import { IPrintJobStoreRepository } from "@domain/repositories/IPrintJobStoreRepository.js";

////////   EQUIVALENTE A UN CONTROLADOR   ///////////
export class PrintAckHandler {

    private readonly store: PrintJobStore;
    private readonly jobStoreRedis: IPrintJobStoreRepository;

    constructor(store: PrintJobStore, jobStoreRedis:IPrintJobStoreRepository) {
        this.store = store;
        this.jobStoreRedis = jobStoreRedis;
    }

    async handleAck(message: PrintAckMessage):Promise<void> {
        //console.log("ACK recibido:", message.payload);

        //const job = this.store.get(message.payload.jobId); //obtenemos el trabajo de impresion de la base de datos en memoria usando el ID del ACK
        const job = await this.jobStoreRedis.get(message.payload.jobId);  //Buscamos el trabajo en Redis
        if (!job)return;
        switch(message.payload.status){
            case "received":
                job.markAsReceived(); //actualizamos el estado del trabajo de impresion segun el status del ACK, tambien se modifica el objeto en el MAP debido a la referencia
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
            default:
                return; // Si viene un estado desconocido, no hacemos nada
        }

        // aquí luego:
        // guardar DB
        // notificar POS
        // logs
        // métricas

        await this.jobStoreRedis.add(job);

    }

}