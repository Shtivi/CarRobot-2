<template>
    <transition enter-to-class="slide-in-bottom" leave-to-class="slide-out-bottom">
        <div class="gallery-container" v-if="isShown">
            <md-toolbar class="toolbar">
                <h3 class="md-title" style="flex:1">Captures</h3>
                <md-button 
                    class="md-icon-button" 
                    @click="setGalleryDisplayState(false)"
                    v-show="!zoomedPicture.isPresent()">
                    <md-icon>close</md-icon>
                </md-button>
                <md-button 
                    class="md-icon-button" 
                    @click="setZoomedPicture(null)"
                    v-show="zoomedPicture.isPresent()">
                    <md-icon>arrow_back</md-icon>
                </md-button>
            </md-toolbar>
            <div class="gallery-content">
                <div class="spinner-container" v-if="loadingState">
                    <md-progress-spinner md-mode="indeterminate" :md-diameter="60"> 
                    </md-progress-spinner>
                </div>

                <transition enter-to-class="slide-in-left" leave-to-class="slide-out-left">
                    <md-card class="information-card" v-if="!loadingState && zoomedPicture.isPresent()">
                        <md-card-header>
                            <h4 class="md-title">{{zoomedPicture.get().info.name}}</h4>
                        </md-card-header>
                        <md-card-content>
                            <ul class="capture-info">
                                <li v-for="(prop, index) in propertyDescriptions" :key="index">
                                    <div class="property md-body-2">{{prop.description}}</div>
                                    <div class="value md-body-1">{{zoomedPicture.get().info[prop.property]}}</div>
                                </li>
                            </ul>
                        </md-card-content>
                        <md-card-actions>
                        </md-card-actions>
                    </md-card>
                </transition>

                <div class="pictures-block" v-if="!loadingState">
                    <transition enter-to-class="scale-in-center" leave-active-class="scale-in-center">
                        <div class="pictures-list" v-show="!zoomedPicture.isPresent()">
                            <img 
                                @click="setZoomedPicture(picture)"
                                class="md-elevation-2"
                                v-for="(picture, index) in pictures" 
                                :key="index"
                                :src="'data:image/jpeg;base64,' + picture.data">
                        </div>
                    </transition>
                    <transition enter-to-class="scale-in-center" leave-active-class="scale-in-center">
                        <div class="zoomed-picture" v-if="zoomedPicture.isPresent()">
                            <img 
                                class="md-elevation-2"
                                :src="'data:image/jpeg;base64,' + zoomedPicture.get().data">
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter, Mutation, Action } from 'vuex-class';
import { IFetchLatestPicturesPayload } from '@/store/modules/gallery/IFetchLatestPicturesPayload';
import { ICapture } from '@/models/ICapture';
import { Optional } from '@/utils/Optional';
import { IPropertyDescription } from '@/models/IPropertyDescription';

@Component
export default class CapturesGallery extends Vue {
    @Getter('isGalleryShown')
    private isShown!: boolean;

    @Getter('getGalleryPictures')
    private pictures!: ICapture[];

    @Getter('getPicturesLoadingState')
    private loadingState!: boolean;

    @Getter('getZoomedPicture')
    private zoomedPicture!: Optional<ICapture>;

    @Getter('getCaptureInfoPropertyDescriptions')
    private propertyDescriptions!: Array<IPropertyDescription>;

    @Mutation('setGalleryDisplayState')
    private setGalleryDisplayState!: (shown: boolean) => void;
    
    @Mutation('setZoomedPicture')
    private setZoomedPicture!: (capture: ICapture) => void;

    @Action('fetchLatestPictures')
    private fetchLatestPictures!: (payload?: IFetchLatestPicturesPayload) => void;
}
</script>

<style lang="scss">
.gallery-container {
    position: absolute;
    bottom: 0;
    z-index: 9;
    width: 100%;
    height: 100%;
    background: #333;

    .toolbar {
        background-color: #282828!important;
        * {
            color: #f5f5f5!important;
        }
    }


    .gallery-content {
        $capture-size: 50%;
        $capture-margin: 0.6%;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        text-align: center;

        .spinner-container {
            text-align: center;
            margin: 30px;
            flex: 1;
        }

        .information-card {
            flex: 0.6;
            background: #f8f8f8;
            z-index: 10;
            height: 100vh;
            border-radius: 0;

            h4.md-title {
                font-size: 20px;
            }

            ul.capture-info {
                display: flex;
                flex-direction: column;
                padding: 0;
                margin: 0;
                text-align: left;

                li {
                    display: flex;
                    margin-bottom: 5px;

                    .property {
                        flex: 1;
                    }

                    .value {
                        flex: 1.8;
                    }
                }
            }
        }

        .pictures-block {
            flex: 1;
            position: relative;
            height: 100%;
            max-height: calc(100vh - 20px);
            overflow-y: scroll;
            
            .pictures-list {
                padding: 8px;

                img {
                    width: $capture-size - ($capture-margin * 2);
                    margin: $capture-margin;
                }
            }

            .zoomed-picture {
                height: 100%;
                margin: 0;
                padding: 0;

                img {
                    display: block;
                    padding: 0;
                    margin: 0 auto;
                    width: 100%;
                }
            }
        }
    }
}
</style>
