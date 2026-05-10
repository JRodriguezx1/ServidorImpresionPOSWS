export interface PrintWSMessage {
   type: "print";
   payload: {
      businessId: string,
      sucursal: string,
      printerName: string,
      content: string
   };
}