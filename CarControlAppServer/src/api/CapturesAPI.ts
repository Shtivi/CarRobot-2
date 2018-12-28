import { Request, Response } from "express";
import { BaseApiRouter } from "./BaseApiRouter";
import { RouteAction, HttpMethod } from "./RouteAction";
import { ICapturesManager } from "../captures/ICapturesManager";
import { ICapture } from "../models/captures/ICapture";

export class CapturesAPI extends BaseApiRouter {
    public constructor(private capturesManager: ICapturesManager) {
        super();
    }

    private getLatestCaptures(req: Request, res: Response): void {
        const parsedLimit: number = parseInt(req.query.limit);
        const parsedTime: number = parseInt(req.query.untilTime);

        const fixedLimit: number = !isNaN(parsedLimit) ? parsedLimit : 10;
        const fixedTime: number = !isNaN(parsedTime) ? parsedTime : Date.now();

        this.capturesManager.getLatestCaptures(fixedLimit, fixedTime).then((data) => {
            res.json(data);
        }).catch(err => {
            res.status(500).json(err);
        })
    }

    private getCaptureById(req: Request, res: Response): void {
        const captureId: number = Number(req.params.id);

        if (isNaN(captureId)) {
            res.status(500).send("Invalid picture id - not an number");
            return;
        }

        this.capturesManager.getCapture(captureId)
            .then((capture: ICapture) => res.json(capture))
            .catch(err => res.status(500).send(err));
    }

    private searchCaptures(req: Request, res: Response): void {

    }

    private updateCaptureDetails(req: Request, res: Response): void {

    }

    private deleteCapture(req: Request, res: Response): void {

    }

    private 

    protected buildRoutes(): RouteAction[] {
        return [
            new RouteAction(HttpMethod.GET, '/latest', this.getLatestCaptures),
            new RouteAction(HttpMethod.GET, '/:id', this.getCaptureById),
            new RouteAction(HttpMethod.GET, '/search', this.searchCaptures),
            new RouteAction(HttpMethod.PUT, '/:id', this.updateCaptureDetails),
            new RouteAction(HttpMethod.DELETE, '/:id', this.deleteCapture)
        ];
    }
}