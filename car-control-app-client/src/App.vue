<template>
  <div id="app">
    <DriverCabin />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DriverCabin from './components/DriverCabin.vue';

@Component({
  components: {
    DriverCabin,
  },
})
export default class App extends Vue {
    // mounted() {
    //     if (screen.availHeight > screen.availWidth) {

    //     }
    // }
}
</script>

<style lang="scss">
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
.toasted-container {
    &.top-right {
        top: 2%!important;
        right: 2%!important;
    }

    .toasted .action:hover {
        text-decoration: none!important;
    }
}
</style>
