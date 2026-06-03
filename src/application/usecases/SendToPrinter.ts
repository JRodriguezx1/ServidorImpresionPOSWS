import { PrintJob } from "@domain/entities/Printjob.js";
import { IPrintJobRepository } from "@domain/repositories/IPrintJobRepository.js";
import { PrintJobStore } from "@infrastructure/database/PrintJobStore.js";


///////    CASO DE USO    ////////
export class SendToPrinter {

    private printRepo: IPrintJobRepository;
    private jobStore: PrintJobStore;

    constructor(printRepository: IPrintJobRepository, jobStore: PrintJobStore){
        this.printRepo = printRepository;
        this.jobStore = jobStore;
    }

    async execute(job: {businessId: string, sucursal: string, printerName: string, tipoTicket: string, content: string}): Promise<PrintJob|null> {
        /* validar antes de crear entidad
        if (!data.sucursal?.trim()) {
            throw new Error("Sucursal requerida");
            }
        */
        const newJob = new PrintJob(job.businessId, job.sucursal, job.printerName, job.tipoTicket, job.content);  //aqui validamos los campos reglas de negocio
        this.jobStore.add(newJob);
        return await this.printRepo.sendPrint(newJob); //llamamos a la infrastructure WsPrintBroker para enviar print a socket
    }
}