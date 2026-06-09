import { PrintJob } from "@domain/entities/Printjob.js";


export interface IPrintJobStoreRepository {
    add(job: PrintJob): Promise<void>;
    get(jobId: string): Promise<PrintJob | null>;
    // Aquí puedes añadir update, delete, etc.
}