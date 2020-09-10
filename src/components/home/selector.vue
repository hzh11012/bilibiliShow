<template>
  <div class="selector">
    <div class="wrapper selector-city">
      <div class="title">城市:</div>
      <div class="list">
        <div class="first-item">
          <span :class="$store.state.active_cityid == -1?'on':''" @click="clickCity(-1,'更多城市')">全国</span>
        </div>
        <div class="item" v-for="(item,index) in city" :key="index">
          <span
            :class="$store.state.active_cityid == item.id?'on':''"
            @click="clickCity(item.id,'更多城市')"
          >{{item.name}}</span>
        </div>
        <div class="last-item">
          <div @click="isShowCityPop = !isShowCityPop">
            <span
              :class="$store.state.active_cityname != '更多城市'?'on':''"
            >{{$store.state.active_cityname}}</span>
            <svg :class="isShowCityPop == true?'roate on':''" class="icons" aria-hidden="true">
              <use xlink:href="#icon-xiala" />
            </svg>
          </div>
          <div class="moreCityPop" v-if="isShowCityPop">
            <div class="letter-list">
              <div class="letter-item" v-for="(item,index) in moreCity" :key="index">
                <span
                  class="letter"
                  :class="index==active?'active':''"
                  @click="active=index"
                >{{item.letter}}</span>
              </div>
            </div>
            <div class="city-list">
              <span
                @click="clickCity(item.id,item.fullname)"
                class="city-item"
                :class="$store.state.active_cityid == item.id?'on':''"
                v-for="(item,index) in moreCity[active].list"
                :key="index"
              >{{item.fullname}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper selector-type">
      <div class="title">类型:</div>
      <div class="list">
        <div class="item" v-for="(item,index) in cityData.tags" :key="index">
          <span
            @click="active_type=item.key;$store.state.active_typeT=item.value;getProjects()"
            :class="active_type == item.key?'on':''"
          >
            <span>{{item.value}}</span>
            <span v-if="index>0 && item.project_num>0">({{item.project_num}})</span>
          </span>
        </div>
      </div>
    </div>
    <div class="wrapper selector-order">
      <div class="title">筛选:</div>
      <div class="list">
        <div class="item" v-for="(item,index) in cityData.filter" :key="index">
          <span
            @click="$store.state.active_filter=item.key;getProjects()"
            :class="$store.state.active_filter == item.key?'on':''"
          >
            <span>{{item.value}}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      city: [],
      moreCity: [],
      moreCity_title: "更多城市",
      active: 0,
      isShowCityPop: false,
      cityData: [],
      active_type: -1
    };
  },
  methods: {
    //获取城市列表
    async getCity() {
      const { data: data } = await this.$http.get(
        "/bili/ticket/city/list?channel=4"
      );
      this.city = data.data.list;
      this.moreCity = data.data.more;
    },
    //获取该城市演出数目等信息
    async getCityData() {
      const { data: data } = await this.$http.get(
        "/bili/ticket/project/listconf?city_id=" +
          this.$store.state.active_cityid
      );
      this.cityData = data.data;
    },
    //点击选择获取 该城市的所有类型的所有信息
    clickCity(adcode, cityName) {
      this.$store.commit("cityId", adcode);
      this.$store.commit("cityName", cityName);
      this.getBanners();
      this.getCityData();
      this.getProjects();
      this.isShowCityPop = false;
    },
    //获取滚动banner
    async getBanners() {
      const { data: data } = await this.$http.get(
        "/bili/ticket/banner/list?district_id=" +
          this.$store.state.active_cityid +
          "&position=2&sub_position=0"
      );
      this.$store.commit("banners", data.data);
    },
    //获取选中的城市及类型及时间的所有项目
    async getProjects() {
      this.$store.commit("page", 1);
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
      if (data.data.total == 0) {
        const { data: data1 } = await this.$http.get(
          "/bili/ticket/project/recommend?id=0"
        );
        this.$store.commit("recommendList", data1.data);
      }
      if (this.$store.state.active_cityid == -1) {
        this.$store.commit("hideCityTag", true);
      } else {
        this.$store.commit("hideCityTag", false);
      }
    },
    //首次加载 默认城市及类型及时间的所有项目
    async getProjectsFirst() {
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
      if (data.data.total == 0) {
        const { data: data1 } = await this.$http.get(
          "/bili/ticket/project/recommend?id=0"
        );
        this.$store.commit("recommendList", data1.data);
      }
      if (this.$store.state.active_cityid == -1) {
        this.$store.commit("hideCityTag", true);
      } else {
        this.$store.commit("hideCityTag", false);
      }
    }
  },
  async created() {
    if (
      sessionStorage.getItem("cityId") != null &&
      sessionStorage.getItem("cityName") != null
    ) {
      let id = JSON.parse(sessionStorage.getItem("cityId"));
      this.$store.commit("cityId", id);
      let name = JSON.parse(sessionStorage.getItem("cityName"));
      this.$store.commit("cityName", name);
    } else {
      //获取当前定位 位置信息
      // const { data: data } = await this.$http.get(
      //   "/map/ip?key=8b261a8c71aefa2cab79521d760505fe"
      // );
      const { data: data } = await this.$http.get(
        "/bili/ticket/district/geocoder"
      );
      if(data.data.city!=''){
        this.$store.commit("cityName", data.data.city);
      }else{
        this.$store.commit("cityName", data.data.province);
      }
      this.$store.commit("cityId", Number(data.data.adcode));
    }

    this.getBanners();
    this.getCity();
    this.getCityData();
    this.getProjectsFirst();
  }
};
</script>

<style lang="less" scoped>
.selector {
  width: 100%;
  height: 120px;
  background: #fff;
  box-shadow: 0 0 15px 0 hsla(203, 6%, 45%, 0.09),
    0 1px 0 0 rgba(204, 208, 215, 0.3);
  .wrapper {
    box-sizing: border-box;
    background: #fff;
    width: 1160px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    height: 40px;
  }
  .selector-city {
    border-bottom: 1px dashed #e5e9ef;
    .first-item {
      width: 140px;
    }
    .last-item {
      position: relative;
      flex: 1 1;
      text-align: right;
      .icons {
        transition: all 0.3s;
        margin-left: 5px;
        font-size: 13px;
      }
      .moreCityPop {
        overflow: hidden;
        width: 414px;
        height: 165px;
        z-index: 999;
        top: 28px;
        right: 0;
        position: absolute;
        opacity: 1;
        background: #fff;
        border: 1px solid #fff;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        .letter-list {
          padding: 8px 0;
          border-bottom: 1px solid #e7e7e7;
          margin: 9px 20px 0;
          display: flex;
          text-align: left;
          .letter-item {
            margin-right: 25px;
            box-sizing: border-box;
            .letter {
              display: inline-block;
            }
          }
        }
        .city-list {
          margin: 9px 20px 0;
          text-align: left;
          box-sizing: border-box;
          overflow: hidden;
          max-height: 110px;
          overflow-y: scroll;
          .city-item {
            line-height: 15px;
            font-size: 12px;
            padding: 6px 0;
            width: 20%;
            float: left;
            box-sizing: border-box;
            cursor: pointer;
          }
        }
      }
    }
    .item {
      width: 90px;
    }
  }
  .selector-type {
    border-bottom: 1px dashed #e5e9ef;
    .item {
      width: 140px;
    }
  }
  .selector-order {
    .item {
      width: 140px;
    }
  }
  .title {
    width: 90px;
    font-size: 12px;
    color: #99a2aa;
    letter-spacing: 0;
  }
  span {
    cursor: pointer;
    &:hover {
      color: #f25d8e;
    }
  }
  .list {
    font-size: 12px;
    color: #6d757a;
    letter-spacing: 0;
    line-height: 14px;
    display: flex;
    flex: 1 1;
  }
}
.active {
  position: relative;
  color: #f25d8e;
}
.on {
  color: #f25d8e;
}
.roate {
  transform: rotate(180deg);
}
.active::after {
  position: absolute;
  content: "";
  transform: translate(-50%);
  left: 50%;
  bottom: -9px;
  width: 100%;
  height: 2px;
  background: #f25d8e;
}
</style>