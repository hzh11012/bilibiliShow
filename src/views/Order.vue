<template>
  <div v-if="isShowOrder">
    <navs @search="search" v-model="inputValue" @getInputValue="getInputValue"></navs>
    <div class="order-info-box">
      <div class="order-info">
        <div class="top-tips" v-if="orderInfo.buyer_info!=''">{{toptips}}</div>
        <h1>订单信息</h1>
        <div class="project-info">
          <table>
            <tbody>
              <tr>
                <th>商品</th>
                <th>单价</th>
                <th>数量</th>
                <th>合计</th>
              </tr>
              <tr>
                <td>
                  <div class="detail-info">
                    <div class="info-left">
                      <img :src="orderInfo.project_img" />
                    </div>
                    <div class="info-right">
                      <h1>{{orderInfo.project_name}}</h1>
                      <p>{{orderInfo.venue_name}}</p>
                      <p class="ticket-name">
                        <span :title="orderInfo.screen_name">{{orderInfo.screen_name}}</span>
                        <span></span>
                        <span :title="orderInfo.ticket_info.name">{{orderInfo.ticket_info.name}}</span>
                      </p>
                      <div
                        class="ticket-type clearFloat"
                        v-if="orderInfo.ticket_type==1||orderInfo.ticket_type==2"
                      >
                        <span :class="orderInfo.ticket_type==1?'ticket':''"></span>
                        {{orderInfo.ticket_type==1?'纸质票':'电子票'}}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>￥{{orderInfo.ticket_info.price/100}}</div>
                </td>
                <td>
                  <div>{{orderInfo.count}}张</div>
                </td>
                <td class="total">
                  <p>￥{{orderInfo.item_total_money/100}}</p>
                  <p>(不含运费)</p>
                </td>
              </tr>
              <tr class="through-ticket" v-if="orderInfo.ticket_info.link_sc_name!=''">
                <p>
                  关联场次：
                  <span
                    v-for="(item,index) in orderInfo.ticket_info.link_sc_name"
                    :key="index"
                  >
                    {{item}}
                    <span v-if="index!=orderInfo.ticket_info.link_sc_name.length-1">,</span>
                  </span>
                </p>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 优惠券功能暂时不明确//TODO -->
        <div class="discounts">
          <div class="discounts-list">
            <p>暂无可用优惠券</p>
          </div>
        </div>
        <div class="buyer-block" v-if="orderInfo.buyer_info!=''">
          <div class="buyer-info-title">
            <span class="buyer-title-text">购买人</span>
            <div class="buyer-tip">
              <i class="icon-buyer-tip"></i>
              <span class="buyer-tip-text">添加1个购买人，入场时需携带相关证件</span>
            </div>
          </div>
          <div>
            <div class="card-container" style="max-height:259px">
              <div
                class="card-item user-item"
                :class="active==index?'checked':''"
                @click="active = index"
                v-for="(item,index) in buyerInfo"
                :key="index"
              >
                <div class="card-item-content">
                  <p class="name">{{item.name}}</p>
                  <section class="info-block info-table">
                    <div class="info-row">
                      <div
                        class="info-cell item-property"
                        v-text="item.id_type==0?'身份证':(item.id_type==1?'护照':(item.id_type==3?'台湾居民...':'港澳居民...'))"
                      ></div>
                      <div class="info-cell item-value-cell">{{item.personal_id}}</div>
                    </div>
                    <div class="info-row">
                      <div class="info-cell item-property" style="padding-top: 6px;">手机号</div>
                      <div class="info-cell item-value-cell" style="padding-top: 6px;">{{item.tel}}</div>
                    </div>
                  </section>
                </div>
                <i class="icon-tag-default" v-if="item.is_default"></i>
                <div class="control-btn">
                  <span class="hover" @click="edit(item)">编辑</span>
                  <span class="hover" @click="deleted(item)">删除</span>
                </div>
                <i class="icon-checked" v-if="active==index"></i>
              </div>
              <div class="card-item empty add" v-if="buyerInfo==''" @click="add">
                <div class="card-item-empty">
                  <span>添加购买人</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="total-container clearFloat">
          <div>
            商品总额
            <span>￥{{orderInfo.item_total_money/100}}</span>
          </div>
          <div>
            应付金额
            <span class="total">￥{{orderInfo.pay_money/100}}</span>
          </div>
        </div>
        <div class="bottom-confirm">
          <div class="service-term">
            <span class="icon-check" :class="isCheck?'checked':''" @click="isCheck=!isCheck"></span>
            我已阅读并同意
            <span
              class="term-content"
              @click="isShowGpfwxy=true"
            >《bilibili购票服务协议》</span>
            <span class="term-content" @click="isShowHygxy=true">《会员购服务协议》</span>
          </div>
          <div
            class="confirm-paybtn"
            :class="isCheck?'active':''"
            @click="pay"
          >下一步支付,￥{{orderInfo.pay_money/100}}</div>
        </div>
      </div>
    </div>
    <gpfwxy v-if="isShowGpfwxy" @close="isShowGpfwxy=false"></gpfwxy>
    <hygxy v-if="isShowHygxy" @close="isShowHygxy=false"></hygxy>
    <delete-pop v-if="isShowDelete" :deletePopInfo='deletePopInfo' @submit="deleted1" @close="isShowDelete=false"></delete-pop>
    <add-buyer
      ref="addbuyer"
      v-if="isShowAddBuyer"
      :buyer="buyer"
      :title="title"
      @close="isShowAddBuyer=false"
      @update="update"
    ></add-buyer>
    <footers></footers>
  </div>
</template>

<script>
import navs from "@/components/nav.vue";
import footers from "@/components/footer.vue";
import hygxy from "../components/hygxy.vue";
import gpfwxy from "../components/gpfwxy.vue";
import deletePop from "../components/deletePop.vue";
import addBuyer from "../components/order/addBuyer.vue";
import qs from "qs";
export default {
  data() {
    return {
      buyer: {
        id: "",
        name: "",
        phone: "",
        id_type: "0",
        personal_id: "",
        is_default: false
      },
      title: "添加购买人",
      inputValue: "",
      orderInfo: {},
      isShowOrder: false,
      isCheck: false,
      isShowHygxy: false,
      isShowGpfwxy: false,
      isShowAddBuyer: false,
      isShowDelete: false,
      buyerInfo: {},
      deletePopInfo: {
        content: "确认删除信息？",
        btn1: "残忍删除",
        btn2: "不删了",
        img: 0
      },
      active: 0,
      toptips:
        "购票即表示同意以下内容：本人未被确诊为新冠肺炎或疑似病例，未接触过新冠肺炎确诊或疑似患者，最近14天未去过疫情中/高风险地区；当日如有发热、咳嗽、胸闷、乏力等症状不会到现场参观。本人对以上所提供的健康相关信息真实性负责，如提供信息不实，由此引发的一切后果自负，愿承担由此带来的法律责任。"
    };
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
    pay() {
      if (this.isCheck) {
        let timestamp = new Date().getTime();
        if (this.orderInfo.buyer_info != "") {
          let b = this.buyerInfo[this.active];
          let info = [{ id: b.id, uid: b.uid }];
          this.$http({
            url: "/bili/ticket/order/createV2",
            method: "POST",
            data: qs.stringify({
              project_id: this.orderInfo.project_id,
              screen_id: this.orderInfo.screen_id,
              sku_id: this.orderInfo.ticket_info.sku_id,
              count: this.orderInfo.count,
              pay_money: this.orderInfo.pay_money,
              order_type: this.orderInfo.order_type,
              timestamp: timestamp,
              buyer_info: JSON.stringify(info)
            })
          }).then(res => {
            this.$toast(
              "已创建订单,2s后跳转订单中心 //未做支付// " + res.data.msg
            );
            setTimeout(() => {
              this.$router.push("/ordercenter");
            }, 2000);
          });
        } else {
          this.$http({
            url: "/bili/ticket/order/createV2",
            method: "POST",
            data: qs.stringify({
              project_id: this.orderInfo.project_id,
              screen_id: this.orderInfo.screen_id,
              sku_id: this.orderInfo.ticket_info.sku_id,
              count: this.orderInfo.count,
              pay_money: this.orderInfo.pay_money,
              order_type: this.orderInfo.order_type,
              timestamp: timestamp
            })
          }).then(res => {
            this.$toast(
              "已创建订单,2s后跳转订单中心 //未做支付// " + res.data.msg
            );
            setTimeout(() => {
              this.$router.push("/ordercenter");
            }, 2000);
          });
        }
      } else {
        this.$toast("请先阅读并同意订票服务条款");
        return null;
      }
    },
    add() {
      this.isShowAddBuyer = true;
    },
    edit(item) {
      this.title = "编辑购买人";
      this.buyer.id = item.id;
      this.buyer.name = item.name;
      this.buyer.phone = item.tel;
      this.buyer.id_type = item.id_type + "";
      this.buyer.personal_id = item.personal_id;
      if (item.is_default) {
        this.buyer.is_default = true;
      } else {
        this.buyer.is_default = false;
      }
      this.isShowAddBuyer = true;
    },
    deleted(item) {
      this.isShowDelete = true;
      this.buyer.id = item.id;
    },
    deleted1() {
      this.$http({
        url: "/bili/ticket/buyer/delete",
        method: "POST",
        data: qs.stringify({
          id: this.buyer.id
        })
      }).then(res => {
        this.isShowDelete = false;
        this.update();
      });
    },
    update() {
      this.$http.get("/bili/ticket/buyer/list?is_default").then(res => {
        this.buyerInfo = res.data.data.list;
      });
    }
  },
  created() {
    this.$http
      .get("/bili/ticket/order/confirmInfo?token=" + this.$route.query.token)
      .then(res => {
        this.orderInfo = res.data.data;
        this.isShowOrder = true;
        if (this.orderInfo.buyer_info != "") {
          this.$http.get("/bili/ticket/buyer/list?is_default").then(res => {
            this.buyerInfo = res.data.data.list;
          });
        }
      });
  },
  components: {
    navs,
    footers,
    hygxy,
    gpfwxy,
    addBuyer,
    deletePop
  }
};
</script>

<style lang="less" scoped>
.order-info-box {
  display: flex;
  width: 1160px;
  margin: 0 auto;
  .order-info {
    width: 100%;
    padding: 15px 40px 40px;
    margin: 40px 0;
    box-sizing: border-box;
    box-shadow: 0 0 2px 0 #cbd0d8;
    border-radius: 4px;
    background: #fff;
    .top-tips {
      background-color: #fff1d3;
      padding: 6px 12px;
      color: #e78b1f;
      margin-bottom: 4px;
      font-size: 12px;
    }
    h1 {
      font-weight: 400;
      font-size: 22px;
      line-height: 52px;
      color: #222;
    }
    .project-info {
      margin-bottom: 20px;
      border-bottom: 1px dashed #e7e7e7;
      table {
        tbody {
          tr {
            display: flex;
            display: -webkit-flex;
            justify-content: space-between;
            width: 1080px;
            padding-right: 15px;
            font-size: 12px;
            color: #222;
            box-sizing: border-box;
            th {
              padding: 15px 0;
              line-height: 24px;
              font-size: 14px;
              font-weight: 400;
              color: #6d757a;
              &:first-child {
                width: 310px;
              }
              &:nth-child(2) {
                text-align: left;
                width: 290px;
              }
              &:nth-child(3) {
                text-align: right;
                width: 115px;
              }
              &:last-child {
                text-align: right;
                width: 115px;
              }
            }
            &:first-child {
              background: #f4f5f7;
            }
            td {
              padding: 15px 0;
              text-align: right;
              &:first-child {
                padding-left: 15px;
                text-align: left;
                width: 295px;
              }
              &:nth-child(2) {
                text-align: left;
                width: 290px;
              }
              &:nth-child(3) {
                text-align: right;
                width: 115px;
              }
              &:last-child {
                text-align: right;
                width: 115px;
              }
              .detail-info {
                .info-left {
                  float: left;
                  width: 86px;
                  height: 114px;
                  margin: 5px 0;
                  img {
                    display: block;
                    width: 100%;
                    height: 100%;
                  }
                }
                .info-right {
                  padding: 5px 5px 5px 96px;
                  h1 {
                    max-height: 40px;
                    margin-bottom: 15px;
                    font-weight: 400;
                    overflow: hidden;
                    line-height: 20px;
                    font-size: 14px;
                    color: #222;
                  }
                  p {
                    font-size: 12px;
                    color: #6d757a;
                  }
                  .ticket-name {
                    white-space: nowrap;
                    span {
                      margin-right: 4px;
                    }
                  }
                  .ticket-type {
                    margin-top: 15px;
                    font-size: 14px;
                    color: #fb7299;
                    span {
                      float: left;
                      width: 15px;
                      height: 18px;
                      margin-right: 5px;
                      background: url(data:image/png;base64,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)
                        50% no-repeat;
                      background-size: contain;
                    }
                    .ticket {
                      background: url(data:image/png;base64,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)
                        50% no-repeat;
                      background-size: contain;
                    }
                  }
                }
              }
            }
            .total {
              font-size: 16px;
              color: #fb7299;
              p {
                &:last-child {
                  font-size: 12px;
                }
              }
            }
          }
          .through-ticket {
            line-height: 40px;
            font-size: 12px;
            color: #6d757a;
            p {
              width: 980px;
              margin-left: 96px;
              border-top: 1px dashed #e7e7e7;
            }
          }
        }
      }
    }
    .discounts {
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      border-bottom: 1px solid #e7e7e7;
      margin-bottom: 15px;
      .discounts-list {
        position: relative;
        p {
          position: relative;
          width: 300px;
          height: 42px;
          padding: 0 33px 0 15px;
          margin: 0 0 20px;
          color: #222;
          font-size: 14px;
          line-height: 42px;
          border: 1px solid #e7e7e7;
          border-radius: 4px;
          cursor: default;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .buyer-block {
      display: block;
      position: relative;
      .buyer-info-title {
        height: 18px;
        line-height: 18px;
        padding: 17px 0;
        font-weight: 0;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        .buyer-title-text {
          height: 18px;
          position: relative;
          display: block;
          font-size: 18px;
          font-weight: 700;
        }
        .buyer-tip {
          flex: 1 1;
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          margin-left: 9px;
          position: relative;
          .icon-buyer-tip {
            width: 14px;
            height: 14px;
            display: inline-block;
            background-color: transparent;
            background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNfZ2VuZXJhbF9pbmZvcm0gI0U3OEIxRjwvdGl0bGU+CiAgICA8ZyBpZD0iUGFnZS0yIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i546w6LSnL+WFqOasvumihOWUri1jb3B5LTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNTUuMDAwMDAwLCAtNTQyLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5Mi4wMDAwMDAsIDUzOC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJpY19nZW5lcmFsX2luZm9ybS0jRTc4QjFGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2Mi4wMDAwMDAsIDMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMiIgeD0iMCIgeT0iMCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zLjg0NjcsMTMgQzQuOTcyNywxMy45MzcgNi40MjA3LDE0LjUgNy45OTk3LDE0LjUgQzExLjU4OTcsMTQuNSAxNC40OTk3LDExLjU5IDE0LjQ5OTcsOCBDMTQuNDk5Nyw0LjQxIDExLjU4OTcsMS41IDcuOTk5NywxLjUgQzQuNDA5NywxLjUgMS40OTk3LDQuNDEgMS40OTk3LDggQzEuNDk5Nyw5LjA4MiAxLjc2NDcsMTAuMTAzIDIuMjMyNywxMSIgaWQ9IlN0cm9rZS0xIiBzdHJva2U9IiNFNzhCMUYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOSw1IEM5LDUuNTUyIDguNTUyLDYgOCw2IEM3LjQ0OCw2IDcsNS41NTIgNyw1IEM3LDQuNDQ4IDcuNDQ4LDQgOCw0IEM4LjU1Miw0IDksNC40NDggOSw1IiBpZD0iRmlsbC0zIiBmaWxsPSIjRTc4QjFGIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04LDEyIEw4LDEyIEM3LjcyNSwxMiA3LjUsMTEuNzc1IDcuNSwxMS41IEw3LjUsNy41IEM3LjUsNy4yMjUgNy43MjUsNyA4LDcgQzguMjc1LDcgOC41LDcuMjI1IDguNSw3LjUgTDguNSwxMS41IEM4LjUsMTEuNzc1IDguMjc1LDEyIDgsMTIiIGlkPSJGaWxsLTUiIGZpbGw9IiNFNzhCMUYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==);
            margin-right: 4px;
          }
          .buyer-tip-text {
            font-size: 13px;
            height: 14px;
            line-height: 14px;
            color: #e78b1f;
            display: inline-block;
          }
        }
      }
      .card-container {
        max-height: 122px;
        overflow: hidden;
        padding: 10px;
        margin: -10px;
        margin-bottom: 5px;
        .card-item {
          width: 310px;
          height: 122px;
          background-color: #fff;
          border-radius: 3px;
          position: relative;
          float: left;
          padding: 16px;
          box-sizing: border-box;
          overflow: hidden;
          box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
          &::before {
            content: "";
            position: absolute;
            z-index: 5;
            top: 0;
            left: 0;
            width: 200%;
            height: 200%;
            border: 1px solid #d8d8d8;
            box-sizing: border-box;
            transform: scale(0.5);
            transform-origin: top left;
            border-radius: 6px;
          }
          .card-item-empty {
            z-index: 10;
            font-size: 16px;
            height: 16px;
            line-height: 16px;
            max-height: 16px;
            color: #fb7299;
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding-left: 18px;
            -webkit-user-select: none;
            user-select: none;
            &::before {
              content: "";
              background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Q29tYmluZWQgU2hhcGU8L3RpdGxlPgogICAgPGRlZnM+CiAgICAgICAgPHJlY3QgaWQ9InBhdGgtMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjMxMCIgaGVpZ2h0PSIxMjIiIHJ4PSIzIj48L3JlY3Q+CiAgICAgICAgPGZpbHRlciB4PSItMy4yJSIgeT0iLTYuNiUiIHdpZHRoPSIxMDYuNSUiIGhlaWdodD0iMTE2LjQlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItMiI+CiAgICAgICAgICAgIDxmZU1vcnBob2xvZ3kgcmFkaXVzPSIxIiBvcGVyYXRvcj0iZGlsYXRlIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93U3ByZWFkT3V0ZXIxIj48L2ZlTW9ycGhvbG9neT4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMiIgaW49InNoYWRvd1NwcmVhZE91dGVyMSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjIiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICAgICAgPGZlQ29tcG9zaXRlIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0ib3V0IiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb21wb3NpdGU+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwICAgMCAwIDAgMCAwICAgMCAwIDAgMCAwICAwIDAgMCAwLjAzIDAiIHR5cGU9Im1hdHJpeCIgaW49InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb2xvck1hdHJpeD4KICAgICAgICA8L2ZpbHRlcj4KICAgICAgICA8bWFzayBpZD0ibWFzay0zIiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjMxMCIgaGVpZ2h0PSIxMjIiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICA8L21hc2s+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0yIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNDkuMDAwMDAwLCAtMzQ3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTYtQ29weSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDMuMDAwMDAwLCAyOTMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iUmVjdGFuZ2xlLUNvcHktMiIgc3Ryb2tlLWxpbmVqb2luPSJiZXZlbCIgc3Ryb2tlLWRhc2hhcnJheT0iMTAiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgICAgICAgICAgPHVzZSBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIxIiBmaWx0ZXI9InVybCgjZmlsdGVyLTIpIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8dXNlIHN0cm9rZT0iI0ZCNzI5OSIgbWFzaz0idXJsKCNtYXNrLTMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9IiNGRkZGRkYiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMDYuMDAwMDAwLCA1My4wMDAwMDApIiBmaWxsPSIjRkI3Mjk5Ij4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0idXBsb2FkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTcsMCBDNy41NTIyODQ3NSwwIDgsMC40NDc3MTUyNSA4LDEgTDgsNiBMMTMsNiBDMTMuNTUyMjg0Nyw2IDE0LDYuNDQ3NzE1MjUgMTQsNyBDMTQsNy41NTIyODQ3NSAxMy41NTIyODQ3LDggMTMsOCBMOCw4IEw4LDEzIEM4LDEzLjU1MjI4NDcgNy41NTIyODQ3NSwxNCA3LDE0IEM2LjQ0NzcxNTI1LDE0IDYsMTMuNTUyMjg0NyA2LDEzIEw2LDggTDEsOCBDMC40NDc3MTUyNSw4IDYuNzYzNTM3NTFlLTE3LDcuNTUyMjg0NzUgMCw3IEMtNi43NjM1Mzc1MWUtMTcsNi40NDc3MTUyNSAwLjQ0NzcxNTI1LDYgMSw2IEw2LDYgTDYsMSBDNiwwLjQ0NzcxNTI1IDYuNDQ3NzE1MjUsMCA3LDAgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
              position: absolute;
              top: 1px;
              left: 0;
              width: 14px;
              height: 14px;
            }
          }
          .card-item-content {
            position: relative;
            z-index: 10;
            .name {
              color: #212121;
              font-size: 14px;
              line-height: 14px;
              height: 14px;
              max-height: 14px;
              font-weight: 700;
            }
            .info-block {
              margin-top: 13px;
              .info-row {
                font-size: 12px;
                min-height: 16px;
                line-height: 16px;
                max-height: 32px;
                display: flex;
                flex-direction: row;
                font-weight: 300;
                font-family: -apple-system, BlinkMacSystemFont, Segoe UI,
                  Helvetica, Arial, sans-serif;
                .item-property {
                  color: #999;
                  font-weight: 400;
                  white-space: nowrap;
                  flex-shrink: 0;
                  text-align: right;
                }
                .item-value-cell {
                  padding-left: 6px;
                }
              }
            }
            .info-table {
              display: table;
              .info-row {
                display: table-row;
                .info-cell {
                  display: table-cell;
                }
              }
            }
          }
          .control-btn {
            display: block;
            position: absolute;
            left: 19px;
            bottom: 12px;
            height: 12px;
            line-height: 12px;
            max-height: 12px;
            z-index: 5;
            font-size: 0;
            .hover {
              transition: opacity 0.1s ease-out;
              opacity: 0;
            }
            span {
              font-size: 12px;
              vertical-align: bottom;
              color: #498ede;
              display: inline-block;
              cursor: pointer;
            }
            span + span {
              margin-left: 16px;
            }
          }
          .icon-tag-default {
            font-style: normal;
            width: 32px;
            height: 16px;
            display: block;
            position: absolute;
            background-color: #faf;
            background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMzIgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+dGFnX+m7mOiupDwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8cmVjdCBpZD0icGF0aC0xIiB4PSIwIiB5PSIwIiB3aWR0aD0iMzEwIiBoZWlnaHQ9IjEyMiIgcng9IjMiPjwvcmVjdD4KICAgICAgICA8ZmlsdGVyIHg9Ii0zLjIlIiB5PSItNi42JSIgd2lkdGg9IjEwNi41JSIgaGVpZ2h0PSIxMTYuNCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImZpbHRlci0zIj4KICAgICAgICAgICAgPGZlTW9ycGhvbG9neSByYWRpdXM9IjEiIG9wZXJhdG9yPSJkaWxhdGUiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dTcHJlYWRPdXRlcjEiPjwvZmVNb3JwaG9sb2d5PgogICAgICAgICAgICA8ZmVPZmZzZXQgZHg9IjAiIGR5PSIyIiBpbj0ic2hhZG93U3ByZWFkT3V0ZXIxIiByZXN1bHQ9InNoYWRvd09mZnNldE91dGVyMSI+PC9mZU9mZnNldD4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgICAgICA8ZmVDb21wb3NpdGUgaW49InNoYWRvd0JsdXJPdXRlcjEiIGluMj0iU291cmNlQWxwaGEiIG9wZXJhdG9yPSJvdXQiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUNvbXBvc2l0ZT4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMDYgMCIgdHlwZT0ibWF0cml4IiBpbj0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgIDwvZmlsdGVyPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMTAwJSIgeTE9IjUwJSIgeDI9IjAlIiB5Mj0iNTAlIiBpZD0ibGluZWFyR3JhZGllbnQtNCI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiM2QzZDNkMiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzRDNEM0QyIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjEwMCUiIHkxPSI1MCUiIHgyPSIwJSIgeTI9IjUwJSIgaWQ9ImxpbmVhckdyYWRpZW50LTUiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNkM2QzZDIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiM0QzRDNEMiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0yIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMDYuMDAwMDAwLCAtMTE5LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzLjAwMDAwMCwgMTA1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9ImZvbGxvd2VkLSNmZjU2ODciPgogICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPSJtYXNrLTIiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8L21hc2s+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ik1hc2siIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMSIgZmlsdGVyPSJ1cmwoI2ZpbHRlci0zKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IHN0cm9rZT0iI0ZGQjRDQSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1saW5lam9pbj0ic3F1YXJlIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHg9IjAuMjUiIHk9IjAuMjUiIHdpZHRoPSIzMDkuNSIgaGVpZ2h0PSIxMjEuNSIgcng9IjMiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPGcgaWQ9InRhZ1/pu5jorqQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwNi4wMDAwMDAsIDExOS4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC42NTgsOS40MjMgTDEwLjY1OCwxMC4yMjYgQzkuNjQ2LDEwLjMzNiA3Ljk4NSwxMC40MjQgNS42NjQsMTAuNTAxIEw1LjU0Myw5LjYzMiBDNi4yOTEsOS42MjEgNi45ODQsOS42MSA3LjYyMiw5LjU4OCBMNy42MjIsOC44NTEgTDUuNzA4LDguODUxIEw1LjcwOCw4LjAxNSBMNy42MjIsOC4wMTUgTDcuNjIyLDcuMyBMNS42MzEsNy4zIEw1LjYzMSwzLjIxOSBMMTAuNTkyLDMuMjE5IEwxMC41OTIsNy4zIEw4LjU0Niw3LjMgTDguNTQ2LDguMDE1IEwxMC40ODIsOC4wMTUgTDEwLjQ4Miw4Ljg1MSBMOC41NDYsOC44NTEgTDguNTQ2LDkuNTU1IEM5LjM2LDkuNTExIDEwLjA2NCw5LjQ2NyAxMC42NTgsOS40MjMgWiBNNS43OTYsMTAuODIgTDYuNjU0LDEwLjkxOSBDNi41OTksMTEuNzMzIDYuNDY3LDEyLjQ1OSA2LjI0NywxMy4wOTcgTDUuNCwxMi44MjIgQzUuNjA5LDEyLjIzOSA1Ljc0MSwxMS41NjggNS43OTYsMTAuODIgWiBNNy43OTgsMTAuOTA4IEM3LjkwOCwxMS4zNyA3Ljk4NSwxMi4wMTkgOC4wMjksMTIuODMzIEw3LjE2LDEyLjk0MyBDNy4xMzgsMTIuMTA3IDcuMDgzLDExLjQ1OCA3LjAwNiwxMC45OTYgTDcuNzk4LDEwLjkwOCBaIE0xMC4yMTgsMTAuNjU1IEMxMC40MzgsMTEuMTcyIDEwLjYyNSwxMS42NTYgMTAuNzU3LDEyLjA5NiBDMTEuNjM3LDEwLjUyMyAxMi4xNDMsOC43NDEgMTIuMjk3LDYuNzYxIEwxMS4wMSw2Ljc2MSBMMTEuMDEsNS43NiBMMTIuMzQxLDUuNzYgQzEyLjM2Myw0LjUxNyAxMi4zNzQsMy41NiAxMi4zNzQsMi45IEwxMy4zNzUsMi45IEMxMy4zNzUsMy42NyAxMy4zNjQsNC42MjcgMTMuMzY0LDUuNzYgTDE1LjIwMSw1Ljc2IEwxNS4yMDEsNi43NjEgTDEzLjQwOCw2Ljc2MSBDMTMuNzcxLDkuMTM3IDE0LjQ5NywxMC45NzQgMTUuNTc1LDEyLjI3MiBMMTQuODYsMTMuMDY0IEMxMy45OCwxMS44NzYgMTMuMzUzLDEwLjQ0NiAxMy4wMDEsOC43NjMgQzEyLjYyNywxMC40NzkgMTIuMDU1LDExLjkwOSAxMS4yODUsMTMuMDc1IEwxMC42OTEsMTIuNDA0IEwxMC4wODYsMTIuNjM1IEM5LjkzMiwxMi4wMTkgOS43MzQsMTEuNDI1IDkuNTAzLDEwLjg1MyBMMTAuMjE4LDEwLjY1NSBaIE05LjAxOSwxMC43NzYgQzkuMjA2LDExLjI5MyA5LjM3MSwxMS44ODcgOS41MjUsMTIuNTU4IEw4LjcsMTIuNzY3IEM4LjU3OSwxMi4xNjIgOC40MzYsMTEuNTc5IDguMjcxLDExLjAwNyBMOS4wMTksMTAuNzc2IFogTTE0LjMxLDMuMTk3IEMxNC43NjEsMy44MTMgMTUuMTEzLDQuMzYzIDE1LjM1NSw0LjgzNiBMMTQuNjI5LDUuMzUzIEMxNC4zNzYsNC44MzYgMTQuMDM1LDQuMjY0IDEzLjYwNiwzLjYzNyBMMTQuMzEsMy4xOTcgWiBNOS43NjcsNi41MDggTDkuNzY3LDQuMDExIEw4LjQ2OSw0LjAxMSBMOC40NjksNi41MDggTDkuNzY3LDYuNTA4IFogTTcuNzMyLDYuNTA4IEw3LjczMiw0LjAxMSBMNi40NTYsNC4wMTEgTDYuNDU2LDYuNTA4IEw3LjczMiw2LjUwOCBaIE04Ljk5Nyw0LjQ5NSBMOS41MTQsNC42MjcgQzkuNDU5LDUuMTU1IDkuMzQ5LDUuNjYxIDkuMTg0LDYuMTU2IEw4LjY3OCw1Ljk5MSBDOC44MzIsNS41MTggOC45MzEsNS4wMjMgOC45OTcsNC40OTUgWiBNNy4xMzgsNC41MjggQzcuMjkyLDQuOTY4IDcuNDI0LDUuNDYzIDcuNTM0LDYuMDI0IEw3LjAzOSw2LjE1NiBDNi45MjksNS42NSA2Ljc4Niw1LjE1NSA2LjYzMiw0LjY4MiBMNy4xMzgsNC41MjggWiBNMjIuNzE0LDIuOTQ0IEwyMy43NywyLjk0NCBDMjMuNzcsMy44OSAyMy43MzcsNC43ODEgMjMuNjcxLDUuNTk1IEMyNC4yNDMsOC4zMDEgMjUuMjMzLDEwLjQ1NyAyNi42NDEsMTIuMDYzIEwyNS44OTMsMTIuOTQzIEMyNC44MDQsMTEuNTM1IDIzLjk2OCw5Ljg0MSAyMy4zNzQsNy44NjEgTDIzLjI4Niw4LjI5IEMyMi44OSwxMC4xODIgMjEuOTU1LDExLjczMyAyMC40ODEsMTIuOTY1IEwxOS43NzcsMTIuMTA3IEMyMS4wMzEsMTEuMDI5IDIxLjg0NSw5LjY5OCAyMi4yNDEsOC4xMTQgQzIyLjU0OSw2Ljc4MyAyMi43MDMsNS4wNTYgMjIuNzE0LDIuOTQ0IFogTTE3Ljg0MSwyLjk1NSBDMTguNTU2LDMuNDk0IDE5LjE2MSw0LjAzMyAxOS42NTYsNC41ODMgTDE4Ljk0MSw1LjMwOSBDMTguNTAxLDQuNzkyIDE3Ljg5Niw0LjI0MiAxNy4xMTUsMy42NyBMMTcuODQxLDIuOTU1IFogTTE2LjM4OSw2LjE0NSBMMTguOTMsNi4xNDUgTDE4LjkzLDEwLjc0MyBDMTkuMjcxLDEwLjQ1NyAxOS42MzQsMTAuMTI3IDIwLjAzLDkuNzUzIEwyMC4yOTQsMTAuODMxIEMxOS41OSwxMS40OCAxOC44NDIsMTIuMDYzIDE4LjAzOSwxMi41OTEgTDE3LjY0MywxMS42NTYgQzE3LjgzLDExLjUwMiAxNy45MjksMTEuMzE1IDE3LjkyOSwxMS4wODQgTDE3LjkyOSw3LjE0NiBMMTYuMzg5LDcuMTQ2IEwxNi4zODksNi4xNDUgWiIgaWQ9Ium7mOiupCIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC00KSIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTEwIiBzdHJva2U9InVybCgjbGluZWFyR3JhZGllbnQtNSkiIHN0cm9rZS13aWR0aD0iMC41IiB4PSIwLjI1IiB5PSIwLjc1IiB3aWR0aD0iMzEuNSIgaGVpZ2h0PSIxNC41IiByeD0iMiI+PC9yZWN0PgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
            right: 15px;
            top: 14px;
          }
          .icon-checked {
            z-index: 1;
            display: block;
            background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzJweCIgaGVpZ2h0PSI0NnB4IiB2aWV3Qm94PSIwIDAgNzIgNDYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Zm9sbG93ZWQgI2ZmNTY4NzwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8cmVjdCBpZD0icGF0aC0xIiB4PSIwIiB5PSIwIiB3aWR0aD0iMzEwIiBoZWlnaHQ9IjEyMiIgcng9IjMiPjwvcmVjdD4KICAgICAgICA8ZmlsdGVyIHg9Ii0zLjIlIiB5PSItNi42JSIgd2lkdGg9IjEwNi41JSIgaGVpZ2h0PSIxMTYuNCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImZpbHRlci0zIj4KICAgICAgICAgICAgPGZlTW9ycGhvbG9neSByYWRpdXM9IjEiIG9wZXJhdG9yPSJkaWxhdGUiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dTcHJlYWRPdXRlcjEiPjwvZmVNb3JwaG9sb2d5PgogICAgICAgICAgICA8ZmVPZmZzZXQgZHg9IjAiIGR5PSIyIiBpbj0ic2hhZG93U3ByZWFkT3V0ZXIxIiByZXN1bHQ9InNoYWRvd09mZnNldE91dGVyMSI+PC9mZU9mZnNldD4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgICAgICA8ZmVDb21wb3NpdGUgaW49InNoYWRvd0JsdXJPdXRlcjEiIGluMj0iU291cmNlQWxwaGEiIG9wZXJhdG9yPSJvdXQiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUNvbXBvc2l0ZT4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMDYgMCIgdHlwZT0ibWF0cml4IiBpbj0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkFydGJvYXJkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjU1LjAwMDAwMCwgLTE1Ny4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0My4wMDAwMDAsIDEwNS4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJmb2xsb3dlZC0jZmY1Njg3Ij4KICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJNYXNrIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICAgICAgICAgICAgICA8dXNlIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjEiIGZpbHRlcj0idXJsKCNmaWx0ZXItMykiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBzdHJva2U9IiNGRkI0Q0EiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbGluZWpvaW49InNxdWFyZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJldmVub2RkIiB4PSIwLjI1IiB5PSIwLjI1IiB3aWR0aD0iMzA5LjUiIGhlaWdodD0iMTIxLjUiIHJ4PSIzIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDxnIG1hc2s9InVybCgjbWFzay0yKSIgaWQ9IlN0cm9rZS0yIiBzdHJva2U9IiNGRjU2ODciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSI4Ij4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjE2LjAwMDAwMCwgNTYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMCwxMi42NjY2NjY3IEwyNC4xOTMyMSwzNi42MDc4NjQgQzI0Ljk3MjUzMDEsMzcuMzc5MDY2MyAyNi4yMjc0Njk5LDM3LjM3OTA2NjMgMjcuMDA2NzksMzYuNjA3ODY0IEw2NCwwIEw2NCwwIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==);
            width: 72px;
            height: 46px;
            position: absolute;
            right: -2px;
            bottom: -2px;
          }
          &:hover {
            .control-btn {
              .hover {
                opacity: 1;
              }
            }
          }
        }
        .checked {
          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 200%;
            border: 1px solid #ffb4ca;
            box-sizing: border-box;
            transform: scale(0.5);
            transform-origin: top left;
          }
        }
        .user-item {
          margin: 0 25px 15px 0;
        }
        .empty {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAAB6CAYAAAA1UX8KAAAACXBIWXMAAAsSAAALEgHS3X78AAAFPklEQVR4Xu3dsYodBRgF4JlBWFyDrI2vINhELGzs18JHsPABfAYr8QXEZxAUSxutjBZaiVamNdGAN8myLlxZMNxxt7C7MGOXOedLJw7LnO9cD3gX8o/DMLxwfX19fnJy8vH8zU9v3Pzz4p/x/M3FZ24fuPl5q57z844z8Tvu4vPi83JsX+ar/e7w4PG9Dz77+r1xv9+/e3p6+tWqBfIQAQIEnmeBR0+Hf7649/l4OBx+Hsfx7vP8rt6NAAECawUOX36/m4zaWi7PESCwBYHx5ZdeHeebP1t4We9IgACBVQK/PxkM2yopDxEgsCWBafhrv6X39a4ECBBYFJgOP95ffMgDBAgQ2JLAtKWX9a4ECBBYI2DY1ih5hgCBTQkYtk3V5WUJEFgjYNjWKHmGAIFNCRi2TdXlZQkQWCNg2NYoeYYAgU0JGLZN1eVlCRBYEpjvPxwM25KSf0+AwLYEHjwepvGVO9t6aW9LgACBBYFpfOs1SAQIEIgS8L+iUXUKQ4DArYBh8zkgQCBOwLDFVSoQAQKGzWeAAIE4AcMWV6lABAgYNp8BAgTiBPzV4HGVCkSgXMDNg/IPgPgEQgXcPAgtViwCzQJuHjS3LzuBUAG/PAgtViwCzQKGrbl92QmEChi20GLFItAsYNia25edQKiAYQstViwCzQKGrbl92QmEChi20GLFItAq4OZBa/NyE0gWcPMguV3ZCPQKuHnQ273kBGIFfMcWW61gBHoFDFtv95ITiBUwbLHVCkagV8Cw9XYvOYFYAcMWW61gBHoFDFtv95ITiBVw8yC2WsEIlAq4eVBavNgEwgXcPAgvWDwCjQJuHjS2LjOBcAG/PAgvWDwCjQKGrbF1mQmECxi28ILFI9AoYNgaW5eZQLiAYQsvWDwCjQKGrbF1mQmECxi28ILFI9Am4OZBW+PyEmgQcPOgoWUZCfQJuHnQ17nEBOIFfMcWX7GABPoEDFtf5xITiBcwbPEVC0igT8Cw9XUuMYF4AcMWX7GABPoEDFtf5xITiBdw8yC+YgEJlAm4eVBWuLgESgTcPCgpWkwCTQJuHjS1LSuBEgG/PCgpWkwCTQKGraltWQmUCBi2kqLFJNAkYNia2paVQImAYSspWkwCTQKGraltWQmUCBi2kqLFJNAi4OZBS9NyEmgScPOgqW1ZCfQIuHnQ07WkBGoEfMdWU7WgBHoEDFtP15ISqBEwbDVVC0qgR8Cw9XQtKYEaAcNWU7WgBHoEDFtP15ISqBFw86CmakEJlAi4eVBStJgEygTcPCgrXFwCDQJuHjS0LCOBMgG/PCgrXFwCDQKGraFlGQmUCRi2ssLFJdAgYNgaWpaRQJmAYSsrXFwCDQKGraFlGQmUCRi2ssLFJZAu4OZBesPyEWgUcPOgsXWZCeQLuHmQ37GEBOoEfMdWV7nABPIFDFt+xxISqBMwbHWVC0wgX8Cw5XcsIYE6AcNWV7nABPIFDFt+xxISqBNw86CucoEJhAu4eRBesHgESgXcPCgtXmwCyQJuHiS3KxuBUgG/PCgtXmwCyQKGLbld2QiUChi20uLFJpAsYNiS25WNQKmAYSstXmwCyQKGLbld2QiUChi20uLFJpAq4OZBarNyEWgWcPOguX3ZCeQKuHmQ261kBGoFfMdWW73gBHIFpnmef8mNJxkBAm0C89V+N11eXn7YFlxeAgRCBR49HZ799ud34028k4uLi/Ozs7OPxnG8+1/c+Ydfh/nq78X009uvD8OdFxef8/OOE/E77uLz4vNyK/C//vv448nu2cPdt+988un7/wLzATxT1XWY0QAAAABJRU5ErkJggg==);
          &::before {
            border: none;
          }
        }
        .add {
          cursor: pointer;
        }
      }
    }
    .total-container {
      margin-top: 30px;
      background: #f4f5f7;
      padding: 20px 15px 5px;
      div {
        text-align: right;
        margin-bottom: 15px;
        font-size: 14px;
        line-height: 16px;
        color: #6d757a;
        span {
          float: right;
          min-width: 130px;
          color: #222;
        }
        .total {
          line-height: 22px;
          font-size: 22px;
          color: #ff66a2;
        }
      }
    }
    .bottom-confirm {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      .service-term {
        margin: 10px 0;
        font-size: 12px;
        line-height: 18px;
        color: #666;
        .icon-check {
          float: left;
          width: 12px;
          height: 12px;
          margin: 3px 5px 3px 0;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAE9JREFUSA1j/F008z8DDQETDc0GG80Cs4C1L50RxqYGDQsZmvtg1AKC0TUaRKNBRDAECCoYTUWjQUQwBAgqGE1FBIOIEVZ3ElRJpgKaxwEA40oKO+qdXicAAAAASUVORK5CYII=)
            50% no-repeat;
          background-size: contain;
          cursor: pointer;
        }
        .checked {
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAUtJREFUSA1j/F008z8DDQETDc0GG80Cs4C1L50RxqYGDQsZmvtg1AJwdP2vmi3+v2S2Hra4oziI/pfOMvj74/+1v//+nflfsogb3RKKLAAb/pdh73+G/0IMDIybGHvivlLNAmTDGRkYNzKr/49ENxzEx+qD/5O2sWNTDBPDYngoY3r6b5g8Mo1hwZ+S2cl/Hzz++Ld4Vi6yQhibFMNBejAsYPj3/yUwPNn+/f8/6W/JzDyYwSCaVMNBejAsYOlL28LI9D8TGK7///1jmAizhBzDsVoAEmTuSZ+JYknxzM6/0NQCjVCcYQ7SjwwwfACTRLHkP0MZKCmSajjILJwWgCShlrQAi9n/TAxMV4BJkWiXg/SDAF4LQAqAltQx/2WSZO5L1cWVFEHqcAGCFoA0Mk5MBaYs8gBRFpBnNETX0LeAEVZ3UhIM+PTSPIgAdAmkO9XVxCoAAAAASUVORK5CYII=)
            50% no-repeat;
          background-size: contain;
        }
        .term-content {
          color: #ff5678;
          cursor: pointer;
        }
      }
      .confirm-paybtn {
        width: 240px;
        height: 50px;
        font-size: 18px;
        color: #99a2aa;
        cursor: not-allowed;
        line-height: 50px;
        text-align: center;
        background: #e4eaef;
        border-radius: 4px;
      }
      .active {
        color: #fff;
        background-image: linear-gradient(-48deg, #fe8574, #ff6a9c);
        box-shadow: 0 3px 4px 0 #fdb8cc;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}
.clearFloat {
  &::after {
    content: "";
    clear: both;
    visibility: hidden;
    font-size: 0;
    width: 0;
    height: 0;
  }
}
</style>