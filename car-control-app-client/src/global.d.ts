import { IStreamingObject } from "./models/IStreamingObject";

declare global {
    interface Window {
        streaming: IStreamingObject;
    }
}