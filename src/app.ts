//import "module-alias/register"; //en modo dev comentar esta linea.
import { Server } from "@main/server.js";
import { RouterApp } from "@interfaces/http/routes/Router.js";
import { buildUserModule } from "@main/dependencies.js";
//import "@config/mongodb";
import dotenv from "dotenv";
import { WSRouter } from "@interfaces/websocket/WSRouter.js";



dotenv.config();
const wsRouter = new WSRouter();
const {printController, userController, connectionManager, registerPrinterHandler, printJobHandler, printAckHandler}=buildUserModule();

//registro de rutas por envento type para websocket
wsRouter.register("register_printer", (data, ws) => registerPrinterHandler.handleRegister(data, ws));
wsRouter.register("print", (data, ws) => printJobHandler.handlePrint(data, ws));  //tambien soporta si la impresion biene de un socket y no solo de http
wsRouter.register('print_ack', (data, ws) => printAckHandler.handleAck(data));


(async  ()=>{
    // Railway inyecta automáticamente process.env.PORT
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3100;  //proces.env.PORT viene del archivo .env, si no existe se asigna el puerto 3100 por defecto
    new Server(PORT, RouterApp.getRoutes(printController, userController), connectionManager).start(wsRouter);
})();


// npm run dev para iniciar el servidor en modo desarrollo, 
// npm run build para compilar el proyecto a JavaScript en la carpeta dist.
// npm run start para iniciar en modo produccion (con build previo)