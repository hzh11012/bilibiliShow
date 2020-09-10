<template>
  <div>
    <div v-if="!$store.state.token" class="bottom-input-form" style="margin-bottom:20px">
      <div class="no-login-img"></div>
      <div class="no-login-tips">
        请先
        <span class="tologin-btn" @click="login">登录</span>后发表评论 (・ω・)
      </div>
      <div class="no-login-btn submint-btn">发表评论</div>
    </div>
    <div v-if="$store.state.token" class="bottom-input-form" style="margin-bottom:20px">
      <div class="no-login-img" :style="{backgroundImage: 'url('+ $store.state.userinfo.face +')'}"></div>
      <textarea
        class="comment-input-form"
        placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"
        cols="80"
        rows="5"
        maxlength="1000"
        v-model="comment"
      ></textarea>
      <div
        class="submint-btn"
        :class="this.comment.length<3?'no-login-btn':''"
        @click="sumbitComment"
      >发表评论</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comment: ""
    };
  },
  methods: {
    login() {
      this.$emit("login");
    },
    sumbitComment() {
      if (this.comment.length < 3) {
        console.log(123);
        return null;
      } else {
        this.$emit("sumbitComment",this.comment);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.bottom-input-form {
  margin-top: 20px;
  align-items: center;
  display: flex;
  .no-login-img {
    width: 50px;
    height: 50px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 25px;
    background-image: url(//static.hdslb.com/images/member/noface.gif);
  }
  .no-login-tips {
    font-size: 12px;
    display: inline-block;
    box-sizing: border-box;
    background-color: #f4f5f7;
    border: 1px solid #e5e9ef;
    overflow: auto;
    border-radius: 4px;
    color: #212121;
    width: 656px;
    height: 65px;
    margin-left: 30px;
    margin-right: 15px;
    transition: 0s;
    padding: 5px 10px;
    line-height: 53px;
    text-align: center;
    resize: none;
    outline: none;
    .tologin-btn {
      cursor: pointer;
      background: #00a1d6;
      color: #fff;
      padding: 6px 9px;
      margin: 0 3px;
      border-radius: 4px;
    }
  }
  .no-login-btn {
    color: #99a2aa;
    background: #e5e9ef;
    cursor: not-allowed;
    box-shadow: none;
    font-size: 12px;
  }
  .comment-input-form {
    width: 656px;
    display: inline-block;
    padding: 5px 10px;
    overflow: auto;
    border-radius: 4px;
    color: #222;
    height: 65px;
    margin-left: 30px;
    margin-right: 15px;
    line-height: 20px;
    font-size: 12px;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #e5e9ef;
    resize: none;
    outline: none;
    &:focus {
      border: 1px solid #f25d8e;
    }
  }
}
.submint-btn {
  width: 30px;
  height: 30px;
  padding: 17px;
  color: #fff;
  text-align: center;
  line-height: 16px;
  font-size: 14px;
  border-radius: 4px;
  background-image: linear-gradient(-48deg, #ff6a9c, #fe8574);
  box-shadow: 0 3px 4px 0 #fdb8cc;
  cursor: pointer;
}
</style>