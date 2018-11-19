import { Request, Response } from "express";
import * as WebSocket from 'ws';
import { BaseApiRouter } from "./BaseApiRouter";
import { RouteAction, HttpMethod } from "./RouteAction";

export class CommandsAPI extends BaseApiRouter {

    public constructor(private wss: WebSocket.Server) {
        super();
    }

    private handleCommand(req: Request, res: Response): void {
        if (!this.wss) {
            res.status(500).send("No web socket server defined");
            return;
        }

        if (this.wss.clients.size == 0)  {
            res.status(200).send({
                warning: "command sent, but there are no listeners registered to receive it."
            });
            return;
        }

        this.wss.clients.forEach((client: WebSocket) => {
            client.send(req.params.cmd);
        })
        
        console.log(`sending command: ${req.params.cmd}`);
        res.status(200).send();
    }

    protected buildRoutes(): RouteAction[] {
        return [{
            method: HttpMethod.GET,
            path: '/:cmd',
            handler: this.handleCommand
        }]
    }
}