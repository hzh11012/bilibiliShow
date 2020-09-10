<template>
  <div class="home">
    <navs @search="search" v-model="inputValue" @getInputValue="getInputValue"></navs>
    <banner></banner>
    <selector></selector>
    <projects></projects>
    <pagination @getProjects="getProjects"></pagination>
    <footers></footers>
    <tool-bar></tool-bar>
  </div>
</template>

<script>
import navs from "@/components/nav.vue";
import banner from "@/components/home/banner.vue";
import selector from "@/components/home/selector.vue";
import projects from "@/components/home/projects.vue";
import pagination from "@/components/home/pagination.vue";
import footers from "@/components/footer.vue";
import toolBar from "@/components/toolBar.vue";
export default {
  data() {
    return {
      inputValue: ""
    };
  },
  components: {
    navs,
    banner,
    selector,
    projects,
    pagination,
    footers,
    toolBar
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
    async getProjects() {
      const { data: data } = await this.$http.get(
        "/bili/ticket/project/listV2?version=134&page=" +
          this.$store.state.page +
          "&pagesize=16&area=" +
          this.$store.state.active_cityid +
          "&filter=" +
          this.$store.state.active_filter +
          "&platform=web&p_type=" +
          this.$store.state.active_typeT
      );
      this.$store.commit("projectsList", data.data);
      console.log(data.data);
    }
  }
};
</script>
