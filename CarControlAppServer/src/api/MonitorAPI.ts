import { BaseApiRouter } from "./BaseApiRouter";
import { RouteAction, HttpMethod } from "./RouteAction";
import { Request, Response } from "express";

export class MonitorAPI extends BaseApiRouter {
    private aliveSince: Date;

    public constructor() {
        super();
        this.aliveSince = new Date();
    }

    private isAlive(req: Request, res: Response): void {
        res.json({
            isAlive: true,
            since: this.aliveSince.getTime()
        })
    }

    protected buildRoutes(): RouteAction[] {
        return [{
            method: HttpMethod.GET,
            path: '/isAlive',
            handler: this.isAlive
        }]
    }
}