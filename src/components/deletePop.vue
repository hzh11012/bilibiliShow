<template>
  <div>
    <div class="modal-mask"></div>
    <div class="modal-content">
      <div class="content">
        <i class="icon-close" @click="close"></i>
        <div class="content-header">
          <div class="header-img" :class="deletePopInfo.img==0?'cancel':''"></div>
        </div>
        <div class="content-body">
          <div>{{deletePopInfo.content}}</div>
        </div>
        <div class="content-footer">
          <div class="footer-btn">
            <div class="confirm-btn" @click="submit">{{deletePopInfo.btn1}}</div>
            <div class="cancel-btn" @click="close">{{deletePopInfo.btn2}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["isShow",'deletePopInfo'],
  methods: {
    close() {
      this.$emit("close");
    },
    submit() {
      this.$emit("submit");
    }
  }
};
</script>

<style lang="less" scoped>
.modal-mask {
  display: table;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9000;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.25s linear;
}
.modal-content {
  display: table-cell;
  position: fixed;
  z-index: 9001;
  top: 50%;
  left: 50%;
  vertical-align: middle;
  transform: translate(-50%, -50%);
  transition: all 0.12s linear;
  .content {
    width: auto;
    margin: 0 auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    .content-header {
      width: 100%;
      height: 150px;
      position: relative;
      .header-img {
        top: 30px;
        left: 50%;
        transform: translate(-50%);
        position: absolute;
        width: 130px;
        height: 113px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url(//s1.hdslb.com/bfs/static/platform/static/img/deleteorder.png);
      }
      .cancel {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url(//s1.hdslb.com/bfs/static/platform/static/img/tip@2x.png);
      }
    }
    .content-body {
      min-width: 280px;
      margin: 20px 50px !important;
      color: #222;
      font-size: 18px;
      line-height: 25px;
      text-align: center;
    }
    .icon-close {
      display: inline-block;
      position: absolute;
      width: 14px;
      height: 14px;
      top: 17px;
      right: 17px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAZdJREFUSA21lk1SAyEQRmlyDS/kzkX8qTJmZ1x5GlfGncYqNVl4KK+hyBvTFpPA0MSxq6ZgSPf3ugkwyHK1PnbBLV204OT25mr6Tn8su3/anIgLd52euIUHFkI44hH3tVk+ri/GgqGFpurD8ql4CG7iJKzGgD6s3s7R6jQTiGcaRdynjo0BJeGo85zCYMDy/Gfx5TIH7bLUTIxtrrJOO8isY6kOjrmsSOZ6dvaqfkNtScNF2GJ++kKspAKlAAvUGtsDArcGHproHrAV2ppgFmiFtsLQLQJrUH4/ZJENAoegW+CEFmPpWxZXFYhYbuoYV7PC8DcBcSxBW2Do9M5SBv7bTBWWqtPkWqqsAnMwAMB2D+c4Xj0GB4ElGMJb4N4XoQYtAodgephbfHTatc0CW4RafIHuAVsFEGmJ6QFbAgGlZo39BVoDUshu36LRAS2Ou+Kl95qW/NwbucrFG9vW2Ge15a2+ubYEDc5PPZfUMWEkwLYhYRLXhGDA6p2lf61MxUtQxn3cGAsR+eChZN3UafChfbTQVH1Y3/0suK2T+zTcAAAAAElFTkSuQmCC);
      cursor: pointer;
      z-index: 80;
    }
    .content-footer {
      .footer-btn {
        margin-top: 40px;
        display: flex;
        justify-content: center;
        div {
          cursor: pointer;
          border-radius: 4px;
          font-size: 14px;
          width: 120px;
          height: 42px;
          line-height: 42px;
          border: 1px solid #ccc;
          text-align: center;
          color: #6c767a;
        }
        .confirm-btn {
          margin-right: 10px;
          color: #fff;
          background: #fb7299;
          border: 1px solid #fb7299;
        }
        .cancel-btn {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>