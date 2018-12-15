<template>
    <div id="player-container">
        <md-empty-state
            v-show="liveStreamingStatus == 'DISCONNECTED' || liveStreamingStatus == 'CONNECTING'"
            class="md-primary"
            md-icon="videocam_off"
            md-label="Live Streaming Disconnected">
        </md-empty-state>
        <md-empty-state 
            v-show="liveStreamingStatus == 'ERROR'"
            class="md-accent"
            md-icon="error_outline"
            md-label="Error"
            v-bind:mdDescription="errorMessage">
        </md-empty-state>
        <div v-show="liveStreamingStatus == 'CONNECTED'" id="live-stream-player"></div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ILiveStreamingApi, LiveStreamingApi } from '../services/LiveStreamingApi';
import { State, Action, Getter, Mutation } from 'vuex-class';
import { ILiveStreamingState } from '@/store/modules/liveStreaming/ILiveStreamingState';
import { StreamingStatus } from '@/models/StreamingStatus';
import { Optional } from '@/utils/Optional';

@Component({})
export default class LiveStreamPlayer extends Vue {
    @State('liveStreaming') 
    private liveStreaming!: ILiveStreamingState;

    @Getter('streamingStatus')
    private liveStreamingStatus!: StreamingStatus;
    
    @Getter('errorMessage')
    private errorMessage!: string;

    private mounted(): void {
        // this.liveStreamingStatus = StreamingStatus.CONNECTING;

        // this.liveStreamingApi.start().then(() => {
        //     this.liveStreamingStatus = StreamingStatus.CONNECTED;
        // }).catch((err: string) => {
        //     this.errorMsg = err;
        //     this.liveStreamingStatus = StreamingStatus.ERROR;

        // });
    }
}
</script>

<style lang="scss">
#player-container {
    width: 100%;
    height: 100%;
    color: #444;
}
</style>