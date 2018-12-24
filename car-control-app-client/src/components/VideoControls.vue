<template>
    <div class="video-controls">
        <div class="controls-container">
            <div v-show="streamingStatus != 'CONNECTED'" class="async-btn-container">
                <md-button v-on:click="dispatchStartLiveStreaming()" class="md-icon-button md-raised md-primary">
                    <md-icon>videocam</md-icon>
                </md-button>
                <div class="spinner">
                    <md-progress-spinner
                        class="md-accent" 
                        md-mode="indeterminate" 
                        :md-stroke="2" 
                        :md-diameter="40"
                        v-if="streamingStatus == 'CONNECTING'"></md-progress-spinner>
                </div>
            </div>
            <div v-show="streamingStatus == 'CONNECTED'" class="async-btn-container">
                <md-button v-on:click="dispatchStopLiveStreaming()" class="md-icon-button">
                    <md-icon>stop</md-icon>
                </md-button>
                
                <md-button v-on:click="dispatchCapture()" class="md-icon-button md-raised">
                </md-button>
                <div class="spinner">
                    <md-progress-spinner
                        class="md-primary" 
                        md-mode="indeterminate" 
                        :md-stroke="2" 
                        :md-diameter="40"
                        v-if="isCapturing"></md-progress-spinner>
                </div>
                
                <md-button class="md-icon-button">
                    <!-- <md-icon v-show="isStreaming">pause</md-icon> -->
                    <md-icon v-show="true">pause</md-icon>
                    <!-- <md-icon v-show="!isStreaming">play_arrow</md-icon> -->
                </md-button>
            </div>
        </div>        
    </div>
</template>

<script lang="ts">
import { State, Action, Getter, Mutation } from 'vuex-class';
import {Component, Prop, Vue} from 'vue-property-decorator';
import { ILiveStreamingState } from '@/store/modules/liveStreaming/ILiveStreamingState';
import { IStartLiveStreamingPayload } from '@/store/modules/liveStreaming/IStartLiveStreamingPayload';
import { StreamingStatus } from '@/models/StreamingStatus';
import { IToastOptions } from '@/models/IToastOptions';

@Component
export default class VideoControls extends Vue {
    @Getter('streamingStatus') 
    private streamingStatus!: StreamingStatus; 

    @Getter('isCapturing') 
    private isCapturing!: boolean; 
    
    @Action('startLiveStreaming')
    private startLiveStreaming!: (args: IStartLiveStreamingPayload) => Promise<void>;

    @Action('stopLiveStreaming')
    private stopLiveStreaming!: () => Promise<void>;

    @Action('capture')
    private capture!: () => Promise<string[]>;

    @Action('showNotification')
    private showNotification!: (options: IToastOptions) => void;

    private dispatchStartLiveStreaming(): void {
        this.startLiveStreaming({
            playerElementId: "live-stream-player"
        });
    }
    
    private dispatchStopLiveStreaming(): void {
        this.stopLiveStreaming().catch((err) => {
            this.showNotification({ label: err })
        })
    }

    private dispatchCapture(): void {
        this.capture().then((warnings: string[]) => {
            if (warnings.length > 0) {
                this.showNotification({label: `Warning: ${warnings.join(", ")}`, duration: 3000})
            }
        }).catch(err => {
            this.showNotification({label: err, duration: 1000});
        })
    }

    private mounted(): void {
        this.dispatchStartLiveStreaming();
    }
}
</script>

<style lang="scss">
.video-controls {
    $glass-padding: 10px;
    $bottom-offset: 10px;
    $container-width: 200px;
    $container-height: 40px;

    text-align: center;
    position: absolute;
    bottom: $bottom-offset + 10px;
    width: $container-width;
    height: $container-height;
    left: 50%;
    transform: translate(-50%);

    .md-icon {
        color:white!important;
    }

    .async-btn-container {
        position: relative;

        .spinner {
            position: absolute;
            z-index: 888;
            top: 0px;
            left: 50%;
            transform: translate(-50%);
        }
    }

    .md-icon-button {
        margin: 0;
    }

    .controls-container::before {
        border-radius: 30px;
        display: block;
        position: absolute;
        width: $container-width + $glass-padding;
        height: $container-height + $glass-padding;
        background-color: #000;
        content: ' ';
        filter: blur(0.5px);
        opacity: 0.3;
        background-size: cover;
        top: -$glass-padding/2;
        left: -$glass-padding/2;
    }

}
</style>