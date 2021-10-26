<template>
    <div class="recommend-wrap">
        <div class="recommend-sum">
            <div>
                <div class="num">{{dataObj.registerNum}}</div>
                <div class="desc">已注册人数</div>
            </div>
            <div>
                <div class="num">{{dataObj.listeningPassNum}}</div>
                <div class="desc">面试通过</div>
            </div>
            <div>
                <div class="num">{{dataObj.examPassNum}}</div>
                <div class="desc">考核通过</div>
            </div>
            <div>
                <div class="num">{{dataObj.teachKlassNum}}</div>
                <div class="desc">完课人数</div>
            </div>
        </div>
        <div class="recommend-title">
            <img src="@/assets/img/detail-icon.png" alt="" class="title-icon"> 被推荐人
        </div>
        <div class="recommend-list">
            <ul v-if="dataObj.applyInfoDTOList && dataObj.applyInfoDTOList.length">
                <li v-for="(i, k) in dataObj.applyInfoDTOList" :key='k'>
                    <div class="detail">
                        <div>被推荐人</div><div class="mobile">{{i.mobile}}</div>
                    </div>
                    <div class="status">
                        <div>
                            <div><img v-if="i.registerTime" src="@/assets/img/status_1_active.png" alt=""><img v-else src="@/assets/img/status_1.png" alt=""></div>
                            <div class="process">已注册</div>
                            <div class="date">{{fmtTime(i.registerTime)}}</div>
                        </div>
                        <div>
                            <div><img v-if="i.listeningPassTime" src="@/assets/img/status_2_active.png" alt=""><img v-else src="@/assets/img/status_2.png" alt=""></div>
                            <div class="process">面试通过</div>
                            <div class="date">{{fmtTime(i.listeningPassTime)}}</div>
                        </div>
                        <div>
                            <div><img v-if="i.examPassTime" src="@/assets/img/status_3_active.png" alt=""><img v-else src="@/assets/img/status_3.png" alt=""></div>
                            <div class="process">考核通过</div>
                            <div class="date">{{fmtTime(i.examPassTime)}}</div>
                        </div>
                        <div>
                            <div><img v-if="i.firstKlassTime" src="@/assets/img/status_4_active.png" alt=""><img v-else src="@/assets/img/status_4.png" alt=""></div>
                            <div class="process">已完课</div>
                            <div class="date">{{fmtTime(i.firstKlassTime)}}</div>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-if="resp && !dataObj.applyInfoDTOList.length" class="empty">
                <img src="@/assets/img/empty.png" alt="">
                <div>暂无推荐人信息</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      dataObj: {},
      resp: false,
    };
  },
  mounted() {
    this.getRecommendTeacherList();
  },
  methods: {
    getRecommendTeacherList() {
      api.getRecommendTeacherList().then((res) => {
        this.resp = true;
        if (res.data.status) {
          this.dataObj = res.data;
        }
      });
    },
    fmtTime(val) {
      if (val) {
        return val.split(' ')[0];
      }
      return '';
    },
  },
};
</script>

<style lang="stylus" scoped>
.recommend-wrap{
    background-color #ffffff
    .recommend-sum{
        display flex
        justify-content space-around
        background-color #ffffff
        height 92.5px
        align-items center
        border 1px solid rgba(243,246,249,1)
        box-shadow 0px 3px 7.5px 0px rgba(243,246,249,0.7);
        border-radius 0px 0px 15px 15px

        .num{
            font-size 24px
            font-weight 500
            line-height 26px
            color #FE5806
        }
        .desc{
            font-size 12px
            font-weight 400
            line-height 20px
            color #666666
        }
    }
    .recommend-title{
        padding 24px 24px 0 24px
        img{
            width 24px
            height 24px
            display inline-block
            margin-right 20px
        }
        display: flex;
        justify-content: flex-start;
        font-size: 16px;
        font-weight: 500;
        line-height: 42px;
        align-items: center;
        color: #353536;
    }
    .recommend-list{
        margin-top: 6px;
        background-color #ffffff
        padding 0 24px 10px 24px
        min-height 300px
    }
    .recommend-list ul{
        li{
            .detail{
                height 35px
                background:rgba(243,246,249,1);
                border-radius:5px;
                display flex
                justify-content space-between
                align-items center
                font-weight:400;
                color:rgba(102,102,102,1);
                font-size 14px
                padding 0 10px
                .mobile{
                    font-weight 500
                }
            }
            .status{
                display flex
                justify-content space-between
                padding: 15px 0px;
                .process{
                    font-size 12px
                    font-weight 500
                    line-height 20px
                    color #9B9B9D
                }
                .date{
                    font-size 12px
                    font-weight 400
                    line-height 20px
                    color #C7C7C7
                }
                img{
                    width 18px
                    height 18px
                }
            }
        }
    }
    .empty{
        font-size 18px
        color #aaaaac
        margin 40px 0
        text-align center
        img{
            width 200px
        }
    }
}
</style>
