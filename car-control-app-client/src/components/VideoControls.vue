<template>
    <div class="video-controls">
        <div class="controls-container">
            <md-button class="md-icon-button">
                <md-icon>stop</md-icon>
            </md-button>
            <md-button class="md-icon-button md-raised">
            </md-button>
            <md-button class="md-icon-button" v-on:click="toggleVideoPlaying()">
                <!-- <md-icon v-show="!isPaused">pause_circle_outline</md-icon>
                <md-icon v-show="isPaused">play_circle_outline</md-icon> -->
                <md-icon v-show="!isPaused">pause</md-icon>
                <md-icon v-show="isPaused">play_arrow</md-icon>
            </md-button>
        </div>        
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
})
export default class VideoControls extends Vue {
    private isPaused: boolean = true;

    private toggleVideoPlaying(): void {
        this.isPaused = !this.isPaused;
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

    .controls-container::before {
        border-radius: 30px;
        display: block;
        position: absolute;
        width: $container-width + $glass-padding;
        height: $container-height + $glass-padding;
        background-color: #000;
        content: ' ';
        filter: blur(0.5px);
        opacity: 0.2;
        background-size: cover;
        top: -$glass-padding/2;
        left: -$glass-padding/2;
    }

}
</style>