import { RouteAction, HttpMethod } from "./RouteAction";
import { Router, IRouterMatcher } from "express";
import { Optional } from "../utils/Optional";
import { IRouter } from "express-serve-static-core";

export abstract class BaseApiRouter {
    private _router: IRouter;

    public constructor() {
        this.createRouter();
    }

    public router(): IRouter {
        return this._router;
    }

    private createRouter(): void {
        this._router = Router();
        this.buildRoutes().forEach((route: RouteAction) => {
            let routeMatcher: IRouterMatcher<IRouter> = 
                this.findRouterMatcher(route.method).orElseThrow(new Error(`could not handle route action ${JSON.stringify(route)}`));
            routeMatcher.call(this._router, route.path, route.handler.bind(this));
        })
    }

    private findRouterMatcher(httpMethod: HttpMethod): Optional<IRouterMatcher<IRouter>> {
        switch (httpMethod) {
            case HttpMethod.GET: 
                return Optional.of(this._router.get);
            case HttpMethod.POST:
                return Optional.of(this._router.post);
            case HttpMethod.PUT:
                return Optional.of(this._router.put);
            case HttpMethod.DELETE:
                return Optional.of(this._router.delete);
            default:
                return Optional.of();
        }
    }

    protected abstract buildRoutes(): RouteAction[];
}