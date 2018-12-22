import { IMeasurement } from './IMeasurement';

export interface IMeasurementsCollection {
    robotConnection: IMeasurement<boolean>;
    wifiSignal: IMeasurement<number>;
    
    [measurementName: string]: IMeasurement<any>;
}