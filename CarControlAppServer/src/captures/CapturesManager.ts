import { ICapturesManager } from "./ICapturesManager";
import { ICapture } from "../models/captures/ICapture";
import { ImageSize } from "../models/captures/ImageSize";
const imageSize = require('image-size');
import * as fs from 'fs';
import * as path from 'path';
import { ICapturesDao } from "../dal/ICapturesDao";
import { ICaptureInfo } from "../models/captures/ICapturInfo";

export class CapturesManager implements ICapturesManager {
    public constructor(private capturesDirPath: string, private capturesDao: ICapturesDao) {
        this.createDirIfDoesntExist(this.capturesDirPath).catch((err: NodeJS.ErrnoException) => {
            console.error(`failed to create captures directory at path: '${capturesDirPath}`, err);
        });
    }

    /** API */

    public getLatestCaptures(limit: number, untilTime: number): Promise<ICapture[]> {
        if (limit < 0 || limit > 10) {
            return Promise.reject("limit must be between zero and 10");
        }

        if (untilTime < 0) {
            return Promise.reject("invalid time filter");
        }

        return new Promise((resolve, reject) => {
            return this.capturesDao.fetchLatest(limit, untilTime).then((captureInfos: ICaptureInfo[]) => {
                const picFilePromises: Promise<string>[] = 
                    captureInfos.map((info: ICaptureInfo) => this.getPictureFile(this.formatPicturePath(info.fileName)));
                
                Promise.all(picFilePromises).then((picsData: string[]) => {
                    let captures: ICapture[] =  picsData.map((data: string, index: number) => {
                        return {
                            info: captureInfos[index],
                            data: picsData[index]
                        }
                    })

                    resolve(captures);
                }).catch(err => reject(err));
            });
        })
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

    private formatPicturePath(filename: string): string {
        return path.join(this.capturesDirPath, filename);
    }

    private getPictureFile(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.exists(path, (exists: boolean) => {
                if (!exists) {
                    resolve("")
                }
            });

            fs.readFile(path, (err: NodeJS.ErrnoException, data: Buffer) => {
                if (err) {
                    (err);
                    return;
                }
                resolve(data.toString('base64'));
            })
        })
    }
}