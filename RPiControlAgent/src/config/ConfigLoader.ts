import * as fs from 'fs';
import * as path from 'path';
import { Config } from './Config';

class ConfigLoader {
    public loadConfig(environment: string): Config {
        if (environment != 'DEV' && environment != 'PROD') {
            throw new Error('invalid environment specified: not DEV or PROD');
        }

        let filePath: string = path.join(__dirname, `../../config/config.${environment.toLowerCase()}.json`);
        let configFileContext: string = fs.readFileSync(filePath).toString();
        return JSON.parse(configFileContext);
    }
}

export default new ConfigLoader();