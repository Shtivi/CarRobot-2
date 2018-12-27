import { Request, Response } from "express";
import * as WebSocket from 'ws';
import { BaseApiRouter } from "./BaseApiRouter";
import { RouteAction, HttpMethod } from "./RouteAction";
import { IRobotWebsocketServer } from "./robotWebsocketServer/IRobotWebsocketServer";
import { IUserNotificationsService } from "./userNotificationsService/IUserNotificationsService";
import { IMeasurementsStateManager } from "../measurements/IMeasurementsStateManager";

export class MeasurementsAPI extends BaseApiRouter {
    public constructor(private measurementsStateManager: IMeasurementsStateManager/*private robotWss: IRobotWebsocketServer, private notificationsService: IUserNotificationsService*/) {
        super();
    }

    private getMeasurements(req: Request, res: Response): void {        
        res.status(200).json(this.measurementsStateManager.retrieveMeasurementsList());
    }

    protected buildRoutes(): RouteAction[] {
        return [{
            method: HttpMethod.GET,
            path: '/',
            handler: this.getMeasurements
        }]
    }
}