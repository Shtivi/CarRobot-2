import { ICapture } from "./ICapture";

export interface ICapturesManager {
    getLatestCaptures(limit: number): Promise<ICapture[]>
    getCapture(id: number): Promise<ICapture>;
    searchCaptures(text: string): Promise<ICapture[]>;
    newCapture(capture: ICapture): Promise<void>;
    updateCaptureDetails(capture: ICapture): Promise<void>;
    deleteCapture(id: number): Promise<void>;
}