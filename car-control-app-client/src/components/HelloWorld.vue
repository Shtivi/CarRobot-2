<template>
    <div>
        <ul>
            <li v-for="(data, index) in names" :key='index' v-bind:class="{'red': data.red}">
                <input type='text' v-model="data.firstname" />
                {{index}}. {{data.firstname}}
                <md-button class="md-primary md-raised" v-on:click="show(data)">Show</md-button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
      return {
          names: [
              {firstname: "ido", red: true},
              {firstname: "amit"}
          ]
      }
  },

  methods: {
    show: function(data) {
        alert(data.firstname);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .red {
        color: red;
    }
</style>
