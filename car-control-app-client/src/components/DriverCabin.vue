<template>
    <div class="driver-cabin">
        <navigation-control side='left' v-bind:controlOptions="controls.driving"></navigation-control>
        <navigation-control side='right' v-bind:controlOptions="controls.cameraTilt"></navigation-control>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavigationControl from './NavigationControl.vue';
import { ControlViewOption } from '@/models/ControlViewOption';

@Component({
    components: {NavigationControl}
})
export default class DriverCabin extends Vue {
    get controls(): { driving: ControlViewOption[], cameraTilt: ControlViewOption[] } {
        return {
            driving: [
                {
                    icon: 'arrow_right',
                    index: 1,
                    action: ''
                }, 
                {
                    icon: 'arrow_drop_down',
                    index: 2,
                    action: ''
                }, 
                {
                    icon: 'arrow_left',
                    index: 3,
                    action: ''
                }, 
                {
                    icon: 'arrow_drop_up',
                    index: 4,
                    action: ''
                }
            ],
            cameraTilt: [
                {
                    icon: 'arrow_right',
                    index: 1,
                    action: ''
                }, 
                {
                    icon: 'arrow_drop_down',
                    index: 2,
                    action: ''
                }, 
                {
                    icon: 'arrow_left',
                    index: 3,
                    action: ''
                }, 
                {
                    icon: 'arrow_drop_up',
                    index: 4,
                    action: ''
                }
            ]
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