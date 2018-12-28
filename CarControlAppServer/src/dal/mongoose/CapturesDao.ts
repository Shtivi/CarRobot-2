import { ICaptureInfo } from "../../models/captures/ICapturInfo";
import { Document, Schema, Model, model } from "mongoose";
import { ICapturesDao } from "../ICapturesDao";
import { BaseMongooseDao } from "./BaseMongooseDao";
import { resolve } from "dns";

interface ICaptureInfoModel extends ICaptureInfo, Document {
} 

export class CapturesDao extends BaseMongooseDao<ICaptureInfoModel> implements ICapturesDao {
    public constructor() {
        super();
    }
    
    // API

    public fetchByTimestamp(time: number): Promise<ICaptureInfo> {
        return new Promise((resolve, reject) => {
            this.model.findOne({ time: time }, (err: any, data: ICaptureInfoModel) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (data)
                    resolve(data.toObject());
                else 
                    reject("capture not found");
            });
        })
    }

    public addNewCapture(info: ICaptureInfo): Promise<void> {
        const doc: ICaptureInfoModel = new this.model(info);
        return new Promise((resolve, reject) => {
            doc.save()
                .then(() => resolve())
                .catch(reject);
        });
    }

    public fetchLatest(limit: number, untilTime: number): Promise<ICaptureInfo[]> {
        return new Promise((resolve, reject) => {
            this.model.find({ time: { $lte: untilTime+1 } }).sort({ time: '-1' }).limit(limit).exec((err: any, res: ICaptureInfoModel[]) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(res.map((doc: ICaptureInfoModel) => doc.toObject()));              
            });
        })
    }

    // Mongoose

    protected createSchema(): Schema {
        return new Schema({
            time: Number,
            fileName: String,
            extension: String,
            name: String,
            source: String,
            takenByUser: String,
            kilobytes: Number,
            width: Number,
            height: Number,
        })    
    }

    protected schemaName(): string {
        return 'captures';
    }
}