import { Request, Response } from "express";
import { BaseApiRouter } from "./BaseApiRouter";
import { RouteAction, HttpMethod } from "./RouteAction";
import { ICapturesManager } from "../captures/ICapturesManager";

export class CapturesAPI extends BaseApiRouter {
    public constructor(private capturesManager: ICapturesManager) {
        super();
    }

    private getLatestCaptures(req: Request, res: Response): void {

    }

    private getCaptureById(req: Request, res: Response): void {

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
            new RouteAction(HttpMethod.GET, '/latest/:limit', this.getLatestCaptures),
            new RouteAction(HttpMethod.GET, '/:id', this.getCaptureById),
            new RouteAction(HttpMethod.GET, '/search', this.searchCaptures),
            new RouteAction(HttpMethod.PUT, '/:id', this.updateCaptureDetails),
            new RouteAction(HttpMethod.DELETE, '/:id', this.deleteCapture)
        ];
    }
}