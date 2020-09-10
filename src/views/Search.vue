<template>
  <div>
    <navs @search="search" v-model="inputValue" @getInputValue="getInputValue"></navs>
    <div class="title" v-if="$store.state.projectsList.total != 0">
      <span></span>
      <span class="total-num">为您找到{{$store.state.projectsList.total}}条结果</span>
      <span></span>
    </div>
    <projects></projects>
    <pagination @getProjects="getProjects"></pagination>
  </div>
</template>

<script>
import navs from "@/components/nav.vue";
import projects from "@/components/home/projects.vue";
import pagination from "@/components/home/pagination.vue";
export default {
  data() {
    return {
      inputValue: ""
    };
  },
  components: {
    navs,
    projects,
    pagination
  },
  methods: {
    async search() {
      if (this.inputValue == "") {
        return null;
      }
      const { data: data } = await this.$http.get(
        "/bili/ticket/search/list?version=134&keyword=" +
          this.inputValue +
          "&pagesize=16&page=" +
          this.$store.state.page +
          "&platform=web"
      );
      console.log(data.data);
      this.$store.commit("projectsList", data.data);
      if (data.data.total == 0) {
        const { data: data1 } = await this.$http.get(
          "/bili/ticket/project/recommend?id=0"
        );
        this.$store.commit("recommendList", data1.data);
      }
      this.$router
        .push({
          path: "/search",
          query: { keyword: this.inputValue }
        })
        .catch(data => {});
    },
    getInputValue() {
      console.log("改变输入框的值");
    },
    async getProjects() {
      const { data: data } = await this.$http.get(
        "/bili/ticket/search/list?version=134&keyword=" +
          this.$route.query.keyword +
          "&pagesize=16&page=" +
          this.$store.state.page +
          "&platform=web"
      );
      console.log(data.data);
      this.$store.commit("projectsList", data.data);
      if (data.data.total == 0) {
        const { data: data1 } = await this.$http.get(
          "/bili/ticket/project/recommend?id=0"
        );
        this.$store.commit("recommendList", data1.data);
      }
    }
  },
  created() {
    this.inputValue = this.$route.query.keyword;
    this.getProjects();
  }
};
</script>

<style lang="less" scoped>
.title {
  width: 1160px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px !important;
  span:first-child {
    background-image: linear-gradient(90deg, #f4f4f4, #aaa);
    width: 100px;
    height: 2px;
  }
  span:last-child {
    background-image: linear-gradient(-90deg, #f4f4f4, #aaa);
    width: 100px;
    height: 2px;
  }

  .total-num {
    font-size: 14px;
    color: #636c7b;
    letter-spacing: 0.5px;
    padding: 0 15px;
  }
}
</style>