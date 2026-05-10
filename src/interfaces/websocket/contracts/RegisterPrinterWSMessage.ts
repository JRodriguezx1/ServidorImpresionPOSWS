export interface RegisterPrinterWSMessage {
   type: "register_printer";
   payload: {
        businessId: string;
        sucursal: string;
        printerName: string;
   };
}