import { Request, Response, RequestHandler } from "express";

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export class RouteAction {
    public method: HttpMethod;
    public path: string;
    public handler: RequestHandler;
}