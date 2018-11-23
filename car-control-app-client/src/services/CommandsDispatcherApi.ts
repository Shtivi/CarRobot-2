import { IConfig } from '@/config/Config';
import axios, { AxiosResponse } from 'axios';

export class CommandsDispatcherApi {
    public constructor(private config: IConfig) {
    }

    public sendCommand(command: string): Promise<void> {
        return new Promise((resolve, reject) => {
            axios.get(this.formatUrl(this.config.api.routes.sendCommand + "/" + command))
                .then((response: AxiosResponse) => resolve())
                .catch((err: any) => reject(err));
        })
    }

    private formatUrl(route: string): string {
        return `${this.config.api.url}/${route}`;
    }
}