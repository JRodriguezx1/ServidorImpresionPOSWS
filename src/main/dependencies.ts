import { UserController } from "@interfaces/http/controllers/UserController.js";
import { SendToPrinter } from "@application/usecases/SendToPrinter.js";
import { WsPrintBroker } from "@infrastructure/repositories/WsPrintBroker.js";
import { PrintJobHandler } from "@interfaces/websocket/handlers/PrintJobHandler.js";
import { RegisterPrinterHandler } from "@interfaces/websocket/handlers/RegisterPrinterHandler.js";
import { ConnectionManager } from "@infrastructure/websocket/ConnectionManager.js";
import { PrintAckHandler } from "@interfaces/websocket/handlers/PrintAckHandler.js";
import { PrintController } from "@interfaces/http/controllers/PrintController.js";
import { PrintJobStore } from "@infrastructure/database/PrintJobStore.js";
import { RedisPrintJobStore } from "@infrastructure/database/RedisPrintJobStore.js";

export const buildUserModule = ()=>{


    const connectionManager = new ConnectionManager(); //corresponde a infrastruture
    const repoBroker = new WsPrintBroker(connectionManager); //implementacion de la interfaz que esta en domain
    const jobStore = new PrintJobStore();
    const jobStoreRedis = new RedisPrintJobStore();
    const sendToPrinter = new SendToPrinter(repoBroker, jobStore, jobStoreRedis);  //caso de uso
    const printController = new PrintController(sendToPrinter, jobStore); //controlador http
    const userController = new UserController(); //controlador http

    const registerPrinterHandler = new RegisterPrinterHandler(connectionManager); //viene siendo como el controlador
    const printJobHandler  = new PrintJobHandler(sendToPrinter);  //viene siendo como el controlador
    const printAckHandler = new PrintAckHandler(jobStore, jobStoreRedis);

    return {printController, userController, connectionManager, registerPrinterHandler, printJobHandler, printAckHandler};
}