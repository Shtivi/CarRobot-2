import { IMeasurementsStateManager } from "./IMeasurementsStateManager";
import { IMeasurementData } from "../models/IMeasurementData";
import * as _ from 'underscore';

export class MeasurementsStateManager implements IMeasurementsStateManager {
    private measurements: _.Dictionary<IMeasurementData[]>;

    public constructor() {
        this.measurements = {};
    }

    updateMeasurement(measurement: IMeasurementData): void {
        if (!measurement.measurementType) {
            throw new Error('measurement has no type');
        }

        if (!this.measurements[measurement.measurementType]) {
            this.measurements[measurement.measurementType] = [];
        }

        this.measurements[measurement.measurementType].push(measurement);
    }

    retrieveMeasurementsList(): IMeasurementData[] {
        return Object.keys(this.measurements).map((type: string) => {
            const currentTypeMeasurements: IMeasurementData[] = this.measurements[type];
            return currentTypeMeasurements[currentTypeMeasurements.length - 1];
        })
    }
}