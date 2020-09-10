import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    active_cityid: -1,//选中的城市id  默认定位当前位置
    active_cityname: '',//选中的城市名字 默认定位当前位置
    banners: [],//导航滚动图 数据
    page: 1, //当前项目 页
    comment_page: 1, //当前评论 页
    order_page: 1, //当前订单 页
    projectsList: [], //获取到的 项目列表
    orderList: [], //获取到的 订单列表
    recommendList: [], //获取到的 推荐项目列表
    active_typeT: "全部类型", //当前 类型
    active_filter: "", //当前 时间
    hideCityTag: false, //是否显示 推荐列表 的tag
    foldPage: 5, //规定最多显示的页数tag
    userinfo: {}, // 用户信息
    token: '', //登录token
    isShowLogin:false, //是否显示登录框
  },
  mutations: {
    isShowLogin(state, isShowLogin) {
      state.isShowLogin = isShowLogin;
    },
    token(state, token) {
      state.token = token;
    },
    userinfo(state, userinfo) {
      state.userinfo = userinfo;
    },
    cityId(state, cityId) {
      state.active_cityid = cityId;
      sessionStorage.setItem("cityId", JSON.stringify(state.active_cityid));
    },
    cityName(state, cityName) {
      state.active_cityname = cityName;
      sessionStorage.setItem("cityName", JSON.stringify(state.active_cityname));
    },
    banners(state, banners) {
      state.banners = banners;
    },
    orderList(state, orderList) {
      state.orderList = orderList;
    },
    projectsList(state, projectsList) {
      state.projectsList = projectsList;
    },
    order_page(state, order_page) {
      state.order_page = order_page;
    },
    page(state, page) {
      state.page = page;
    },
    comment_page(state, comment_page) {
      state.comment_page = comment_page;
    },
    active_typeT(state, active_typeT) {
      state.active_typeT = active_typeT;
    },
    active_filter(state, active_filter) {
      state.active_filter = active_filter;
    },
    hideCityTag(state, hideCityTag) {
      state.hideCityTag = hideCityTag;
    },
    recommendList(state, recommendList) {
      state.recommendList = recommendList;
    },
  },
  actions: {
  },
  modules: {
  }
})
