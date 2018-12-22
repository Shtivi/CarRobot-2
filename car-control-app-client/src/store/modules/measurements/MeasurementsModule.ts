import { Module } from 'vuex';
import { IRootState } from '@/store/IRootState';
import { IMeasurementsState } from './IMeasurementsState';
import { IMeasurementsCollection } from '@/models/IMeasurementsCollection';
import { IMeasurementValueMutationPayload } from './IMeasurementValueMutationPayload';

export const measurementsModule: Module<IMeasurementsState, IRootState> = {
    namespaced: false,
    state: {
        measurements: {
            robotConnection: {
                name: 'robotConnection',
                value: false
            },
            wifiSignal: {
                name: 'wifiSignal',
                value: 0
            }
        }
    },
    getters: {
        getMeasurements(state: IMeasurementsState): IMeasurementsCollection {
            return state.measurements;
        }
    },
    mutations: {
        setMeasurementValue(state: IMeasurementsState, payload: IMeasurementValueMutationPayload): void {
            if (!state.measurements[payload.measurementName]) {
                throw new Error(`unknown measurement '${payload.measurementName}'`);
            }
            state.measurements[payload.measurementName].value = payload.value;
        }
    }
}