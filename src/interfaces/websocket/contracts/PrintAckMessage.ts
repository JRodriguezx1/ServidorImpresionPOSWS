export interface PrintAckMessage {
    type: "print_ack";
    payload: {
        jobId: string;
        status: | "received" | "printing" | "printed" | "failed";
        error?: string;
    };
}