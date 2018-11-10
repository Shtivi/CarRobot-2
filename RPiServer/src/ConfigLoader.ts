import * as fs from 'fs';
import * as path from 'path';

class ConfigLoader {
    public loadConfig(environment: string): void {
        if (environment.toUpperCase() != 'DEV' && environment.toUpperCase() != 'PROD') {
            throw new Error('invalid environment specified: not DEV or PROD');
        }

        let filePath: string = path.join(__dirname, `../config/config.${environment.toLowerCase()}.json`);
        let configFileContext: string = fs.readFileSync(filePath).toString();
        return JSON.parse(configFileContext);
    }
}

export default new ConfigLoader();