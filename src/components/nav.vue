<template>
  <div class="nav-header-wrapper">
    <div class="nav-header">
      <router-link to="/">
        <div class="icon logo"></div>
      </router-link>
      <div class="icon icon-tv"></div>
      <div class="mainsite" @click="toMain">主站</div>
      <div class="search-box">
        <div class="empty"></div>
        <input
          class="search-input"
          @keyup.enter="search"
          placeholder="活动、嘉宾、场馆"
          :value="value"
          @input="$emit('getInputValue',$event.target.value)"
          type="text"
        />
        <div class="icon icon-search" @click="search"></div>
      </div>
      <div class="register-login" v-if="$store.state.token == ''">
        <div class="register">注册</div>
        <div class="line"></div>
        <div class="login" @click="login">登录</div>
      </div>
      <div class="userinfo" v-if="$store.state.token != ''">
        <div
          @mouseover="mouseover1"
          class="user-img"
          :class="isHover?'isHover':''"
          :style="{backgroundImage: 'url('+ $store.state.userinfo.face +')'}"
        ></div>
      </div>
      <div class="user-panel" @mouseover="mouseover1" @mouseout="mouseout1" v-show="isHover">
        <div class="user-name">{{$store.state.userinfo.uname}}</div>
        <div class="panel-list">
          <div class="user-center-item">
            <span class="icon icon-user-center"></span>
            <a target="_blank">个人中心</a>
          </div>
          <div class="order-center-item">
            <span class="icon icon-order-center"></span>
            <a @click="toOrderCenter">订单中心</a>
          </div>
        </div>
        <div class="login-out" @click="logout">
          <span>退出登录</span>
        </div>
      </div>
      <div class="orders" @click="toOrderCenter">
        <div class="icon icon-order"></div>
        <div class="order-center">订单中心</div>
      </div>
    </div>
    <div class="login-box" v-if="$store.state.isShowLogin">
      <div class="content">
        <div class="close" @click="$store.commit('isShowLogin', false)"></div>
        <div class="login">
          <div class="login-soma">
            <div class="qrcode">
              <canvas id="canvas"></canvas>
            </div>
            <p class="qr-title">扫描二维码登录</p>
            <p class="qr-text">
              请使用
              <a
                href="//app.bilibili.com/"
                @mouseover="mouseover"
                @mouseout="mouseout"
                id="app-link"
                target="_blank"
              >哔哩哔哩客户端</a>
              <br />扫码登陆
              <br />或扫码下载APP
            </p>
            <img class="bg" src="//ftp.qnets.cn/bilibilibuy/2233pic.png" />
            <div id="tv"></div>
            <div id="qr-success" v-if="status">
              <div class="success"></div>
              <p class="qr-title">扫描成功</p>
            </div>
            <div id="qr-reload" v-if="timer==180000">
              <div class="reload-btn" @click="refreshQrcode">点击刷新</div>
              <p class="qr-title">二维码已失效</p>
            </div>
            <transition name="panel">
              <div v-show="isShowDown" id="download-app" transiton="panel">
                <div id="app-qrcode"></div>
                <p class="qr-title">扫码下载客户端</p>
              </div>
            </transition>
          </div>
          <p class="login-explain">
            登录即代表你同意
            <a target="_blank" href="//www.bilibili.com/protocal/licence.html">用户协议</a>和
            <a target="_blank" href="//www.bilibili.com/blackboard/privacy-pc.html">隐私政策</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import qs from "qs";
import { setCookie, getCookie, delCookie } from "../assets/js/cookie";
export default {
  props: ["value"],
  model: {
    prop: "value",
    event: "getInputValue",
  },
  data() {
    return {
      loginInfo: {
        url: "www.bilibili.com",
      },
      isShowDown: false,
      isHover: false,
      timer: 0,
      status: false,
    };
  },
  methods: {
    search() {
      this.$emit("search");
    },
    async login() {
      this.timer = 0;
      this.$store.commit("isShowLogin", true);
      await this.$http.get("/login/getLoginUrl").then((res) => {
        this.loginInfo = res.data.data;
      });

      this.useqrcode();
      let interval = setInterval(() => {
        this.timer += 3000;
        this.updateQrcode();
        if (this.timer == 180000 || this.$store.state.isShowLogin == false) {
          clearInterval(interval);
        }
      }, 3000);
    },
    useqrcode() {
      var canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, this.loginInfo.url, { width: 165 }, function (
        error
      ) {
        if (error) console.error(error);
        console.log("success!");
      });
    },
    mouseover1() {
      this.isHover = true;
    },
    mouseout1() {
      this.isHover = false;
    },
    mouseover() {
      this.isShowDown = true;
    },
    mouseout() {
      this.isShowDown = false;
    },
    async updateQrcode() {
      const { data: data } = await this.$http({
        url: "/login/getLoginInfo",
        method: "POST",
        crossDomain: true,
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        withCredentials: true,
        data: qs.stringify({
          oauthKey: this.loginInfo.oauthKey,
        }),
      });
      console.log(data);
      if (data.status) {
        const url = data.data.url;
        const index3 = url.indexOf("&SESSDATA=");
        const index4 = url.indexOf("&bili_jct=");
        const index5 = url.indexOf("&gourl");

        setCookie("SESSDATA", url.substring(index3 + 10, index4), 30);
        setCookie("bili_jct", url.substring(index4 + 10, index5), 30);
        this.status = data.status;
        setTimeout(() => {
          this.$router.go(0);
        }, 1000);
      }
    },
    refreshQrcode() {
      this.login();
    },
    async getUserInfo() {
      this.$http({
        url: "/all/x/web-interface/nav",
        method: "GET",
      }).then((res) => {
        this.$store.commit("userinfo", res.data.data);
      });
    },
    logout() {
      delCookie("SESSDATA");
      this.$router.go(0);
    },
    toOrderCenter() {
      this.$router
        .push({
          path: "/ordercenter",
        })
        .catch((data) => {});
    },
    toMain() {
      window.open("//qnets.cn");
    },
  },
  created() {
    if (getCookie("SESSDATA") != false) {
      this.$store.commit("token", getCookie("SESSDATA"));
      this.getUserInfo();
    }
  },
  components: {
    QRCode,
  },
};
</script>

<style lang="less" scoped>
.icon {
  width: 18px;
  height: 18px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.nav-header-wrapper {
  position: relative;
  width: 100%;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  .nav-header {
    background: #fff;
    position: relative;
    display: flex;
    align-items: center;
    height: 60px;
    width: 1160px;
    margin: 0 auto;
    .logo {
      width: 130px;
      height: 27px;
      cursor: pointer;
      background-image: url(//ftp.qnets.cn/bilibilibuy/logo.png);
    }
    .icon-tv {
      cursor: pointer;
      margin: 0 6px 0 40px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAA0FJREFUWAntl89rE0EUx9/sRitqQRAEf52F9uDRa1FPgkfrwYJomgYvHtK0YE89KTS1oAchTaMoVtCDR0Gk0n/BQ/0LrK2ICK1ga3ZmfG933zKdZje7YZNT9/Jm3r73fZ99O5vMABxcOXVATzfP6Nl3x7PK6dkXJ3T11am0eU6aQG9y8anneety6/eGV6nfSJNDMbJSvye3Wz+k2tmUk42ZNHmiUxB1hmA4ToCQAOJWYaH0ln3trKzW7ysFT/geFmq5F+CYKJdb7GtnO3fo6OAWiv3hZA3aBdDLXqVxk322tWH8+0L8hIkJz4615x2BxOwowdwNOhOkJ0G1g8EH+qtdPSaE0DaAPe/4yjgh6IheDmACrw8pxGjhcek9eWjNKIBnnEPWhwH3+qGF8RXTHzfeB6S1FnKqMY62iAWH0A7GJXfjxy5taw1r2KymOz/RtLu2B0jP1E/LXfEaIS53UyxrjhCw4jqHx0TtzibnRmvI70wfYQgAO3VFqn/UgKgxEZCqLpX61RnuRgSFS4R9BR4oXDM8ZovY6+DAtOsUVsVc8Tv7u7H0eyaVNwIK5vBTO2tqYCOodoN8EZAAPWR+kwTjDhy5KB7d/mUmdzsOH+iNfvDyo9zd+WJC4Y/BMOtGrwwD9v5PCWcqLxguRtbXRG3TZ9aOgMwAGrsDatX25TVP0o4FEg/LG3kB2DpJ2rFAtki/5tGi7lTQm2pcA6XrfpwjyoVa6UNSTtZ41koNRDD4eZ6jRKGAwM6zSFubNT4USf3KGIbyzHFbGCsmTTzrpAbihF7b1ED4r/yNYcwx+2xrxphjO86epwYCXMgk7Ivj2BbaN88aHwqkXtThV5W8kA2qrPGcmr5DnNFjGwtEm7Ve1U7SjgWSu85Ir4CStCMg3G5ER50ARM/hVuFk3lC+plY1U9esHS1q3ESugYZLHEg/ZrRv8ar1XDdoqLl/g0a1wysCws+5iRAREN33N1EKlj3lQasS/I1xYlaLp9/YFAec53wTuxVcCCNkdfETbbzZ1w+LjfjszpeuosXnB9wxhxc5/CMJHk3Y12vrwwzsPdFGHeLiYaeK2LAinpuGcZ7/QRH0V4RpurXSEneG6x/YTh34D8X2aE2nnJqmAAAAAElFTkSuQmCC);
    }
    .mainsite {
      cursor: pointer;
      font-size: 14px;
      color: #636c7b;
      line-height: 14px;
      margin-right: 32px;
    }
    .search-box {
      flex: 1 1;
      position: relative;
      display: flex;
      .empty {
        flex: 1;
      }
      .search-input {
        background: #f1f3f5;
        color: #6d757a;
        width: 360px;
        height: 40px;
        border-radius: 20px;
        font-size: 12px;
        line-height: 14px;
        padding: 0 40px 0 20px;
      }
      .icon-search {
        position: absolute;
        cursor: pointer;
        top: 50%;
        transform: translateY(-50%);
        right: 12px;
        height: 20px;
        width: 20px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAABNJJREFUWAm9WE1sVFUUvue+mQHMlCZo1aSKCboSo65s4k5idIFR66JQaI3YmoqJiazanZGNdCVhYS1OLbGtxVlYNbLQRBo3JkQ3mIAxARIK3YCg0xra+XuX79zxjue9ea9TOg/fYu757s+5553/N6TW+eTz+ez1Qmk3KbPLGPWUIrODFLXzcaNMQRm6RKTOGkWnO9ozp3p6ev5ZJ+vANgqgCJDLTT1WMmpYGbPPKHVPxJaGKTC9pYi+yJAaHRzsv9CwYY2JWIEmJ+c3r5YXPzDKPwRB0mvwiF0C8zIp/dHmdOf7Bw48txq7USxECjR+4uSj1XLpK5jmSbF3wyRM+ZuXzrw29Mbei82YNAh0/PjM0xXlfw+/uL/hMNFlMD9piE7rVObcvVvUdd5zY0V1+JXSTjLWv/bCvI+Ez8LfrmlPvfD2QP/Z8JrEAYGsZkrln8PCYNOCJhoZGuz7koh8ySBMG2P0eG56j2/MEZh6u1xnobxM+tm1NFUXiH1mpXLlTNhMYPLtJm9r38DAK8uSeTN6YuKbtmJ1aRov97Lcy+bbknq4K86nUm5zzYFDPkP62MHB/YeaacXxkCO/ALTVPZabOoqXfNet8QvzXcDDbk6OVkM2tH1zXkYTa+bgW33dGxFGXsAmHPt0ek5qCpeWM5oej0oJmg8jz4wEhVELbKZWhWHezMPygh8y5ofvsrmtBgO/mjMwoqJXzpJWw3fqM/J8mGZezDMwj0Rr7w5MKqVvLK2+BIn/y8AIbYRmPrSvZWh5grdjxHdyKXLYjRoxvMuB2mhmkzBVkGfNdJzD5DzXRYmZ1sSFUjweiqOAiZKcUCVDRFzgbl7TqNI75Ka0Tp2TOEmas3uAHzqGAAbQitRWOdnW5v0pcZK0KzWOJ1KLbV8c5lFLcLfpbDZr8567ByarOtqNMJlacoDH5eXqfRInSS8u3uwI8CP1VwADwGTmkpws+5WdEidJV8k8IflBXQsSM60N2k45WY0IRbneCl015nl5Hib7VWKmNZwoEIrIGL1cf8IbW8Xz8/Mo5LRH8vGIfpKYaZ2h9lNQ3a36ApqrTyameuo4IeL3i4v7UaIecuyQJJc3pTq/c9iN2tYsolk3waPx1Sj3M3KuFXo8n2+H1kclDzI0FdUTWdPg6+AItFR2B1BnttvmysDDWnzY/NW/iyegnQcEq2KK6EOB66QVyPYlREfrsyC4f/k4N4PmauNCsTBjuZlj4PWq5A1fKvue3xmcq6G6BpJuYdlMlUJxEprpjr6YCl7KvDj05utn5HpdIJ5cq8nnfoZbiGadAEfT+QtX90HHo1Dzg/KyMI3S0SBUQCA+0OwzCBfNckfARZjrHpcDzsCc9Gp5BqEtoiksRBiHhWoQiA8k/aEYFiKMpVCRAvGBmk9dPYy3fY974DCTdeIiOzC0mm22n4VKqfQzsQI5Bv/+2TACwXoDra7bEDFy0uM8w6HN0VStEH8JN7QaDUeJ5poK5A5xoiyZwm4fLa/tMrmxs72U8fEXzE048BXs/YXLwbba3zEr7uz4Z593VSr0AzQV6L3cuhvtizhwt0cWqpmmWKDEi2jci3G+4bzDvhK3B+30j+s2WSyTO1yI05QV1FNd/5uGnNysKY4mfNLOWZ/hAFD0tYIw7wz0/3EbU/0A4mUiUMEAAAAASUVORK5CYII=);
      }
    }
    .register-login {
      width: 90px;
      display: flex;
      font-size: 14px;
      align-items: center;
      color: #636c7b;
      letter-spacing: 0;
      line-height: 20px;
      margin-left: 30px;
      .register,
      .login {
        cursor: pointer;
        &:hover {
          color: #f25d8e;
        }
      }
      .line {
        width: 1px;
        height: 12px;
        background-color: #636c7b;
        margin: 0 4px;
      }
    }
    .orders {
      display: flex;
      align-items: center;
      margin-left: 25px;
      margin-right: 15px;
      cursor: pointer;
      &:hover {
        .order-center {
          color: #f25d8e;
        }
        .icon-order {
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABjUlEQVR42u2XXUrDQBDHewgV9C765IlUrNkN5CaCmaCPVWnpGXz3Cgp57aYPRRKd/agEEzc7m42izcA+FJrJb+cr/5lMRvvPtuLZiWCwLBjkBYd32xE8fRJJejAYTMHSqAuiAcXgeRCoIr45xRdUeDYYnemawaH1/0NDCQ736gUI43SBGkxQKBkZdDZDp6V03BWZBhBCBIMyNVPVw+/+LLyoCyR3R0GgZDdpiPQNzyUVSMTZg34mu1K/+0Kp1tZAF/UUOF8ogmOT5s8maEBF1/uEdOk5s0pu93yAaikvbXPK3dkXAB+gbaREDI/Ypa9tUMGAMOQLyzBcUP0PC8Rh/uNAvefbCLTzQLaidum63wVq6bqxhnYPaPstchVoNpM+jPrM/YHwA0mRsB1KYmq6b+kN1KZvvCKjYTZK2qAI7JXjNQdm1zfN9v5mPFRSK1G3jNaasekbB6BSbS+4ONDXnpA1w+HM1MzMf2UOUDNS/hZxdq4XBUyTT2QoNUM61Jrx1cR2CMhla5O6abS/aB+NBvp0oWKGRAAAAABJRU5ErkJggg==);
        }
      }
      .icon-order {
        margin-right: 4px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAvFJREFUWAntV09rE0EUf293g3rQUxX8DL31oDcVEQ/WgH6BekirHpIqKtR0g0Sb1FZbKE0FaRMQwbN/68GDHnIr0ptfoaJ4tQ1ms+N7GzZMNrO7s0kVChlYdmfen/nt7703+xZgOA4YA5gE741b9pmWi3kQMCZAnIiyRYQt61Aq/Xyp+DNKLyjTBpSZLuTBFfNBB1FzBPxmHbbOJwGlBWgqV7jgCvEJEJsGwAM0j7xcX7G/h4HJZG3hy5KCIv/xg8KTJS1kMBuV0mIUGNkbgyHbUafhfL55rxgZYt8uEhAzk8kVXhOWNBswM76hzp3DlRRUKCDOGS9MQlwRQnh6uswQ9B0GbBlgJQWlBMTVxAmMiC3yO6PDRkDnK88bu80JTugkoJSAvNImh4giX1srPwlsFjulF1miyxWIDynsM66TMoOgcrn54ypHSkB8zrAyplIv+J50VCtzdYFQoBK2KOwLLWd3p9lo/uAEZ19834PfH1R+lYDIwKuI9eXiL5WRzlpttfSYXukcHZDv6eo5IoSAUyo/lmoxbm0yW9gk0JdUelRVH6trpXGWMVN046tryOdUl4AmSoaCSknmAundBxh9MeQzMMC+oab7zlDoTpqCIaA4ovrKoagqC24oV11Qppr/85Alrbq+GBpWmSq2/2tNK4f8b9H12+WTgwLzfVCyK5t/LUAEwutvRGtvYlBAHR8I2ypfmkltPKXeaNwFeET9jdfK6neP7W2ZGQbDPnjFNAR1A71D+dfhf42pOevIJ3P2LLUTc3472+MKYbNWKV+W10POKwEG2u32RNZuPytDpsqZaqVM/2Th/U2v6+4V7iDJ71sD8WIYGLboMCCbExvvqIlIk/F9/u2RZUmfp6btO64Ly9QPv6lVSlfj7ENyaB9y5m5xxP3jXKMXW6CmlX9bnsWBYbmSIRbE5gwr6Q4DZ6PCJLsx5Yn8vL1Vr4+dPvuFqmuEYn+MZEdledwznzOUN3XLhMzGavlVnP5QfmAZ+AuAtC6WgulmZAAAAABJRU5ErkJggg==);
      }
      .order-center {
        font-size: 14px;
        color: #636c7b;
        line-height: 14px;
        width: 60px;
      }
    }
    .userinfo {
      z-index: 2;
      .user-img {
        transition: all 0.3s;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-left: 65px;
        width: 40px;
        height: 40px;
        border-radius: 20px;
      }
    }
    .user-panel {
      right: 0px;
      z-index: 1;
      background: #fff;
      position: absolute;
      width: 280px;
      top: 60px;
      color: #6d757a;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
      .user-name {
        margin: 0 20px;
        padding-bottom: 18px;
        margin-top: 58px;
        text-align: center;
        font-size: 14px;
        line-height: 16px;
        box-shadow: inset 0 -1px 0 0 #e7ecf1;
      }
      .panel-list {
        margin: 0 auto;
        width: 240px;
        height: 66px;
        box-shadow: inset 0 -1px 0 0 #e7ecf1;
        font-size: 12px;
        color: #6d757a;
        line-height: 14px;
        .user-center-item,
        .order-center-item {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          float: left;
          width: 50%;
          cursor: pointer;
          a {
            color: #6d757a;
          }
          &:hover {
            a {
              color: #f25d8e;
            }
            .icon-user-center {
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAADlElEQVR42r2Xu27UQBSGhztICHFtER1QgyhRkLh1EcUWIbY3CIkOpeABltDQrGdXURIJEV4ARfAKQYCgoCEVeYMkkLD20qwozPnnFq/t2bGdDcWRRjNz5nw+l5ljlrDkgFNarYNjkRK2WF2Ynte+Ewfh69jnP2I/7EuhMc1hrS4UqwoTT3cvk+FVksQhq9hbFYqVhmm8PRQ3uzfJ0A4MRj7/2fc6rV6zfe33TOc0BGPMYU1AeXwbOtAtC8VKw8AzMCANvYse87PJROtwkWANewwUPFUSipWBEUA6TGQoefLqiA3GCO0xUKSrz3FBjQZSh4gEVmHKeQZwacl4SodPJHoR1Eggm3dkNSXIDyuIBQw6wkt0RhkvMZd3IPSV6+IrKWlLwaSgoKO8u54+0w1k8Q4OVXdMgkoqDaMEOjKPwr74GIeXmMs7aaDew5dnqgKJiisCsnipFJAJmc+v54w2WkeHJLMOHROyPQOpxKQDl8WhQfjcCmIBg44q/WVTEJWAMt6RHure02UfBwvnnDBKsFeXPc7IAaWhhoBGhMtccub9Ct8nT+ePOYFoD/aaizF9R40IG3OFywDNtK+YpwOGptrnBViBYM3AQId0c7d7baBUgvaD8JaGivzwF4VjLgr4DYRGhIfGYo7WNAx0Cm/yPQOpUPT9ztXYCz842w/ag7256hs3kM6PyOP3yegbeSXIBk2MMUdruTzbL6CtxuLJOOAPyOgiQXyNvHCLPDKAyDHmaI32YO++AfUfzV8ggy9MfpQQkWekA916QJaSj7zOFBnY3DXE15C8vSa/S2/Vpe3p+VMQjDEnE5uvpeA2cYaz9AXQKO/MtI5HfmcpBfJRVI0ucVovFLWOvdDZ1e8sifURXrIDIXF9vqIO+0vjZzqhh8QCY4R0oIsz1EetiHknUO5BVZ7xeCy8kqqwSqKvC3mHxcZTlrCxIu+onElE5eANypR8HSDpKfEmDgQUcqrASyzrHfUgbkglPlt0B9UFkgXCZ1XoNuRDPewllvMOVYgK1bfCR3QvQPrRpbMV1FzWS2yIsMFP6HaBmvMJZ99jA3b0SSKfVDsDm2kGNtSqBnxSXWjfSzdiVUU3bmRD/o3wybSX2HC4woXKnWFdINVJwqYViGi/YNOfgN/ebyD98wmbeaDd3lk8Dzt+92KVvtnZ+BfowYZ+VtI3dxZoUPbhHKMMRgF9/u9AHv9kBar0mzwuyfTZ/wCVBLQnV4XUEwAAAABJRU5ErkJggg==);
            }
            .icon-order-center {
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAADIklEQVR42s2Yy27UMBSGzR2W3O+vAVsWQNmXES0koRUSOx4BgsRNQO2MRkgVS1iypixgXSSQKkElVvQFYEEnyXQWSBDOiZ3gOLbjzESIxa/RzDjH35ybj4dkJNtWUxhu16r3akdrmWzp9gURV5AtLzoe+9H92GfroHHis6xBa/iMFc4KZPFIGkSXE5/GDhAVAfiXtlBECyMZSD06C8Z/8U3o61HAzg+vPtqfnQt3Zjef79KpBjX3+ES+3gGM2HJktPDkGBjdRMPgpdsmABMQwrSFIjqY0Xz/KBhZBmPfCs9oN++Fu3UqgLYCdlILJYNpgSQYNJJ4bEN2+9BbumADqAPRNIe4wQ60hSIVF8IiePBtDuKxD/D6szBsBLg12KMq9unn8ofAmhoUvDdBERkGE1Z45UfuKeGhJgBViR89LEMtPnOFIgWM8M4L8cA9ORdcIGTxH8PbROqzO0YoNdErQLw6vuaLA3ZmGiAUgMzBs78LT2H4kuDZwSYoUroNgMoOPL90iLu+CgSG31sa4WoJtBDuRXGoxoa6JoeOyA2uDiDeiw0agcQ6WeNrg1OYUzzRefWp0gOpIcoBqkBayaGyrVPXy/vh/gKKyE1uaiAXqEo1ugKVIWoAsiX2VEBKy+8EyARlAhJQbkA9tm8iIBlM20BtQNqqsgBN0Ju6A3Ir+yatdu6hToHUsu80ZC0mgf8TSC2ifwakA9NMli2A+NmTLg4OTwWkmyrh5Bcn/ljfGDVAxeQXe+xSYx8qPGHykPJZPo5woHVnoHLy8+ibqZtjPX9WxOz1wPno4KMDn2figN7tCginSLHXMB9lzUBiXsEBrTJkFZMfW4n9/oz8vXNXhpwZXmcXC8/g5TP1aU9O6NppD/H8xOPan5G94Dj5tdGmDqYOBPEsPFEJC+SPy+TXIH6l8uj3fI7GqKhA6sRYuS14Ueg0ATrklcjFj6KqlstqswIJqDSgV6w546jUf3oEnj2Lf+HgPU9cPjf4vyESTBPQX6hOcwY98268SE/bvFO7Bsk9CeOMOTVpzogrFdzz6EusrlpzbAWknj8d5FEFyACD+gNWjBmTJuYNzAAAAABJRU5ErkJggg==);
            }
          }
        }
        .user-center-item {
          .icon-user-center {
            display: inline-block;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAABcxJREFUWAm9V11sFFUUnjuzu93lp0KxaIoQpBWeCA8+kADaooHYlBiIrQR9QaJSoC0tFbGJMY0PIA9CofwUQpCY+MdPQCPypBQFEqJ9EBMSqkZpQh9ECoXS3W53djzf7ZzJnbsz3TYBbzI9957zne98e+6dnwrDMARd+cZYMPk4EHfygVAoX7HA+L6OT140LPNV0zCfcxxjBgoJYdzMGtmfDDt7vK72je9Dio8qKp+gHDFtbQeeiU6YdIiKlYcUZPeF4cGB9Y2NG39nh2JDRY0mSBcj9nUcW2ya1hnHcKYKQ/zrONl9mVT62zt3bv6JYlOnziiNxGMrhDDrCPM4dawva2dX1dWuvURhXYS+lnrDBOWIoc6UxSZOukzbU0Tcp2/1/vVma2vrPcmi/SF/YXHJ00doE1dBVPrBwCLq1B9jEWVqXFjmiIET28Rijh7auzpMDLCIAQPhyHG3GKFAbgR4BAniGKwkoAP8As3LsU3oTFdXl9puYNQLeQYwwCKHluUuB0K6KPi8oQsKBtPdhAycGaUzLMIjcyeeH1jkSL/LoYNp7aupC1LxHlA44nkEcIBdgBdTE7S5xHAOc+TLVwWFFSG/KAGRezeF4TQ9cin4DnQ5wnI9vypIJfQAqjOVSgX6VYw+7+83xlUjDKzxOr1wTJ8+u1QLYAmR6uWDzJz55JwRxwiHLxiwyCdIdkS+Dig5mihYoXCwCMUlpz4/5zAHISSnnsTrIEE5CfZQ+gQSLCuyqaWlpZCmORgmVKwAFjnwMYcSxzSHhwXlBNTExvq3f6D1BbwOnpo970hZWdmoeOQCAyxykOtyIBQ2JCcLCgL5iibv9dfiNWAIc2XT1ve/bG5u5k4B57sQAwZY5CBXK+DjVmMqEfsZrFvj4z2HliQmJE7KV4hj3LbtzP7k/YGzPT3X5ct11qx5pYnJk6rkNgljmhQzmKxu3rz+IpOT5ae8bgFxxiNICty5c3fpxClFHUKMPCyVQr6p4zg/PrjbV7ttW5MUi2IuIMwiPH5BLqnYtadjaSReUGMJawntmHxwEl+v7dgXM6mhE1s2155HARcPw/MwKzEW/eUuwYGhb5VvXVFTE2tY3/hStCBWaQpzAXWqhK6JtD2Si16mUdOyJi9bVmUNTY7f+PvaNXuEdmx/WQwXDRVU39IyZe6sufX0gbaRJE8bEz2ds2zWPtDd093evmPHXTdn1A7pggKF7d1/tNqKRtqIcLpL+pudyZxOpZKX+u7d6v71ypU++BcsXFhUVFg8Nx5PLLYikVXkmu/i/7GHM40Nm9adpLUuCBDPBwHqrc+CpK2oqIhUr1m3i7ZjA7JoXEwlkx/QXXN5ZOltr7v0jCxAd+WieCLxIXnpnFFVxzh48oujWzo7OzMu0hPiriVhoKDKykqrauXqz+j7+BU6Vhnbtt9r2LC2nRJZtMrBc1guwj5n78Fj9ZZlfUShCH0fnTp75qvXz507h7PFWLaB3ZFEVSvX7IYY6s79VHJwuSuGi6gWZOqlxuQcueAAFzjBrYG8H4kJd4idgs5MDZ2Zz+nuSadTyZfpsX9eIWCc4hp16v36tvbDS2PxxDf0jIrRmXqNzhTekRyXVhdjtGzf/pgVi8pfQE/id8fwDhpVjRoEFzjhQw3UUuLyh7Ig9osZRSUNdPqeIOFd3319vIMC4+0IcwVZMcLpdKGGrKXxQ5BXsKapKSqfM+RMD6XfoYOXDWBFa/lCmOdsdR/W3gBnKpnaCgdqoaYXJC1qh8SS0vnL3c+Fq031b+G/zXwDIvQR5PNh3JftVdRCTQp6TVEFGVbUXIbMrG2f9jE8ggXX4JpcwieI7qpnEcgMD6ufC4x9qHbIzsgd4JpMzoJky4RhzkGgf7Cv2wV4reQEzfK50a0G8y0l58DA7evwck05pT8ROL0hjCk4osVFJTf2H/7Ucz/SCWoqgzskXfTA+kWJ/S/TrJP9WS2E9vE3EfvzbRPjHpZV70rnP+4JDxVeBgPaAAAAAElFTkSuQmCC);
            margin-right: 10px;
          }
        }
        .order-center-item {
          .icon-order-center {
            display: inline-block;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAABYxJREFUWAmtWH1MW1UUv7d0W1u6CY6y4QxkzLjI1CWiMZpojHFGZTObfxkTMzEG2LoNZuLYAjHVwASUlTGKULPJ0Ghiotli8A81miV+JEY00wT3B5ABMuQrYx9QPto+z+/13Xrf63ulnZzkvnPu+fzd8y6398EZY5yGkcx08LHSG+PluSJPJNlUjwJyEVmWYhmv9/tzs9zrvUxhz1PIXYwpTtnBRP5tZnZ6Z83hwxOSzQjCOFfBCBCCS/ExsK0dZ/dk2GynCcQ62bicTNX6rs1OP5UOKIAQQ84fB3fq/a7dtgzbZ2S00ehZDIdbxofHexsajt3QYuU4VQ4EuxeFEqCmro7t8FVXo1NyR2QZ7uochVFIUBwIFL6mJo8ne+Nf5JoVVZQ3D5bvbRCOybgABDCUsAg8VVCmYOrrW3ICHV1tuVl5FwGGivdYgMECzIaKd2xi+GkBKic77xtfY2Ou5A8fXQOgEIDihrq6Extv89z+I7PZKhSmIAELLS6cBCcyFo9pE578JlRz09OhsSFTUDCLmoKrOgDSKbJzcz4kxRZa2S/El+A1OtDXa/CDWhDiDUMZhHFTwdbi+vraSWOnaurqNmjBiAMJHu+QqvS3n3mChB2c8auU5AUCtQoGv9+vrhgykaF4TCk/o9FoD+ZOp6uSGK+vrZ2SQeXl5n9tBUr3yux2+8tIFI5GApRkErJGMgihs+T/jPwdIBzXCXpJa/uZajiqoKTXB1DantLlEYCg5DR5FEJoLvQl+K0SvaaphcVQOedcybDb3wp0dn/+XkvH4zMzY/MWe0q8Mm6nomICcROOg4nRfuwBSR+D1tZ59nsq8khspn8qivLTgfK9T2pa/vqBsnMn2oIvrVnt7GRcKXG6XCVF2x/WBVGBIk92HhYPA+opokNa8djPQXNzMw49mWDXfGR1gqzzA6ih/oFt4XD4HfL8g1LIe1EEPyAEcHRIkLGgcc6kDogYcNr7cUqIaWryTZH1bW3AUfgrdIAuQEGEOOixbVJaObmlRKJYKs4J4BEkXpkxgamz0YnmZgCgM9ObhCeqBKBUASRmsNakC0rFIABZp41ZbhWw3C1ZtqwnA0q3aDodSNlX/iuzRE0GNSGdQ99ZnUPJgmEznFOW7nKHLJ3IkG73kuUSNtOupdohNYnhHJITyrIoCJ72QlLtkFxkJWSrBVieQytRFDlQ2FjcONfVWqZDsd+e0tJSty4q/YkAFgfj9R5bG0vDQ1o61ZYUkMKi6s3v7vseLDbBIO8PIQtudE/Qb76nUPtRVfpl56SAIuGIevNzZ2YeoqCEpAadsIMbB2oKHWTmWL26CpyOA93dSwYUbyccQf2XL7VTnus2bnvWHzit3vxilv/3bO3oOkrX5OdoXBubHKEa/xFQ494MzgLBj6YJs/virz94gsGgend592Rwd6bL+QmthNNXyFc35+ZaB/t+7xV2CktYCHIZyev1ugu23l/scjgqAYbs0aVw5MWq/aXnNF81jwAEHW8LduNLY/uNudlnjlbtu6A5MoByOenml+antIhP4JzNLM0vllUdfE0HBn7yK2PRiLZnXC7smTi9UVl2/lL/n+rNj7pkdfOL+5sJtFD1k4psk0Ojg9sIzHkTPwUdEvdqXlNT57mjoKAPnQhHIr7KfaWNJkGpqHSv8YjP58nPK/yCc/YQi0Y7vBWv4PMIJPziXAYEB9586oM9Tofj0yR7Bn7LUkVFxbr8LfduXut27crIWLWfOptNVQeuXB557PjxGtqrcTDIZQ0IVoByrHEE0SnMV4QU5dsrwyOv0ifSuJYvDkKeiw5BBxkEzqnN6+/cUOClf8Xs5MxWSODSPK1xAiujEUX5eX5h/uMjh8ovUF4BAnWErONWgBAgABplzFMhUUj2FTorzv4F+nTwtWh/YXQAAAAASUVORK5CYII=);
            margin-right: 10px;
          }
        }
      }
      .login-out {
        padding: 0 10px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        span {
          cursor: pointer;
          color: #6d757a;
          font-size: 12px;
        }
      }
    }
    .isHover {
      transform: scale(2) translateY(15px);
      &::before {
        content: "";
        display: block;
        background-color: #23ade5;
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: 50%;
        opacity: 0;
        animation: bowen cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.6s;
      }
    }
  }
  .login-box {
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    .content {
      background: #fff;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url(//ftp.qnets.cn/bilibilibuy/banner.jpg);
      border-radius: 8px;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
      width: 330px;
      padding: 25px 45px 40px;
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      margin: -200px auto auto;
      .close {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAtUlEQVR42r2WXQqAIBCEvV5vvm337xqhaViIWG06OwuCIc7XqvvjYoxLCGHLI829A1vWrPQXVyaX7WmsQNhaNE/LrBYIgyYNqWE3MLvcLsxCW88qTf/4N+VbEJ51HUBA1TAEdHjvyMbp0/kjALt/jRDysX0KwmEKKB72AbWBKaB4GB1IPVLqo6GGBTXwqamNmryp5cm4AItNidFovTRRYhBO/qlNFIuE0etLoXmxhV59KbXVPwB0FxsrSpPB6gAAAABJRU5ErkJggg==);
        cursor: pointer;
        position: absolute;
        top: 14px;
        right: 14px;
        width: 14px;
        height: 14px;
      }
      .login {
        position: relative;
        .login-soma {
          line-height: 1;
          margin-top: 50px;
          text-align: center;
          padding: 26px 0 0;
          position: relative;
          .qrcode {
            width: 165px;
            height: 165px;
            margin: 0 auto;
          }
          .qr-title {
            color: #222;
            font-size: 18px;
            letter-spacing: 3px;
            margin-bottom: 8px;
          }
          .qr-text {
            font-size: 14px;
            position: relative;
            z-index: 9;
            line-height: 20px;
            #app-link {
              font-size: 12px;
              text-decoration: none;
              &:visited,
              :active {
                color: #00a1d6;
              }
              &:hover {
                color: #f35c8f;
              }
            }
          }
          .bg {
            position: absolute;
            left: -27px;
            bottom: 60px;
            z-index: 3;
          }
          #download-app {
            background: #fff;
            display: block;
            padding: 20px 0;
            position: absolute;
            top: 6px;
            left: 91px;
            z-index: 4;
            #app-qrcode {
              width: 140px;
              height: 140px;
              margin: 12.5px auto;
              background: url(//ftp.qnets.cn/bilibilibuy/qrcode-app.png);
            }
          }
          #tv {
            background: url(//ftp.qnets.cn/bilibilibuy/tv.gif) 0 0 no-repeat;
            width: 70px;
            height: 70px;
            position: absolute;
            top: -27px;
            left: 85px;
            z-index: 9;
          }
          #qr-reload,
          #qr-success {
            background: rgba(255, 255, 255, 0.8);
            color: #0594c7;
            font-size: 12px;
            position: absolute;
            top: 39px;
            left: 95px;
            width: 140px;
            height: 140px;
            z-index: 3;
            .qr-title {
              background: #fff;
              position: absolute;
              top: 149px;
              left: -5px;
              padding: 5px;
              width: 140px;
              color: #222;
              font-size: 18px;
              letter-spacing: 3px;
              margin-bottom: 8px;
            }
          }
          #qr-reload {
            .reload-btn {
              background: url(//ftp.qnets.cn/bilibilibuy/qr-refresh.png) 8px 3px
                no-repeat #fff;
              border-radius: 3px;
              box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
              cursor: pointer;
              margin: 40px auto;
              width: 60px;
              padding: 43px 0 5px;
            }
          }
          #qr-success {
            .success {
              background: url(//ftp.qnets.cn/bilibilibuy/qr_code_sc.png)
                no-repeat;
              border-radius: 3px;
              cursor: pointer;
              margin: 40px auto;
              width: 60px;
              padding: 60px 5px 8px 5px;
            }
          }
        }
        .login-explain {
          width: 100%;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #99a2aa;
          text-align: center;
          line-height: 16px;
          position: absolute;
          left: 0;
          bottom: -26px;
          a {
            color: #00a1d6;
          }
        }
      }
    }
  }
}

.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s;
}
.panel-enter,
.panel-leave-active {
  opacity: 0;
}
@keyframes bowen {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}
</style>