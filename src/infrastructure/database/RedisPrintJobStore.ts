import { PrintJob } from "@domain/entities/Printjob.js";
import { IPrintJobStoreRepository } from "@domain/repositories/IPrintJobStoreRepository.js";
import { createClient } from "redis";

export class RedisPrintJobStore implements IPrintJobStoreRepository{

    private client;

    constructor(){
        this.client = createClient({ url: process.env.REDIS_URL });
        this.client.connect().catch(console.error);
    }

    async add(job: PrintJob):Promise<void> {
        const key = `printjob:${job.jobId}`;
        const data = JSON.stringify({
            jobId: job.jobId,
            businessId: job.businessId,
            sucursal: job.sucursal,
            printerName: job.printerName,
            tipoTicket: job.tipoTicket,
            content: job.content,
            status: job.status,
            createdAt: job.createdAt
        });
        // Guardamos en Redis y le damos 2 horas de vida (7200 segundos) para no llenar la memoria
        await this.client.set(key, data, { EX: 14400 });
    }

    async get(jobId: string):Promise<PrintJob | null> {
        const key = `printjob:${jobId}`;
        const rawData = await this.client.get(key);
        if (!rawData) return null;
        const data = JSON.parse(rawData);
        return PrintJob.reconstruct(data);
    }

}