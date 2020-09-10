<template>
  <div class="feedbacklist-box">
    <navs @search="search" v-model="inputValue" @getInputValue="getInputValue"></navs>
    <div class="feedbacklist">
      <div class="feedbacklist-header">
        <div class="advice-tips">我的建议</div>
        <div class="create-feedback-btn" @click="isShowCreatePop=true">新建反馈</div>
      </div>
      <div class="feedbacklist-body">
        <div class="list-header">
          <div class="list-header-type">类型</div>
          <div class="list-header-submit-time">提交时间</div>
          <div class="list-header-status">当前状态</div>
          <div class="list-header-operator">操作</div>
        </div>
        <div class="list"></div>
      </div>
    </div>
    <div class="feedback-pop" v-if="isShowCreatePop">
      <div class="feedback-pop-mask"></div>
      <div class="feedback-pop-content">
        <i class="icon-close" @click="isShowCreatePop=false"></i>
        <div class="content">
          <div class="content-header">
            <div class="title">用户意见反馈</div>
            <div>希望能听到你的声音，促使我们更好地为你服务！</div>
          </div>
          <div class="content-body">
            <div>
              <input-item :isRequire="true" title="反馈类型：" type>
                <select slot="leftarea" v-model="selected">
                  <option value="0">请选择反馈类型：</option>
                  <option value="394">功能建议</option>
                  <option value="395">bug反馈</option>
                </select>
              </input-item>
              <input-item title="你的QQ：">
                <input
                  type="number"
                  slot="leftarea"
                  pattern="\d"
                  v-model="qq"
                  oninput="if(value.length>11)value=value.slice(0,11)"
                  placeholder="请输入QQ号"
                />
              </input-item>
              <input-item :isRequire="true" title="反馈内容：">
                <div class="slot" slot="leftarea">
                  <textarea
                    maxlength="800"
                    v-model="feedbackContent"
                    placeholder="输入具体内容，最多可输入800个字"
                  ></textarea>
                  <span class="tips">{{feedbackContent.length}}/800</span>
                </div>
              </input-item>
              <input-item title="上传图片：(可传三张）">
                <div slot="leftarea">
                  <van-uploader
                    :preview-full-image="false"
                    :after-read="afterRead"
                    v-model="fileList"
                    multiple
                    :max-count="3"
                  />
                </div>
              </input-item>
            </div>
          </div>
          <div class="content-footer">
            <div
              class="submit-btn"
              :class="selected!='0'&&feedbackContent!=''?'':'disabled'"
              @click="submit"
            >提交</div>
          </div>
        </div>
      </div>
    </div>
    <div class="result-pop" v-if="isShowResultPop">
      <div class="result-pop-mask"></div>
      <div class="result-pop-content">
        <i class="icon-close" @click="isShowResultPop=false"></i>
        <div class="content">
          <div class="content-body">
            <div class="body-img"></div>
          </div>
          <div class="content-footer">
            <div class="success-tips">我们已经收到你的反馈，感谢你的支持！</div>
            <div class="submit-btn" @click="isShowResultPop=false">确定</div>
          </div>
        </div>
      </div>
    </div>
    <footers class="footers"></footers>
  </div>
</template>

<script>
import navs from "@/components/nav.vue";
import inputItem from "../components/feedbacklist/inputItem.vue";
import footers from "@/components/footer.vue";
import qs from "qs";
export default {
  data() {
    return {
      inputValue: "",
      qq: "",
      feedbackContent: "",
      isShowCreatePop: false,
      isShowResultPop: false,
      selected: "0",
      fileList: []
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
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file);
    },
    submit() {
      if (this.feedbackContent == "" || this.selected == "0") {
        return null;
      }
      //这里上传提交的数据 api有问题 暂且搁置
      this.isShowCreatePop = false;
      this.isShowResultPop = true;
    }
  },
  components: {
    navs,
    inputItem,
    footers
  }
};
</script>

<style lang="less" scoped>
.feedbacklist-box {
  background: white;
  .feedbacklist {
    width: 1160px;
    margin: 0 auto;
    .feedbacklist-header {
      display: flex;
      padding: 0 10px;
      align-items: center;
      height: 36px;
      margin-top: 34px;
      margin-bottom: 10px;
      .advice-tips {
        flex: 1 1;
        font-size: 20px;
        color: #222;
        letter-spacing: 0;
        line-height: 20px;
      }
      .create-feedback-btn {
        height: 36px;
        line-height: 36px;
        background-image: linear-gradient(-48deg, #ff6a9c, #fe8574);
        border-radius: 3px;
        width: 94px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
      }
    }
    .feedbacklist-body {
      .list-header {
        padding-left: 20px;
        font-size: 14px;
        color: #222;
        line-height: 14px;
        display: flex;
        background: #e4e9f0;
        border: 1px solid #e7ecf1;
        border-radius: 4px 4px 0 0;
        box-sizing: border-box;
        height: 50px;
        align-items: center;
        .list-header-type {
          width: 600px;
        }
        .list-header-submit-time {
          width: 258px;
        }
        .list-header-status {
          width: 164px;
        }
        .list-header-operator {
          flex: 1 1;
        }
      }
      .list {
        margin-bottom: 40px;
        min-height: 330px;
      }
    }
  }
  .feedback-pop {
    .feedback-pop-content {
      z-index: 2;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      box-sizing: border-box;
      border-radius: 4px;
      .icon-close {
        top: 18px;
        right: 18px;
      }
      .content {
        padding: 20px 30px;
        width: 580px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        .content-header {
          padding-bottom: 17px;
          font-size: 14px;
          line-height: 16px;
          text-align: left;
          border-bottom: 1px solid #e7e7e7;
          .title {
            margin-bottom: 20px;
            font-size: 16px;
          }
        }
        .content-body {
          font-size: 12px;
          margin: 20px 0;
          select {
            width: 200px;
            height: 40px;
            background: #fff;
            border: 1px solid #cbd0d8;
            box-sizing: border-box;
            color: #9aa6ae;
            font-size: 12px;
            line-height: 16px;
            border-radius: 4px;
            padding: 0 10px;
          }
          input {
            box-sizing: border-box;
            width: 200px;
            height: 40px;
            padding: 0 10px;
            background: #fff;
            border: 1px solid #cbd0d8;
            border-radius: 4px;
            cursor: auto;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          textarea {
            padding: 10px;
            width: 500px;
            height: 200px;
            box-sizing: border-box;
            background: #f4f5f7;
            border: 1px solid #cbd0d8;
            border-radius: 4px;
            outline: none;
            resize: none;
            color: #222;
            line-height: 16px;
          }
          textarea::-webkit-scrollbar {
            width: 0 !important;
          }
          .slot {
            position: relative;
            .tips {
              font-size: 12px;
              color: #9aa6ae;
              bottom: 5px;
              right: 5px;
              position: absolute;
            }
          }
        }
        .content-footer {
          overflow: hidden;
          .submit-btn {
            cursor: pointer;
            float: right;
            width: 90px;
            height: 36px;
            background-image: linear-gradient(-48deg, #ff6a9c, #fe8574);
            text-align: center;
            line-height: 36px;
            border-radius: 3px;
            font-size: 14px;
            color: #fff;
          }
          .disabled {
            background: #e5e9ef;
            color: #b8c0cc;
            cursor: not-allowed;
            box-shadow: none;
            font-size: 12px;
          }
        }
      }
    }
  }
  .result-pop,
  .feedback-pop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    .result-pop-mask,
    .feedback-pop-mask {
      position: absolute;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  .result-pop {
    .result-pop-content {
      z-index: 2;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      box-sizing: border-box;
      border-radius: 4px;
      .content {
        width: auto;
        margin: 0 auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        .content-body {
          margin: 20px 0;
          .body-img {
            margin: auto;
            width: 160px;
            height: 120px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url(//s1.hdslb.com/bfs/static/platform/static/img/2233.png);
          }
        }
        .content-footer {
          .success-tips {
            font-size: 18px;
            color: #222;
          }
          .submit-btn {
            cursor: pointer;
            margin: auto;
            margin-top: 40px;
            width: 120px;
            height: 42px;
            line-height: 42px;
            text-align: center;
            background-image: linear-gradient(-48deg, #ff6a9c, #fe8574);
            border-radius: 2px;
            font-size: 14px;
            color: #fff;
          }
        }
      }
      .icon-close {
        top: 17px;
        right: 17px;
      }
    }
  }
  .footers {
    background-color: #f4f5f7;
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

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #9aa6ae;
}
input:-moz-placeholder,
textarea:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #9aa6ae;
}
input::-moz-placeholder,
textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #9aa6ae;
}
input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #9aa6ae;
}
</style>