import { Request, Response } from "express";
import { SendToPrinter } from "@application/usecases/SendToPrinter.js";
import { PrintJobStore } from "@infrastructure/database/PrintJobStore.js";


export class PrintController{

    private sendToPrinter: SendToPrinter;
    private jobStore: PrintJobStore;

    constructor(sendToPrinter: SendToPrinter, jobStore: PrintJobStore){
        this.sendToPrinter = sendToPrinter;  //uso del caso de uso para enviar a imprimir, inyectado desde el router o contenedor de dependencias
        this.jobStore = jobStore; //inyeccion del store para consultar estado de trabajos de impresion, inyectado desde el router o contenedor de dependencias
    }

    PrintToCLI = async(req:Request, res:Response)=>{
        try {
            const {businessId, sucursal, printerName, content} = req.body;
            const user = await this.sendToPrinter.execute({businessId, sucursal, printerName, content});
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({
                message: error.message || "Error al enviar trabajo de impresion."
            });
        }
    }


    getPrintStatus = async(req:Request, res:Response)=>{
        try {
            const {jobId} = req.params;
            if(Array.isArray(jobId) || !jobId.trim()) return res.status(400).json({message: "ID de trabajo de impresion no valido"});
            const job = this.jobStore.get(jobId);
            if(!job) return res.status(404).json({message: "Trabajo de impresion no encontrado"});
            res.json({jobId: job.jobId, status: job.status});
        } catch (error: any) {
            res.status(400).json({
                message: error.message || "Error al consultar estado de impresion."
            });
        }
    }

    
}