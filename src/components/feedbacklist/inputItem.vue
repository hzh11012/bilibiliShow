<template>
  <div class="input-box">
    <div class="title-box">
      <span v-if="isRequire" class="icon-require">*</span>
      <span class="title" v-text="title"></span>
    </div>
    <slot name="leftarea"></slot>
  </div>
</template>

<script>
export default {
  props: ["isRequire", "title"]
};
</script>

<style lang="less" scoped>
.input-box {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  .title-box {
    width: 80px;
    display: flex;
    font-size: 12px;
    .icon-require {
      color: #f25d8e;
    }
    .title {
      flex: 1;
      text-align: right;
      box-sizing: border-box;
      padding-right: 10px;
    }
  }
}
</style>