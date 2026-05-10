/*export interface User {
  id?: string;
  name: string;
  email: string;
}*/


export class PrintJob{

  public readonly jobId: string;
  public readonly businessId: string;
  public readonly sucursal: string;
  public readonly printerName: string;
  public readonly content: string;
  public readonly createdAt: Date;

  constructor(businessId:string, sucursal:string, printerName:string, content:string){

    // Reglas
    if(!businessId.trim())throw new Error("id del negocio inválido");
  
    if(!sucursal.trim()) throw new Error("Sucursal no valida");
    
    if(!printerName.trim()) throw new Error("Nombre de la impresora no valida");
    
    if(!content.trim()) throw new Error("Contenido de impresion vacio");
    
  
    this.jobId = crypto.randomUUID();
    this.businessId = businessId;
    this.sucursal = sucursal;
    this.printerName = printerName;
    this.content = content;
    this.createdAt = new Date();
  }

  
}