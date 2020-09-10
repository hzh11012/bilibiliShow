<template>
  <div class="item" @click="click(item.id)">
    <div class="item-img" :style="{backgroundImage:'url(https:' + item.cover + '@350w_466h.jpeg)'}"></div>
    <div class="item-content">
      <div class="item-title">{{item.project_name}}</div>
      <div class="item-time">
        <span class="icon icon-rili"></span>
        {{item.tlabel}}
      </div>
      <div class="item-address">
        <span class="icon icon-address"></span>
        <span class="city-name" v-if="$store.state.hideCityTag">{{item.city}}</span>
        <span class="address">{{item.venue_name}}</span>
      </div>
      <div class="item-price">
        <div class="not-free" v-if="item.is_sale && item.is_price">
          <span class="price-symbol">¥</span>
          <span class="price">{{item.price_low/100}}</span>
          <span class="start" v-if="item.price_high!=item.price_low">起</span>
          <!-- <span></span>
          <span></span>-->
          <span class="not" v-if="item.sale_flag_number==1">{{item.sale_flag}}</span>
          <span class="promo-item" v-if="item.promo">{{item.promo[0].type_name}}</span>
          <span class="promo-item" v-if="item.is_exclusive">{{item.label}}</span>
          <span class="list-end" v-if="item.countdown_sec>0">
            <span class="icon-end"></span>
            {{item.countdown}}
          </span>
        </div>
        <span v-if="!item.is_sale || !item.is_price" class="not-sale">{{item.sale_flag}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  methods: {
    click(id) {
      // this.$router
      //   .push({
      //     path: "/detail",
      //     query: { id: id }
      //   })
      //   .catch(data => {});
      window.open("#/detail?id=" + id + "");
    }
  }
};
</script>

<style lang="less" scoped>
.item {
  cursor: pointer;
  display: flex;
  position: relative;
  margin-top: 60px;
  margin-right: 40px;
  width: 560px;
  height: 237px;
  background: #fff;
  box-shadow: 0 0 15px 0 hsla(203, 6%, 45%, 0.09);
  border-radius: 8px;
  float: left;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 10px 20px 10px 0 hsla(255, 9%, 45%, 0.09);
    .item-img {
      transform: translateY(-10px);
    }
  }
  &:hover:nth-child(2n) {
    box-shadow: -10px 20px 10px 0 hsla(255, 9%, 45%, 0.09);
  }
  .item-img {
    transition: transform 0.1s;
    background: #fff;
    box-shadow: 3px 3px 2px 0 hsla(203, 6%, 45%, 0.3);
    border-radius: 8px;
    left: 20px;
    bottom: 24px;
    position: absolute;
    width: 175px;
    height: 233px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .item-content {
    margin-left: 223px;
    .item-title {
      font-size: 18px;
      color: #222;
      margin-top: 30px;
      width: 286px;
      height: 48px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
    }
    .icon {
      margin-top: 1px;
      margin-right: 8px;
      display: inline-block;
      width: 12px;
      height: 13px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .item-time,
    .item-address,
    .item-price {
      display: flex;
      align-items: center;
      height: 17px;
      font-size: 14px;
      color: #999;
    }
    .item-time {
      margin-top: 19px;
      .icon-rili {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAYAAACtv5zzAAAAAXNSR0IArs4c6QAAAi5JREFUSA3tlU1IG0EUx3c3u0ECFdIeWpCAN6VgQXrsUUohl0LFgJgekmySkyCUgvTWHnsolEJpdpPm5tkPvHvQixe1QqE3hZJGBEEPARd209+IGzb7YbK09dSFx7yP//vPmzezM7IU8dXr9RnHcV6nUqlcPp+/CIM1Go0J27Y/JRKJxVKp9CMMo4Q5hQ/yF91u91mn05mOwkA+A+apGKMwaq1W0xRFeQPhLCChL5fL5TU3AYItMK7ZNxLrsw3DeItvXpblC8SAx1BBvId8CQexroXc68uSpCPsjs/nmndRHrgG4xgyDoeGUFfNUSEu4TxTVXWyWCyeesD2tf6yWq1ue/w9FYIqxhfIrrCVSkXH1k3TfETRB4JbIXgHafvIJXwmgA/pdHq3x+hTksnkGpiPYvSGaM03YcMxKloU+lH1IYFXocFrZ6FQaKMu3YSJPEU3JcWJBVZA/+7TvwokWhwiWtVmDz77cwITQD4H6J0fOMim3xLFrdP/n15sYIJMJmO2Wq1jEuKu4ETX9T5yMVFggmw2e4l/w1vFn+i3v8mi2mazOW5Z1kjMys852r/8OYEWsVHPIV/1A4ewHW7Xh/5bNTABx20fshUk7grONE0bvMmchGPIF4aoeCjIP9/kW5nAYa2xfqpBveEad/ls8R7s8dc+xvmVxMAxG0QWEZ8SfsGtQi4utk2kIJx/8fsO97IsCDm/4tF5wuMd92hG1XPOQ7WTy+WsKMB/f68DvwErc967V/DPSQAAAABJRU5ErkJggg==);
      }
    }
    .item-address {
      margin-top: 10px;
      .city-name {
        margin-right: 10px;
      }
      .address {
        flex: 1 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 260px;
      }
      .icon-address {
        margin-top: 0;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAcCAYAAAB/E6/TAAAAAXNSR0IArs4c6QAABHdJREFUSA2dlm9o1VUYx3d/3txMyxVboOxFhVqmL8SwyDD/4Iu4ltKbRSR3jP25wQQteuULozcVYnMGtfb3wtyKltAIm6gVMiRERVYpU3EqDpyEdYewe93udm+f7+F3Lufe3bsbHXju85zn+Z7ne85z/vxuoGSe1tbWVhEIBHam0+k3ga3CXo69CPs+ch0Z8jzvu4aGhhHseVsgX7Szs/PJ2dnZ/cT2IKUOJgZZgn4FhAutH99pCD+or6+/bH25eg4RJK+lUqljJKoE/IAkUWQgGAyeq62tfagExAIdHR0voF+nG0FWIknI6lldD/acFnQ97e3t77KSKL5HkFbkQGNjo8qU1SBO47gigewwpO+hP2aCz2YBnU5mRVoJJD8TS5GoAYKjDq6oqVX6E8iLNUTaE2ZzFXAl4HAhkt7e3senpqaW1NXV3c2bDefg4GDp2NjYZ5hHI5HIJYszpfM3XnvSmo+Ekm5XieLx+BrNnNN4D+xBsEeYWMomkx4fH38atQ//RvTLiGmejjCWTtcD5IDxOj/UP0z3FLIWkj/QZ0lSjm4mpv3Maqz2GvELYF9igiIzzcO5E6sUHWWpWRvf09PzFCX9gkEzxEPE1yGb6K+lfwMdhizk58oo/C1+Z691ejh1GUsYOGCdVicSic3YS4l9TZlOWD9ko7o36jORXdbv6O+x4+TeZH0exip1dE+s09EmRn/Y8RmTff1dBpOwmAyEiSTp3ESWUZXFCqh0y9ExexnltI1ZX5PNzNZbn6Otz2AcvzHJOyqDqpi7pdLp7Zo10ZwfynIGVwyJsBeZEnV1dT1HomYf/oOvc5WeqhImq4NTotL9g1Rw+pbK4TZKcB9gE0kXQDoAZoSTdH5mZuZPJvgM2E727qQ7xtrEV8hGK78p3YgM9kjv1ZzG2/UtZFsIXIJwJQM3oO8iTZA0zhngO4ivQKarqqpuyBWkM8Tgbcx4B/2LPi5L8SoP4XiRFT1aVla2qKam5m8BCvHw0rzKYVHJzoZCoSlhPQjaxQxZU39/v/arYKOUcUtSEEQAkg8VJ++XFucxeJzONxBVxmKxOhv4v5pDs5qxegRul5eX6z6ZpsOgdgh2nbxPo9Fo3r0yqCI/VGQhFeoFxrZ6h6qrqzOn2RBRa31XPgKwZHp6+se+vr4niuTMG6YiXQTWM+lf2ddWF2RXpI39BMAxgs9PTk4e56485gKL2Rz7z8HsRkaZ9NvkynrVM0QE0tQ0jD4DcCN35aS+P8UIFIekmTF6++4xXo9v1uMsTIZIHWqaYMAOkdF9he/PafbM3GzFcxtYfZuOoN8npm/UVipzPRenfuZT7gZ1XyD7iQRb0No/zfJODkb/K7oRlcuQgLnqYlw7a0U2wIA4F/MNSAYhWYP/gv5T2Li+U8R+ob8bfQvZPB+JxuVdkU3IcV0wMTHRAtkekumoHkSG6begl+H7jQm9FQ6H/7JjCul5iewgLuE7JP8KMfvlkx6mv5+V6NtTtP0nImXp7u6uTCaT+zD1N1l/YoaLZncA/wI5+QZSrZRLqQAAAABJRU5ErkJggg==);
      }
    }
    .item-price {
      align-items: flex-end;
      margin-top: 40px;
      height: auto;
      color: #f25d8e;
      .not-free {
        display: flex;
        align-items: flex-end;
        .price-symbol {
          align-self: flex-end;
          font-size: 18px;
          line-height: 18px;
        }
        .price {
          margin-left: 4px;
          font-size: 28px;
          letter-spacing: 1px;
          line-height: 24px;
        }
        .start {
          line-height: 12px;
          margin-left: 5px;
          font-size: 12px;
          color: #999;
          margin-bottom: 2px;
        }
        .not {
          box-sizing: border-box;
          margin-left: 8px;
          text-align: center;
          color: #999;
          width: 45px;
          height: 18px;
          line-height: 18px;
          background: #e7e7e7;
          border-radius: 1px;
        }
        .promo-item {
          display: inline-block;
          max-width: 80px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: auto;
          height: 16px;
          line-height: 16px;
          margin-left: 8px;
          color: #fb7299;
          font-size: 12px;
          text-align: center;
          border: 1px solid #fb7299;
          border-radius: 1px;
        }
        .list-end {
          margin-left: 8px;
          line-height: 18px;
          font-size: 11px;
          color: #999;
          letter-spacing: 0.46px;
          &::before {
            float: left;
            width: 1px;
            height: 9px;
            margin: 4px 3px 5px 5px;
            font-size: 0;
            clear: both;
            content: "";
            border-left: 1px solid #ccc;
          }
          .icon-end {
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAABDlJREFUWAntWM9LVUEUfr+IlBfURlAwECQQVIJavWjpIgpKjMJN/4GKJC5KqIW5EETSv6GgQGxRtHjtpLdzo0JQgmDwhDYJirp4vtf3TXMuZ+6979ft+XiQA3PPmZlzzvfNnZk7dyYWO0//6RuI/0u/NzY2rsTj8buIMYR8tVQqdaHcxZjQ89DzUHeRsyh/Ghwc/M22KCkS0c3NzWGAjQH8NmSqRuACiK/BdnlgYGC1Rh/PrC6iW1tbt0BuHjnjRYiggHAOebq/v/9rre41EQWxJEguQE7owAAropxD/oC8nkql8sVikcMdSyQSXYVCgdPgBvID5Az8E5Begv9rkH0KeepVllGqEt3Z2bl8eHj4HiCchyYh8AnKS+3t7Qu9vb2/pL6S3N7e7jg6OiKpcfheFFuUs+l0+lFPT8++1IXJikQtyRwC94kzAq9An8Q8+yl19UjM727YLyLmiPgh5jeQzVQi6wyFOFIiUNK+SUMSwUrIz0HwYRhJEHiFfECp4/h1+jIGYzGmxeqzWEm/vZTLErVz0gy3DTgKgDlxDJFT6Fwa9VMhbYEqG2tUkR0iZsDQVoQStatbL5wZBH5XLgjrQfKClpVspc3GnJEyYkwQW8pahhKFw7wYoccrtvdS1VDJ2MSQoBpb6igDRDHHhmFsvpMIcAKbSe1wRvqkxeLIZMjBjxMgCoMxMYLTEnocaXVLjFokMYilbD0OUucQ5d4NB26LMfSwyO+kGJ61JBYxiUMO5KIxHaIwvIdG2btztX7MdcCousXiLseUslz+lvB0iKLs7T7QuS02O2lMzSVAlLuGpHVRmig1pubiEsXcMP+SJMYfjCYSNFAaU3NhozP0mBceUfkLaiZZjam5BIiiwuy9bEgmkxV/WGjT6OTD9LgQR1a4wcTr3oNyiQXonRAH1OtN+GC/rOaD+D/w/XyLN+cRspjG1XLxwjhE4ZSHwTW22p/e755lFYWASGYUIF9UMTfN6BDlG7G1mKZILlJP6cxRlHdVI//M60mRD24K5KbSNRd36GH0BfmJNebxoZ6d6TqOH9NYEPt4G6c2RlmBt26G3mdwX5WzSo85C8ZuWzxacGcotrW1dTZrd+JR5fj4eA8d4CgXkDv08doZejaAII+0XEwJnnGoNyMRy5Lkf8aaJkl8h6gltCzE4DCOCe/sENLWSEkMYqmYHgepCxDFJ2MVTubnAD3kaXFRjM9Q8rBnTqbEJgc/VoAoDWA8LYYIMIIeP5NyoyVjE0PiamypowwlyhsMOLxWhrMI+FiVG6LamLMSjJjlbk+cVS8OlOglb0c+Q+qTKA95c9ouqm5HaRbxDQeQzILkHcjQT1tZoiTQShcQFYkqsq19pSPDaqdBa1+SCVlKezHRuteOmix1LASeu1v3ItdP2F6N8+TKL0M3pkjY1TjvBXg1/tG/LfrjnZfP30DIG/gDhiom74wwkPcAAAAASUVORK5CYII=)
              50% no-repeat;
            background-size: contain;
            float: left;
            width: 12px;
            height: 12px;
            margin: 3px 5px;
          }
        }
      }
      .not-sale {
        font-size: 20px;
        color: #99a2aa;
        letter-spacing: 1px;
        line-height: 20px;
      }
    }
  }
}
.item:nth-child(2n) {
  margin-right: 0;
}
</style>