<template>
  <div v-if="showDeatil">
    <navs @search="search" v-model="inputValue" @getInputValue="getInputValue"></navs>
    <div class="order-detail-box">
      <div class="order-detail-nav">
        <span @click="toOrdercenter">订单中心</span>
        <span>></span>
        <span>订单详情</span>
      </div>
      <div class="order-detail-content">
        <div class="order-detail-status">
          <h1 v-text="orderDetail.pay_remain_time>0&&orderDetail.sub_status==1?'待支付':'已取消'"></h1>
          <div class="status-text">
            <div v-if="orderDetail.pay_remain_time>0&&orderDetail.sub_status==1">
              订单已提交，请在
              <van-count-down
                style="color:#f25d8e;display:inline-block;"
                format="mm:ss"
                :time="orderDetail.pay_remain_time*1000"
              />内完成付款，超时将自动取消订单
            </div>
          </div>
          <div class="clearFloat">
            <div
              class="pay-btn"
              v-if="orderDetail.pay_remain_time>0&&orderDetail.sub_status==1"
              @click="$toast('没有支付功能哦~')"
            >立即支付</div>
            <div
              class="pay-btn cancel-btn"
              v-if="orderDetail.pay_remain_time>0&&orderDetail.sub_status==1"
              @click="isShowDelete1=true"
            >取消订单</div>
            <div class="refund-btn" v-if="orderDetail.sub_status!=1">
              <div @click="isShowDelete = true">删除订单</div>
            </div>
          </div>
        </div>
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
                      <img :src="orderDetail.img.url" />
                    </div>
                    <div class="info-right">
                      <h1>{{orderDetail.item_info.name}}</h1>
                      <p>{{orderDetail.item_info.venue_name}}</p>
                      <p class="ticket-name">
                        <span
                          :title="orderDetail.item_info.screen_name"
                        >{{orderDetail.item_info.screen_name}}</span>
                      </p>
                      <div
                        class="ticket-type clearFloat"
                        v-if="orderDetail.item_info.ticket_type==1||orderDetail.item_info.ticket_type==2"
                      >
                        <span :class="orderDetail.item_info.ticket_type==1?'ticket':''"></span>
                        {{orderDetail.item_info.ticket_type==1?'纸质票':'电子票'}}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>￥{{orderDetail.ticket_info.price/100}}</div>
                </td>
                <td>
                  <div>×{{orderDetail.count}}</div>
                </td>
                <td>
                  <p>￥{{orderDetail.item_total_money/100}}</p>
                  <p>(不含运费)</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="order-detail-buyer" v-if="orderDetail.buyer_infos!=''">
          <h1>购买人信息</h1>
          <div class="buyer-info">
            <div class="buyer-item-box">
              <div class="buyer-item" v-for="(item,index) in orderDetail.buyer_infos" :key="index">
                <p class="buyer-name">{{item.buyer}}</p>
                <p class="buyer-infos">
                  <span
                    class="buyer-label"
                    v-text="item.id_type==0?'身份证':(item.id_type==1?'护照':(item.id_type==3?'台湾居民来往大陆通行证':'港澳居民来往内地通行证'))"
                  ></span>
                  <span class="buyer-num">{{item.personal_id}}</span>
                </p>
                <p class="buyer-infos tel-info">
                  <span class="buyer-label">手机号</span>
                  <span class="buyer-num">{{item.tel}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="order-detail-buyer">
          <h1>订单信息</h1>
          <div class="buyer-info">
            <p class="order-id-time">
              订单编号：
              <span>{{orderDetail.order_id}}</span>
            </p>
            <p class="order-id-time">
              下单时间：
              <span>{{orderDetail.ctime}}</span>
            </p>
          </div>
        </div>
        <div class="total-content clearFloat">
          <div>
            商品总额
            <span>￥{{orderDetail.item_total_money/100}}</span>
          </div>
          <div>
            应付金额
            <span class="total">￥{{orderDetail.pay_money/100}}</span>
          </div>
        </div>
      </div>
    </div>
    <delete-pop
      v-if="isShowDelete"
      :deletePopInfo="deletePopInfo"
      @submit="deleted1"
      @close="isShowDelete=false"
    ></delete-pop>
    <delete-pop
      v-if="isShowDelete1"
      :deletePopInfo="deletePopInfo1"
      @submit="cancel"
      @close="isShowDelete1=false"
    ></delete-pop>
    <footers></footers>
  </div>
</template>

<script>
import qs from "qs";
import navs from "@/components/nav.vue";
import deletePop from "../components/deletePop.vue";
import footers from "@/components/footer.vue";
export default {
  data() {
    return {
      inputValue: "",
      orderDetail: {},
      showDeatil: false,
      isShowDelete: false,
      isShowDelete1: false,
      deletePopInfo: {
        content: "是否确定删除订单？删除后不可撤销哦",
        btn1: "确定",
        btn2: "取消",
        img: 0
      },
      deletePopInfo1: {
        content: "所选票十分抢手，确认取消该订单？",
        btn1: "残忍取消",
        btn2: "不取消了",
        img: 1
      }
    };
  },
  components: {
    navs,
    deletePop,
    footers
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
    deleted1() {
      this.$http({
        url: "/bili/ticket/order/del",
        method: "POST",
        data: qs.stringify({
          order_id: this.$route.query.order_id
        })
      }).then(res => {
        this.isShowDelete = false;
        setTimeout(() => {
          this.$router.push("/ordercenter");
        }, 1000);
      });
    },
    cancel() {
      this.$http({
        url: "/bili/ticket/order/cancel?order_id=" + this.$route.query.order_id,
        method: "GET"
      }).then(res => {
        this.isShowDelete1 = false;
        this.$router.go(0);
      });
    },
    toOrdercenter() {
      this.$router
        .push({
          path: "/ordercenter"
        })
        .catch(data => {});
    }
  },
  created() {
    this.$http
      .get(
        "/bili/ticket/order/info?order_id=" +
          this.$route.query.order_id +
          "&timestamp=" +
          new Date().getTime()
      )
      .then(res => {
        this.orderDetail = res.data.data;
        this.showDeatil = true;
        console.log(res.data.data);
      });
  }
};
</script>

<style lang="less" scoped>
.order-detail-box {
  width: 1160px;
  height: 100%;
  margin: 30px auto 50px;
  .order-detail-nav {
    overflow: hidden;
    margin-bottom: 10px;
    span {
      font-size: 12px;
      margin-right: 4px;
      &:first-child {
        cursor: pointer;
        color: #6d757a;
      }
    }
  }
  .order-detail-content {
    padding: 30px 40px;
    background: #fff;
    box-shadow: 0 0 2px 0 #cbd0d8;
    border-radius: 4px;
    .order-detail-status {
      margin-bottom: 20px;
      padding: 20px;
      border: 1px solid #e7e7e7;
      h1 {
        font-weight: 400;
        font-size: 18px;
        color: #fb7299;
      }
      .status-text {
        margin: 15px 0 20px;
        font-size: 14px;
        line-height: 14px;
        color: #222;
      }
      .clearFloat {
        &::after {
          display: block;
          content: "";
          clear: both;
          width: 0;
          height: 0;
          visibility: hidden;
          font-size: 0;
        }
        .pay-btn {
          float: left;
          width: 118px;
          height: 40px;
          margin-right: 10px;
          color: #fff;
          font-size: 14px;
          text-align: center;
          line-height: 40px;
          border-radius: 3px;
          border: 1px solid #fb7299;
          background-color: #fb7299;
          cursor: pointer;
        }
        .cancel-btn {
          margin-right: 10px;
          color: #6d757a;
          border: 1px solid #e7e7e7;
          background-color: #fff;
        }
        .refund-btn {
          float: left;
          margin-top: 15px;
          div {
            width: 74px;
            height: 28px;
            margin-right: 10px;
            color: #6d757a;
            font-size: 12px;
            text-align: center;
            line-height: 28px;
            border-radius: 3px;
            border: 1px solid #ccd0d7;
            background-color: #fff;
            cursor: pointer;
            display: inline-block;
          }
        }
      }
    }
    .project-info {
      margin-bottom: 20px;
      tr {
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        width: 1080px;
        padding-right: 15px;
        font-size: 12px;
        color: #222;
        box-sizing: border-box;
        border-left: 1px solid #e7e7e7;
        border-right: 1px solid #e7e7e7;
        &:first-child {
          border: none;
          background: #f4f5f7;
        }
        &:last-child {
          border-bottom: 1px solid #e7e7e7;
        }
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
        td {
          padding: 15px 0;
          text-align: right;
          &:first-child {
            padding-left: 15px;
            text-align: left;
            width: 295px;
          }
          &:nth-child(2) {
            text-align: center;
            width: 290px;
          }
          &:nth-child(3) {
            text-align: right;
            width: 115px;
          }
          &:last-child {
            font-size: 16px;
            color: #fb7299;
            text-align: right;
            width: 115px;
          }
          p {
            &:last-child {
              font-size: 12px;
            }
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
                  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAA2CAYAAABTCxDCAAAAAXNSR0IArs4c6QAACoNJREFUaAXtWn2MVFcVP/e+92Zmd2FLd4Gy2EKDFMuHQJWEImCNWkSbRk1raVIJMZIuoE1hrTGaGNfoH8ZIIUu1XYw2tU38QEMbjNjaUppKuogYaYsFWm3ZUnD7Abgf7O68d+/1d+7sm30z82bem1KNJr2bnXlz37nn/O655+vd+wSVNdPZ6QYD0z4khXOrUmY5CeOWkZDAHxnja/Jvy2778tHy+0m//a90ryAjdxrSJo5WCMoTySeM0Lu8H7T/iaVF6UoADW++96NqwPm2JLFcCimE1KXUYyMFuIIpUSAvw0XdoIUxVzqeN1cHwBbTWClCysVamzvVXTv3DeWDbzR1bTockkJyoeW3dK/LeN4ex3FXGKNFoAJSRkMXrI/Sf6U1mDpQll4Qjq/nG2q7BitVwTeUw3JZPuhcR3qrcpnMo/6W7lWhDAs6f1f3Ukc6P5SGGoPAj9VuOKD4DcbQ2GdhTsWJF+/VuDCd9+fIiE+QVjWoCrcMJhZgNbDmrdKRD4x07JzDd6T53K8coc13pOM0BSkYhZIUNCGlu3K0/7JPhX1pvv2B/Ocd152v6pDFWpeON02S/jrLEPmO+xYJkodgpZ5Jp+MiNqwOVtm8lFeD1zds3/JK8UaViwt33rM062X3QNYUNrF6miMkzFWdc11noTRG3OC6bt2AWSBrS0pntus07jEdP762FoiRzTs/CcC/hoPXDdjKgjm6jnep8tUHXdjLcqpz1lFwgfLBzF2gtX4839H9c+G4u4J8cCyXgTHqbFbpYCEJcRsCwk2ISi4v9dtvAisrFrgwiSs1ZnExzdqcEE2em1lvVLBeONSvlDtijGrEhCZgOYh9oB6ficfD4Vp7JXE6nnCsF54MeygL8+MjNAwV2ub4yqmnGc7dbKQoAGWn4zxSa0U59jtpApGszHbjMCJXLDDrkZg5Fe7qVAJngXmEylf6yIz6RNNbSaxeQvrhA0TnL3D2JGqZSGJSU+VYFoPhNDRK5vVziGfJwJM1DXmUcclZ93ESc2ewiKrNPPsPUj99jKi1mcSiWSSePELmjX4S82aQs/ZjRBMbq46lkTypXU+T+fMJTinV6XAnGbRS0PAUC1gfPEam51jlMjLN8vkkl8whMa0F6X0scbCG8S+XzcNKZUj/Yj+ZoRFoNqpN0MBKnc8sI7lyPqm/vFgTMN9MBs1UY0tmDp0gc+JUpSZ8RIRJE4gAmrJgyWDDxqaTy5A5N0D64HFMCLQloEGIQGCuvbqwErauCQfHf6cDHY5lR+GlK18+Bhk6UQRvOMxOgsGwP7D9lgMz4Mt90ckWB1deRNep8u7/aM+7oP9bC5POptkOubG9Ih7bRGE7xj7YEcOHkJA2et/aKzqYjiNLhU2DMdtzeX+UR+Q6GTSDyBdCmFz1ATKTmxFNypABsFhylRVsLoySaMyOi2Aww+hraSOJsFgIeZHxfB95QLS1kOk7nwp8MmgH5efpN0k//RzJpXNJvLetoPFxWNAQTywgve8IUR+yGk+MG2sfE9QHjpIzaxrJm1cW+uM+Eb/1/mfHxsQRjPehnu4+6ggxjx91qjauORjApYjFYWgrJ+ZlPz+IXsygIUNixhQyL/+zYA4KY5HCxSXV07gZHCY6h/Hl4TQiB8UXBX7QmaxpngynZV5yBl+tsbabkab5m+c/MFzIjuFv5lNjvGjipzAQ/2so0bZrg2ZBKJSc9autzaUN/tXmVbMfgDnbqnt/e5GgeebweP3IM4UUW8uEyhExbcpoYFM7lwr9qAhTjKmtaQYC2eaF3jHbTDAPtsdQKOoNrtwSm408qFkGR8gcP2UjSdKYZNDMAUDE7OmFyBGCinJGH4cyc+Rl1MWw5RlTUcpeT+qhJ2yNbZ2X7ZnHcrjkVWDHhWNRVpK8cSnRm/2kuBhL0ZJBQ5h4z2Ry2m8gYmfk5GK9LcKdgUDLes7lpO9/FA6JKMFhb0JDASCDnI6SdRia5wiDfgFac/Tk+ArWeqqJiOLLZND8CMVPLACsHnyczEtnLMBxPgCEJXZuWkFy/kzSHNZCAAyW/5E83C+uxtjT9iFBLJ5tHwpU18MIi33jrFJeJYMOGaHQp5OvI5YOVMbqUWxhnXmLxPuuGLfpcBx/c2zPeLbYt91hRo0ztei4KtfpQTMDFs5eXv4cF/ZXEWK7Q63Xokl5Dwj+/9q7oItrFqZrrlf+Ay2dTbPD8D9j4H2N8qLJh5OynTMNV4Un+0g98AcyvYgM5bTvwCRSgObEgQoMoOSt16FMPYtrgIs2/JYLZ5HhYmcUsRhlqjmMrYAwQ7ITWmctG8c8WBFpHDkiLxk0BJsXXiXz1HMkFswkgYrPCoow4UtzFlsEvz9EhIeAAogI6xGf9J4eMm8hXOY8W7La31x7g5nei3GceGLmVCbG/qxZT2NHlTezwRfq4ISBDZcoY95U5N16bhJ2LE3BPGxHyYchNYI0b80HK4Yh+BxfCbsXEo4FLX7H7ZUn1tMS5gBApwM/f3dR/jDMpFgzqSw2XTpA18pYlDanAqN3SM1ZqLRhczInXWcz9qYnMy12T1/VQt9Tso3Kc7enAwbFu9iCbcyJ8cdUNdI4BIBn0Odta99aCqHwy1Cn9Le0fYFBswMaE5zJbtv4/TjaJ3HM9+GBtrVYucnWWUmd8ba2x9Kar33vkiCYdDvWeKJd4RiGSXG6+v21Tah6osZCsrPKodGC3oYGLFCUlzQfqfLUNJIbe4SJQTvWFfGWGCIcGJo7ulDaVbYBLXM5PIRH7ogNg00N37qjC/sEpQ1PijnBBh1S80HkvCk58/4uLhlLWy6bJZ+do3qrClpZ0zRXBZlsT9xwAHbA+fLCKRUWk+jqFt18IMBeYzl9K2jhWFeEtBg3N8i5f8RpRgmtPZDwycP9llqnE1VBs/dCNQ04wVpcDsL+RtRgEAWpoBWi0ZNyUUl4CQdaWnYrpi7QOnG0bEAlfEMGpd9VQTMZC0l7sGMPKscCR+EY2jKwPEpFMi7mWxFkysmq/nZ54kVbq0qWfIOB4ogaiPiIGEdePGc4H2Irto8EYm/Kk+BkUUjIQvRyErmY5uIQFDP3VaB25QN/jStooXJoniv1Nb7y1yk/2MvAme4daBqa1gdJZnBWXcwadfHlLIUXAP6Ok61NiOmPxQx+Hn0/CzruW6OF6ALwqRdzNIeXI/7GGXUP0qZ6OzbCx8xwxtd8NfrpKoCLc3Dv3vDL/Kh/C7bfznPiqrfxGJQN/Y5Wh6U3JI7A4Z5h06unsUFhwhqgO9K+qNKwY9NTSPedXCLUa5DS9QjlwO/E9o0npdjZjhJMf1NrNcqH5mkbO53Sfk/mVOtv0o5hOm/U/0kQBC/yKqVtLmp0OPJZT4vvYgyf0IDR9o37ccL/VSStgG00VcMEYVK7xa5b6opd4kdfGkS+24vyMVEMrwbeNYBOzSDO2NeLbbfbt3iKqs1s3bAD59o3B1o/z8Brebo1DbzghDn/NVFyLIEpvtoTd9uCxaTYjJCZe7QKbkQxtjukLYLmDnfbhkfc4fyyfKDWBErvgypHiokiHMHfHHcxQ5Tv2Lqvv8Gp3jDIpnF2zfLgK0N4H2Q33txZfbz3tevYEqJS/g2FIm4y9ab8PAAAAABJRU5ErkJggg==)
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
      }
    }
    .order-detail-buyer {
      font-size: 14px;
      color: #6d757a;
      h1 {
        font-weight: 400;
        font-size: 14px;
        line-height: 34px;
        color: #222;
      }
      .buyer-info {
        position: relative;
        padding: 15px;
        margin-bottom: 10px;
        border: 1px solid #e7e7e7;
        .buyer-item-box {
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .buyer-item {
            width: 310px;
            height: 94px;
            margin-right: 25px;
            padding: 16px;
            box-sizing: border-box;
            border-radius: 3px;
            border: 1px solid #d8d8d8;
            .buyer-name {
              font-size: 14px;
              color: #212121;
              font-weight: 500;
              line-height: 14px;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .buyer-infos {
              font-size: 12px;
              line-height: 12px;
              margin-top: 15px;
              .buyer-label {
                color: #999;
                line-height: 12px;
                vertical-align: top;
              }
              .buyer-num {
                color: #212121;
                margin-left: 6px;
                line-height: 12px;
                vertical-align: top;
              }
            }
            .tel-info {
              margin-top: 10px;
            }
          }
        }
        .order-id-time {
          font-size: 14px;
          line-height: 24px;
          color: #6d757a;
        }
      }
    }
    .clearFloat {
      &::after {
        display: block;
        content: "";
        clear: both;
        width: 0;
        height: 0;
        visibility: hidden;
        font-size: 0;
      }
    }
    .total-content {
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
      }
    }
  }
}
.total {
  line-height: 22px;
  font-size: 22px;
  color: #ff66a2 !important;
}
</style>