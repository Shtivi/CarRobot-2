<template>
  <div id="app">
    <driver-cabin></driver-cabin>
  </div>
</template>

<script>
import DriverCabin from './components/DriverCabin.vue';

export default {
  name: 'app',
  components: {
    DriverCabin
  }
}
</script>

<style lang="scss">
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
</style>
