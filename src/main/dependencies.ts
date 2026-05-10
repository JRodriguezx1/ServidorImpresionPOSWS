import { UserController } from "@interfaces/http/controllers/UserController.js";
import { SendToPrinter } from "@application/usecases/SendToPrinter.js";
import { WsPrintBroker } from "@infrastructure/repositories/WsPrintBroker.js";
import { PrintJobHandler } from "@interfaces/websocket/handlers/PrintJobHandler.js";
import { RegisterPrinterHandler } from "@interfaces/websocket/handlers/RegisterPrinterHandler.js";
import { ConnectionManager } from "@infrastructure/websocket/ConnectionManager.js";
import { PrintAckHandler } from "@interfaces/websocket/handlers/PrintAckHandler.js";
import { PrintController } from "@interfaces/http/controllers/PrintController.js";

export const buildUserModule = ()=>{


    const connectionManager = new ConnectionManager(); //corresponde a infrastruture
    const repoBroker = new WsPrintBroker(connectionManager); //implementacion de la interfaz que esta en domain
    const sendToPrinter = new SendToPrinter(repoBroker);  //caso de uso
    const printController = new PrintController(sendToPrinter); //controlador http
    const userController = new UserController(sendToPrinter); //controlador http

    const registerPrinterHandler = new RegisterPrinterHandler(connectionManager); //viene siendo como el controlador
    const printJobHandler  = new PrintJobHandler(sendToPrinter);  //viene siendo como el controlador
    const printAckHandler = new PrintAckHandler();

    return {printController, userController, connectionManager, registerPrinterHandler, printJobHandler, printAckHandler};
}