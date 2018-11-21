<template>
    <div class="navigation-control" v-bind:class="{'right': side == 'right' || !side, 'left': side == 'left'}">
        <div class="controls-container">
            <span v-for="(control, index) in controls" :key="index">
                <md-icon>{{control.icon}}</md-icon>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'NavigationControl',
        props: ['side', 'controls'],
        data() {
            return {
                
            }
        }
    }
</script>

<style lang="scss">
@mixin on-circle($item-count, $circle-size, $item-size) {
    position: relative;
    width:  $circle-size;
    height: $circle-size;
    padding: 0;
    border-radius: 50%; 
    list-style: none;       

    > * {
        display: block;
        position: absolute;
        top:  50%; 
        left: 50%;
        width:  $item-size;
        height: $item-size;
        margin: -($item-size / 2);

        $angle: (360 / $item-count);
        $rot: 0;

        @for $i from 1 through $item-count {
            &:nth-of-type(#{$i}) {
            transform: 
                rotate($rot * 1deg) 
                translate($circle-size / 2) 
                rotate($rot * -1deg);
            }

            $rot: $rot + $angle;
        }
    }
}

.navigation-control {
    $container-size: 100px;
    $glass-padding: 30px;
    $side-offset: 20px;

    text-align: center;
    position: absolute;
    color: #000;
    bottom: 20px;
    transform-origin: center;
    width: $container-size;
    height: $container-size;

    &.left {
        left:$side-offset;
    }

    &.right {
        right:$side-offset;
    }

    .controls-container::before {
        display: block;
        position: absolute;
        width: $container-size + $glass-padding;
        height: $container-size + $glass-padding;
        background-color: #fff;
        content: ' ';
        border-radius: 100%;
        filter: blur(0.5px);
        opacity: 0.3;
        background-size: cover;
        top: -$glass-padding/2;
        left:-$glass-padding/2;
    }

    .controls-container {
        @include on-circle($item-count: 4, $circle-size: $container-size, $item-size: 24px);
        // background-color: #fff;
        span {
            display: block;
        }
    }
}
</style>