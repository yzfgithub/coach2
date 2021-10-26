<template>
  <div class="leave-list-page pages-ctn">
    <div class="page-container top-container">
        <div class="container-title">
          <img src="@/assets/img/time-icon.png" alt="" class="title-icon">
          <span class="date" @click="showDatePicker">{{selectDate}}</span>
          <img src="@/assets/img/arrow-icon.png" alt="" class="arrow-icon">
        </div>
        <div class="time-info">{{batchInfo.month}}月等级对应积分周期为{{fmtDate(batch)}}</div>
        <div class="bottom-btn">
          <div class="medal-wrap"><img :src="gradeIconUrl(batchInfo.level)" alt=""/></div>
          <div class="grade-title">{{fmtLevelName(batchInfo.level)}}
            <img src="@/assets/img/newbie.png" alt="" class="newbie-icon" v-if="batchInfo.is_new">
          </div>
          <div class="grade-tips">{{batchInfo.salary_rule25}}</div>
          <div class="grade-tips">{{batchInfo.salary_rule50}}</div>
        </div>
    </div>
    <div class="page-container grade-container">
      <div class="container-title">
        <img src="@/assets/img/record-icon.png" alt="" class="title-icon">
        <span class="title">明细详情</span>
      </div>
      <div class="total-score">
        <p>总记分：{{batchInfo.score/100}}分，本月初始分：{{batchInfo.default_score/100}}分</p>
        <p>完课履约：{{batchInfo.klass_score/100}}分 <span v-if="batchInfo.max_klass_score<1000000">（满分{{batchInfo.max_klass_score/100}}）</span>， 课程评价：{{batchInfo.klass_report_score/100}}分 <span v-if="batchInfo.max_klass_report_score<1000000">（满分{{batchInfo.max_klass_report_score/100}}）</span></p>
        </div>
        <div>
          <div class="scord-detail-item"  v-for="(item,index) in batchLogList" :key="index">
          <div style="width: 75%;">
            <div class="item-name">{{item.reason}}</div>
            <div class="item-date">{{item.created_at}}</div>
          </div>
          <div>
            <div class="item-score add-score" v-if="item.score*1>0">+{{item.score/100}}</div>
            <div class="item-score" v-else>{{item.score/100}}</div>
          </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      selectDate: '',
      datePicker: false,
      batch: '',
      batchInfo: [],
      maxMonth: 2020,
      gradeList: [],
      batchLogList: [],
    };
  },
  created() {
    const date = new Date();
    this.selectDate = `${this.$route.query.year}年${this.$route.query.month}月`;
    this.batch = this.$route.query.batch;
    let yearNow = date.getFullYear();
    let monthNow = date.getMonth() + 1;
    const day = date.getDate();
    if (yearNow < 2020) {
      this.maxYear = 2020;
      this.maxMonth = 1;
    } else if (monthNow === 12) {
      monthNow = 0;
      yearNow++;
    } else if (day > 20) {
      this.maxMonth = monthNow * 1 + 1;
      this.maxYear = yearNow;
    } else {
      this.maxMonth = monthNow;
      this.maxYear = yearNow;
    }
    this.getBatchInfo(this.batch);
    this.getBatchLog(this.batch);
    this.getBatchList();
  },
  methods: {
    fmtDate(batch) {
      if (batch === '20191221-20200120') {
        batch = '20200101-20200120';
      }
      return `${Number(batch.split('-')[0].slice(4, 6))}月${batch.split('-')[0].slice(6, 8)}日 - ${Number(batch.split('-')[1].slice(4, 6))}月${batch.split('-')[1].slice(6, 8)}日`;
    },
    fmtType(type) {
      if (type.indexOf('appeal') > -1) {
        return '申诉成功 已加回';
      }
      return '';
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
    showDatePicker() {
      if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: '请选择日期',
          value: new Date(),
          min: new Date(2020, 1),
          max: new Date(this.maxYear, this.maxMonth),
          format: {
            month: 'MM',
          },
          columnCount: 2,
          onSelect: this.selectHandle,
        });
      }
      this.datePicker.show();
    },
    selectHandle(date, selectedVal, selectedText) {
      this.leaveDate = `${selectedVal[0]}年${selectedVal[1]}月`;
      this.gradeList.map((item, index) => {
        if (item.year === selectedVal[0] && item.month === selectedVal[1]) {
          this.selectDate = `${selectedVal[0]}年${selectedVal[1]}月`;
          this.batch = item.batch;
          this.getBatchInfo(this.batch);
          this.getBatchLog(this.batch);
        }
      });
    },
    getBatchList() {
      api.getBatchList().then((res) => {
        this.gradeList = res.data.data.list;
      });
    },
    getBatchInfo(batch) {
      api.getBatchInfo(batch).then((res) => {
        this.batchInfo = res.data.data;
      });
    },
    getBatchLog(batch) {
      api.getBatchLog(batch).then((res) => {
        this.batchLogList = res.data.data.list;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.grade-container {
  border-radius: 5px;
}
  .leave-list-page {
    background-color #F3F6F9
    padding-bottom 60px
  }
  .leave-info{
      display flex
      justify-content space-between
      margin-top 24px
  }
  .bottom-btn{
    text-align center
    margin-top 20px
  }
  .leave-tips{
    color #fe5806
    font-size 12px
    margin-top 10px
  }
  .total-score{
    color #FFAA00
    font-size 11px
    width 345px
    height 22px
    line-height 22px
    background-color #FFF9E5
    border-radius 5px
    margin-top 10px
    margin-bottom 40px
    p{
      background-color #FFF9E5
      text-align left
      padding-left 20px
    }
  }
  .newbie-icon{
    width 50px
    vertical-align top
  }
  .time-info{
    font-size 12px
    color #666
    margin-top 10px
  }
  .grade-title{
    color #353536
    font-size 16px
  }
  .grade-tips{
    font-size 12px
    color #9B9B9D
    margin-top 10px
  }
  .scord-detail-item{
    display flex
    justify-content space-between
    margin-top 20px
    padding-bottom 20px
    border-bottom 1px solid #EFF3F5
    .item-name{
      color #666
      font-size 14px
      margin-bottom 10px
      text-align left
      line-height 18px
    }
    .item-score{
      font-size 18px
      margin-bottom 6px
      font-weight 500
    }
    .item-score-add{
      color #FF7C3B
    }
    .item-score-reduce{
      color #C7C7C7
    }
    .item-date{
      color #C7C7C7
      font-size 11px
      text-align left
    }
    .item-status{
      color #9B9B9D
      font-size 11px
    }
    .add-score{
      color #FF7C3B
    }
  }

</style>
