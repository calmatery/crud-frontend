<template>
  <div id="app">
      <designer></designer>
  </div>
</template>

<script>
import Designer from "../wxm-crud/Designer";
export default {
  name: 'app',
  components: {
      Designer
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
    height: 100%;
}
</style>
