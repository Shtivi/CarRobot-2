import { IDatabaseConfig } from "../../config/IDatabaseConfig";

export class DBConnection {
    public static buildMongoConnectionString(dbconfig: IDatabaseConfig): string {
        return `mongodb://${dbconfig.username}:${dbconfig.password}@${dbconfig.url}/${dbconfig.dbname}`;
    }
}