import { Router, Request, Response } from "express";
import * as WebSocket from 'ws';

export class CommandsAPI {
    public router: Router;

    public constructor(wss: WebSocket.Server) {
        this.router = Router();

        this.router.get('/:cmd', (req: Request, res: Response) => {
            (<WebSocket[]>wss.clients).forEach((client: WebSocket) => {
                client.send(req.params.cmd);
            })
        })
    }
}