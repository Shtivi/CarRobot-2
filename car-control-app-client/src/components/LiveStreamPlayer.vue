<template>
    <div id="player-container">
        <div v-show="liveStreamingStatus != 'CONNECTED'" class="not-connected">
            <md-icon v-show="liveStreamingStatus != 'ERROR'">videocam_off</md-icon>
            <md-icon v-show="liveStreamingStatus == 'ERROR'">error_outline</md-icon>
            <div class="md-headline" v-if="liveStreamingStatus == 'DISCONNECTED'">
                Live streaming is not active
            </div>
            <div class="md-headline" v-if="liveStreamingStatus == 'ERROR'">
                {{errorMsg}}
            </div>
            <div class="md-headline error" v-if="liveStreamingStatus == 'CONNECTING'">
                <md-progress-spinner md-mode="indeterminate" :md-stroke="4" :md-diameter="60"></md-progress-spinner>
                <div>Connecting...</div>
            </div>
        </div>
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
    private errorMsg?: string;

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

    .not-connected {
        font-size: 32px;
        padding: 20px;
        text-align: center;
        
        .md-icon {
            height: auto;
            width: auto;
            font-size: 100px!important;
        }
    }
}
</style>