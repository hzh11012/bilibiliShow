<template>
  <div class="tabs-box">
    <div class="tabs">
      <div
        class="tabs-item"
        :class="activeTabs == index?'active':''"
        v-for="(item,index) in list"
        :key="index"
        @click="changeTab(item)"
      >{{item}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["detail"],
  data() {
    return {
      list: [],
      activeTabs: 0
    };
  },
  methods: {
    changeTab(item) {
      if (item == "公告") {
        let el = document.getElementsByClassName("notice-box")[0];
        this.$nextTick(function() {
          window.scrollTo({ behavior: "smooth", top: el.offsetTop - 50 });
        });
      } else if (item == "参展嘉宾") {
        let el = document.getElementsByClassName("guests-box")[0];
        this.$nextTick(function() {
          window.scrollTo({ behavior: "smooth", top: el.offsetTop - 50 });
        });
      } else if (item == "活动详情") {
        let el = document.getElementsByClassName("activity-box")[0];
        this.$nextTick(function() {
          window.scrollTo({ behavior: "smooth", top: el.offsetTop - 40 });
        });
      } else if (item == "讨论") {
        let el = document.getElementsByClassName("comment-box")[0];
        this.$nextTick(function() {
          window.scrollTo({ behavior: "smooth", top: el.offsetTop - 40 });
        });
      }
    },
    handleScroll(e) {
      let that = this;
      let list = document.getElementsByClassName('con-box');
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      Array.from(list).forEach(function(item, index){
        if (scrollTop >= item.offsetTop-50) {
           that.activeTabs = index;
        }if (scrollTop <= list[0].offsetTop) {
           that.activeTabs = 0;
        }
      })
    }
  },
  created() {
    if (this.detail.bulletin.length != 0) {
      this.list.push("公告");
    }
    if (this.detail.guests.length != 0) {
      this.list.push("参展嘉宾");
    }
    if (this.detail.performance_desc.length != 0) {
      this.list.push("活动详情");
    }
    this.list.push("讨论");
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
  }
};
</script>

<style lang="less" scoped>
.tabs-box {
  width: 1160px;
  margin: 0 auto;
  position: sticky;
  z-index: 2;
  top: 0;
  height: 50px;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .tabs {
    display: flex;
    margin-top: 20px;
    line-height: 50px;
    .tabs-item {
      position: relative;
      cursor: pointer;
      font-size: 14px;
      width: 140px;
      text-align: center;
    }
    .active {
      color: #f25c8e;
      &::before {
        left: 50%;
        transform: translate(-50%);
        position: absolute;
        content: "";
        top: 45px;
        width: 30px;
        height: 3px;
        background: #f25c8e;
        border-radius: 4px;
      }
    }
  }
}
</style>