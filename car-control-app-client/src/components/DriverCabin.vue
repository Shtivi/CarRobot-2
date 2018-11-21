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
                        icon: 'keyboard_arrow_up',
                        index: 1
                    }, 
                    {
                        icon: 'thumb_up',
                        index: 2
                    }, 
                    {
                        icon: 'thumb_up',
                        index: 3
                    }, 
                    {
                        icon: 'thumb_up',
                        index: 4
                    }
                ],
                cameraTilt: [
                    {
                        icon: ''
                    }, 
                    {
                        icon: ''
                    }, 
                    {
                        icon: ''
                    }, 
                    {
                        icon: ''
                    }
                ]
            }
        }
    }
}
</script>

<style lang="scss">
.driver-cabin {
    background-image: url('../assets/images.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;
    background-color: #fff;
    color: white;
}
</style>