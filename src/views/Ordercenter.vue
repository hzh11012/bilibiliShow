<template>
  <div class="top" v-if="showCenter">
    <navs @search="search" v-model="inputValue" @getInputValue="getInputValue"></navs>
    <div class="box">
      <div class="order-list-box">
        <div class="order-list">
          <div v-if="$store.state.orderList == false">
            <div class="no-order">
              <div class="err-img"></div>
              <div class="err-tips">然而并没有订单</div>
              <div class="err-btn-group">
                <div class="err-jump-btn" @click="toCenter">去票务中心</div>
              </div>
            </div>
          </div>
          <order-card
            v-else
            @checkOrder="checkOrder"
            :item="item"
            v-for="(item,index) in $store.state.orderList.list"
            :key="index"
          ></order-card>
        </div>
        <pagination @getProjects="getProjects"></pagination>
      </div>
    </div>
    <footers></footers>
    <tool-bar></tool-bar>
  </div>
</template>

<script>
import navs from "@/components/nav.vue";
import orderCard from "@/components/ordercenter/card.vue";
import pagination from "@/components/ordercenter/pagination.vue";
import footers from "@/components/footer.vue";
import toolBar from "@/components/toolBar.vue";
export default {
  data() {
    return {
      inputValue: "",
      showCenter: false
    };
  },
  components: {
    navs,
    footers,
    toolBar,
    orderCard,
    pagination
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
    getProjects() {
      this.$http
        .get(
          "/bili/ticket/order/list?page=" +
            (this.$store.state.order_page - 1) +
            "&page_size=10"
        )
        .then(res => {
          this.$store.commit("orderList", res.data.data);
          this.showCenter = true;
        });
    },
    checkOrder(item) {
      this.$router
        .push({
          path: "/orderdetail",
          query: { order_id: item.order_id }
        })
        .catch(data => {});
    },
    toCenter(){
      this.$router.push('/');
    }
  },
  created() {
    this.getProjects();
  }
};
</script>

<style lang="less" scoped>
.box {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  .order-list-box {
    margin: 30px auto 0;
    min-height: 500px;
    width: 980px;
    height: 100%;
    .order-list {
      margin-bottom: 30px;
      .no-order {
        .err-img {
          margin: 30px auto 0;
          width: 210px;
          height: 210px;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-image: url(//s1.hdslb.com/bfs/static/ticket/static/img/empty-order.052a021.png);
        }
        .err-tips {
          margin-top: 25px;
          text-align: center;
          font-size: 14px;
          color: #99a2aa;
        }
        .err-btn-group {
          width: 100%;
          margin-top: 30px;
          margin-bottom: 200px;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-pack: center;
          justify-content: center;
          .err-jump-btn {
            cursor: pointer;
            font-size: 18px;
            border-radius: 4px;
            border: 1px solid #cbd1d7;
            color: #6c767a;
            text-align: center;
            width: 160px;
            height: 52px;
            line-height: 52px;
          }
        }
      }
    }
  }
}
</style>