<template>
    <div id="liveStreamPlayer"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class LiveStreamPlayer extends Vue {
    @Prop() private streamerUrl!: string;

    private mounted(): void {
        (<any>window).startStream('liveStreamPlayer', this.streamerUrl);
    }
}
</script>