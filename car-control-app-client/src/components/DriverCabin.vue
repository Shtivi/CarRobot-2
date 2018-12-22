<template>
    <div class="driver-cabin">
        <live-stream-player></live-stream-player>
        <side-box></side-box>
        <navigation-control side='left' v-bind:commandsDispatcher="commandsDispatcher" v-bind:controlOptions="controls.driving"></navigation-control>
        <navigation-control side='right' v-bind:commandsDispatcher="commandsDispatcher" v-bind:controlOptions="controls.cameraTilt"></navigation-control>
        <video-controls></video-controls>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavigationControl from './NavigationControl.vue';
import SideBox from './SideBox.vue';
import LiveStreamPlayer from './LiveStreamPlayer.vue';
import { ControlViewOption } from '@/models/ControlViewOption';
import { ControlOptions } from '@/models/ControlOptions';
import { CommandsDispatcherApi } from '@/services/CommandsDispatcherApi';
import VideoControls from './VideoControls.vue';
import config, { IConfig } from '@/config/Config';
import { State, Action, Getter, Mutation } from 'vuex-class';

@Component({
    components: {NavigationControl, LiveStreamPlayer, VideoControls, SideBox}
})
export default class DriverCabin extends Vue {
    @Action('connectNotificationsService')
    private connectNotificationsService!: () => void;
    
    get config(): IConfig {
        return config;
    }

    get commandsDispatcher(): CommandsDispatcherApi {
        return new CommandsDispatcherApi(config);
    }

    get controls(): { driving: ControlOptions, cameraTilt: ControlOptions } {
        return {
            driving: {
                stopCommand: "STOP_DRIVING",
                controls: [
                    {
                        icon: 'arrow_right',
                        index: 1,
                        action: 'TURN_RIGHT'
                    }, 
                    {
                        icon: 'arrow_drop_down',
                        index: 2,
                        action: 'DRIVE_BACKWARD'
                    }, 
                    {
                        icon: 'arrow_left',
                        index: 3,
                        action: 'TURN_LEFT'
                    }, 
                    {
                        icon: 'arrow_drop_up',
                        index: 4,
                        action: 'DRIVE_FORWARD'
                    }
                ]
            },
            cameraTilt: {
                stopCommand: "STOP_TILTING",
                controls: [
                    {
                        icon: 'arrow_right',
                        index: 1,
                        action: 'TILT_RIGHT'
                    }, 
                    {
                        icon: 'arrow_drop_down',
                        index: 2,
                        action: 'TILT_DOWN'
                    }, 
                    {
                        icon: 'arrow_left',
                        index: 3,
                        action: 'TILT_LEFT'
                    }, 
                    {
                        icon: 'arrow_drop_up',
                        index: 4,
                        action: 'TILT_UP'
                    }
                ]
            }
        }
    }

    private mounted(): void {
        this.connectNotificationsService();
    }
}

</script>

<style lang="scss">
.driver-cabin {
    width: 100%;
    height: 100vh;
    background-color: #fff;
    color: white;
}
</style>