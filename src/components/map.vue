<template>
  <div class="amap-page-container">
    <el-amap vid="amapDemo" :center="center" :zoom="zoom" class="amap-demo">
      <el-amap-marker :position="center"></el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
export default {
  props: ["center"],
  data() {
    let self = this;
    return {
      zoom: 15
    };
  }
};
</script>

<style lang="less" scoped>
.amap-demo {
  padding: 20px 0;
  height: 300px;
}
</style>