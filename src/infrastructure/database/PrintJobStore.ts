import { PrintJob } from "@domain/entities/Printjob.js";

export class PrintJobStore{

    private jobs = new Map<string, PrintJob>();

    add(job: PrintJob) {
        this.jobs.set(job.jobId, job);
    }

    get(jobId: string): PrintJob | undefined {
        return this.jobs.get(jobId);
    }
}