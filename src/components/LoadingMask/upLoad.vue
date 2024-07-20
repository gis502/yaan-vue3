<template>
  <div class="loading-mask">
    <dv-loading>正在上传Excel，请耐心等待...</dv-loading>
  </div>
</template>

<script>
export default {
  name: 'upLoad'
}
</script>

<style scoped>
.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}
</style>
