<template>
  <div class="my-grade-page pages-ctn" v-if="gradeListLength>0">
    <img src="@/assets/img/growth-rules.png" class="growth-rules" @click="toGradeRules">
    <!-- 当前月份 -->
    <div v-for="(item,index) in gradeList" :key="index">
      <div class="page-container" :class="index===0?'top-container':''" @click="toGradeDetile(item.year,item.month,item.batch)" v-if="index<gradeListLength-1">
        <div class="container-title">
          <div class="list-left">
            <div class="title">{{item.month}}月等级</div>
            <div class="klass-price">{{item.salary_rule25}}</div>
            <div class="klass-price">{{item.salary_rule50}}</div>
          </div>
          <div class="list-right">
            <img :src="gradeIconUrl(item.level)" alt="" class="grade-icon">
            <div class="grade-name">{{fmtLevelName(item.level)}}</div>
          </div>
        </div>
      </div>
      <!-- 下个月预计 -->
      <div class="page-container" :class="index===0?'top-container':''" v-if="index===gradeListLength-1" @click="toGradeDetile(item.year,item.month,item.batch)">
        <div class="container-title">
          <div class="list-left">
            <div class="title">{{item.month}}月等级
              <span class="mark-tips">（截止目前）</span>
              <img src="@/assets/img/newbie.png" alt="" class="newbie-icon" v-if="item.is_new">
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar progress-bar-bg">
                <div class="progress-bar-active" :style="'width:'+ (ftmScore(item.score,item.max_score)/item.max_score)*100 +'%'" v-if="item.year<=2020&&item.month<5"></div>
                <div class="progress-bar-active" :style="'width:'+ (ftmScore(item.score,item.level5_min_score)/item.level5_min_score)*100 +'%'" v-else></div>
              </div>
              <div class="percentage-wrap">
                <span class="percentage" v-if="item.year<=2020&&item.month<5"><span class="curret-score">{{item.score/100}}</span>/{{item.max_score/100}}</span>
                <span class="percentage" v-else><span class="curret-score">当前积分值{{item.score/100}}</span></span>
                <span class="percentage-tips" v-if="!item.is_new">还差{{(item.current_max_score-item.score)/100}}分会升级</span>
              </div>
            </div>
          </div>
          <div class="list-right">
            <img :src="gradeIconUrl(item.level)" alt="" class="grade-icon">
            <div class="grade-name">{{fmtLevelName(item.level)}}</div>
          </div>
        </div>
        <div class="grade-rules">
          <div class="mark-tips">本月获得等级的记分周期{{fmtDate(item.batch)}}</div>
          <div class="mark-tips" v-if="item.is_new">新手保护期老师默认为白银等级，不参与本月积分排名</div>
          <div class="grade-rules-table">
            <div class="grade-row grade-title">
              <div class="grade-item">等级</div>
              <div class="grade-item">人数占比</div>
              <div class="grade-item">当前最低分</div>
            </div>
            <div class="grade-row">
              <div class="grade-item">未来橙</div>
              <div class="grade-item">5%</div>
              <div class="grade-item">{{item.level5_min_score/100}}</div>
            </div>
            <div class="grade-row">
              <div class="grade-item">钻石</div>
              <div class="grade-item">10%</div>
              <div class="grade-item">{{item.level4_min_score/100}}</div>
            </div>
            <div class="grade-row">
              <div class="grade-item">黄金</div>
              <div class="grade-item">60%</div>
              <div class="grade-item">{{item.level3_min_score/100}}</div>
            </div>
            <div class="grade-row">
              <div class="grade-item">白银</div>
              <div class="grade-item">15%</div>
              <div class="grade-item">{{item.level2_min_score/100}}</div>
            </div>
            <div class="grade-row">
              <div class="grade-item">青铜</div>
              <div class="grade-item">10%</div>
              <div class="grade-item">-</div>
            </div>
          </div>
        </div>
    </div>
    </div>
  </div>
  <div class="blank-wrap"  v-else>
    <div class="blank-tips">您当前还未上过课，完课后才会参与记分排名哦</div>
  </div>
</template>
<script>
import api from '../api';
import cookie from '@/tool/cookie';

export default {
  data() {
    return {
      gradeList: [],
      gradeListLength: 1,
    };
  },
  created() {
    if (cookie.getCookie('webAuthToken') === '') {
      window.location.href = this.isDev ? 'http://coachwechat.weilaicheng.com/auth/bindPage' : 'http://p.coachwechat.kuaipeilian.com/auth/bindPage';
    } else {
      this.load();
    }
  },
  methods: {
    load() {
      api.getBatchList().then((res) => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() * 1 + 1;
        const year = date.getFullYear();
        if (year === 2020 && month === 1) {
          this.gradeList = res.data.data.list.slice(-1);
          if (day > 20) {
            this.gradeList = res.data.data.list.slice(-2);
          }
        } else if (day > 20) {
          this.gradeList = res.data.data.list.slice(-3);
        } else {
          this.gradeList = res.data.data.list.slice(-2);
        }
        if (this.gradeList) {
          this.gradeListLength = this.gradeList.length;
        }
      });
    },
    fmtDate(batch) {
      if (batch === '20191221-20200120') {
        batch = '20200101-20200120';
      }
      return `${Number(batch.split('-')[0].slice(4, 6))}月${batch.split('-')[0].slice(6, 8)}日 - ${Number(batch.split('-')[1].slice(4, 6))}月${batch.split('-')[1].slice(6, 8)}日`;
    },
    gradeIconUrl(level) {
      switch (level) {
        case 1: return require('../assets/img/bronze-icon.png');
        case 2: return require('../assets/img/silver-icon.png');
        case 3: return require('../assets/img/gold-icon.png');
        case 4: return require('../assets/img/diamond-icon.png');
        case 5: return require('../assets/img/weilaicheng-icon.png');
        default: return '';
      }
    },
    fmtLevelName(level) {
      switch (level) {
        case 1: return '青铜';
        case 2: return '白银';
        case 3: return '黄金';
        case 4: return '钻石';
        case 5: return '未来橙';
        default: return '';
      }
    },
    toGradeRules() {
      this.$router.push({ path: '/GradeRules' });
    },
    toGradeDetile(year, month, batch) {
      this.$router.push({ path: '/GradeDetail', query: { year, month, batch } });
    },
    ftmScore(score, maxScore) {
      let defaultScore = 0;
      score > maxScore ? defaultScore = maxScore : defaultScore = score;
      score < 0 ? defaultScore = 0 : defaultScore = score;
      return defaultScore;
    },
  },
};
</script>
<style lang="stylus" scoped>
.blank-wrap{
  width 100%
  height 100%
  display flex
  align-items center
  justify-content center
  font-size 18px
  .blank-tips{
    width 80%
    line-height 30px
  }
}
.my-grade-page{
  .growth-rules{
    width 82px
    position fixed
    right 0
    top 10px
    z-index 999
  }
  .list-left{
    width 70%
    text-align left
    display flex
    flex-direction column
    justify-content space-between
    .title{
      margin-bottom 12px
      width 278px
      .newbie-icon{
        float right
        width 55px
      }
    }
    .klass-price{
      font-size 12px
      color #9B9B9D
      margin-bottom 5px
    }
    .progress-bar-wrap{
      width 278px
      .progress-bar{
        width 278px
        height 5px
        background-color #EFF3F5
        border-radius 3px
      }
      .progress-bar-bg{
        background-color #EFF3F5
      }
      .progress-bar-active{
        background-color #FFD561
        width 200px
        height 5px
        border-radius 3px
      }
      .percentage-wrap{
        display flex
        justify-content space-between
        margin-top 9px
      }
      .percentage{
        color #C7C7C7
        font-size 11px
        .curret-score{
          color #9B9B9D
        }
      }
      .percentage-tips{
        font-size 11px
        color #9B9B9D
      }
    }
  }
  .list-right{
    position absolute
    right 16px
    .grade-icon{
      width 40px
    }
    .grade-name{
      font-size 11px
      color #666
    }
  }
  .mark-tips{
    color #FE5806
    font-size 12px
  }
  .grade-rules{
    margin-top 20px
    border-top 1px solid #F7F9FC
    padding-top 20px
    .mark-tips{
      text-align left
    }
    .grade-rules-table{
      margin-top 16px
    }
    .grade-row{
      display flex
      justify-content space-between
      font-size 12px
      margin-bottom 4px
      color #666
      .grade-item{
        width 112px
        height 30px
        background-color #F7F9FC
        text-align center
        line-height 30px
        font-weight 500
      }
    }
    .grade-title{
      color #9B9B9D
    }
  }
}

</style>
