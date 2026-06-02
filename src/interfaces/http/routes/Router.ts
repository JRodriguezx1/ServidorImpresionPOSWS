import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { PrintController } from "../controllers/PrintController.js";



export class RouterApp {

    static getRoutes(printController: PrintController, userController: UserController): Router{
        const router = Router();
        router.post('/api/user/create', userController.createuser);
        router.post('/api/print/printJob', printController.PrintToCLI);
        router.get('/api/print/status/:jobId', printController.getPrintStatus);

        return router;
    }
}
