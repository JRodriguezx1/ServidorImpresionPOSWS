import { WebSocket } from 'ws';
// 1. Definimos el contrato de la función
type Handler = (data: any, ws: WebSocket) => Promise<void>;

export class WSRouter {
     private routes: Record<string, Handler> = {};

     register(type: string, funcion: Handler) {
        this.routes[type] = funcion;  //se registra funcion (data, ws) => userWSHandler.WSCreateUser(data, ws) pero no se ejecuta, solo cuando se llama o se hace userWSHandler.WSCreateUser()
    }


    async handle(message: any, ws: WebSocket) {
        const funcion = this.routes[message.type]; //obtiene el handle o funcion correspondiente al evento type

        if (!funcion)throw new Error(`Evento [${message.type}] no soportado`);

        try {
            await funcion(message, ws);  //ejecuta la funcion asignada al evento type
        } catch (error:any) {
            ws.send(JSON.stringify({
                type: "error",
                message: error.message
            }));
        }
    }

}