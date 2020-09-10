import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入全局样式表
import './assets/css/global.css'
//导入icon js
import './assets/iconfont/iconfont.js'


Vue.config.productionTip = false

import axios from 'axios'
axios.defaults.baseURL = '/api'
Vue.prototype.$http = axios

import { Uploader, Toast, RadioGroup, Radio, Switch, CountDown } from 'vant';
import 'vant/lib/uploader/style';
import 'vant/lib/toast/style';
import 'vant/lib/radio/style';
import 'vant/lib/radio-group/style';
import 'vant/lib/switch/style';
import 'vant/lib/count-down/style';
Vue.use(Uploader);
Vue.use(Toast);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Switch);
Vue.use(CountDown);

import VueAMap from 'vue-amap';
// Vue.use(ElementUI, { locale })
Vue.use(VueAMap);
//初始化vue-amap
VueAMap.initAMapApiLoader({
  //高德api  key
  key: "3b77b3bfc2c7e511211b6a44313e28a4",
  //地图插件
  plugin: [
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.Geocoder',
    'AMap.Geolocation'
  ],
  v: '1.4.4'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
