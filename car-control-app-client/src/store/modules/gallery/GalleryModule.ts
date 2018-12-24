import { Module, Dictionary } from 'vuex';
import { IRootState } from '@/store/IRootState';
import { IGalleryState } from './IGalleryState';
import { CapturesApi } from '@/services/CapturesApi';
import Config from '@/config/Config';
import { IFetchLatestPicturesPayload } from './IFetchLatestPicturesPayload';
import { ICapture } from '@/models/ICapture';
import { Optional } from '@/utils/Optional';
import { ICaptureInfo } from '@/models/ICaptureInfo';
import { IPropertyDescription } from '@/models/IPropertyDescription';

export const galleryModule: Module<IGalleryState, IRootState> = {
    namespaced: false,
    state: {
        capturesApi: new CapturesApi(Config),
        isShown: false,
        pictures: [],
        arePicturesLoading: false,
        zoomedPicture: Optional.of()
    },
    getters: {
        isGalleryShown(state: IGalleryState) {
            return state.isShown
        },
        getGalleryPictures(state: IGalleryState) {
            return state.pictures
        },
        getPicturesLoadingState(state: IGalleryState) {
            return state.arePicturesLoading;
        },
        getZoomedPicture(state: IGalleryState) {
            return state.zoomedPicture;
        },
        getCaptureInfoPropertyDescriptions(state: IGalleryState): Array<IPropertyDescription> {
            return [{
                property: "time",
                description: "Date taken"
            }, {
                property: "fileName",
                description: "File name"
            }, {
                property: "kilobytes",  
                description: "Size (KB)"
            }, {
                property: "width",
                description: "Width"
            }, {
                property: "height",
                description: "Height"
            }]
        }
    },
    mutations: {
        setGalleryDisplayState(state: IGalleryState, payload: boolean) {
            state.isShown = payload;
        },
        setGalleryPictures(state: IGalleryState, payload: ICapture[]) {
            if (payload) {
                state.pictures = payload;
            }
        },
        setPicturesLoadingState(state: IGalleryState, payload: boolean) {
            state.arePicturesLoading = payload || false;
        },
        setZoomedPicture(state: IGalleryState, payload: ICapture) {
            state.zoomedPicture = Optional.of(payload);
        }
    },
    actions: {
        fetchLatestPictures({ commit, state, dispatch }, payload?: IFetchLatestPicturesPayload) {
            commit('setPicturesLoadingState', true);
            state.capturesApi.fetchLatestCaptures().then((captures: ICapture[]) => {
                commit('setGalleryPictures', captures);
            }).catch(err => {
                dispatch('showErrorNotification', err.toString());
            }).finally(() => {
                setTimeout(() => {
                    commit('setPicturesLoadingState', false);
                }, 500);
            })
        },
        openGallery({ commit, state, dispatch }) {
            commit('setGalleryDisplayState', true);
            dispatch('fetchLatestPictures');
        }
    }
}