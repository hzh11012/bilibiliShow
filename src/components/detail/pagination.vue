<template>
  <div class="pagination-box">
    <div class="pagination">
      <div class="total" v-if="isLeftTotal">共{{Math.ceil(total/10)}}页</div>
      <div class="preview-page" @click="clickPage(page-1)" v-if="page > 1">上一页</div>
      <div class="pages">
        <span class="pageNum" @click="clickPage(1)" :class="page==1?'active':''">1</span>
        <span class="pageNum" @click="prePageMore" v-show="showPreMore">...</span>
        <span
          class="pageNum"
          @click="clickPage(index)"
          :class="page==index?'active':''"
          v-for="index in pages"
          :key="index"
        >{{index}}</span>
        <span class="pageNum" @click="nextPageMore" v-show="showNextMore">...</span>
        <span
          v-if="Math.ceil(total/10)>1"
          class="pageNum"
          @click="clickPage(Math.ceil(total/10))"
          :class="page==Math.ceil(total/10)?'active':''"
        >{{Math.ceil(total/10)}}</span>
      </div>
      <div class="next-page" @click="clickPage(page+1)" v-if="page<Math.ceil(total/10)">下一页</div>
      <div class="jump-box" v-if="isRightTotal">
        共{{Math.ceil(total/10)}}页，跳至
        <input
          class="jump-input"
          :value="value"
          type="text"
          oninput="value=value.replace(/[^\d]/g,'')"
          @input="$emit('getInputValue',$event.target.value)"
          @keyup.enter="jump"
        /> 页
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["total", "isLeftTotal", "isRightTotal", "value", "page"],
  model: {
    prop: "value",
    event: "getInputValue"
  },
  data() {
    return {
      showPreMore: false, //是否显示左省略号
      showNextMore: false //是否显示右省略号
    };
  },
  methods: {
    clickPage(page) {
      this.$emit("clickPage", page);
      this.getCommentList();
      this.toMove();
    },
    async getCommentList() {
      this.$emit("getCommentList");
    },
    nextPageMore() {
      this.$store.commit("comment_page", this.page + 3);
      this.getCommentList();
    },
    prePageMore() {
      this.$store.commit("comment_page", this.page - 3);
      this.getCommentList();
    },
    toMove() {
      this.$emit("toMove");
    },
    jump() {
      this.$emit("jump");
    }
  },
  computed: {
    pages() {
      const foldPage = this.$store.state.foldPage; //规定最多显示的页数tag
      const current = Number(this.page); //当前页数
      const halfFoldPage = Math.floor((foldPage - 2) / 2);

      if (Math.ceil(this.total / 10) > foldPage) {
        if (current - halfFoldPage > 2) {
          this.showPreMore = true;
        } else {
          this.showPreMore = false;
        }

        if (current + halfFoldPage < Math.ceil(this.total / 10) - 1) {
          this.showNextMore = true;
        } else {
          this.showNextMore = false;
        }
      }

      let arr = [];

      if (Math.ceil(this.total / 10) - 1 < 5) {
        this.showPreMore = false;
        this.showNextMore = false;
        for (let i = 2; i < Math.ceil(this.total / 10); i++) {
          arr.push(i);
        }
      } else {
        // 左侧省略号显示
        if (this.showNextMore && !this.showPreMore) {
          for (let i = 2; i < foldPage; i++) {
            arr.push(i);
          }
          // 左侧省略号 和 右侧省略号都显示
        } else if (this.showPreMore && this.showNextMore) {
          for (
            let i = current - halfFoldPage;
            i <= current + halfFoldPage;
            i++
          ) {
            arr.push(i);
          }
          // 右侧省略号
        } else if (!this.showNextMore && this.showPreMore) {
          // 当右侧省略号显示的时候,页码不能大于$last,需要往前多显示差额
          let dis = current + halfFoldPage - Math.ceil(this.total / 10) + 1;

          for (
            let i = current - halfFoldPage - dis;
            i < Math.ceil(this.total / 10);
            i++
          ) {
            arr.push(i);
          }
          // 都不显示
        } else {
          for (let i = 2; i < Math.ceil(this.total / 10); i++) {
            arr.push(i);
          }
        }
      }

      return arr;
    }
  }
};
</script>

<style lang="less" scoped>
.pagination-box {
  flex: 1 1;
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;
    line-height: 30px;
    font-size: 12px;
    color: #99a2aa;
    .total {
      margin-right: 10px;
    }
    .preview-page {
      margin-right: 5px;
      cursor: pointer;
    }
    .next-page {
      margin-left: 5px;
      cursor: pointer;
    }
    .pages {
      .pageNum {
        cursor: pointer;
        margin: 0 4px;
      }
      .active {
        color: #f25d8e;
        font-weight: 700;
      }
    }
    .jump-box {
      margin-left: 20px;
      display: flex;
      align-items: center;
    }
  }
}
.jump-input {
  margin: 0 5px;
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  box-shadow: none;
  width: 24px;
  border-radius: 4px;
  border: 1px solid #ddd;
  outline: none;
  text-align: center;
  &:focus {
    border: 1px solid #f25d8e;
  }
}
</style>