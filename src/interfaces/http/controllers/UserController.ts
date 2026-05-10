import { Request, Response } from "express";
import { CreateUser } from "@application/usecases/SendToPrinter.js";


export class UserController{

    private createUser: CreateUser;

    constructor(crearUsuario: CreateUser){
        this.createUser = crearUsuario;

    }

    createuser = async(req:Request, res:Response)=>{
        try {
            const {name, email} = req.body;
            const user = await this.createUser.execute({name, email});
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({
                message: error.message || "Error al crear usuario"
            });
        }
    }

    
}