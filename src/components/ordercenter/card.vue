<template>
  <div class="order-item">
    <div class="item-header">
      <div class="header-time">创建时间：{{item.ctime}}</div>
      <div class="header-id">订单号：{{item.order_id}}</div>
      <div class="header-status">
        {{item.pay_remain_time>0&&item.sub_status==1?'待支付':'已取消'}}
        <van-count-down
          style="color: #f25d8e;display:inline-block;font-size:12px"
          format="mm:ss"
          :time="item.pay_remain_time*1000"
          v-if="item.pay_remain_time>0&&item.sub_status==1"
          @finish="finish"
        />
      </div>
    </div>
    <div class="item-content">
      <div class="img" :style="{backgroundImage:'url('+item.img.url+')'}"></div>
      <div class="content">
        <div class="item-name-box">
          <div class="item-name">{{item.item_info.name}}</div>
          <div class="item-time">场次：{{item.item_info.screen_name}}</div>
        </div>
        <div class="item-count">{{item.count}}张</div>
        <div class="item-total">￥{{item.pay_money/100}}</div>
        <div class="item-tiocket-type">{{item.item_info.ticket_type_name}}</div>
        <div class="item-deliver">{{item.deliver_type_name}}</div>
      </div>
      <div class="btn-box">
        <div
          class="btn pay"
          v-if="item.pay_remain_time>0&&item.sub_status==1"
          @click="$toast('没有做支付功能哦~')"
        >去支付</div>
        <div class="btn checkdetail" @click="checkOrder">查看订单</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  methods: {
    checkOrder() {
      this.$emit("checkOrder", this.item);
    }
  }
};
</script>

<style lang="less" scoped>
.order-item {
  border-radius: 5px;
  margin-top: 20px;
  border: 1px solid #e5e9ef;
  .item-header {
    display: flex;
    height: 42px;
    align-items: center;
    background-color: #f4f5f7;
    color: #99a2aa;
    font-size: 12px;
    .header-time {
      margin-left: 20px;
    }
    .header-id {
      margin-left: 30px;
    }
    .header-status {
      flex: 1;
      text-align: right;
      margin-right: 20px;
      color: #333;
    }
  }
  .item-content {
    padding: 20px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    .img {
      border-radius: 5px;
      width: 74px;
      height: 74px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .content {
      margin-left: 10px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex: 1;
      flex: 1;
      height: 74px;
      font-size: 12px;
      .item-name-box {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        width: 200px;
        -ms-flex-pack: justify;
        justify-content: space-between;
        .item-name {
          line-height: 20px;
          font-size: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }
        .item-time {
          color: #99a2aa;
          line-height: 12px;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }
      }
      .item-count {
        align-self: center;
        line-height: 18px;
        width: 45px;
        margin-left: 30px;
      }
      .item-total {
        -ms-flex-item-align: center;
        align-self: center;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        width: 90px;
        margin-left: 30px;
      }
      .item-tiocket-type {
        -ms-flex-item-align: center;
        -ms-grid-row-align: center;
        align-self: center;
        width: 75px;
        margin-left: 30px;
      }
      .item-deliver {
        -ms-flex-item-align: center;
        -ms-grid-row-align: center;
        align-self: center;
        width: 90px;
        margin-left: 30px;
      }
    }
    .btn-box {
      height: 74px;
      width: 100px;
      text-align: center;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-pack: center;
      justify-content: center;
      font-size: 12px;
      .btn {
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        border-radius: 5px;
      }
      .checkdetail {
        color: #6c767a;
        border: 1px solid #cbd1d7;
      }
      .pay {
        margin-bottom: 10px;
        color: #fff;
        border: 1px solid #f25d8e;
        background-color: #f25d8e;
      }
    }
  }
}
</style>