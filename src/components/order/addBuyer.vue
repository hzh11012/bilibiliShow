<template>
  <div class="fixed-layer">
    <div class="flexd-layer-content">
      <i class="icon-close" @click="close"></i>
      <div class="content">
        <div class="buyerinfo-title">
          <span>{{title}}</span>
        </div>
        <div class="buyerinfo-body">
          <div>
            <label>姓名</label>
            <input
              type="text"
              :class="nameError?'error':''"
              v-model="buyer.name"
              placeholder="请输入你的真实姓名"
              @input="changeInput"
            />
            <span v-if="nameError" class="reg-error">长度不符合，请控制在2-15个字符</span>
          </div>
          <div>
            <label>手机号码</label>
            <input
              type="number"
              :class="phoneError?'error':''"
              v-model="buyer.phone"
              placeholder="请填写手机号"
              @input="changeInput1"
            />
            <span v-if="phoneError" class="reg-error">请输入正确的手机号</span>
          </div>
          <div style="display:flex">
            <label style="margin-top:8px">证件类型</label>
            <van-radio-group
              style="font-size:14px;"
              :icon-size="18"
              v-model="buyer.id_type"
              direction="horizontal"
            >
              <van-radio name="0" class="vant-check">
                身份证
                <template #icon="props">
                  <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-radio>
              <van-radio name="1" class="vant-check">
                护照
                <template #icon="props">
                  <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-radio>
              <van-radio name="2" class="vant-check">
                港澳居民往来内地通行证
                <template #icon="props">
                  <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-radio>
              <van-radio name="3" class="vant-check">
                台湾居民往来大陆通行证
                <template #icon="props">
                  <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-radio>
            </van-radio-group>
          </div>
          <div>
            <label>证件号码</label>
            <input
              type="text"
              :class="personal_idError?'error':''"
              v-model="buyer.personal_id"
              placeholder="请输入你的真实证件号码"
              @input="changeInput2"
            />
            <span v-if="personal_idError" class="reg-error">请输入正确的证件号</span>
          </div>
          <div class="switch">
            <label>默认购买人</label>
            <van-switch
              v-model="buyer.is_default"
              inactive-color="#CCCCCC"
              active-color="#FB7299"
              size="22px"
            />
          </div>
          <section class="agreement">
            <div class="agreement-check">
              <span class="icon-check" :class="isAgree?'active':''" @click="isAgree=!isAgree"></span>我已经阅读并同意以下内容
            </div>
            <p
              class="agreement-content"
            >请您理解并同意，根据相关法律法规以及国内公安部门对大型活动中购票用户或观演用户实名制的要求，实名制的项目在购票时需要您提供您的实名信息，包括但不限于姓名、身份证、护照、港澳居民往来内地通行证、台湾居民往来大陆通行证。为保证信息的真实性和唯一性，会员购有权基于您所提供的信息通过第三方机构（包含信用服务机构和数据服务机构等）进行验证等相关处理（包括但不限于收集、整理、保存、提供）。您所提供的身份信息仅用于实名验证，未经本人许可不做任何他用。</p>
          </section>
        </div>
        <div class="buyerinfo-btn clearFloat">
          <div class="action-btn active" @click="click">保存</div>
          <div class="action-btn normal" @click="close">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  props: ["title", "buyer"],
  data() {
    return {
      checked: true,
      isAgree: false,
      activeIcon: "http://www.qnets.cn:8082/bilibilibuy/activeIcon.png",
      inactiveIcon: "http://www.qnets.cn:8082/bilibilibuy/inactiveIcon.png",
      nameError: false,
      phoneError: false,
      personal_idError: false,
      isDefault: 0
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    changeInput() {
      const rulg = /^.{2,15}$/;
      if (!rulg.test(this.buyer.name)) {
        this.nameError = true;
      } else {
        this.nameError = false;
      }
    },
    changeInput1() {
      const rulg = /^.{11,11}$/;
      if (!rulg.test(this.buyer.phone)) {
        this.phoneError = true;
      } else {
        this.phoneError = false;
      }
    },
    changeInput2() {
      const rulg = /^.{18,18}$/;
      const rulg1 = /^[0-9]*$/;
      if (!rulg.test(this.buyer.personal_id) && this.buyer.id_type == 0) {
        this.personal_idError = true;
      } else if (!rulg1.test(this.buyer.personal_id)) {
        this.personal_idError = true;
      } else {
        this.personal_idError = false;
      }
    },
    submit() {
      if (
        this.buyer.name != "" &&
        this.buyer.phone != "" &&
        this.buyer.personal_id != ""
      ) {
        if (this.isAgree) {
          if (this.buyer.is_default) {
            this.isDefault = 1;
          } else {
            this.isDefault = 0;
          }
          this.$http({
            url: "/bili/ticket/buyer/create",
            method: "POST",
            data: qs.stringify({
              name: this.buyer.name,
              tel: this.buyer.phone,
              id_type: this.buyer.id_type,
              personal_id: this.buyer.personal_id,
              is_default: this.isDefault,
              src: "ticket"
            })
          }).then(res => {
            if (res.data.msg != "") {
              this.$toast(res.data.msg);
            } else {
              this.close();
              this.$emit("update");
            }
          });
        } else {
          this.$toast("请勾选购买人协议");
        }
      } else {
        this.$toast("请完善购买人信息");
      }
    },
    edit() {
      if (
        this.buyer.name != "" &&
        this.buyer.phone != "" &&
        this.buyer.personal_id != ""
      ) {
        if (this.isAgree) {
          if (this.buyer.is_default) {
            this.isDefault = 1;
          } else {
            this.isDefault = 0;
          }
          this.$http({
            url: "/bili/ticket/buyer/update",
            method: "POST",
            data: qs.stringify({
              id: this.buyer.id,
              name: this.buyer.name,
              tel: this.buyer.phone,
              id_type: this.buyer.id_type,
              personal_id: this.buyer.personal_id,
              is_default: this.isDefault,
              src: "ticket"
            })
          }).then(res => {
            if (res.data.msg != "") {
              this.$toast(res.data.msg);
            } else {
              this.close();
              this.$emit("update");
            }
          });
        } else {
          this.$toast("请勾选购买人协议");
        }
      } else {
        this.$toast("请完善购买人信息");
      }
    },
    click() {
      if (this.title == "添加购买人") {
        this.submit();
      } else if (this.title == "编辑购买人") {
        this.edit();
      }
    }
  }
};
</script>

<style lang="less" scoped>
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
    width: 494px;
    padding: 12px;
    padding-bottom: 24px !important;
    background: #fff;
    border-radius: 4px;
    transform: translate(-50%, -50%);
    .icon-close {
      width: 15px;
      height: 15px;
      top: 10px;
      right: 10px;
    }
    .content {
      overflow: hidden;
      .buyerinfo-title {
        font-size: 16px;
        line-height: 22px;
        height: 22px;
        min-height: 22px;
        max-height: 22px;
        color: #212121;
        padding-left: 11px;
        font-weight: 700;
      }
      .buyerinfo-body {
        margin-top: 16px;
        label {
          display: inline-block;
          width: 72px;
          min-width: 72px;
          margin-right: 10px;
          font-size: 14px;
          color: #6d757a;
          text-align: right;
          flex-shrink: 0;
        }
        input[type="text"],
        input[type="number"] {
          width: 400px;
          height: 34px;
          padding: 2px 15px;
          font-size: 14px;
          color: #222;
          line-height: 38px;
          border: 1px solid #e7e7e7;
          border-radius: 4px;
          box-sizing: border-box;
          cursor: auto;
        }
        .agreement {
          margin-left: 60px;
          margin-right: 16px;
          .agreement-check {
            height: 16px;
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 12px;
            line-height: 12px;
            color: #212121;
            margin-top: 20px;
            margin-bottom: 0;
            .icon-check {
              cursor: pointer;
              float: left;
              width: 16px;
              height: 16px;
              margin-right: 6px;
              background: url(https://s1.hdslb.com/bfs/static/platform/static/img/checkbox_bg.svg)
                50% no-repeat;
              background-size: contain;
            }
            .active {
              background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAUtJREFUSA1j/F008z8DDQETDc0GG80Cs4C1L50RxqYGDQsZmvtg1AJwdP2vmi3+v2S2Hra4oziI/pfOMvj74/+1v//+nflfsogb3RKKLAAb/pdh73+G/0IMDIybGHvivlLNAmTDGRkYNzKr/49ENxzEx+qD/5O2sWNTDBPDYngoY3r6b5g8Mo1hwZ+S2cl/Hzz++Ld4Vi6yQhibFMNBejAsYPj3/yUwPNn+/f8/6W/JzDyYwSCaVMNBejAsYOlL28LI9D8TGK7///1jmAizhBzDsVoAEmTuSZ+JYknxzM6/0NQCjVCcYQ7SjwwwfACTRLHkP0MZKCmSajjILJwWgCShlrQAi9n/TAxMV4BJkWiXg/SDAF4LQAqAltQx/2WSZO5L1cWVFEHqcAGCFoA0Mk5MBaYs8gBRFpBnNETX0LeAEVZ3UhIM+PTSPIgAdAmkO9XVxCoAAAAASUVORK5CYII=)
                50% no-repeat;
              background-size: contain;
            }
          }
          .agreement-content {
            margin-top: 7px;
            color: #9b9b9b;
            font-size: 12px;
            line-height: 18px;
            padding-left: 20px;
          }
        }
        .reg-error {
          font-size: 14px;
          line-height: 26px;
          color: #fb7299;
          margin-left: 86px;
        }
        .error {
          background: #fef4f7;
        }
      }
      .buyerinfo-body > div {
        margin-bottom: 15px;
      }
      .buyerinfo-btn {
        height: 28px;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 24px;
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 28px;
          font-size: 12px;
          line-height: 28px;
          border-radius: 4px;
          cursor: pointer;
          box-sizing: border-box;
          &:last-child {
            margin-left: 20px;
          }
        }
        .active {
          color: #ff5687;
          background: #fff;
          border: 1px solid #ff5687;
        }
        .normal {
          color: #999;
          background-color: #fff;
          border: 1px solid #999;
        }
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
.vant-check {
  margin-right: 20px;
  height: 36px;
}
.img-icon {
  height: 18px;
}
.switch {
  display: flex;
  align-items: center;
  margin-bottom: 0 !important;
  height: 32px;
}
.clearFloat {
  &::after {
    display: block;
    content: "";
    clear: both;
    visibility: hidden;
    font-size: 0;
    width: 0;
    height: 0;
  }
}
</style>