<template>
  <div class="footer">
    <div class="footer-wrp">
      <div class="top-line"></div>
      <div class="content">
        <ul class="postcards">
          <li>
            <div class="tips">bilibili</div>
            <div class="cards" v-for="(item,index) in liData1" :key="index">
              <a href>{{item.title}}</a>
            </div>
          </li>
          <li>
            <div class="tips">传送门</div>
            <div class="cards" v-for="(item,index) in liData2" :key="index">
              <a href>{{item.title}}</a>
            </div>
          </li>
          <li>
            <div class="block right">
              <a target="_blank" href="//app.bilibili.com/">
                <div class="phone">
                  <div class="pic"></div>
                  <span>手机端下载</span>
                  <div class="code-pop">
                    <div class="code-box code-app">
                      <div class="arrow"></div>
                    </div>
                  </div>
                </div>
              </a>
              <a target="_blank" href="http://weibo.com/bilibiliweb">
                <div class="weibo">
                  <div class="pic"></div>
                  <span>新浪微博</span>
                  <div class="code-pop">
                    <div class="code-box code-weibo">
                      <div class="arrow"></div>
                    </div>
                  </div>
                </div>
              </a>
              <a id="weixin">
                <div class="weixin">
                  <div class="pic"></div>
                  <span>官方微信</span>
                  <div class="code-pop1">
                    <div class="code-box code-weixin">
                      <div class="arrow"></div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </li>
        </ul>
        <div class="partner">
          <div class="partner-banner"></div>
          <div class="Domain">
            <p>
              广播电视节目制作经营许可证：
              <span>（沪）字第1248号</span>
              | 网络文化经营许可证：
              <span>沪网文[2013]0480-056号</span>
              | 信息网络传播视听节目许可证：
              <span>0910417</span>
              互联网ICP备案：
              <span>沪ICP备13002172号-3</span>
              沪ICP证：
              <span>沪B2-20100043</span>
              | 违法不良信息举报邮箱：help@bilibili.com | 违法不良信息举报电话：4000233233 转 3 ｜
              <a
                href
                target="_blank"
              >
                <span>营业执照</span>
              </a>
            </p>
            <p>
              网上有害信息举报专区：
              <a href="http://www.12377.cn/?spm=a2hww.20023042.0.0" target="_blank">
                <img
                  src="//static.hdslb.com/images/12377.png"
                  width="16"
                  height="16"
                  style="vertical-align: sub;"
                /> 中国互联网违法和不良信息举报中心
              </a> |
              <a href="http://www.shjbzx.cn" target="_blank">
                <i class="icons-footer-report"></i>
                <span>上海互联网举报中心</span>
              </a> |
              <a href="http://jb.ccm.gov.cn/" target="_blank">12318 全国文化市场举报网站</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      liData1: [
        { title: "关于我们", href: "" },
        { title: "友情链接", href: "" },
        { title: "哔哩哔哩周边", href: "" },
        { title: "联系我们", href: "" },
        { title: "加入我们", href: "" },
        { title: "官方认证", href: "" }
      ],
      liData2: [
        { title: "帮助中心", href: "" },
        { title: "高级弹幕", href: "" },
        { title: "活动专题页", href: "" },
        { title: "侵权申诉", href: "" },
        { title: "分院帽计划", href: "" },
        { title: "活动中心", href: "" },
        { title: "用户反馈论坛", href: "" },
        { title: "壁纸站", href: "" },
        { title: "名人堂", href: "" }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.footer {
  width: 100%;
  color: #99a2aa;
  text-align: center;
  .footer-wrp {
    height: 222px;
    padding-bottom: 40px;
    .top-line {
      width: 980px;
      height: 1px;
      margin: 0 auto 30px;
      border-top: 1px solid #e5e9ef;
    }
    .content {
      width: 1160px;
      margin: 0 auto;
      .postcards {
        list-style: none;
        margin: 0 auto;
        float: left;
        margin-bottom: 30px;
        li {
          float: left;
          text-align: left;
          list-style: none;
          height: 112px;
          line-height: 1;
          border-left: 1px solid #e5e9ef;
          font-size: 14px;
          padding-right: 40px;
          padding-left: 39px;
          width: 360px;
          &:first-child {
            border-left: 0;
            padding-left: 0 !important;
          }
          &:last-child {
            width: 280px;
            padding-right: 0;
          }
          .tips {
            margin-bottom: 22px;
          }
          .cards {
            width: 120px;
            float: left;
            position: relative;
            margin-bottom: 16px;
          }
          .right {
            position: relative;
            width: 100%;
          }
          .block {
            .phone,
            .weibo,
            .weixin {
              position: relative;
              width: 82px;
              height: 80px;
              float: left;
              span {
                float: left;
                position: absolute;
                width: 82px;
                line-height: 14px;
                bottom: 0;
                left: 0;
                text-align: center;
              }
              .code-pop {
                width: 130px;
                height: 130px;
                background: #fff;
                margin-top: -206px;
                right: -23px;
                position: absolute;
                visibility: hidden;
                opacity: 0;
                transition: 0.2s;
                z-index: 100000;
                .code-box {
                  width: 128px;
                  height: 128px;
                  border: 1px solid #e5e9ef;
                }
                .code-app {
                  background: url(//static.hdslb.com/images/base/app-qrcode.png)
                    50% no-repeat;
                }
                .code-weibo {
                  background: url(//static.hdslb.com/images/base/weibo-qrcode.png)
                    50% no-repeat;
                }
                .arrow {
                  width: 130px;
                  height: 141px;
                  background: url(//static.hdslb.com/ad-images/wx-arrow.png)
                    bottom no-repeat;
                }
              }
              .code-pop1 {
                width: 260px;
                height: 150px;
                margin-top: -226px;
                background: #fff;
                right: -23px;
                position: absolute;
                visibility: hidden;
                opacity: 0;
                transition: 0.2s;
                z-index: 100000;
                .code-box {
                  width: 258px;
                  height: 148px;
                  border: 1px solid #e5e9ef;
                }
                .code-weixin {
                  background: url(//static.hdslb.com/ad-images/wx.gif) 50%
                    no-repeat;
                }
                .arrow {
                  width: 130px;
                  height: 141px;
                  background: url(//static.hdslb.com/ad-images/wx-arrow.png)
                    bottom no-repeat;
                  margin-left: 128px;
                  margin-top: 20px;
                }
              }
              &:hover {
                .code-pop,
                .code-pop1 {
                  opacity: 1;
                  visibility: visible;
                }
              }
            }
          }
          .pic {
            position: relative;
            margin-left: 11px;
            width: 60px;
            height: 60px;
          }
          .phone .pic {
            background: url(//static.hdslb.com/images/base/icons.png) no-repeat -1024px -194px;
          }
          .weibo .pic {
            background: url(//static.hdslb.com/images/base/icons.png) no-repeat -1024px -322px;
          }
          .weixin .pic {
            background: url(//static.hdslb.com/images/base/icons.png) no-repeat -1024px -66px;
          }
          a:hover {
            color: #2db0dc;
          }
        }
      }
      .partner {
        clear: both;
        padding: 0;
        text-align: left;
        margin: 0 auto;
        height: 80px;
        display: flex;
        .partner-banner {
          display: inline-block;
          background: url(//static.hdslb.com/images/v2images/footpic.png)
            no-repeat;
          width: 100px;
          height: 80px;
        }
        .Domain {
          flex: 1;
          margin-left: 14px;
          margin-right: 68px;
          p {
            line-height: 24px;
            font-size: 12px;
          }
          a {
            color: #99a2aa;
            .icons-footer-report {
              display: inline-block;
              *display: inline;
              *zoom: 1;
              vertical-align: middle;
              width: 16px;
              height: 16px;
              margin-right: 3px;
              background: url(//static.hdslb.com/images/base/icons.png)
                no-repeat;
              background-position: -1367px -89px;
            }
            &:hover {
              color: #222;
            }
          }
        }
      }
    }
  }
}
</style>