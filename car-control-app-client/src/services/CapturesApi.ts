import { IConfig } from '@/config/Config';
import axios, { AxiosResponse } from 'axios';
import { ICapture } from '@/models/ICapture';

export class CapturesApi {
    public constructor(private config: IConfig) {}

    public fetchLatestCaptures(): Promise<ICapture[]> {
        return new Promise((resolve, reject) => {
            const url: string = this.formatUrl(this.config.api.routes.getLatestCaptures);
            axios.get(url)
                .then((res: AxiosResponse<ICapture[]>) => {
                    resolve(res.data);
                })
                .catch(err => reject(err));
        })
    }

    private formatUrl(route: string): string {
        return `${this.config.api.url}/${route}`;
    }
}