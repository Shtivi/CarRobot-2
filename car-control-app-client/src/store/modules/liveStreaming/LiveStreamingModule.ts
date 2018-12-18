import { Module, GetterTree, MutationTree, ActionContext } from 'vuex';
import { ILiveStreamingState } from './ILiveStreamingState';
import { IRootState } from '@/store/IRootState';
import { LiveStreamingApi, ILiveStreamingApi } from '@/services/LiveStreamingApi';
import { Optional } from '@/utils/Optional';
import { IStartLiveStreamingPayload } from './IStartLiveStreamingPayload';
import { StreamingStatus } from '@/models/StreamingStatus';
import Config from '@/config/Config';
import { Notifications } from '@/services/Notifications';
import { CommandsDispatcherApi } from '@/services/CommandsDispatcherApi';

export const state: ILiveStreamingState = {
    streamingStatus: StreamingStatus.DISCONNECTED,
    errorMessage: "",
    liveStreamingApi: Optional.of(),
    isCapturing: false
}

export const liveStreamingModule: Module<ILiveStreamingState, IRootState> = {
    namespaced: false,
    state: state,
    getters: {
        streamingStatus(state: ILiveStreamingState): StreamingStatus {
            return state.streamingStatus
        },
        errorMessage(state: ILiveStreamingState): string {
            return state.errorMessage;
        },
        isCapturing(state: ILiveStreamingState): boolean {
            return state.isCapturing
        }
    },
    mutations: {
        setStreamingStatus(state: ILiveStreamingState, payload: StreamingStatus): void {
            state.streamingStatus = payload
        },
        setLiveStreamingApiInstance(state: ILiveStreamingState, payload: ILiveStreamingApi): void {
            state.liveStreamingApi = Optional.of(payload);
        },
        setIsCapturing(state: ILiveStreamingState, payload: boolean): void {
            state.isCapturing = payload;
        }
    },
    actions: {
        startLiveStreaming({ commit, state }, payload: IStartLiveStreamingPayload): Promise<void> {
            if (state.streamingStatus == StreamingStatus.CONNECTED) {
                return Promise.reject("already streaming");
            }

            const liveStreamingApiInstance: ILiveStreamingApi = 
                new LiveStreamingApi(payload.playerElementId, Config.liveStream.streamerUrl);
            commit('setLiveStreamingApiInstance', liveStreamingApiInstance);
            commit('setStreamingStatus', StreamingStatus.CONNECTING);

            return liveStreamingApiInstance.start().then(() => {
                setTimeout(() => commit('setStreamingStatus', StreamingStatus.CONNECTED), 1000);
                
                liveStreamingApiInstance.on('disconnected', () => {
                    commit('setStreamingStatus', StreamingStatus.DISCONNECTED);
                });
            })
        },

        stopLiveStreaming({commit, state}): Promise<void> {
            if (state.streamingStatus != StreamingStatus.CONNECTED) {
                return Promise.reject('live streaming is not connected');
            }

            return state.liveStreamingApi.get().stop();
        },

        capture({ commit, state }): Promise<string[]> {
            if (state.isCapturing) {
                return Promise.reject("Already capturing");
            }

            commit('setIsCapturing', true);
            // Not good!!! use as singleton
            return new CommandsDispatcherApi(Config).sendCommand('CAPTURE').finally(() => {
                commit('setIsCapturing', false);
            });
        }
    }
}