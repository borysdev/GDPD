<template>
  <div 
      @drop.stop.prevent="() => {}"  
      @dragstart="() => {}"
      @dragenter="() => {}"
      @drag="() => {}"
      @dragend="() => {}"
      @dragover.stop.prevent="() => {}"
      @dragleave="() => {}"
    id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'el-srm'
};
</script>
<style lang="scss">
@import 'styles/style.scss';
</style>
