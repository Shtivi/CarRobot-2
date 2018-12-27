import { IMeasurementIndicator } from "../IMeasurementIndicator";
import * as Process from 'child_process';

export class WifiMeter implements IMeasurementIndicator<number> {
    public type(): string {
        return "wifi";
    }

    public measure(): Promise<number> {
        return new Promise((resolve, reject) => {
            Process.exec('iwconfig wlan0 | grep Link | sed -n "s/^.*level=\\s*\\(-\\S*\\) dBm/\\1/p"', (err: Process.ExecException, output: string, stderr: string) => {
                if (err) {
                    reject(err);
                } else if (stderr) {
                    reject(stderr);
                } else {
                    resolve(Number(output));
                }
            })
        });
    }
}