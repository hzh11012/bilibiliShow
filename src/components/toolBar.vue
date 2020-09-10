<template>
  <div class="toolbar-box">
    <div class="advices" @click="toAdvices">
      <div class="icon-advices"></div>
      <div class="title" >建议</div>
    </div>
    <transition name="panel">
      <div class="scroll-top" v-if="isScrollTop" @click="toTop" transiton="panel">
        <div class="icon-scroll"></div>
        <div class="title">顶部</div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isScrollTop: false,
      scrollTop: 0 //当前滑动距离
    };
  },
  methods: {
    toTop() {
      const that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    scrollToTops(e) {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.scrollTop = scrollTop;
      if (this.scrollTop > 600) {
        this.isScrollTop = true;
      } else {
        this.isScrollTop = false;
      }
    },
    toAdvices(){
      console.log('建议');
      window.open("#/feedbacklist");
    }
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("scroll", this.scrollToTops, true);
    });
  },
  destroyed() {
    window.addEventListener("scroll", this.scrollToTops, true);
  }
};
</script>

<style lang="less" scoped>
.toolbar-box {
  z-index: 10;
  width: 78px;
  background: #fff;
  box-shadow: 0 2px 22px 0 rgba(214, 186, 216, 0.5);
  border-radius: 12px;
  position: fixed;
  right: 60px;
  bottom: 100px;
  text-align: center;
  color: #f25d8e;
  .advices,
  .scroll-top {
    cursor: pointer;
    margin: 15px;
    .icon-advices,
    .icon-scroll {
      width: 30px;
      height: 30px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin: auto;
    }
    .icon-advices {
      background-image: url(data:image/png;base64,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);
    }
    .icon-scroll {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAABMNJREFUaAXtmV1oHFUUx8+Zj93N7qypTVCq8aP0qbFK30QCYkUFlaoUrYK1aUqgVSHa0qKCD/FFFKFbDPTDB63RPpXqS0EQqiKKIAgt2EpfSnyoDUHbmP3O7Mz13JQzmXQ/3Jmd2c3DXVjOzL137j2//717z9yzAOqjFFAKKAWUAkoBpYBSQCmgFFAKhFEAwzwU5pnS+MdDtaq7H0A8hQj3CoAyCjiHmjadWf/AFzi5pRam36DPdAW4OHr4GUe4X4KAbCMHEfFnSKe2ZY+9OteoPsqy2IHzo4e2gwsnaUaNVo6TIxch07clbuhYgRvBIuBVgfAtwQ8iiCeFAI2FoJm+QDP9aJzQ3mA8aFS2ISzCWasvvTHbr+9J3Z55V0+a++n3XOIxhRD3Qakyxfdx2FiAm8IODG2FZLViJ5ObUThrzH7jvNlnHlwBDeLuOEC5z8iBW8LWZt0lWHD72AE9a1w008YBTcMZQJxBDd/hujhsy40k6IBBYbl/3TL/oO+YEEbezBoXuDwOG9mmFRa2HgqrhrP2HOa2l+vrOi+JBDg62BtABmD1qoXn1w3fWi2c+WtcoFibRTiKJ/bNd4rcMXBQWKMmMuWFxSfQxFkjm/ilKYCuL1ZmS48J131PtiFHI4nTHW1aQWFdGwYK16rHarY7YZec9yt/V19rCuw4CdrAHuR6enEZhmL5+/zeo7dxWRgbGjgM7OL1ymGKtUPsqHDcF1pB60n9NL2kLMfpCKBDAUcB2w60YemXk3VxurOZDgwcBSy9QlYZWNpWM70UpyOEDgQcBSxtP9c11EY0xA97Ad32Lh0VrK5pj2c+f+M3CVvYmfvAFeItPzjq2qnUYPKIv4yvnXxt2C7bH9GBI81lQXfvtoDjgGWHuw39v0s6TlgJbU3vezuS5V2qfNdOyGo5w3HD8ixLG8lMt3GebgrcTVgG7wZ0Q+BewHYLug64l7DdgF4BXNx1aKvrwFf+hBtlI85aMlPR4PAu341vfl2UcdYfehgiqI1keQP+bq3RR3BqYoHH93bp4u6pO5ybsou9gpXORbN7i02F+dpxhpXWA3Zs54A/b9xLWHYwLDSdJYvcB624F4s7cuv43gMGdJ/mQlrnc5aGz8usg51KbURfDirOZczj+20o6JTuZT4FUPrAwE3cpwdM+eJ7uJCSaT/I7IKY/Cwls4tc3m1YHjcotJk2f+JnpRWAA3zvAZMSvmUAd3IDtr2C5fGDQNu2O8jPSStcxzudecAkw6/ciA7pIws7c+M4OVYRqM+LMtwV127MY7Zjm0Ev/lOdoDOmKftASiHZhdpef386GDN874Wl/Cu5bTTLp7nihsVLpM+/1GgzharEcl00oWe5v2BXDUMW4jVAcUUI+mkKcQv3SJvvFSuVWY+f7LFlmQcsbwj6a4J+Tl43//QWlv1qBM11bAnW1UB7NjP95hkuW17SVEL/+7xMm9cprqy3eBkT2sN8nq2v717J0vLW8CD56zQalbIqJfru8MPKditmmB/M78o9Qn9xvkTL435aJgkU+KfQ4Jss9p/EE2MVbrcabGX0+AYby7vBdR8ifyii4JwG+KOwzE+tI6/PrgYflQ9KAaWAUkApoBRQCigFlAJKAaWAUmD1K/Afka/QlLMG2VwAAAAASUVORK5CYII=);
    }
    .title {
      font-size: 12px;
      margin-top: 4px;
    }
  }
}

.panel-enter-active,
.panel-leave-active {
  transition: all 0.55s ease 0s;
}
.panel-enter,
.panel-leave-active {
  opacity: 0;
}
</style>