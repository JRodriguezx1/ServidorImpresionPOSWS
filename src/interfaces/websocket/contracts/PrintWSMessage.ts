export interface PrintWSMessage {
   type: "print";
   payload: {
      businessId: string,
      sucursal: string,
      printerName: string,
      tipoTicket: string,
      content: string
   };
}