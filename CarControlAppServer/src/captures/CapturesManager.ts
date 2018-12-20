import { ICapturesManager } from "./ICapturesManager";
import { ICapture } from "../models/captures/ICapture";
import { ImageSize } from "../models/captures/ImageSize";
const imageSize = require('image-size');
import * as fs from 'fs';
import * as path from 'path';
import { ICapturesDao } from "../dal/ICapturesDao";

export class CapturesManager implements ICapturesManager {
    public constructor(private capturesDirPath: string, private capturesDao: ICapturesDao) {
        this.createDirIfDoesntExist(this.capturesDirPath).catch((err: NodeJS.ErrnoException) => {
            console.error(`failed to create captures directory at path: '${capturesDirPath}`, err);
        });
    }

    /** API */

    public getLatestCaptures(limit: number): Promise<ICapture[]> {
        throw new Error("Method not implemented.");
    }    
    
    public getCapture(id: number): Promise<ICapture> {
        throw new Error("Method not implemented.");
    }

    searchCaptures(text: string): Promise<ICapture[]> {
        throw new Error("Method not implemented.");
    }

    newCapture(capture: string): Promise<ICapture> {
        const imageDimensions: ImageSize = this.calculateImageSize(capture);
        const captureTime: Date = new Date();
        const captureFileName: string = `${captureTime.getTime()}.jpeg`;
        const captureFilePath: string = path.join(this.capturesDirPath, captureFileName);

        return new Promise((resolve, reject) => {
            fs.writeFile(captureFilePath, capture, {encoding: 'base64'}, (err: NodeJS.ErrnoException) => {
                if (err) {
                    reject(err);
                    return;
                }

                const captureModel: ICapture = {
                    data: capture,
                    info: {
                        extension: 'jpeg',
                        fileName: `${captureTime.getTime()}.jpeg`,
                        height: imageDimensions.height,
                        width: imageDimensions.width,
                        kilobytes: imageDimensions.kilobytes,
                        name: captureTime.toLocaleString(),
                        time: captureTime.getTime(),
                        source: "HomieRobot",
                        takenByUser: "Ido"
                    }
                }
                
                this.capturesDao.addNewCapture(captureModel.info)
                    .then(() => resolve(captureModel))
                    .catch(reject);
            });
        })
    }

    updateCaptureDetails(capture: ICapture): Promise<ICapture> {
        throw new Error("Method not implemented.");
    }

    deleteCapture(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /** Private methods */
    
    private calculateImageSize(base64: string): ImageSize {
        const buffer: Buffer = Buffer.from(base64, 'base64');
        const dimensions = imageSize(buffer);
        const kilobytes = buffer.length / 1000;
        
        return {
            width: dimensions.width,
            height: dimensions.height,
            kilobytes
        }
    }

    private createDirIfDoesntExist(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.stat(path, (statsErr: NodeJS.ErrnoException, stats: fs.Stats) => {
                if (statsErr) {
                    fs.mkdir(path, (mkdirErr: NodeJS.ErrnoException) => {
                        if (mkdirErr) {
                            reject(mkdirErr);
                            return
                        }
                        resolve();
                    })
                } else {
                    resolve();
                }
            });
        });
    }
}