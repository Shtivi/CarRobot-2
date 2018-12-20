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
    
    public fetchByTimestamp(time: number): Promise<ICaptureInfo> {
        throw new Error("Method not implemented.");
    }

    public addNewCapture(info: ICaptureInfo): Promise<void> {
        const doc: ICaptureInfoModel = new this.model(info);
        return new Promise((resolve, reject) => {
            doc.save(() => resolve()).catch(reject);
        });
    }
}