import { WebSocket } from 'ws';
import { SendToPrinter } from "@application/usecases/SendToPrinter.js";
import { PrintWSMessage } from '../contracts/PrintWSMessage.js';


////////   EQUIVALENTE A UN CONTROLADOR   ///////////
export class PrintJobHandler {

  private sendToPrinter: SendToPrinter;
  
  constructor(sendToPrinter: SendToPrinter) {
    this.sendToPrinter = sendToPrinter;
  }

  async handlePrint(message: PrintWSMessage, ws: WebSocket) {
    

      const printjob = await this.sendToPrinter.execute({
        businessId: message.payload.businessId,
        sucursal: message.payload.sucursal,
        printerName: message.payload.printerName,
        content: message.payload.content
      });

      //enviar a server local
      /*ws.send(JSON.stringify({
        type: "print",
        payload: printjob
      }));*/

  }


}