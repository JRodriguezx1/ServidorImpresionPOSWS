import { Request, Response } from "express";
import { SendToPrinter } from "@application/usecases/SendToPrinter.js";


export class PrintController{

    private sendToPrinter: SendToPrinter;

    constructor(sendToPrinter: SendToPrinter){
        this.sendToPrinter = sendToPrinter;  //uso del caso de uso para enviar a imprimir, inyectado desde el router o contenedor de dependencias

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

    
}