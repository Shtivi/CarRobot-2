import { ICapture } from "../models/captures/ICapture";

export interface ICapturesManager {
    getLatestCaptures(limit: number, untilTime: number): Promise<ICapture[]>
    getCapture(id: number): Promise<ICapture>;
    searchCaptures(text: string): Promise<ICapture[]>;
    newCapture(data: any): Promise<ICapture>;
    updateCaptureDetails(capture: ICapture): Promise<ICapture>;
    deleteCapture(id: number): Promise<void>;
}