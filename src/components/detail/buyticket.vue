<template>
  <div class="buyticket">
    <div class="bread-wrapper">
      <span>
        <a href="//www.bilibili.com">Bilibili</a>
      </span>
      <span class="symbol">></span>
      <span>
        <router-link to="/">会员购</router-link>
      </span>
      <span class="symbol">></span>
      <span class="project-name">{{detail.name}}</span>
    </div>
    <div class="detail">
      <div
        class="detail-img"
        :style="{backgroundImage:'url(https:' + detail.cover + '@600w_800h.jpeg)'}"
      ></div>
      <div class="detail-info">
        <div class="name-box">
          <span class="label" v-if="detail.crowdfund.cf_status==1"></span>
          <span>{{detail.name}}</span>
        </div>
        <div
          v-if="detail.crowdfund.cf_status==1||detail.crowdfund.cf_status==2"
          class="crowfund-box"
        >
          <div class="content">
            <div class="tips">
              <span class="status" v-text="detail.crowdfund.cf_status==1?'众筹中':'众筹成功，项目开启普通售票'"></span>
              <span class="tip-icon" @click="isShowCrowdfund = true"></span>
            </div>
            <!-- <div>未知功能</div> -->
            <div class="current-people">
              <span class="num">{{detail.crowdfund.success_num}}</span>
              <span class="num">人</span>
              <span class="join-status">已参与</span>
            </div>
            <div class="progress">
              <div class="progress-fill" :style="'width:'+detail.crowdfund.percentage+'%'"></div>
            </div>
            <p class="progress-num">当前进度{{detail.crowdfund.percentage}}%</p>
            <p class="goal" v-if="detail.crowdfund.cf_status==1">
              此项目须在
              <span>{{detail.crowdfund.expire_time*1000 | formatDate}}</span>
              前达到
              <span>{{detail.crowdfund.target_num}}人</span>
              的目标才可成功
            </p>
            <p class="goal" v-if="detail.crowdfund.cf_status==2">
              此项目在
              <span style="color: #262626;">{{detail.crowdfund.end_time*1000 | formatDate}}</span>
              众筹成功
            </p>
            <!-- 未知 -->
            <!-- 未知 -->
            <!-- 未知 -->
          </div>
        </div>
        <div class="time-box">
          <span class="title">时间：</span>
          <span class="time">{{detail.project_label}}</span>
        </div>
        <div class="address-box">
          <span class="title">场馆：</span>
          <div class="content">
            <span class="address-name">{{detail.venue_info.name}}</span>
            <span class="address-detail">{{detail.venue_info.address_detail}}</span>
            <span class="address-icon"></span>
            <span class="watch-map" @click="watchMap(detail.venue_info.coordinate)">查看地图</span>
          </div>
        </div>
        <div class="show-box">
          <div class="show-item round">
            <span class="title">场次：</span>
            <div class="screens">
              <span
                class="selectable-option"
                v-for="(item,index) in detail.screen_list"
                @click="selector(item.clickable,index,0,item.sale_flag_number)"
                :class="item.clickable?(active_Round == index?'active':''):'unable'"
                :key="index"
              >{{item.name}}</span>
            </div>
          </div>
          <div class="show-item">
            <span class="title">价格：</span>
            <div class="tickets">
              <span
                class="selectable-option"
                v-for="(item,index) in detail.screen_list[active_Round].ticket_list"
                @click="selector(item.clickable,index,1,item.sale_flag_number)"
                :class="item.clickable?(active_Ticket == index?'active':''):'unable'"
                :key="index"
              >
                {{'¥'+item.price/100 + '('+item.desc+')'}}
                <span v-if="item.sale_flag_number==6">库存紧张</span>
                <span v-if="item.sale_flag_number==8">暂时售罄</span>
                <span v-if="item.sale_flag_number==1">{{item.sale_start}}开售</span>
              </span>
            </div>
          </div>
          <div class="show-item">
            <span class="title">数量：</span>
            <div class="count">
              <span
                class="count-reduce"
                :class="(!detail.is_sale || !detail.is_price || detail.sale_flag_number==1)?'none':(num>0?'color-reduce':'')"
                @click="count(true)"
              ></span>
              <span
                class="count-num"
                v-text="(!detail.is_sale || !detail.is_price || detail.sale_flag_number==1)?'0':num"
              ></span>
              <span
                class="count-add"
                :class="(!detail.is_sale || !detail.is_price || detail.sale_flag_number==1)?'none':(num<(detail.screen_list[active_Round].ticket_list[active_Ticket].num)?'color-add':'')"
                @click="count(false,detail.screen_list[active_Round].ticket_list[active_Ticket].num)"
              ></span>
            </div>
          </div>
          <div
            class="show-item"
            v-if="detail.screen_list[active_Round].ticket_list[active_Ticket].link_sc_name"
          >
            <span class="title" style="color:white">提示：</span>
            <div class="tips">
              <p>
                <span>关联场次：</span>
                <span
                  v-for="(item,index) in detail.screen_list[active_Round].ticket_list[active_Ticket].link_sc_name"
                  :key="index"
                  v-text="index==detail.screen_list[active_Round].ticket_list[active_Ticket].link_sc_name.length-1?item:item+' , '"
                ></span>
              </p>
              <p>
                <span class="tip-icon"></span>
                <span>所购票关联的场次均可参加</span>
              </p>
            </div>
          </div>
          <div class="support">
            <div class="express-info">
              <i class="icon-small-circle"></i>
              <span v-if="detail.has_eticket">电子票/兑换票·无需配送</span>
              <span v-if="detail.has_paper_ticket">纸质票·快递包邮</span>
            </div>
            <div
              class="express-info"
              v-if="detail.crowdfund.cf_status==1||detail.crowdfund.cf_status==2"
            >
              <i class="icon-small-circle"></i>
              <span>本项目由主办方发起众筹</span>
            </div>
            <div class="express-info" v-if="!detail.all_refund">
              <i class="icon-small-circle"></i>
              <span>{{detail.refund_desc}}</span>
            </div>
          </div>
          <div class="buy-btn">
            <div class="buy" :class="detail.sale_begin == -1?'enable':''" @click="buy">
              <span
                v-if="detail.sale_begin != -1"
                v-text="detail.crowdfund.cf_status==1?'立即支持':'立即购票'"
              ></span>
              <span v-if="detail.sale_begin == -1">{{detail.sale_flag}}</span>
            </div>
            <div class="want" @click="want">
              <span class="icon-want"></span>
              <div class="content">
                <p>{{detail.wish_info.count}}人想去</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="map-model" v-if="isShowMap">
      <div class="map-mask"></div>
      <div class="map-box">
        <div class="map-content">
          <div class="map-header">
            <i class="icon-close" @click="close"></i>
            <span>场馆地址</span>
          </div>
          <maps :center="center"></maps>
        </div>
      </div>
    </div>
    <div class="crowfund-pop" v-if="isShowCrowdfund">
      <div class="crowfund-pop-mask"></div>
      <div class="crowfund-pop-content">
        <i class="icon-close" @click="close"></i>
        <span class="header">众筹风险提醒</span>
        <div class="detail-content">
          <p v-for="(item,index) in detailContent" :key="index">{{item.content}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import maps from "../map.vue";
import { formatDate } from "../../assets/js/date.js";
import qs from "qs";
export default {
  props: ["detail"],
  data() {
    return {
      center: [0, 0],
      isShowMap: false,
      active_Round: 0,
      active_Ticket: 0,
      num: 1,
      detailContent: [
        {
          content:
            "1.众筹不是商品交易。支持者根据自己的判断选择、支持众筹项目，与发起者共同实现梦想并获得发起者承诺的回报，众筹存在一定风险。"
        },
        {
          content: `
                    2.会员购平台仅为平台方，为众筹双方提供平台服务，众筹关系仅存在于发起者和支持者之间，产生的法律后果由发起者与您自行承担。
                    会员购平台不对发起者在详情页面所做任何陈述、承诺、发布的及交易行为的真实性、合法性、准确性、有效性、众筹项目指向的活动是否会如期举行等作任何的明示或暗示的保证，
                    也不承担任何法律责任。若发起者与支持者之间的众筹行为，或支持者参与众筹项目指向的活动产生任何法律纠纷，均与会员购平台无涉。
                `
        },
        {
          content:
            "3.由于发起者能力和经验不足、市场风险、法律风险等各种因素，众筹可能失败，支持者支付的款项将全部原路退还。"
        }
      ],
      isShowCrowdfund: false,
      screen_id: 0, //选中的场次id
      sku_id: 0 //选中的票（价格）的id
    };
  },
  methods: {
    watchMap(obj) {
      const a = obj.coor.split(",");
      this.center = a.map(Number);
      this.isShowMap = true;
    },
    close() {
      this.isShowMap = false;
      this.isShowCrowdfund = false;
    },
    selector(isAllowClick, index, type, sale_flag) {
      this.num = 1;
      if (!type) {
        if (isAllowClick) {
          this.active_Round = index;
          this.active_Ticket = 0;
        } else {
          //TODO
          switch (sale_flag) {
            case 1:
              this.$toast("还未开售，暂时无法购买~");
              break;
            case 3:
              this.$toast("呜呜呜，该场次无法购买~");
              break;
            case 4:
              this.$toast("来晚了，票票已经售罄啦o(╥﹏╥)o");
              break;
            case 5:
              this.$toast("呜呜呜，该场次无法购买~");
              break;
            case 105:
              this.$toast("别点人家啦，这个场次选不了");
              break;
          }
          return null;
        }
      } else {
        if (isAllowClick) {
          this.active_Ticket = index;
        } else {
          //TODO
          switch (sale_flag) {
            case 1:
              this.$toast("还未开售，暂时无法购买~");
              break;
            case 3:
              this.$toast("呜呜呜，该票种无法购买~");
              break;
            case 4:
              this.$toast("来晚了，票票已经售罄啦o(╥﹏╥)o");
              break;
            case 5:
              this.$toast("呜呜呜，该票种无法购买~");
              break;
            case 8:
              this.$toast("好可惜，票票暂时售罄啦(Ｔ▽Ｔ)");
              break;
            case 105:
              this.$toast("别点人家啦，这个场次选不了");
              break;
          }
          return null;
        }
      }
    },
    count(type, max) {
      if (type) {
        if (this.num > 0) {
          this.num -= 1;
        }
      } else {
        if (this.num < max) {
          this.num += 1;
        } else {
          this.$toast("购买票数超过单笔订单购买限制" + this.num + "张");
        }
      }
    },
    want() {
      this.$emit("want");
    },
    buy() {
      if(this.detail.sale_begin==-1){
        return null;
      }
      if (this.num == 0) {
        this.$toast("请选择数量");
        return null;
      }
      if (this.$store.state.token != "") {
        this.screen_id = this.detail.screen_list[this.active_Round].id;
        this.sku_id = this.detail.screen_list[this.active_Round].ticket_list[
          this.active_Ticket
        ].id;
        this.$http({
          url: "/bili/ticket/order/prepare",
          method: "POST",
          data: qs.stringify({
            project_id: this.detail.id,
            screen_id: this.screen_id,
            order_type: 1,
            count: this.num,
            sku_id: this.sku_id,
            token: "c0489caa%2C1610070844%2Cacff3%2A71"
          })
        }).then(res => {
          this.$router
            .push({
              path: "/order",
              query: { token: res.data.data.token }
            })
            .catch(data => {});
        });
      } else {
        this.$toast("老铁，请先登录后才可购票呐");
      }
    }
  },
  components: {
    maps
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  }
};
</script>

<style lang="less" >
.buyticket {
  background: #fff;
  width: 100%;
  padding-bottom: 58px;
  .bread-wrapper {
    width: 1160px;
    box-sizing: border-box;
    margin: 0 auto;
    background: #fff;
    padding: 10px 0;
    display: flex;
    align-items: center;
    .symbol {
      margin-bottom: 1px;
    }
    span {
      color: #000;
      font-size: 12px;
      margin-right: 5px;
    }
    .project-name {
      color: #99a2aa;
    }
  }
  .detail {
    background: #fff;
    width: 1160px;
    margin: auto;
    display: flex;
    .detail-img {
      width: 300px;
      height: 400px;
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgODAgODAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDgwIDgwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0IwQjlDMDt9Cjwvc3R5bGU+CjxnPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTU0LDIxLjRIMjVjLTEuMSwwLTIsMC45LTIsMnMwLjksMiwyLDJoMjljMi4xLDAsNSwyLjksNSw1djExYzAsMS4xLDAuOSwyLDIsMnMyLTAuOSwyLTJ2LTExCgkJQzYzLDI2LjEsNTguMywyMS40LDU0LDIxLjR6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDAsNjIuNEgxNGMtMi4xLDAtNC0xLjktNC00di00LjFsMTEuNC0xMC40YzAuOC0wLjcsMC45LTIsMC4xLTIuOGMtMC43LTAuOC0yLTAuOS0yLjgtMC4xTDEwLDQ4LjlWMjkuNgoJCWMwLTEuMS0wLjktMi0yLTJzLTIsMC45LTIsMnYyOC44YzAsNC4zLDMuNyw4LDgsOGgyNmMxLjEsMCwyLTAuOSwyLTJDNDIsNjMuMyw0MS4xLDYyLjQsNDAsNjIuNHoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02Myw0OS4xYzAtMC4xLDAtMC4xLDAtMC4yYzAtMC4xLDAtMC4xLTAuMS0wLjJjMC0wLjEsMC0wLjEtMC4xLTAuMmMwLTAuMS0wLjEtMC4xLTAuMS0wLjIKCQljMC0wLjEtMC4xLTAuMS0wLjEtMC4yYzAsMC0wLjEtMC4xLTAuMS0wLjFjMC0wLjEtMC4xLTAuMS0wLjItMC4yYzAsMCwwLDAtMC4xLTAuMWwtNi4zLTUuM0M1NS4yLDQyLDU0LDQyLDUzLjMsNDIuN0w0NS42LDUwCgkJYy0wLjgsMC44LTAuOCwyLTAuMSwyLjhjMC40LDAuNCwwLjksMC42LDEuNSwwLjZjMC41LDAsMS0wLjIsMS40LTAuNWw2LjQtNmw0LjIsMy41djguMWMwLDIuMS0xLjksNC00LDRjLTEuMSwwLTIsMC45LTIsMgoJCWMwLDEuMSwwLjksMiwyLDJjNC4zLDAsOC0zLjcsOC04di05YzAsMCwwLTAuMSwwLTAuMUM2Myw0OS4zLDYzLDQ5LjIsNjMsNDkuMXoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00OC44LDQwLjNjMi43LDAsNC45LTIuMiw0LjktNC45YzAtMi43LTIuMi00LjktNC45LTQuOXMtNC45LDIuMi00LjksNC45QzQzLjksMzguMSw0Ni4xLDQwLjMsNDguOCw0MC4zegoJCSBNNDguOCwzNC41YzAuNSwwLDAuOSwwLjQsMC45LDAuOXMtMC40LDAuOS0wLjksMC45cy0wLjktMC40LTAuOS0wLjlTNDguMywzNC41LDQ4LjgsMzQuNXoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMi42LDE2LjJjLTAuNy0wLjktMS45LTEtMi44LTAuM2MtMC45LDAuNy0xLDEuOS0wLjMsMi44bDQyLDUzYzAuNCwwLjUsMSwwLjgsMS42LDAuOGMwLjQsMCwwLjktMC4xLDEuMi0wLjQKCQljMC45LTAuNywxLTEuOSwwLjMtMi44TDEyLjYsMTYuMnoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03Mi40LDE1LjdjLTEuMy0xLjctMy4xLTIuNy01LjItM0wyOS42LDcuN2MtMi4xLTAuMy00LjEsMC4zLTUuOCwxLjVjLTEuNywxLjMtMi43LDMuMS0zLDUuMgoJCWMtMC4xLDEuMSwwLjYsMi4xLDEuNywyLjJjMS4xLDAuMSwyLjEtMC42LDIuMi0xLjdjMC4xLTEsMC43LTEuOSwxLjUtMi41YzAuOC0wLjYsMS44LTAuOSwyLjgtMC44bDM3LjYsNS4xCgkJYzIuMSwwLjMsMy42LDIuMiwzLjMsNC4zTDY4LDM1LjRjLTAuMSwxLjEsMC42LDIuMSwxLjcsMi4yYzAuMSwwLDAuMiwwLDAuMywwYzEsMCwxLjgtMC43LDItMS43bDEuOS0xNC41CgkJQzc0LjIsMTkuNSw3My43LDE3LjQsNzIuNCwxNS43eiIvPgo8L2c+Cjwvc3ZnPgo=);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5), 0 4px 8px 0 rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      margin-right: 20px;
    }
    .detail-info {
      width: 840px;
      .name-box {
        display: flex;
        align-items: flex-start;
        font-size: 18px;
        .label {
          display: inline-block;
          width: 39px;
          height: 21px;
          background-size: cover;
          background-image: url(data:image/png;base64,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);
          margin-right: 15px;
          margin-top: 3px;
        }
      }
      .crowfund-box {
        margin-top: 14px;
        padding-left: 54px;
        .content {
          width: 406px;
          background-color: hsla(0, 0%, 84%, 0.2);
          position: relative;
          border-radius: 5px;
          padding: 15px 17px;
          box-sizing: border-box;
          .tips {
            position: absolute;
            right: 11px;
            top: 8px;
            z-index: 1;
            .status {
              font-size: 14px;
              color: #fb7299;
              vertical-align: middle;
            }
            .tip-icon {
              cursor: pointer;
              margin-left: 2px;
              display: inline-block;
              width: 15px;
              height: 15px;
              vertical-align: middle;
              background-size: contain;
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAyJJREFUSA29ljFoU1EUhpvXxuCSzYptERqwQykESlEXwUm3dqkgknaICThpZ9tFsG5CdRISMoTg1KWOHUToYqUIASu0aiqiFRUcOiWGNH7/49305eUlr9LEC5d77rn/Of+95513zw31HaPlcrnJw8PDGaBX6vX6MOOQY7YfCoW+IW9YlrWWTCbfOvq2Q6jtCgsQzdZqtWXEMeFw/p5hj/5dc9o5+iibGNeE9R2IlyBe1dyv+RJCFONEz3F0CScl+ko4HF6bn5//4uckn8+fr1arM+AX6DHwmxDfgrjkxbcQZjKZqxhoh6cYF+Px+LOpqamq19BvvrW1FS4Wi3cgVVT+MM6m0+lXbmwTochYXKd/hWw6lUq9c4OPK2ez2QnIXoAfoV9zkzYInTC+AXgQiUQuE76ffgSFQiFaqVRSWgOXTSQSB344wjwI7jUbjxLeiya8lgHrmyErjNPtyIQtl8vrYB+rSzb23lE+5IsDRBzfNsQmJAQ3WFCCLHYKo3YtnHEuWToz947yxenuC6eM17pNiOIh8icliNfIPZ+bm/vFphqZJ1k6N8Yry6dwzu/VZ8E8CWiMnTwJykYM62CvM+bUHVm6tk0+wa4AGBPXAPHVDdKn/6ytlWuBMH1ketulChTlmwR6Kq4Q3+8lIR0kdScCLQGwyzPg08Ky8wzZ1zGkxic828g/BjAexvCDWQgawS+x07vC8RnOMtwLsnHW97C9oKTRRWzuxkBbjE4bkFs2ug6jOIYa/2EHYFeXRLhP163f6yaOfYvvp3o22ms2cYhLJ9zgW4yrxPSKVL7FIS4SzbL/P9WzXhEa3+Ky+I/0LNhlBwuqZ90mlU/5Jpw74rKztL+/fxFlTMXzGIS/XRi37FIfiU5BjnG6JWltQphX2cEmpMsqnkfwVikajT5Ae1PdkVtBjka+uCQeybc4pP7nAtzWu2dBZatjAWYHJU6omjUiYNBJPf6bprKVD/mST/k2gMYJjaIbjygnjBWRud8z4mghlJKK8P+eiSI0DeKmhzD6bRLgM6O57Jsewuh3lfEmQZi3NN8TelGq1Cqe6E/81P8LaTbHgsgJu2oAAAAASUVORK5CYII=);
            }
          }
          .current-people {
            .num {
              display: inline-block;
              font-size: 20px;
              line-height: 1;
              color: #222;
              font-weight: 500;
              margin-right: 0;
              vertical-align: bottom;
              padding-right: 4px;
            }
            .join-status {
              display: inline-block;
              font-size: 14px;
              line-height: 17px;
              color: #99a2aa;
              vertical-align: bottom;
            }
          }
          .progress {
            width: 371px;
            height: 4px;
            background-color: #d3d3d3;
            border-radius: 2px;
            overflow: hidden;
            margin-top: 12px;
            .progress-fill {
              background-color: #fb7299;
              height: 100%;
            }
          }
          .progress-num {
            font-size: 13px;
            color: #fb7299;
            font-weight: 500;
            margin-top: 11px;
          }
          .goal {
            font-size: 13px;
            color: #99a2aa;
            margin-top: 11px;
          }
        }
      }
      .time-box {
        margin-top: 30px;
        display: flex;
        align-items: center;
        .time {
          font-size: 14px;
          color: #222;
          line-height: 14px;
        }
      }
      .address-box {
        padding-bottom: 8px;
        margin-top: 10px;
        align-items: center;
        display: flex;
        border-bottom: 1px dashed #e7ecf1;
        .title {
          line-height: 38px;
        }
        .content {
          display: flex;
          align-items: center;
          .address-name {
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 430px;
          }
          .address-detail {
            margin-right: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-left: 10px;
            font-size: 12px;
            color: #99a2aa;
            line-height: 14px;
            max-width: 250px;
          }
          .address-icon {
            margin-left: 15px;
            margin-right: 5px;
            width: 15px;
            height: 15px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url(data:image/png;base64,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);
          }
          .watch-map {
            flex: 1 1;
            cursor: pointer;
            font-size: 12px;
            color: #6d757a;
            line-height: 14px;
          }
        }
      }
      .show-box {
        .show-item {
          margin-top: 10px;
          display: flex;
          .title {
            line-height: 38px;
          }
          .selectable-option {
            font-size: 12px;
            display: inline-block;
            position: relative;
            height: 38px;
            line-height: 38px;
            text-align: center;
            margin-right: 10px;
            margin-bottom: 10px;
            padding: 0 30px;
            border: 1px solid #ccd0d7;
            border-radius: 4px;
            user-select: none;
            cursor: pointer;
          }
          .active {
            height: 38px;
            line-height: 38px;
            color: #f25d8e;
            border: 1px solid #f25d8e;
            box-shadow: inset 0 0 0 1px #f25d8e;
            &::before {
              display: inline-block;
              position: absolute;
              content: "";
              font-size: 0;
              line-height: 0;
              width: 6px;
              height: 4px;
              right: 1px;
              bottom: 3px;
              border: 1px solid #fff;
              border-width: 0 0 2px 2px;
              transform: rotate(-43deg);
              z-index: 10;
            }
            &::after {
              position: absolute;
              content: "";
              font-size: 0;
              width: 0;
              height: 0;
              bottom: 0;
              right: 0;
              border-style: solid;
              border-width: 0 0 18px 18px;
              border-color: transparent transparent #f25d8e;
            }
          }
          .unable {
            color: #b8c0cc;
            border-color: #e5e9ef;
            background-color: #f4f5f7;
            cursor: not-allowed;
          }
          .count {
            display: flex;
            align-items: center;
            height: 38px;
            border-radius: 3px;
            border: 1px solid #ccd0d7;
            width: 158px;
            line-height: 38px;
            .count-reduce {
              margin-left: 13px;
              width: 14px;
              height: 14px;
              cursor: pointer;
              border-top-left-radius: 0.133rem;
              border-bottom-left-radius: 0.133rem;
              &::before {
                position: absolute;
                content: "";
                font-size: 0;
                width: 14px;
                height: 14px;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAADtJREFUSA1jYBgFoyEwGgKjITAaApSGAOO2Q2f+U2oIKfqZSFFMDbXD30JqhNKoGaMhMBoCoyEw0kMAADpvA0tfvmHDAAAAAElFTkSuQmCC)
                  50% no-repeat;
                background-size: contain;
              }
            }
            .count-num {
              font-size: 12px;
              flex: 1 1;
              width: 1.44rem;
              height: 1.013rem;
              line-height: 1.013rem;
              left: 1.013rem;
              text-align: center;
            }
            .count-add {
              margin-right: 13px;
              position: relative;
              right: 0;
              border-top-right-radius: 0.133rem;
              border-bottom-right-radius: 0.133rem;
              width: 14px;
              height: 14px;
              cursor: pointer;
              &::after {
                position: absolute;
                content: "";
                font-size: 0;
                top: 0;
                left: 0;
                width: 14px;
                height: 14px;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAGFJREFUSA1jZCARbDt05j+yFi87E0ZkPiE2EyEF1JYftZDaIcowGqSjQUpyCAz/RMOIXjaSHEYkahj+QUp3H5JUl4GiCz3OR+tD9ERM9zgctRA9CijmjwYpxUGIbsDwD1IAVHkLeR151+0AAAAASUVORK5CYII=)
                  50% no-repeat;
                background-size: contain;
              }
            }
            .color-reduce {
              &::before {
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAADtJREFUSA1jYBgFoyEwGgKjITAaApSGAOOX9P7/lBpCin4mUhRTQ+3wt5AaoTRqxmgIjIbAaAiM9BAAAL/RAvFeejHUAAAAAElFTkSuQmCC)
                  50% no-repeat;
                background-size: contain;
              }
            }
            .color-add {
              &::after {
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAGFJREFUSA1jZCARfEnv/4+shWdmISMynxCbiZACasuPWkjtEGUYDdLRICU5BIZ/omFELxtJDiMSNQz/IKW7D0mqy0DRhR7no/UheiKmexyOWogeBRTzR4OU4iBEN2D4BykAzpsLH0YD4fsAAAAASUVORK5CYII=)
                  50% no-repeat;
                background-size: contain;
              }
            }
            .none {
              pointer-events: none;
            }
          }
          .tips {
            margin-top: 10px;
            p {
              font-size: 12px;
              color: #99a2aa;
              line-height: 14px;
              &:first-child {
                margin-bottom: 7px;
                color: #222;
              }
              .tip-icon {
                float: left;
                width: 14px;
                height: 14px;
                margin-right: 5px;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA6VJREFUWAntV01oU0EQntn0LylaCoLWUhFE6FEPol6KF5Hagj+FHgpeFDwJ0iRKQdEqFkSTFkGEIvXYQ7FioRXEg+KlioIXQUUERVN7EGyxfTW2740zm+zz5eclrzU33fDY3dmZb763+3ZmAvCvN1zNBixGkzsBnENE2MZ2zUiwWewJYYa7FCI9BVAT9YOxVyIP0gIRsGKJo44DA0DUGgQUEN8qBeciyfi9cvolCSz1DW11fq6MEsBeAULEFCDc52cqRPihdn3dDFh1mF6Za7KRtgFBBz+HiahZ6wNMq7qqnvDV3o8yL9Z8CSzFEm22A+P81hvY8Vf2fjGyp+UOdnfbxYCMjMbGQtazz8fZ7hITaWK7byEFXeFknI+nsBUlIM4dhx4RQQ07n4xUN/bgtRM/Cs39JXR2ZJ21/H2USXQiwi+lcH8xEgUEZNvttP0i8+bqZqQhehr70fF35b9C/aSs+cEbRM4pvRO1oV35x6HyzeXMs9s+Wc75Yu/1KXnyMcxciGsM3kXB1NhmMdvnELCiyS754OTM9baXeXM+ooPy5GHmTDUJOULGFGzx4VXIIeAQXdGL/MGt9sy9oPljjcWYInd9ZJVcAjrI8D1npin52vNB/naub5BcY/aRCWgZRJeARDgt4nte7qqthYzGlBiiW9YXj10C2fDK0QZ8P6q1OM6xyWK7vrwEeKyjl0S4HKMKTjzY2pdAuztgEosOrxV06oUy2MZXDgFXkWO7O670YMHim8gN+Zdt7g5kUypIYjGLle7TdtVGjUk0a7BdAixIiVBnNbNa4d5GR6dzftkvBtolkCkmWCwpNWDjJPOA40bgW8NR84BAI6nHxoVLQCoZLZR8zinVKJTq64fOdNQPxTtL6Zg1Gh6uRqAjMkcFD43cJaDLKK5kpJjQ+dxoVKi33i0cY+wWdv86nIw+N7AuAREoxPN6QYoJzudGya8vlw2NHfXdauQQ3C9zhTTAx5a5DTIXoWmRwdg4349pqWR0McH53Kz593/A/HSs9OKIvL1ghxviY1499z4aYSULEsFMxxKtyza94a2fC4VgB1dFn4wv6QveUCoWqeGkjJJKxppPTgQ5Di+od1yze8t7BHWBS7L2fOeiV7ADxnitRamxD9r7EhCAQGU566Xn05ts5WznGNLOd30fg97l63k5CImSBAyAlFG6kgn4x4SP7zbHiJPGvlQfiIAB8Ptrxgc5S0D81wyecPU7FUnEXnqvmrH/3xfbgd9mMpALYN6nJAAAAABJRU5ErkJggg==)
                  50% no-repeat;
                background-size: contain;
              }
            }
          }
          .tickets,
          .screens {
            flex: 1 1;
          }
        }
        .round {
          margin-top: 14px;
        }
        .support {
          font-size: 12px;
          margin-top: 20px;
          .icon-small-circle {
            display: inline-block;
            vertical-align: middle;
            background-image: url(data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjRweCIgaGVpZ2h0PSI0cHgiIHZpZXdCb3g9IjAgMCA0IDQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0i6aG16Z2iLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLor6bmg4XpobUxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzYwLjAwMDAwMCwgLTQ3MS4wMDAwMDApIiBmaWxsPSIjQ0NDQ0NDIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM4MC4wMDAwMDAsIDYwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzODAuMDAwMDAwLCA0MDcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0xNSIgeD0iMCIgeT0iNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgcng9IjIiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
            background-size: 100% 100%;
            height: 4px;
            width: 4px;
          }
          span {
            padding-left: 4px;
            vertical-align: middle;
            font-size: 12px;
            color: #999;
          }
          .express-info {
            margin-left: 60px;
            display: inline-block;
          }
        }
        .buy-btn {
          margin-left: 57px;
          margin-top: 30px;
          display: flex;
          .buy {
            color: #fff;
            background-image: linear-gradient(-48deg, #ff6a9c, #fe8574);
            box-shadow: 0 3px 4px 0 #fdb8cc;
            width: 240px;
            height: 50px;
            text-align: center;
            font-size: 16px;
            line-height: 50px;
            border-radius: 3px;
            cursor: pointer;
          }
          .want {
            width: 240px;
            height: 50px;
            margin-left: 17px;
            cursor: pointer;
            .icon-want {
              float: left;
              width: 22px;
              height: 22px;
              margin: 14px 5px 14px 0;
              background: url(data:image/png;base64,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)
                50% no-repeat;
              background-size: 16px 16px;
            }
            p {
              font-size: 12px;
              line-height: 50px;
              color: #212121;
              &:hover {
                color: #ff6a9c;
              }
            }
          }
          .enable {
            box-shadow: none;
            cursor: not-allowed;
            background: #e4eaef;
            color: #99a2aa;
          }
        }
      }
      .title {
        font-size: 14px;
        color: #99a2aa;
        line-height: 14px;
        margin-right: 15px;
      }
    }
  }
  .map-model {
    .map-mask {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9000;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .map-box {
      position: fixed;
      z-index: 9001;
      top: 50%;
      left: 50%;
      vertical-align: middle;
      transform: translate(-50%, -50%);
      .map-content {
        width: 500px;
        margin: 0 auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        .map-header {
          width: 100%;
          height: auto;
          font-size: 12px;
          position: relative;
        }
      }
    }
  }
  .crowfund-pop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    .crowfund-pop-mask {
      position: absolute;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .crowfund-pop-content {
      z-index: 2;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 451px;
      padding: 0 16px;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 4px;
      .header {
        height: 58px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 100%;
        font-size: 18px;
        font-weight: 500;
        color: #212121;
        padding-left: 10px;
      }
      .detail-content {
        font-size: 14px;
        color: #b6b6b6;
        width: 100%;
        box-sizing: border-box;
        p {
          margin-bottom: 20px;
        }
      }
      .icon-close {
        width: 18px;
        height: 18px;
        top: 20px;
        right: 20px;
      }
    }
  }
  .icon-close {
    display: inline-block;
    position: absolute;
    width: 14px;
    height: 14px;
    top: 0;
    right: 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAZdJREFUSA21lk1SAyEQRmlyDS/kzkX8qTJmZ1x5GlfGncYqNVl4KK+hyBvTFpPA0MSxq6ZgSPf3ugkwyHK1PnbBLV204OT25mr6Tn8su3/anIgLd52euIUHFkI44hH3tVk+ri/GgqGFpurD8ql4CG7iJKzGgD6s3s7R6jQTiGcaRdynjo0BJeGo85zCYMDy/Gfx5TIH7bLUTIxtrrJOO8isY6kOjrmsSOZ6dvaqfkNtScNF2GJ++kKspAKlAAvUGtsDArcGHproHrAV2ppgFmiFtsLQLQJrUH4/ZJENAoegW+CEFmPpWxZXFYhYbuoYV7PC8DcBcSxBW2Do9M5SBv7bTBWWqtPkWqqsAnMwAMB2D+c4Xj0GB4ElGMJb4N4XoQYtAodgephbfHTatc0CW4RafIHuAVsFEGmJ6QFbAgGlZo39BVoDUshu36LRAS2Ou+Kl95qW/NwbucrFG9vW2Ge15a2+ubYEDc5PPZfUMWEkwLYhYRLXhGDA6p2lf61MxUtQxn3cGAsR+eChZN3UafChfbTQVH1Y3/0suK2T+zTcAAAAAElFTkSuQmCC);
    cursor: pointer;
    z-index: 80;
  }
}
</style>