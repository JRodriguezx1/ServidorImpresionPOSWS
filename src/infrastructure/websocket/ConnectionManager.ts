import { WebSocket } from "ws";

export class ConnectionManager {

    private printers = new Map<string, WebSocket>();

    private buildKey( businessId: string, sucursal: string, printerName: string): string {
        return `${businessId}:${sucursal}:${printerName}`;
    }

    registerPrinter(businessId: string, sucursal: string, printerName: string, ws: WebSocket) {
        const key = this.buildKey(businessId, sucursal, printerName);
        this.printers.set(key, ws);
    }

    getPrinter(businessId: string, sucursal: string, printerName: string): WebSocket | undefined {
        const key = this.buildKey(businessId, sucursal, printerName);
        return this.printers.get(key);
    }

    remove(ws: WebSocket) {
        for (const [key, socket] of this.printers.entries()) {
            if (socket === ws) {
                this.printers.delete(key);
                break;
            }
        }
    }

}