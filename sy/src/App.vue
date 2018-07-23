<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  watch:{
      '$route':function(to,from){
          document.documentElement.scrollTop = '0';
      }
  }
}
</script>

<style>
#app{
  height: 100%;
}
</style>
