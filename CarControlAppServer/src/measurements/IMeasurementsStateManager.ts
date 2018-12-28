import { IMeasurementData } from "../models/IMeasurementData";

export interface IMeasurementsStateManager {
    updateMeasurement(measurement: IMeasurementData): void;
    retrieveMeasurementsList(): IMeasurementData[];
    reset(): void;
}