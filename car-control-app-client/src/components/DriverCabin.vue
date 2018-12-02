<template>
    <div class="driver-cabin">
        <navigation-control side='left' v-bind:commandsDispatcher="commandsDispatcher" v-bind:controlOptions="controls.driving"></navigation-control>
        <navigation-control side='right' v-bind:commandsDispatcher="commandsDispatcher" v-bind:controlOptions="controls.cameraTilt"></navigation-control>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavigationControl from './NavigationControl.vue';
import { ControlViewOption } from '@/models/ControlViewOption';
import { ControlOptions } from '@/models/ControlOptions';
import { CommandsDispatcherApi } from '@/services/CommandsDispatcherApi';
import config, { IConfig } from '@/config/Config';

@Component({
    components: {NavigationControl}
})
export default class DriverCabin extends Vue {
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
                        action: ''
                    }, 
                    {
                        icon: 'arrow_drop_down',
                        index: 2,
                        action: 'TILT_DOWN'
                    }, 
                    {
                        icon: 'arrow_left',
                        index: 3,
                        action: ''
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
}

</script>

<style lang="scss">
.driver-cabin {
    background-image: url('../assets/IMG_0020b.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;
    background-color: #fff;
    color: white;
}
</style>