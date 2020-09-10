<template>
  <div class="content-box">
    <div class="detail-box">
      <div class="notice-box con-box" v-if="detail.bulletin.length != 0">
        <div class="notice">
          <div class="notice-header">
            <span class="notice-icon"></span>
            <span class="title">公告</span>
          </div>
          <div class="notice-list">
            <div
              class="notice-item"
              :class="index==0?'active':''"
              v-for="(item,index) in detail.bulletin"
              :key="index"
            >
              <span class="notice-item-time">{{item.time}}</span>
              <span class="circle"></span>
              <span class="notice-item-title" @click="toBulletin(item.id)">{{item.title}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="guests-box con-box" v-if="detail.guests.length != 0">
        <div class="guests">
          <div class="guests-header">
            <span class="guests-icon"></span>
            <span class="title">参展嘉宾</span>
          </div>
          <div class="guests-list">
            <div class="left-btn">
              <div class="left" v-if="xMove < 0" @click="touch(768)"></div>
            </div>
            <div class="content">
              <div
                class="content-item"
                @click="clickGuest(item)"
                v-for="(item,index) in detail.guests"
                :key="index"
              >
                <img :src="item.guest_img" />
                <div class="name">{{item.name}}</div>
              </div>
            </div>
            <div class="right-btn">
              <div
                class="right"
                v-if="xMove > Math.floor((detail.guests.length-1)/6)*(-768)"
                @click="touch(-768)"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="activity-box con-box">
        <div class="activity-detail">
          <div class="activity-header">
            <span class="activity-icon"></span>
            <span class="title">活动详情</span>
          </div>
          <div class="activity-body">
            <div v-for="(item,index) in detail.performance_desc.list" :key="index">
              <div v-if="item.module=='base_info'">
                <div class="info-header">
                  <span>基础信息</span>
                </div>
                <div class="info-body">
                  <div class="info-item" v-for="(item1,index1) in item.details" :key="index1">
                    <span>{{item1.title}}</span>
                    <span>{{item1.content}}</span>
                  </div>
                </div>
              </div>
              <div v-if="item.module=='ticket_desc'">
                <div class="info-header">
                  <span>票种说明</span>
                </div>
                <div class="info-body">
                  <div class="list">
                    <div
                      class="info-item1"
                      v-for="(item1,index1) in item.details.ticket_list"
                      :key="index1"
                    >
                      <span>{{item1.name}}</span>
                      <span>¥{{item1.price}}</span>
                      <p v-if="item1.welfare!=''">特别福利：{{item1.welfare}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="item.module=='custom'">
                <div class="info-header">
                  <span>{{item.module_name}}</span>
                </div>
                <div class="info-body">
                  <div class="info-content" v-html="item.details"></div>
                </div>
              </div>
              <div class="info-body" v-if="item.module=='videos'">
                <div class="video-box" v-html="item.details"></div>
              </div>
              <div v-if="item.module=='activity_content'">
                <div class="info-header">
                  <span>活动介绍</span>
                </div>
                <div class="info-body">
                  <div class="info-content" v-html="item.details"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="comment-box con-box">
        <div class="comment">
          <input-form @login="login" @sumbitComment="sumbitComment"></input-form>
          <div class="comment-tabs">
            <span
              class="all-comment"
              :class="activeTabs==0?'active':''"
              @click="isHot=false;comment(0)"
            >全部讨论</span>
            <span
              class="sortByHot"
              :class="activeTabs==1?'active':''"
              @click="isHot=true;comment(0)"
            >按热度排序</span>
            <paginations
              v-if="total!=0"
              :page="$store.state.comment_page"
              :isLeftTotal="true"
              :total="total"
              @getCommentList="getCommentList"
              @clickPage="commentPage"
            ></paginations>
          </div>
          <div class="comment-list">
            <div class="comment-item" v-for="(item,index) in commonList" :key="index">
              <img class="user-img" :src="item.userinfo.avatar" />
              <div class="user-content">
                <div class="user-name">
                  {{item.userinfo.uname}}
                  <span class="level" :class="'level'+item.userinfo.level"></span>
                </div>
                <div class="user-message">
                  <div class="detail-message active detail-messages">
                    <p class="detail-message-p" v-html="item.content.replace(/\n/g,'<br/>')"></p>
                  </div>
                  <div
                    class="icon-show"
                    :style="arrs[index]?'display:block;':''"
                    @click="showAll($event,index)"
                  >展开</div>
                </div>
                <div class="user-imgs clearFloat">
                  <div class="img-item" v-for="(item1,index1) in item.imgs" :key="index1">
                    <div :style="{backgroundImage:'url('+item1+')'}"></div>
                  </div>
                </div>
                <div class="floor">
                  <div class="time">{{item.ctime | formatDate}}</div>
                  <div class="icon-up"></div>
                  <div class="link-num" v-if="item.upCount!=0">{{item.upCount}}</div>
                  <div class="reply">回复</div>
                </div>
                <div class="reply-comment-list">
                  <div
                    class="reply-comment-item"
                    v-for="(item,index) in item.subCommentList"
                    :key="index"
                  >
                    <img :src="item.userinfo.avatar" />
                    <div class="reply-comment-item-content">
                      <div class="detail-message active">
                        <span class="name">{{item.uname}}</span>
                        <span class="level" :class="'level'+item.userinfo.level"></span>
                        <span class="content">{{item.content}}</span>
                      </div>
                    </div>
                    <div class="floor">
                      <div class="time">{{item.ctime | formatDate}}</div>
                      <div class="icon-up"></div>
                      <div class="link-num" v-if="item.upCount!=0">{{item.upCount}}</div>
                      <div class="reply">回复</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="no-comment" v-if="total==0">
              <div class="no-comment-img"></div>
              <p class="no-comment-tip">暂无评论，抢占第一条评论吧~</p>
            </div>
          </div>
          <div class="pagination-box1">
            <div class="jump">
              <paginations
                v-if="total!=0"
                :page="$store.state.comment_page"
                @toMove="toMove"
                @jump="jump"
                v-model="inputValue"
                :isRightTotal="true"
                :total="total"
                @getCommentList="getCommentList"
                @clickPage="commentPage"
              ></paginations>
            </div>
          </div>
          <input-form v-if="total!=0" @login="login" @sumbitComment="sumbitComment"></input-form>
        </div>
      </div>
    </div>
    <div class="recommend-box">
      <div class="tickets-tips-box">
        <div class="tickets-tips">
          <div class="tickets-tips-header">
            <span></span>购票须知
          </div>
          <div class="tickets-tips-content">
            <p>1、会员购在线售票为电子票或纸质票。</p>
            <p>
              2、如您购买的是电子票，入场时请在bilibili APP中【订单中心】打开电子票检票入场
              <strong>（部分活动需兑换实体票入场）；电子票不得转售，</strong>请在正规途径购买；
              <strong>电子票截图无法入场。</strong>
            </p>
            <p>
              3、如您购买的是纸质票，
              <strong>需在购票时填写准确配送信息，</strong>纸质票将在活动开始之前寄出，邮费由用户承担；因纸质票的特殊性，
              <strong>遗失不补且无法挂失，</strong>请您保管好购买到的票品。
            </p>
            <p>4、部分活动不提供现场售票服务，请您提前购买。</p>
            <p>
              5、因票品具有稀缺性和时效性的特点，一旦退货将会影响二次销售，
              <strong>票品均不支持七天无理由退票，</strong>请您理解并审慎购买，
              <strong>并非所有项目主办方都支持因个人原因发起的退票，</strong>具体请以各商品展示页说明信息为准，请您在购买前仔细阅读商品信息。
            </p>
            <p>
              6、
              <strong>若所购项目主办方支持因个人原因退票，您在因个人原因退票时需支付一定比例的手续费,</strong>具体比例您可在
              <span @click="isShowGpfwxy=true">《bilibili购票服务协议》</span>中查询。
            </p>
            <p>7、为保障您的人身安全，主办方在人流高峰可能会采取临时现场限流措施，如对您的正常观展产生影响，敬请谅解。</p>
            <p>8、若有其他问题请联系客服：客服入口在移动端APP “我的” 个人中心，点击“我的客服”，选择“在线客服”，即可咨询。</p>
            <p>
              9、
              <span @click="isShowHygxy=true">《会员购服务协议》</span>
            </p>
          </div>
        </div>
        <div class="merchant-section" v-if="detail.merchant_id != 0">
          <div class="merchant-header">
            <span></span>主办方信息
          </div>
          <div class="merchant-content">
            <div class="content-item">
              <div class="title">主办名称</div>
              <div class="content">{{detail.merchant.company}}</div>
            </div>
            <div class="content-item" v-if="detail.merchant.license_img!=''">
              <div class="title">
                营业执照
                <div class="fold-btn" @click="isOpenLicense=!isOpenLicense">
                  <span v-text="isOpenLicense?'收起图片':'查看图片'"></span>
                  <i class="icon-fold-btn" :class="isOpenLicense?'close':'open'"></i>
                </div>
              </div>
              <div class="content" :style="isOpenLicense?'':'display:none;'">
                <img :src="detail.merchant.license_img" />
              </div>
            </div>
          </div>
        </div>
        <div class="merchant-section">
          <div class="merchant-content">
            <div class="content-item notitle">
              <div class="title">联系我们</div>
              <div class="content">
                如果您有合作意向请与我们联系:
                <br />kfbd@bilibili.com
              </div>
            </div>
          </div>
        </div>
        <div class="rec-list-box">
          <div class="rec-list">
            <div
              class="rec-item"
              @click="clickRec(item.id)"
              v-for="(item,index) in recommndList"
              :key="index"
            >
              <img :src="item.banner" />
              <div class="rec-item-name">{{item.project_name}}</div>
              <div class="rec-item-time">{{item.tlabel}}</div>
              <div class="rec-item-vuene">{{item.venue_name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="guests-pop" v-if="isShowGuest">
      <div class="guests-pop-mask"></div>
      <div class="guests-pop-content">
        <i class="icon-close" @click="close"></i>
        <div class="contents">
          <div class="contents-body">
            <img :src="guestInfo.guest_img" />
            <div class="guest-info">
              <div class="guest-name">{{guestInfo.name}}</div>
              <div class="guest-description">{{guestInfo.description}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <gpfwxy v-if="isShowGpfwxy" @close="isShowGpfwxy=false"></gpfwxy>
    <hygxy v-if="isShowHygxy" @close="isShowHygxy=false"></hygxy>
  </div>
</template>

<script>
import qs from "qs";
import inputForm from "../detail/inputForm.vue";
import hygxy from "../hygxy.vue";
import gpfwxy from "../gpfwxy.vue";
import paginations from "../detail/pagination.vue";
import { formatDate } from "../../assets/js/date.js";
export default {
  props: ["detail"],
  data() {
    return {
      xMove: 0,
      isShowGuest: false,
      isShowHygxy: false,
      isShowGpfwxy: false,
      guestInfo: [],
      activeTabs: 0,
      arrs: [], //判断是否显示 展开/收起,
      total: null,
      isHot: false,
      inputValue: "",
      commonList: {},
      isOpenLicense: false,
      recommndList: {}
    };
  },
  methods: {
    clickGuest(item) {
      this.isShowGuest = true;
      this.guestInfo = item;
      console.log(item);
    },
    touch(x) {
      this.xMove += x;
      let el = document.getElementsByClassName("content-item");
      for (let i = 0; i < el.length; i++) {
        el[i].style.cssText =
          "transform: translate3d(" + this.xMove + "px, 0px, 0px)";
      }
    },
    close() {
      this.isShowGuest = false;
    },
    showAll(event, index) {
      let _el = event.currentTarget;
      if (_el.innerText == "展开") {
        _el.classList.add("roate");
        let e = document.getElementsByClassName("detail-messages");
        e[index].classList.remove("active");
        _el.innerText = "收起";
      } else {
        let e = document.getElementsByClassName("detail-messages");
        _el.classList.remove("roate");
        e[index].classList.add("active");
        _el.innerText = "展开";
      }
    },
    async comment(tip) {
      if (tip == 0) {
        this.$store.commit("comment_page", 1);
      }
      if (this.isHot == false) {
        this.activeTabs = 0;
        const { data: data } = await this.$http.get(
          "/bili//ticket/comment/alllist?pageNum=" +
            this.$store.state.comment_page +
            "&pageSize=10&subjectId=" +
            this.detail.id +
            "&subjectName=" +
            this.detail.name +
            "&subPageSize=3&subjectType=2&timestamp=" +
            Math.round(new Date().getTime())
        );
        this.commonList = data.data.commonList;
        // console.log(data.data.commonList);
      } else {
        this.activeTabs = 1;
        const { data: data } = await this.$http.get(
          "/bili/ticket/comment/allhotlist?pageNum=" +
            this.$store.state.comment_page +
            "&pageSize=10&subjectId=" +
            this.detail.id +
            "&subjectType=2"
        );
        this.commonList = data.data.hotList;
        // console.log(data.data.hotList);
      }
      this.$nextTick(function() {
        this.arrs = [];
        let that = this;
        let el = document.getElementsByClassName("detail-message-p");
        Array.from(el).forEach(function(item, index) {
          if (el[index].offsetHeight > 80) {
            that.arrs.push(true);
          } else {
            that.arrs.push(false);
          }
        });
      });
      console.log("当前页数:" + this.$store.state.comment_page);
    },
    getCommentList() {
      this.comment();
    },
    toMove() {
      let el = document.getElementsByClassName("comment")[0];
      this.$nextTick(function() {
        window.scrollTo({ behavior: "smooth", top: el.offsetTop - 50 });
      });
    },
    jump() {
      if (
        this.inputValue <= Math.ceil(this.total / 10) &&
        this.inputValue > 0 &&
        this.inputValue != this.$store.state.comment_page
      ) {
        this.$store.commit("comment_page", Number(this.inputValue));
        this.toMove();
        this.comment();
        this.inputValue = "";
      }
    },
    commentPage(page) {
      this.$store.commit("comment_page", page);
    },
    async getRecommndList() {
      const { data: data } = await this.$http.get(
        "/bili/ticket/project/recommendToYou?item_id=" +
          this.detail.id +
          "&buvid=E1781F0F-F91D-43E4-86C2-A7A37D5A8D7553919infoc&scn_code=detail"
      );
      this.recommndList = data.data.items;
      console.log(data.data.items);
    },
    clickRec(id) {
      window.open("#/detail?id=" + id);
    },
    toBulletin(id) {
      window.open("#/announcement?id=" + id + "&projectId=" + this.detail.id);
    },
    login() {
      this.$emit("login");
    },
    sumbitComment(comment) {
      let timestamp = new Date().getTime();
      this.$http({
        url: "/bili/ticket/comment/add",
        method: "POST",
        data: qs.stringify({
          atMids: "",
          content: comment,
          imgs: "",
          subjectId: this.detail.id,
          subjectName: this.detail.name,
          subjectType: "2",
          timestamp: timestamp
        })
      }).then(res => {
        //TODO
        this.comment();
        this.$toast("评论成功~");
      });
    }
  },
  async created() {
    this.comment();
    const { data: data } = await this.$http.get(
      "/bili/ticket/comment/allhotlist?pageNum=" +
        this.$store.state.comment_page +
        "&pageSize=10&subjectId=" +
        this.detail.id +
        "&subjectType=2"
    );
    this.total = data.data.total;
    this.getRecommndList();
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  components: {
    inputForm,
    paginations,
    hygxy,
    gpfwxy
  }
};
</script>

<style lang="less" scoped>
.content-box {
  display: flex;
  width: 1160px;
  margin: 0 auto;
  .detail-box {
    width: 850px;
    box-sizing: border-box;
    .notice-icon,
    .guests-icon,
    .activity-icon {
      margin-right: 10px;
      width: 18px;
      height: 16px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .notice-box {
      width: 100%;
      .notice {
        padding: 20px;
        margin-top: 10px;
        border: 1px solid #e7ecf1;
        border-radius: 4px;
        background: #fff;
        box-sizing: border-box;
        .notice-header {
          display: flex;
          .notice-icon {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAABIlJREFUWAm1l11oHFUUx8+5M5NN90tLrKU+iIbGgopV0Xw8SesXKgoKsVXZpA81NdVGkwdRRN0XP0DoNoFWCtbqRouWgg95rCS+iA8WLCrYQlIQbbQRP7K7kybs3ns8d+osu5td985+DOzeuV//89tzzzkzi9CiK5M49CwAjfBnGxKuAMKXjrDe7Px4bCGICQyyuNpaSs7ZuYWznxDRrsp5RFwRQPdEpifOVM7V6otaEybj/8Gc0DD8ywoI4m2GuBlt3AGA53k8rADTJlr+moY9VAIzqGFA4FOx9PgpXzibeP9aoNVFArIsW/RGPnrpW3/u/9qGPFQPRhuMTY8ucfODvqcC3aRbkyswkAmMb5gALup7buP+WL3WrregdN4EhgZPWsudv96BAjejhCjDBLqMgUxhMpHf7xYSNoEi4IAOBw1SoyPzYObPfspZUzWAtQv0mmzotz6UhU2+S4LC6H11PVSEAXqyWjZpERo56mQvfN8HKDfqfjNXEUiLuqvu0wTYx1G4jc1YWpiLXhen7q01YQZPduTWFvuB1FXNgOQSh94BUEseUHb44C25yy4fCWz3cqJMmRGr1Bm9hA5Mhf75++KApShWtiVgxx1JbZEr6hUuqnmb9h+OZrNrM+yVGxFhiavth2zqPGtKX5cz5QwXvZ/8vm5pz/HO3HJmwEKKlo43ci9WhSPZHMeoY7vZ/Gsahkv9BbCt/ujxsT/qiS6OHA0vr2UGBMlwvbVB520FaqfeJIR43QSGEu9F3NWVAUW0Iagxk/U2Am7noAVbQN1nzZ/PTMWXRaFfKAqZiDeyxuZz88RJwZoWmEsm7Tvn4zcoUR6ogqwOEPIaVGBUuxqB0XuKae8L9C503S4xv8Uizq2yS3FWlg20pbPu1xZEYXNbLBmKCo6hK88/x/JcgorWQRpqtWSZYJp5rSQLcmtLFJsUEYjkZZeSaqxJrZZsF2Dbb3HJ5gyjx7KJg6f4vLbyIW5AZYe8D6DTqCVE9TVX/3NOB86aanhxkxlK7WWII7p0V27UMUZIXwFak0AycJ7FpydmKjUr+5eHJq/PK/mzHvcCOJ4e/4C9dBcgzvAvKnt0cNFErps7kOTLDNWWgO/svm1Re5IZZiuLjQdPe1JXgxXzjOcKmftAof7f5fCmOQroKRMPaaOUJIFJVFWBPKqSr8zQ5ONI6vMrUDhLKKZMj88UyDdndATx9ItfMMQudmmeoXaikgfadXxGQJq+DArgXvbYC+2AMjoy3526rTi+0+y5w7WOj4tcD7+Fdkc7Ym/gsb1/lerUujf2kC9Q5imi+4VS+2t5SinYzUf8vJvPPezvr9cGBtKCpVAK6AFBanQdFCcN5063B6DgUj0Qf74hIL1ZQ3GzWwc6vz0+KIie438DxdcZBPkoz3fxq3EmEne+0XtMrsAxVCmaTaSe4LHPvJIAcIkf1ucY4jr2To+3VsCr8fTEu5X7avWbBtLC7nDqESXhGFf14rsUCxcI8UR8eny4lvFq4y0B0sI0emSj6+YfIqV6hIBfwLG+C/eGfsR9+/LVDNca+xf5GQalv11CrAAAAABJRU5ErkJggg==);
          }
          .title {
            font-size: 16px;
            color: #212121;
            line-height: 16px;
          }
        }
        .notice-list {
          padding: 0 20px;
          .notice-item {
            display: flex;
            align-items: center;
            font-size: 14px;
            margin-top: 15px;
            .notice-item-time {
              color: #99a2aa;
              width: 50px;
              margin-right: 10px;
            }
            .circle {
              border-radius: 50%;
              width: 11px;
              height: 11px;
              background: #b6c2cc;
              position: relative;
            }
            .notice-item-title {
              margin-left: 10px;
              &:hover {
                cursor: pointer;
                color: #f25d8e;
              }
            }
          }
          .notice-item:not(:last-child) {
            .circle {
              &::before {
                position: absolute;
                content: "";
                border-left: 1px dashed #b6c2cc;
                height: 30px;
                left: 5px;
                bottom: -30px;
              }
            }
          }
          .active {
            .notice-item-time {
              color: #f25d8e;
            }
            .circle {
              &::before {
                border-left: 1px dashed #f25d8e !important;
              }
              background-repeat: no-repeat;
              background-size: 100% 100%;
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAodJREFUOBG1lTFoU1EUhs95eaRp2hgzKUYEHazoaGml4OgkVkERHBTFqW51EXUQBysuZmsnUXQQ1MFUXHQURKWKS8U6VBBTdEpi0jQN7+V6/tt3433pS42VHgjJfeecL+fee87/mDqYGpvMLFaXjyoi+ai9pHibDmW1wMSfmCjf19+T56kLxSiE+MOmzt5NVPzSOCl1STzpsHfVqkzMt1KxzTm+d65ue0Pg2pmprKfqTwU6iCB33w5yDwyQuydLnOnXeapYJe9zgbw3c+TNflthMc+4nDiWvD9WWHlA1AID6qult0pR1tmaocT5QxQT4Frmyx/U77yk5o+iFE6FGPcOG7gGB9t/hUrdge3Ue3GUKNmzFvOPr7ZMS7enyZv7LmXyjBzLQRyLg4jgTAdR6T9BkSwFIAe5KEyz5DHj9iuV+lf5nU5ePblq+/6XAjWev6fm/E9gyNm1heKH91Nsd/iYcCy1G48QUk6lEjtdtJQs0rio9jNtPHtHjcevpRBpusCaH6rkf5yn+IkRih8ZMo91LhhyoWkwHfQpvLh923SlT8JQ41dNRQ3xIcY2wwBTwNL8Ymgp27B9ADqZhkuMbYYBpmMmyvSpCTRnatZR3+0xLYZMqe6KqKR1PbM26EhfLACCibINt/83a49RpYAhTAeCAgDG1Da0FIu3k8GHGNsMgxXNIjUPJ2bfNvRp/PhIJFxDpd3ae9kwmHnahfTJgJTRf2hyu5fjo0N63e2ABKJU1nKKKn+dzl2WKZjAWPZdP9W9Tpgtil4sXnuoxUj04sqmB+M3dVdATyEgUCkICklg1xaIEHIDEcoht3U765fNF1JpSZgRsmmq2xChN/ANeTUZOL7/92X6G+0RXaX/hsIpAAAAAElFTkSuQmCC);
            }
          }
        }
      }
    }
    .guests-box {
      width: 100%;
      .guests {
        background: #fff;
        padding: 20px 0;
        margin-top: 10px;
        width: 850px;
        height: 190px;
        border: 1px solid #e7ecf1;
        border-radius: 4px;
        box-sizing: border-box;
        .guests-header {
          display: flex;
          padding: 0 20px;
          font-size: 16px;
          color: #212121;
          line-height: 16px;
          .guests-icon {
            background-image: url(data:image/png;base64,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);
          }
        }
        .guests-list {
          display: flex;
          align-items: center;
          .left-btn,
          .right-btn {
            height: 30px;
            width: 30px;
            box-sizing: border-box;
            .left,
            .right {
              cursor: pointer;
              width: 30px;
              height: 30px;
              background-repeat: no-repeat;
              background-size: 100% 100%;
            }
          }
          .left-btn {
            margin-left: 10px;
            .left {
              background-image: url(data:image/png;base64,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);
              &:hover {
                background-image: url(data:image/png;base64,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);
              }
            }
          }
          .right-btn {
            margin-right: 10px;
            .right {
              background-image: url(data:image/png;base64,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);
              &:hover {
                background-image: url(data:image/png;base64,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);
              }
            }
          }
          .content {
            overflow: hidden;
            padding-top: 20px;
            display: flex;
            flex: 1 1;
            text-align: center;
            .content-item {
              transform: translate3d(0px, 0px, 0px);
              transition: transform 0.6s;
              margin: 0 24px;
              img {
                display: block;
                width: 80px;
                height: 80px;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
                border-radius: 40px;
              }
              .name {
                margin-top: 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 80px;
                font-size: 12px;
              }
              &:hover {
                cursor: pointer;
                img {
                  box-shadow: 0px 0px 15px 0 rgba(242, 92, 142, 0.5);
                }
                .name {
                  color: #f25c8e;
                }
              }
            }
          }
        }
      }
    }
    .activity-box {
      width: 100%;
      .activity-detail {
        line-height: 20px;
        font-size: 14px;
        overflow: hidden;
        background: #fff;
        cursor: auto;
        display: inline-block;
        width: 850px;
        padding: 20px;
        margin-top: 10px;
        border: 1px solid #e7ecf1;
        border-radius: 4px;
        box-sizing: border-box;
        .activity-header {
          display: flex;
          font-size: 16px;
          color: #212121;
          line-height: 16px;
          .activity-icon {
            background-image: url(data:image/png;base64,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);
          }
        }
        .activity-body {
          .info-header {
            background-color: #f4f4f4;
            width: 100%;
            height: 30px;
            line-height: 30px;
            margin-top: 30px;
            span {
              font-size: 16px;
              color: #212121;
              margin-left: 10px;
              font-weight: 700;
            }
          }
          .info-body {
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            margin-top: 10px;
            .info-item {
              margin-top: 10px;
              &:first-child {
                margin-top: 0;
              }
              span:first-child {
                width: 60px;
                display: inline-block;
                box-sizing: border-box;
                vertical-align: top;
              }
              span:nth-child(2) {
                margin-left: 33px;
                display: inline-block;
                width: 690px;
                vertical-align: top;
                box-sizing: border-box;
              }
            }
            .list {
              width: 790px;
              display: flex;
              flex-wrap: wrap;
              .info-item1 {
                margin-top: 15px;
                width: 378px;
                position: relative;
                span {
                  margin-right: 10px;
                }
                p {
                  font-size: 12px;
                  color: #999;
                  margin: 8px 8px 0 0;
                }
              }
            }
            .video-box {
              width: 600px;
              height: 338px;
              margin: 20px auto;
            }
          }
        }
      }
    }
    .comment-box {
      width: 100%;
      .comment {
        background: #fff;
        cursor: auto;
        display: inline-block;
        width: 850px;
        padding: 0 20px 20px;
        margin: 10px 0 40px;
        border: 1px solid #e7ecf1;
        border-radius: 4px;
        box-sizing: border-box;
        .comment-tabs {
          display: flex;
          margin-top: 10px;
          align-items: center;
          box-shadow: inset 0 -1px 0 0 #e7ecf1;
          .all-comment,
          .sortByHot {
            position: relative;
            cursor: pointer;
            font-size: 14px;
            line-height: 14px;
            margin-top: 10px;
          }
          .all-comment {
            padding-bottom: 10px;
            margin-right: 40px;
          }
          .sortByHot {
            padding-bottom: 10px;
          }
          .active {
            color: #f25d8e;
            &::before {
              position: absolute;
              content: "";
              width: 100%;
              height: 3px;
              background: #f25d8e;
              bottom: 0;
              border-radius: 4px;
            }
          }
        }
        .comment-list {
          .comment-item {
            padding: 30px 0 0;
            display: flex;
            .user-img {
              margin-right: 30px;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              flex: none;
              display: block;
            }
            .user-content {
              box-shadow: inset 0 -1px 0 0 #e7ecf1;
              flex: 1 1;
              .user-name {
                font-size: 12px;
                line-height: 14px;
                color: #6d757a;
                display: flex;
                align-items: center;
              }
              .user-message {
                margin-top: 8px;
                font-size: 14px;
                color: #222;
                line-height: 20px;
                position: relative;

                .icon-show {
                  display: none;
                  width: 50px;
                  margin-top: 10px;
                  font-size: 14px;
                  line-height: 20px;
                  color: #fb7299;
                  cursor: pointer;
                  background-color: #fff;
                  &::after {
                    float: right;
                    content: "";
                    width: 12px;
                    height: 12px;
                    margin: 4px 0 0 8px;
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAQ9JREFUSA3tk7EOAUEQhmfdJRpHrtBK1MQLqJRKjQcQTyAanc47kEi8gUaLQqXmKXSiwZ6xv2QvHHe3TnQ3zV42s983mZkjSiPtwK8dEBoge+MFExXsrN0So85B3yc5uT8pS+a5IN5mNABwIq7Ls1zxYFrU99+egHu325qYa8RU8AWonATtlKSSVKLhqtiSYm2svNvxW4RKUbm8XJfKXCUSeyVtmLYrCLcdtymG7dOLIKkkDA7em+BbSRQ8VOBL1MAxk7B2xcEjBXESE3isIExCVy+HVdTbogeK/GB8nEEw6bFdT+1SP5BjAgfHSIDEV8nj5SaqcrxBGAuQDIl3kTP1dbQct4s9x30aaQf+24E7HGLGfyGbLgYAAAAASUVORK5CYII=)
                      100% no-repeat;
                    background-size: 12px 12px;
                    transition: all 0.6s ease-in-out;
                    -webkit-transition: all 0.6s ease-in-out;
                  }
                }
                .roate {
                  &::after {
                    transform: rotate(-180deg);
                  }
                }
              }
              .user-imgs {
                margin-top: 20px;
                max-width: 600px;
                .img-item {
                  float: left;
                  width: 110px;
                  height: 110px;
                  margin: 0 7px 7px 0;
                  border-radius: 2px;
                  overflow: hidden;
                  background: url(data:image/png;base64,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)
                    50% no-repeat;
                  background-size: 32px 32px;
                  background-color: #f4f5f7;
                  div {
                    width: 100%;
                    height: 100%;
                    background-position: 50%;
                    background-size: cover;
                  }
                }
              }
              .floor {
                position: relative;
                margin-top: 10px;
                display: flex;
                display: -webkit-flex;
                align-items: center;
                font-size: 12px;
                color: #6d757a;
                .time {
                  margin-right: 20px;
                }
                .icon-up {
                  cursor: pointer;
                  margin-right: 5px;
                  width: 14px;
                  height: 14px;
                  background-repeat: no-repeat;
                  background-size: 100% 100%;
                  display: inline-block;
                  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAy9JREFUSA29ll9o0lEUx6czGSVWi2o0CqygBVEEvgXCemu0nKVG0ENErw1iNtjToCCKgkZBrwUNIqeiIRIUVKxWLyOonip8iaKFFEPaz+a/Pke89tPs1881u3A8997vOed7z7n3d6+WjhZbOBzeYbFYzpXL5f24FujfdLlc4263O28mlM2MkbKJRCJ9EM0iK2UOMrrlsXQ6LXFGlZ2RthqBjVipVDopZBDdAVtDfw/6K+NQNBrd12jfbNwSIQF8EgSCi8FgcB55zfA2xJZisdgn2N+aaULKeYRg25E3fr//lQoM+YZq/7OaM9KmCDkodsp5SQJBMN4QsJKZzWZ71zDfdGiKEJILeG9DngUCgZiKxEIclHMXeNbn8y0P4dTU1EGCjkDyHTmhyERbrVYPagX4DKRlPfanvmGG7Ntugk2KMwFPc0je6wOBBavjWtZ6vFnf0mxS5ijXFtQM0gvZBKU8I/OqJZPJtQsLC58Yd4EfJ9s5hem01t3dPdvf359Tc00//Hg8vjmfzz8ig14M4+iQclA6l8sdot8lY/BJPgsF1elMJvOFbTnKgh8L8FuGfMBbcX4I5kIeOByOwYGBgR9irG/VRZ1nrnLr6DHVZyGb6MuF8AFxsSXFOkL2bC/HPwXYg9xHDmOkoZfc2JonOHsou4csp2uHRk4jZNOAPYBhtPdfyWSVxKq7EPR7eAt8FQZXuElG0aaOuQQ1apR1fRWXQ9hRyxBgHeNvpH12uciqRDdEE39YdI1QBu1oJBAlbpEkdkr8thNyNo7B00mGb/8LISQBIaLJqW9/hnBMCBElHRLd9pLC8RQpIfWnlIm2NO5YOZ1W9vClEDRm2BmLxdQLviwL4DIZlECU9LJo/Ycvt6+zUCjMcR3Jzf8co4jdbr/n9XqzYryURowS2cnbKS/LrwwBQog8R3IVbUSGMJxcXFz8yNG+mkgk5CJuqeHnJYYHJ40HofJZ1F3eKhoZrmZFg5QjyCIO4CSV0Oib+hshcfCRrZFHQMo5zAVwvdKXH6MmDzEOY9icqhIbmeuxEn4v8LnGI3BXAU0zVKBep1Ipp6ZpTv2cUZ8SZiGab7T5CSZVOrPKlh87AAAAAElFTkSuQmCC);
                }
                .like-num {
                  text-align: center;
                  display: inline-block;
                }
                .reply {
                  cursor: pointer;
                  margin-left: 20px;
                }
              }
              .reply-comment-list {
                margin-top: 30px;
                .reply-comment-item {
                  position: relative;
                  margin-bottom: 28px;
                  .reply-comment-item-content {
                    position: relative;
                    padding-left: 34px;
                    .detail-message {
                      display: flex;
                      align-items: center;
                      .name {
                        color: #6d757a;
                        font-size: 12px;
                      }
                      .level {
                        margin-left: 6px;
                        margin-right: 10px;
                      }
                      .content {
                        flex: 1;
                      }
                    }
                  }
                  .floor {
                    position: relative;
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                    font-size: 12px;
                    color: #6d757a;
                    padding-left: 34px;
                  }
                  img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 24px;
                    height: 24px;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    margin-right: 10px;
                    border-radius: 12px;
                  }
                }
              }
            }
          }
          .no-comment {
            .no-comment-img {
              width: 130px;
              height: 117px;
              margin: 10px auto 5px;
              background: url(//s1.hdslb.com/bfs/static/platform/static/img/comment_empty@2x.png)
                50% no-repeat;
              background-size: contain;
            }
            .no-comment-tip {
              font-size: 12px;
              color: #6d757a;
              text-align: center;
            }
          }
        }
        .pagination-box1 {
          margin-top: 25px;
          text-align: right;
          color: #99a2aa;
          .jump {
            font-size: 12px;
            display: flex;
            align-items: center;
            line-height: 36px;
            justify-content: flex-end;
          }
        }
      }
    }
  }
  .recommend-box {
    margin-top: 10px;
    width: 290px;
    box-sizing: border-box;
    margin-left: 20px;
    .tickets-tips-box {
      .tickets-tips {
        margin-bottom: 10px;
        border: 1px solid #e7ecf1;
        border-radius: 4px;
        padding: 0 20px;
        background: #fff;
        .tickets-tips-header {
          padding: 20px 0;
          span {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAABXRJREFUWAnVWF1oHFUUvufOTrvZnyQiYpNUEYuUhgotGiu1/jxIX0qK5iFaWvNn6w9tQvMgioJGoS8GmibBUmsbk2Cp9qFgJaUtCv6gKCIVFEEhaIsmfSlusrObTbJzj+fcdDe3O7Ob2cQHvQ/Zc8+c7zvf3HtnzpmAKHMgIqRb+u5TCDsJ+jAC1gqEWk0DOAEIE2R/JQHPRUa7fwAALCcFBA1mIanWgV0K1VsCcV0gHMC4BPl6dKTrdFBhgQRlOo6sn59XpxHFZhZCoBkE+JSSjIHAcbQsXhUBrluLAtaR+B2A+DgtTYX2g7hs23JXeOjgrzwvNZYUlGrt2+G6eIpIqkhJigB9sepQLwx2TZcixs6BSieRfYlEdQsUUYqdsizYHR3pHiuFKymIxSiF52hlJN3/96Gw1RQ50fVnKcLCa+m9A2uzGfesENgAIJSUsLOUqKKCnLbBe5U7/zXdXZy25mzMqt4Nw+2ZwoRB5tj2fthxE6doK5tolZPSsh+KDXf+5If1FYRnzljOJ3/9SAQbBcB3cav6MT8x2NMj01dvXSMwu0ZlRbUSKsxJpJAZGRIJAaFrkTuvX4OeHsWikm7ic3ogttAN/hxrrNsEzc1uoShfQdMtfXuFwvdomxxrVWh9dKhTH1oTnNrTVzNvyXqp3IjpL7SVtNK2q36JftA9meoYrHXnsnSwMSYk7Ksc7T5RGE9n4+aBPShBiTfZS3fSWyiGH/9k+0C9C3j/UmKYg2M4ljGRkwcmmVNzI2WiXGybw+Nwfu/fhgJraelmYnH7sBnMttMxuAGz2WDvIQPMGMYyJ3PTg1LHuYwQbXoE0VY9qa8AXISj+x0TwNu0HDE5Dsamp+fitPQXtS+XKxdAv15BKBr0dYALRpzgA8xnxvQtx17gwAVBuVwGkUeQrk0UAAquGHGCn6YgZ8bE+NnMAWDpl2oulxnnEUT7W7MQAJNmID/aN81XMJEC9eO+mGuRzCOIalGKLxOIX/f5we+Z/GSlhhK3MUUul0nnEURFUb9z6FGtMwNzLz3Tt1w7yy0LjVwuk8cjiKr4HzoAxSYz8N+06T13N/PlcxnkHkHUTpxfuK6eMOJ0OTDnK7Hp7Gxh/GKuRTaPIFkBHwMvphD16ZaBB3KhujblJiv4lQD3KMC7OAfnKqTyCIoe754k6TrQxezbeQAVyry9AgOVatdwyqFzFXB5BPF124ZXaFmztEyPOnv6NQFXbS6UBfiypsRJXSRsZG4b7Jf9wL6CuNWkIqjrGAr32HRL/zZuIbhq+5EE88EGOsUvcixzh0cP/OaH8xXEgdHGuldp6y7QWVollBpLPXO4kVsICIXG/YhK+ehLpIG+Pd6gom0zp+YuAqDVKz64L04m3Eu6qaJDSC1ob7TaOuQ4Ym2QIguSmnxXNNOaNJEYOsfU7FVb20v14yUFsVQStZpEHSNRbVo6wHUS1h8C+GJWgO1X3yj1HRJxK7XijYSrvIEbJjEvkJhZPS/yZ0lBOVyy5chT1JwdogRmL3SFCK7Stibp9m2SzyWhhua353C0KuN0Zl6Ljx78KO8rYQQWxBz43Lt2MpNuBYVPU6JHSCCJ8A4SME/Cv6Te88N4ODICx5+f90b5e8oSZFKQuKrUzMyD/BmtpKs7BKkseofhRLSi4lsSMWXG/2/twCvE25WeTW9HlFXl3C2AmoqsjlwKum2hoOROZmYfKnxH0HNc7iDsfsIcDYILLMgOic/m5uifC0Df+GUMKj9TjC0D8t8KDXyGTNnYcTKeyTq3mL5COxyK/Q1DzyYL/UvNyxaUahnYrDD7DW2F/o4vloC2NiMhtDU62nW5WIyfv2hx9QtmnyUkfwQkil03/IkbsYZrafMfYUcib1O1WWQAAAAASUVORK5CYII=);
          }
        }
        .tickets-tips-content {
          padding-bottom: 20px;
          line-height: 20px;
          font-size: 12px;
          span {
            color: #00f;
            cursor: pointer;
          }
        }
      }
      .merchant-header,
      .tickets-tips-header {
        font-size: 16px;
        color: #212121;
        line-height: 16px;
        span {
          vertical-align: top;
          margin-right: 10px;
          width: 18px;
          height: 18px;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: inline-block;
        }
      }
      .merchant-section {
        margin-bottom: 10px;
        background-color: #fff;
        padding: 20px;
        .merchant-header {
          span {
            background-image: url(data:image/png;base64,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);
          }
        }
        .merchant-content {
          width: 100%;
          .content-item {
            margin-top: 16px;
            .title {
              background-color: #f4f4f4;
              font-size: 12px;
              padding: 0 10px;
              font-weight: 700;
              height: 30px;
              line-height: 30px;
              position: relative;
              .fold-btn {
                position: absolute;
                display: flex;
                align-items: center;
                color: #999;
                bottom: 0;
                right: 4px;
                font-weight: 400;
                &:hover {
                  color: #fb7299;
                  cursor: pointer;
                  .open {
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAATJJREFUSA3tkr1KA0EQx3dv8VJYWtrqc4itVnkBw4HYWgW0szOQyjYIQd/BToh5jljYWFoKycFmvN/gST7uLntXyg3cMTsfvz87O8a09u8nYLmh3D4d+MXiGd/F0bUdXL7j1zW5eTzy6fKBPtfpXNj73lfEwafzrhg54/Opf5P++Jh4HaNHe/848y79KuD24ldr7TcBMebQ+3RSR0Th9GS9MGDBxFcBO0g+XGTOm4gUwmFlTAT0DXAw6Y9O/NK8iMg+5yz56Vx8aofJjPOmlcKHV9O8dk2AYKhICBzelkCISCi8VKBKhJwuweqDMvOVsVCTW+EN8mTRuMitbUsFnNpKAYVtPDwxTFdxB1zrtHrHb+sm7HkAPFiAwl+RMX4GT8pmTr6xyZ1EfI0BbWM7gUYT+AGT4tBEVy8BawAAAABJRU5ErkJggg==);
                  }
                  .close {
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAP9JREFUSA3tkzEOwjAMReNGrSpxBBYWNu4ASGycogs3QGJkROoNWHqETrAi7sDGwsIRWKiC6Q+kEqUFw8CAainKEOc9y3GUaqLpwE87wHP2sD6RkjSZp8u+uagE+dpTEcWTreSuSHCHr5i5BSgRnXLJWCJ5KyjDXdVSyUtBGZ4nHyFgpdrYJZJaQRVc62AIsDHnjVRSKaiDUxztIeBp0pVKngTv4BAgpJIHgRR+U8gkheBTuFRiBTxLOibLdsWc59OCB3U9d7C6vbJdvt+jRXSw395k59G3cEhRiC3IjXH+IcHEmRXoIExJ0RpLB3ogrRwAF1aCuwUnTN1Zs/95B64RMsUJLb1TdgAAAABJRU5ErkJggg==);
                  }
                }
                .icon-fold-btn {
                  width: 12px;
                  height: 12px;
                  display: inline-block;
                  background-size: 100% 100%;
                }
                .open {
                  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAASZJREFUSA3tk78OgjAQxqEDDI6OrPocxlUmX0BCQlh9FldCQvAd3EzU59DBxdHRBEgA72taI8j/0XAJ9Hq9+330WhRltL/vgIodhmE4jeN4D58xtnUc5wa/r/m+P8uybIc6Xdc3lmU9GSZRFK3zPF/hSdP0HATBHPE+hhrUSg6YqOcCmqYdVVV9CaCRJMmpjwhyUUP1BhhggQmfC9i2fSffHCJSBQdLMBV+BhTg5nnegpwDbXMiQg/6kiUlX8W8MNTBXde9yMSCAIJdRbrAwfsR6CLSFV4r0CSCtfKBUsj8bgtypFXuQC5WtUusfW4LzWvhyG0UQEKFCML8KtLQCOd5eLVZWURc51Y4uK07kOJCJBBzu67nMn/QSP8HwzOoeCwaOzC4A2+ksbtOXfxa4wAAAABJRU5ErkJggg==);
                }
                .close {
                  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAPNJREFUSA3tkzEOwjAMRRuqVpU4AgsLG3cAJDZOkaWHypIjMMGKuAMbC0uPwJIOxT/ESEBKXQYG1EiRh8TvuY6bJMMaOvDTDjRNM8LuI1XSy8aYBd214b4uy/IoyRUJAnxH1Y8BVUpdKWwkkk7BK5yrlko+CiLwKggmiBJJqyAGz/N8BbBz7kBBJIkK2uBa6zME1tqZVPIm6IJDgCWVPAmk8LtCJnkI+sKlEi+gz53WdX3iOafkCg/KPWdYW4y1K8uyOeVf/G9PD7b+Fg4pCgkT5scYLDBx5gVFUWxppvfYaZoupZUDwAs5yGUOmHw2xD/vwA1Q4q3tGQdUcAAAAABJRU5ErkJggg==);
                }
              }
            }
            .content {
              font-size: 12px;
              color: #212121;
              line-height: 18px;
              margin-top: 10px;
              img {
                width: 100%;
                height: auto;
              }
            }
          }
          .notitle {
            margin-top: 0;
          }
        }
      }
      .rec-list-box {
        .rec-list {
          .rec-item {
            cursor: pointer;
            margin-bottom: 10px;
            box-sizing: border-box;
            width: 100%;
            padding: 18px 20px 13px;
            background: #fff;
            border: 1px solid #e7ecf1;
            border-radius: 4px;
            img {
              width: 250px;
              height: 160px;
              display: block;
            }
            .rec-item-name {
              margin-top: 10px;
              font-size: 14px;
              color: #212121;
              line-height: 21px;
            }
            .rec-item-time,
            .rec-item-vuene {
              color: #99a2aa;
              font-size: 12px;
            }
            &:hover {
              box-shadow: 0px 1px 4px 1px #99a1bb;
            }
          }
        }
      }
    }
  }
  .guests-pop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    .guests-pop-mask {
      position: absolute;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .guests-pop-content {
      z-index: 2;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      box-sizing: border-box;
      border-radius: 4px;
      .icon-close {
        top: 17px;
        right: 17px;
      }
      .contents {
        padding: 17px;
        width: 580px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        .contents-body {
          margin: 20px 0;
          display: flex;
          img {
            transform: translateX(-40px);
            display: block;
            height: 160px;
            widows: 160px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
          }
          .guest-info {
            flex: 1 1;
            text-align: center;
            .guest-name {
              position: relative;
              font-size: 20px;
              &::before {
                position: absolute;
                content: "";
                bottom: -5px;
                width: 40px;
                height: 2px;
                background: #f25c8e;
                background-image: linear-gradient(90deg, #f25b8e 40%, #fff 80%);
              }
            }
            .guest-description {
              margin-top: 25px;
              font-size: 14px;
              color: #222;
              line-height: 24px;
            }
          }
        }
      }
    }
  }
  .fixed-layer {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    .flexd-layer-content {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 11;
      width: 675px;
      padding: 40px;
      background: #fff;
      border-radius: 4px;
      transform: translate(-50%, -50%);
      .icon-close {
        width: 15px;
        height: 15px;
        top: 10px;
        right: 10px;
      }
      .herder-title {
        line-height: 52px;
        text-align: center;
        font-size: 22px;
        color: #222;
        background: #f4f5f7;
        border-radius: 4px;
      }
      .content {
        max-height: 540px;
        overflow-y: scroll;
        line-height: 30px;
        color: #6c767a;
        text-align: left;
        font-size: 14px;
        .paragraph {
          margin-bottom: 10px;
          .text-indent {
            text-indent: 24px;
          }
          .title {
            color: #222;
          }
          .table {
            min-width: 1400px;
            margin: 0 auto;
            margin-bottom: 15px;
            color: #212121;
            border: 1px solid #e7e7e7;
            th,
            td {
              border: 1px solid #e7e7e7;
              text-align: center;
            }
            th {
              padding-top: 9px;
              padding-bottom: 9px;
              background-color: #f9f9f9;
            }
            .clearAlign {
              text-align: left;
              padding: 0 15px;
            }
          }
        }
      }
      .hideScrollbar {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
        &::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }
      }
      .agree-btn {
        width: 120px;
        height: 42px;
        margin: 20px auto 0;
        font-size: 14px;
        color: #fff;
        text-align: center;
        line-height: 42px;
        background: #fb7299;
        border-radius: 3px;
        cursor: pointer;
      }
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
.clearFloat:after {
  display: block;
  content: "";
  clear: both;
}
.detail-message {
  position: relative;
  width: 100%;
  overflow: hidden;
  p {
    width: 728px;
  }
}
.active {
  max-height: 80px;
  transition: all 2s ease-in-out;
  -webkit-transition: all 2s ease-in-out;
}
.level {
  display: inline-block;
  width: 19px;
  height: 9px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-left: 5px;
}
.level1 {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAASCAYAAAA31qwVAAAAAXNSR0IArs4c6QAAAI5JREFUSA3tlVEKwCAMQ+fYwby53szhxxMtFGlhox/up8tMZhpF0/XxU0ppniluj+gPTfJ25DWXc16ktdYFA8ImNoz1TmQ3uJ/rjrcb7wlpKc3zDGPzxwjvx5h1FU5iJzFrAlb+YxVwBnHmadj6X8kPu/nHXUkC0jmYZMBUdNo4PCp8MFXq4yeG8yg1bGIvmHYqU+/kKogAAAAASUVORK5CYII=);
}
.level2 {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAASCAYAAAA31qwVAAAAAXNSR0IArs4c6QAAAJtJREFUSA3tltEJgDAMRK04ifu4iPvoIDqPrqJQeH4UQmPAEMX+hCSXNndNoal5eE3bcliOaC1FHjXJyuhuc2M/qErmfc24sIp10IARHRMvbQ0n5bX7cl5Yxf7GuCKtvWZMW2DFMXva+rBX6aYYStVeJ7jvKAZjZkbyYW6171EMJUqmKEMcHzw+ecmCl/LsE1Yxt9+FpJAUD6vYCQUjLuOnSaqsAAAAAElFTkSuQmCC);
}
.level3 {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAASCAYAAAA31qwVAAAAAXNSR0IArs4c6QAAAJlJREFUSA1jZKAxmHTx6X9yrGAiRxM99DCS6yNSHZerJ0WUlsmXnoHVDdoQY4F5A+YjmIth4ug0IXW45Ik1F2bfoA2xUYfBoohYGp7GiNVArjpY2iNW/6CNSrqF2LDJlSSHGMznsDSDi09sWsKlbuikMVhIoPsEFjIwcRgfph7Gh8mj0zB16OK4+IM2xOjWusAVMrjEB22IAQB0cS4BDa3mEwAAAABJRU5ErkJggg==);
}
.level4 {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAASCAYAAAA31qwVAAAAAXNSR0IArs4c6QAAAJRJREFUSA1jZKAx+L+55j85VjCRo4keehjJ9RHJjvNphmjZUotdK5r8oA0xhMNALoa5GrufIKKE1BGSx2c2khzCYUiCg4E56jBSY4GFVA0UqycmHQMtGbRRSb8Qw1V+waIALSSHUYjBfA7zIS4+LCTIpIdQiMFCAt2nsJCBicP4MPUwPkyeQnrQhhj9WhckhuCgDTEAk/MfvJb+Ar4AAAAASUVORK5CYII=);
}
.level5 {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAASCAYAAAA31qwVAAAAAXNSR0IArs4c6QAAAJZJREFUSA3tlt0KgCAMhV30uPU0PbBBeAwOjOUymZA3uR/nzseEJH288pay54rFc2jEGfEqam7ueAhul6t0WGJrVQ5FpePq542VZ8Wt+uW+sMT+xngiLPueMSuzVxwzqNWb51VqCnr5rddIJMMOf/uMQTkUavZL0hMRAwlWDDLww0Y+bMT5izz2K3ZYYuP+LhQymjsssRPHDB5GHvHUyQAAAABJRU5ErkJggg==);
}
.level6 {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAASCAYAAAA31qwVAAAAAXNSR0IArs4c6QAAAJNJREFUSA3tlo0KgCAMhF30/q9sETuDwThXJhOSoPbj2n1MUMrHq5ZyPvG1xbfM2SFPFYXbq53gRK7SaYntTTkUacfNbz9YHouz+vq/tMT+xuxEMPueMZY5Ko4Z9Oqtcyo9BaP93qk0JNMOf3zGoBgKPfsl6YWIgYRVDDLww0Y+bMS9N/K9uPrTEpt3uyCEbDgtsQMi4RwqZk4wMgAAAABJRU5ErkJggg==);
}
</style>