import { Schema, Model, Document, model } from "mongoose";

export abstract class BaseMongooseDao<T extends Document> {
    private _schemaInstance: Schema;
    private _modelInstance: Model<T>;
    
    public constructor() {
        this.setSchemaInstance(this.createSchema());
        this.createModel(this.schemaName(), this.schema);
    }

    protected get schema(): Schema {
        return this._schemaInstance;
    }

    protected get model(): Model<T> {
        return this._modelInstance;
    }
    
    protected abstract createSchema(): Schema;
    protected abstract schemaName(): string;

    private setSchemaInstance(schema: Schema): void {
        if (!schema) {
            throw new Error("schema must be defined");
        }

        this._schemaInstance = schema;
    }

    private createModel(schemaName: string, schemaInstance: Schema): void {
        if (!schemaName || schemaName.length == 0) {
            throw new Error('schema name must be defined');
        }

        this._modelInstance = model<T>(schemaName, schemaInstance);
    }
}