import { IMeasurementsStateManager } from "./IMeasurementsStateManager";
import { IMeasurementData } from "../models/IMeasurementData";
import * as _ from 'underscore';

export class MeasurementsStateManager implements IMeasurementsStateManager {
    private measurements: _.Dictionary<IMeasurementData>;

    public constructor() {
        this.reset();
    }

    updateMeasurement(measurement: IMeasurementData): void {
        if (!measurement.measurementType) {
            throw new Error('measurement has no type');
        }

        this.measurements[measurement.measurementType] = measurement;
    }

    retrieveMeasurementsList(): IMeasurementData[] {
        return Object.keys(this.measurements).map((type: string) => this.measurements[type]);
    }

    reset(): void {
        this.measurements = {};
    }
}