<template>
  <div>
    <div class="banner-img" v-if="$store.state.banners.length==1">
      <img
        @click="clickImg($store.state.banners[0].url)"
        :src="'https:'+$store.state.banners[0].pic"
      />
    </div>
    <div v-swiper:mySwiper="swiperOption" v-show="$store.state.banners.length > 1">
      <div class="swiper-wrapper">
        <div class="swiper-slide" @click="clickImg(item.url)" :key="index" v-for="(item,index) in $store.state.banners">
          <img :src="'https:'+item.pic" />
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
export default {
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        loop: true,
        autoplay: true,
        initialSlide: 0
      }
    };
  },
  methods: {
    clickImg(url) {
      const index = url.indexOf("?id=");
      const index1 = url.indexOf("&from=");
      const id = url.substring(index + 4, index1);
      if (id != 0) {
        window.open("#/detail?id="+id+"");
      } else {
        window.open(url);
      }
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  }
};
</script>

<style lang="less" scoped>
.swiper-container {
  width: 100%;
  height: 100%;
  .swiper-slide {
    height: auto;
  }
}
.banner-img {
  width: 100%;
  height: 100%;
}
img {
  cursor: pointer;
  width: 100%;
  height: 100%;
  min-height: 175px;
  -webkit-user-drag: none;
  display: block;
}
</style>