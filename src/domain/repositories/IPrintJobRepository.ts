import { PrintJob } from '../entities/Printjob.js';


export interface IPrintJobRepository{  //se implementa en infrastructure WsPrintBroker
    sendPrint(query: PrintJob):Promise<PrintJob | null>
}
