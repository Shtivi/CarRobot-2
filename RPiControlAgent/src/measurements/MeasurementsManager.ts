import { IMeasurementIndicator } from "./IMeasurementIndicator";
import * as events from 'events';
import { IMeasurementData } from "./IMeasurementData";
import { Optional } from "../utils/Optional";

export class MeasurementsManager extends events.EventEmitter {
    private measurementSuppliers: Array<IMeasurementIndicator<any>>;
    private intervalObj: Optional<NodeJS.Timeout>;
    
    public constructor(private interval: number) {
        super();
        this.intervalObj = Optional.of();
        this.measurementSuppliers = [];
    }

    public start(): MeasurementsManager {
        this.intervalObj = Optional.of(setInterval(this.makeMeasurements.bind(this), this.interval));
        return this;
    }

    public stop(): MeasurementsManager {
        if (!this.intervalObj.isPresent()) {
            throw new Error('not started in the first place');
        }

        clearInterval(this.intervalObj.get());
        this.intervalObj = Optional.of();
        return this;
    }

    public withIndicator(supplier: IMeasurementIndicator<any>): MeasurementsManager {
        if (!supplier) {
            throw new Error('got an invalid supplier');
        }

        if (this.measurementSuppliers.find(ms => ms == supplier)) {
            throw new Error('supplier already registered');
        }

        this.measurementSuppliers.push(supplier);
        return this;
    }

    public onData(cb: (data: IMeasurementData[]) => void): MeasurementsManager {
        return this.on('data', cb);
    }

    public onError(cb: (err: any) => void): MeasurementsManager {
        return this.on('error', cb);
    }

    private makeMeasurements(): void {
        const measurementPromises: Promise<any[]> = 
            Promise.all(this.measurementSuppliers.map((supplier: IMeasurementIndicator<any>) => supplier.measure()));

        measurementPromises.then((measurementsData: any[]) => {
            if (measurementsData.length == 0)
                return;

            const measurements: IMeasurementData[] = measurementsData.map((measurementValue: any, index: number) => {
                return {
                    measurementType: this.measurementSuppliers[index].type(),
                    value: measurementValue
                }
            }, this);

            this.emit('data', measurements);
        }).catch(err => this.emit('error', err));
    }
}