<template>
    <div id="player-container">
        <md-empty-state
            v-show="liveStreamingStatus == 'DISCONNECTED' || liveStreamingStatus == 'CONNECTING'"
            class="md-primary"
            md-icon="videocam_off"
            md-label="Live Streaming Disconnected">
        </md-empty-state>
        <div class="connecting" v-show="liveStreamingStatus == 'CONNECTING'">
            <md-progress-spinner 
                md-mode="indeterminate" 
                :md-stroke="4" 
                :md-diameter="80">
            </md-progress-spinner>
        </div>

        <md-empty-state 
            v-show="liveStreamingStatus == 'ERROR'"
            class="md-accent"
            md-icon="error_outline"
            md-label="Error"
            v-bind:mdDescription="errorMsg">
        </md-empty-state>
        <div v-show="liveStreamingStatus == 'CONNECTED'" id="live-stream-player"></div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ILiveStreamingApi, LiveStreamingApi } from '../services/LiveStreamingApi';

enum StreamingStatus {
    DISCONNECTED = 'DISCONNECTED',
    ERROR = 'ERROR',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED'
}

@Component({})
export default class LiveStreamPlayer extends Vue {
    @Prop() private streamerUrl!: string;

    private liveStreamingStatus: StreamingStatus = StreamingStatus.DISCONNECTED;
    private errorMsg?: string = "";

    get liveStreamingApi(): ILiveStreamingApi {
        return new LiveStreamingApi('live-stream-player', this.streamerUrl);
    }

    private mounted(): void {
        this.liveStreamingStatus = StreamingStatus.CONNECTING;

        this.liveStreamingApi.start().then(() => {
            this.liveStreamingStatus = StreamingStatus.CONNECTED;
        }).catch((err: string) => {
            this.errorMsg = err;
            this.liveStreamingStatus = StreamingStatus.ERROR;

        });
    }
}
</script>

<style lang="scss">
#player-container {
    width: 100%;
    height: 100%;
    color: #444;

    .connecting {
        margin: 0 auto;
        text-align: center;
    }
}
</style>