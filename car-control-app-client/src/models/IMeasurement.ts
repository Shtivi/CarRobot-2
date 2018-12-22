import { ValueTypes } from './ValueTypes';

export interface IMeasurement<T> {
    name: string;
    value: T;
}