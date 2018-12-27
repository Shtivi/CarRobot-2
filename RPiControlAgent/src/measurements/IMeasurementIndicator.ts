export interface IMeasurementIndicator<T> {
    type(): string;
    measure(): Promise<T>;
}