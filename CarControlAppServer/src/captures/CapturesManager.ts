import { ICapturesManager } from "./ICapturesManager";
import { ICapture } from "./ICapture";

export class CapturesManager implements ICapturesManager {
    public constructor(capturesDirPath: string) {
    }

    public getLatestCaptures(limit: number): Promise<ICapture[]> {
        throw new Error("Method not implemented.");
    }    
    
    public getCapture(id: number): Promise<ICapture> {
        throw new Error("Method not implemented.");
    }

    searchCaptures(text: string): Promise<ICapture[]> {
        throw new Error("Method not implemented.");
    }

    newCapture(capture: ICapture): Promise<void> {
        throw new Error("Method not implemented.");
    }

    updateCaptureDetails(capture: ICapture): Promise<void> {
        throw new Error("Method not implemented.");
    }

    deleteCapture(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
}