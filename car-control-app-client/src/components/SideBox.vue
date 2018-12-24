<template>
    <div class="side-box">
        <ul class="measurements">
            <li v-for="(measurement, index) in measurements" :key="index">
                <div v-if="measurement.name == 'robotConnection'">
                    <md-icon v-if="measurement.value == true">power</md-icon>
                    <md-icon v-if="measurement.value == false" class="warning">power_off</md-icon>
                </div>

                <div v-if="measurement.name == 'wifiSignal'">
                    <md-icon>wifi</md-icon>
                </div>
            </li>
        </ul>
        <ul class="actions">
            <li>
                <md-button class="md-icon-button" v-on:click="openGallery()">
                    <md-icon>photo_library</md-icon>
                </md-button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Getter, Mutation, Action } from 'vuex-class';
import { IMeasurementsCollection } from '@/models/IMeasurementsCollection';

@Component
export default class SideBox extends Vue {
    @Getter('getMeasurements')
    private measurements!: IMeasurementsCollection;

    @Action('openGallery')
    private openGallery!: () => void;
}
</script>

<style lang="scss">
.side-box {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    ul {
        list-style: none;
        padding: 0;

        li {
            .md-icon {
                // color: white!important;
            }

            padding: 0;
            margin-bottom: 10px;

            .warning {
                color: #F44336!important;
            }
        }
    }

    .separator {
        width: 100%;
        border-top: 1px solid #fff;
        content: '';
        margin-top: 10px;
        margin-bottom: 10px;
    }
}
</style>
