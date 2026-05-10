import { PrintJob } from "@domain/entities/Printjob.js";
import { IPrintJobRepository } from "@domain/repositories/IPrintJobRepository.js";


///////    CASO DE USO    ////////
export class SendToPrinter {

    private printRepo: IPrintJobRepository;

    constructor(printRepository: IPrintJobRepository){
        this.printRepo = printRepository;
    }

    async execute(job: {businessId: string, sucursal: string, printerName: string, content: string}): Promise<PrintJob|null> {
        /* validar antes de crear entidad
        if (!data.sucursal?.trim()) {
            throw new Error("Sucursal requerida");
            }
        */
        const newJob = new PrintJob(job.businessId, job.sucursal, job.printerName, job.content);  //aqui validamos los campos reglas de negocio
        return await this.printRepo.sendPrint(newJob); //llamamos a la infrastructure WsPrintBroker para enviar print a socket
    }
}