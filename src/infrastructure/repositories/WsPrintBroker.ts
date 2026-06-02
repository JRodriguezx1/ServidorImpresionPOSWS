import { PrintJob } from "@domain/entities/Printjob.js";
import { IPrintJobRepository } from "@domain/repositories/IPrintJobRepository.js";
import { ConnectionManager } from "@infrastructure/websocket/ConnectionManager.js";


////////   IMPLEMENTACION DEL REPOSITORIO DE DOMAINS EN INFRASTRUCTURE   ///////////
export class WsPrintBroker implements IPrintJobRepository{

    private connectionManager: ConnectionManager;
    constructor(connectionManager: ConnectionManager){
        this.connectionManager = connectionManager;
    }

    async sendPrint(data: PrintJob):Promise<PrintJob>{

        const socket = this.connectionManager.getPrinter(data.businessId, data.sucursal, data.printerName);
        if (!socket) {throw new Error("Printer offline");}
        //simular envio
        socket.send(JSON.stringify({
            type: "print",
            payload: {
                jobId: data.jobId,  //identificador unico para el ACK
                content: data.content
            }
        }));

        data.markAsSent();

        return data;
    }
}