<template>
  <div class="detail" v-if="showBuy">
    <navs ref="navs" @search="search" v-model="inputValue" @getInputValue="getInputValue"></navs>
    <buy-ticket :detail="detail" @want="want"></buy-ticket>
    <tabs :detail="detail"></tabs>
    <contents @login="login" :detail="detail"></contents>
    <footers></footers>
    <tool-bar></tool-bar>
  </div>
</template>

<script>
import navs from "@/components/nav.vue";
import buyTicket from "../components/detail/buyticket.vue";
import maps from "../components/map.vue";
import tabs from "../components/detail/tabs.vue";
import contents from "../components/detail/content.vue";
import footers from "@/components/footer.vue";
import toolBar from "@/components/toolBar.vue";
import qs from "qs";
export default {
  data() {
    return {
      inputValue: "",
      detail: {},
      showBuy: false
    };
  },
  components: {
    navs,
    buyTicket,
    tabs,
    contents,
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
    async getDetail() {
      const { data: data } = await this.$http.get(
        "/bili/ticket/project/get?version=134&id=" + this.$route.query.id
      );
      this.detail = data.data;
      this.showBuy = true;
      console.log(data.data);
    },
    want() {
      if (this.$store.state.token == "") {
        this.$toast("老铁，请先登录后才可点爱心呐");
      } else {
        if (this.detail.wish_info.want_to_go) {
          this.$toast("您已收藏过了哟～");
          return null;
        } else {
          this.$http({
            url: "/bili/ticket/user/addWish",
            method: "POST",
            data: qs.stringify({
              item_id: this.detail.id
            })
          }).then(res => {
            this.detail.wish_info.want_to_go = true;
            this.detail.wish_info.count += 1;
          });
        }
      }
    },
    login() {
      this.$refs.navs.login();
    }
  },
  created() {
    this.getDetail();
  }
};
</script>