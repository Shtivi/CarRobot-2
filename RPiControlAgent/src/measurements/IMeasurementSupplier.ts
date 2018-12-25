export interface IMeasurementSupplier<T> {
    type(): string;
    measure(): Promise<T>;
}