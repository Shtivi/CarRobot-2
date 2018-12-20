import { ICaptureInfo } from "../models/captures/ICapturInfo";

export interface ICapturesDao {
    fetchByTimestamp(time: number): Promise<ICaptureInfo>;
    addNewCapture(info: ICaptureInfo): Promise<void>;
}