<template>
    <div class="driver-cabin">1
        <navigation-control side='left' v-bind:controls="navigationControls.driving"></navigation-control>
        <navigation-control side='right' v-bind:controls="navigationControls.cameraTilt"></navigation-control>
    </div>
</template>

<script>
import NavigationControl from './NavigationControl';

export default {
    name: 'DriverCabin',
    components: {
        NavigationControl
    },
    data() {
        return {
            navigationControls: {
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