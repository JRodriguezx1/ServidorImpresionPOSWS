import express, { Router }  from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { WSRouter } from "@interfaces/websocket/WSRouter.js";
import { ConnectionManager } from "@infrastructure/websocket/ConnectionManager.js";
//import path from "path";

interface AliveWebSocket extends WebSocket {
    isAlive?: boolean;
}

export class Server{

    private readonly app = express();
    private readonly port:number;
    private readonly routes:Router;
    private connectionManager: ConnectionManager;
    constructor(port: number, routes:Router, connectionManager:ConnectionManager){
        this.port = port;
        this.routes = routes;
        this.connectionManager = connectionManager;
    }

    start(wsRouter: WSRouter){
        this.app.use(cors());
        //middleware serializar la data
        this.app.use(express.json());
        //middleware para tolerar el x-www-form-urlencoded
        this.app.use(express.urlencoded({extended:true}));
        //usar las rutas definidas
        this.app.use(this.routes);  //monta rutas, todas las rutas cuelgan desde / el prefijo se define en AppRouter
        
        const server = http.createServer(this.app);  //montar el servidor http real de manera manual de node

        const wss = new WebSocketServer({ server });  //“WebSocket, usa ESTE servidor HTTP en vez de crear uno nuevo”
        
        wss.on("connection", (ws:AliveWebSocket, req) => {
            console.log(req.url, 'Cliente conectado');
            ws.isAlive = true;
            ws.on("pong", () => {
                console.log("Pong recibido de cliente");
                ws.isAlive = true; 
            });

            ws.on("message", async (msg) => {  //mensaje recibido del cliente

                try {
                    const dataObj = JSON.parse(msg.toString());  //convierte cadena de texto que tiene formato JSON en un objeto/array  //msg.toString() si msg es buffer u objeto convierte a string, si ya es string lo deja igual
                    console.log('datos recibidos =>', dataObj);
                    await wsRouter.handle(dataObj, ws);
                } catch (error:any) {
                    ws.send(JSON.stringify({ type: "error", message: error.message }));
                }

            });

            //socket de cliente cerrado
            ws.on("close", () => {
                console.log("Cliente desconectado");
                this.connectionManager.remove(ws);
            });

            // error websocket
            ws.on("error", (error) => {
                console.error("WS Error:", error);
                this.connectionManager.remove(ws);
            });

        });


        //  heartbeat
        const interval = setInterval(() => {
            wss.clients.forEach((ws: AliveWebSocket) => {  //en foreach no puede hacer continue ni break por que usa callback internamente, se usa return
                //console.log(ws);
                if (ws.isAlive === false) {
                    console.log("Socket muerto");
                    this.connectionManager.remove(ws);
                    return ws.terminate();  //pasa a la siguiente iteracion
                }
                ws.isAlive = false;
                console.log("Enviando ping a cliente");
                ws.ping();// enviar ping
            });
        }, 30000);


        // limpiar interval al cerrar servidor
        wss.on("close", () => {
            clearInterval(interval);
        });

        //this.app.use(express.static(path.join(__dirname, '../public')));
        //this.app.use(express.static(path.join(process.cwd(), "downloads")));
        //escuchar el puerto
        server.listen(this.port, ()=>{  //internamente hace algo como http.createServer(app).listen(3000)
            console.log(`Server running on port ${this.port}`);
        });

    }

}