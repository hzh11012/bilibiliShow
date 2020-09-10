<template>
  <div class="projects">
    <div class="projects-list">
      <card :item="item" v-for="(item,index) in $store.state.projectsList.result" :key="index"></card>
    </div>
    <div class="projects-list" v-if="$store.state.projectsList.total == 0">
      <div class="empty-project"></div>
      <div class="no-result">没有相关结果</div>
      <div class="recommend-project-list">
        <div class="header">
          <div class="left-line"></div>
          <div class="recommend-icon"></div>
          <div class="recommend-text">为你推荐</div>
          <div class="right-line"></div>
        </div>
        <div class="content">
          <card :item="item" v-for="(item,index) in $store.state.recommendList.result" :key="index"></card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from "./card.vue";
export default {
  components: {
    card
  }
};
</script>

<style lang="less" scoped>
.projects {
  width: 1160px;
  margin: 0 auto;
  overflow: hidden;
  padding-bottom: 55px;
  .projects-list {
    width: 1160px;
    margin: 0 auto;
    .empty-project {
      margin: 60px auto 0;
      width: 160px;
      height: 180px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-image: url(//s1.hdslb.com/bfs/static/platform/static/img/empty_project.png);
    }
    .no-result {
      text-align: center;
      font-size: 14px;
      color: #99a2aa;
      letter-spacing: 0;
      margin-bottom: 60px;
    }
    .recommend-project-list {
      .header {
        justify-content: center;
        display: flex;
        align-items: center;
        .left-line {
          margin-right: 20px;
          border-radius: 5px;
          width: 260px;
          height: 2px;
          background-image: linear-gradient(90deg, #f4f4f4, #fb7299);
        }
        .recommend-icon {
          width: 18px;
          height: 18px;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          margin-right: 10px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAA5hJREFUSA29Vk1IVFEUvueNv+PMZFQmaoIZZBBFa8FFuyDTiqYCHXWKokRxygRXRosoimZSNGpR4yhEUhEFIRT9YFkbCapVPzsTbZHo8zmTb+adzpnxTW901NGc7uLdn3Pu991z7jnnPhDLbAGnZ6s6gxeEwN0CRBAE3MnKNLfBrZNqIlApiSjpOpO1HSWqGhxCgWZeAwTUBLbK0wrjtOh6i/XSYsJ5sqDqREQzWXXXas7KhpSUnWTlL5o3T9a4S+fpx1lYHiGI/YwBElwiF05YvA2fyMoeshiEBiVx8OctJUwoV3kOChRbAOCzxdf00YCUw2OThKOGtQWHCRHi+b40uq7LsyhtMWiAYctMmPo1Zn2BSUKE8vfhiwKxmO7qrbXH9VDHwtOdFnLwdrpHOb27fnUIFYdnL7nyLIEqqSKtVifjfloOllEQpdJBBsnVaJQtNF7UwimHZ0dI03p5s4Smhoze+m9GoBBq9tl51GqjPN4Y4i3ymt9xvTCIoUFEkU+n95ArXUZdPNW1dmoqMELyDElAlZDEmFHOYw2E3wrZQ+CtC+iyuIk/Xde5SVVnXpISkz2ylOc3ix59S6RXlMA+JuMZJX8vfeK2KRj/Kde6D1u9rlesMI8w4HRvnlF/PydZEZE9s2SbjoDdHmJlY5NM6S80baYbQISrjlEWHaPIozsuhRD6sK+viHFiXKo42ndpGHxKJ8+lIOm3ri84AG67PwqwgoFc5X5NhaGMTCuzec8MRIOGozGEwQEmo6jrsxYXVPwr2ez5YgpC1KUhRC+Ff5aQ4Kqlu6mF3JlQmC9pNOAGwhVSEApZN2ohJfY6SuJxm891btXImAGgizsNsJH7v4Q8S0Ijbz2gK+Kg28bwSSdUatqPUtCYiPTLfyFE1A4xEbV+/iTdQnq4PExErZI/SSe0lOe+oeKgkVvDURpNC2ZPRlOeDDdSbkt0hx8Yf66FJrn6RvgFXy1ySsHyMJEEV7iPWsihS2bbEP1jVI7GqLS9o9S/n5Vmewy3j8krPgDOlnUTjoSJdSDyczOR0EMqRol4IxXdSn4FZHXih1ztdivOjjxdN9F+0nGtghK/jAq235yZFk6LmOKtA+GJm2uUgL9cQ7QD4h5ySwpvos0J/UZEcDAn/AjQhP7yGq0+VwevxyWMbIh8Iw8xtgrUjjOxUbbYOBKZ4j2A1G71Nd3TdZck1BWxod3m9wubPl+qz5TSZf53nav3B9eTS+ljITpFAAAAAElFTkSuQmCC);
        }
        .recommend-text {
          font-size: 18px;
          color: #fb7299;
        }
        .right-line {
          margin-left: 20px;
          width: 260px;
          height: 2px;
          background-image: linear-gradient(-90deg, #f4f4f4, #fb7299);
          border-radius: 5px;
        }
      }
      .content {
      }
    }
  }
}
</style>