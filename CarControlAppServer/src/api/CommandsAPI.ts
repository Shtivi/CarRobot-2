import { Request, Response } from "express";
import * as WebSocket from 'ws';
import { BaseApiRouter } from "./BaseApiRouter";
import { RouteAction, HttpMethod } from "./RouteAction";
import { IRobotWebsocketServer } from "./robotWebsocketServer/IRobotWebsocketServer";

export class CommandsAPI extends BaseApiRouter {

    public constructor(private robotWss: IRobotWebsocketServer) {
        super();
    }

    private handleCommand(req: Request, res: Response): void {
        if (!this.robotWss) {
            res.status(500).send("No web socket server defined");
            return;
        }

        console.log(`sending command: ${req.params.cmd}`);
        this.robotWss.send(req.params.cmd).then((warnings: string[]) => {
            res.status(200).send(warnings);
            console.log(`${req.params.cmd} sent with ${warnings.length} warnings: ${warnings.join(", ")}`);
        }).catch((err: Error) => {
            res.status(500).send(err);
        });        
    }

    protected buildRoutes(): RouteAction[] {
        return [{
            method: HttpMethod.GET,
            path: '/:cmd',
            handler: this.handleCommand
        }]
    }
}