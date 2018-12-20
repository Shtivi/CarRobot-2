import * as fs from 'fs';
import * as path from 'path';
import { Config } from './Config';
import { IDatabaseConfig } from './IDatabaseConfig';

class ConfigLoader {
    public loadConfig(environment: string): Config {
        if (environment != 'DEV' && environment != 'PROD') {
            throw new Error('invalid environment specified: not DEV or PROD');
        }

        let filePath: string = path.join(__dirname, `../../config/config.${environment.toLowerCase()}.json`);
        let configFileContent: string = fs.readFileSync(filePath).toString();
        return JSON.parse(configFileContent);
    }

    public loadDatabaseConfig(filename: string): IDatabaseConfig {
        const filePath: string = path.join(__dirname, `../../config/${filename}`);
        const fileContent: string = fs.readFileSync(filePath).toString();
        return JSON.parse(fileContent);
    }
}

export default new ConfigLoader();