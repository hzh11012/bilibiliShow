<template>
  <div>
    <navs @search="search" v-model="inputValue" @getInputValue="getInputValue"></navs>
    <div class="notice-info-box">
      <div class="notice-info-header">
        <div class="title">{{bulletin.title}}</div>
        <div class="ctime">{{bulletin.ctime}}</div>
      </div>
      <div v-html="bulletin.detail" class="notice-info-content"></div>
    </div>
  </div>
</template>

<script>
import navs from "@/components/nav.vue";
export default {
  data() {
    return {
      inputValue: "",
      bulletin: {}
    };
  },
  methods: {
    async search() {
      this.$store.commit("page", 1);
      if (this.inputValue == "") {
        return null;
      }
      window.open("#/search?keyword=" + this.inputValue);
    },
    getInputValue() {
      console.log("改变输入框的值");
    },
    async getBulletin() {
      const { data: data } = await this.$http.get(
        "/bili/ticket/project/GetBulletin?bulletin_id=" +
          this.$route.query.id +
          "&project_id=" +
          this.$route.query.projectId
      );
      this.bulletin = data.data;
      console.log(this.bulletin);
    }
  },
  created() {
    this.getBulletin();
  },
  components: {
    navs
  }
};
</script>

<style lang="less" scoped>
.notice-info-box {
  width: 1160px;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 100px;
  .notice-info-header {
    .title {
      font-size: 16px;
      color: #212121;
      line-height: 16px;
    }
    .ctime {
      margin-top: 6px;
      font-size: 12px;
      color: #999;
      line-height: 15px;
    }
  }
  .notice-info-content {
    margin-top: 60px;
    font-size: 14px;
    color: #757575;
    line-height: 24px;
  }
}
</style>