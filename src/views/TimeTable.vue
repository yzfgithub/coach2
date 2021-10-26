<template>
  <div class="page-ctn">
    <div class="page-container top-container">
       <div class="container-title">
          <img src="@/assets/img/time-icon.png" alt="" class="title-icon">
          <span class="title">您当前共开放固定时段</span>
          <span class="mark">{{fixedOpenTimeBlocks}}小时/周</span>
          <span class="detail" @click="getCoachLoopTimes">查看详情 ></span>
        </div>
        <div>
          <div class="add-btn" @click="addTime">增加临时时间</div>
        </div>
    </div>
    <div class="page-container time-container">
      <TimeTable  :legend="legend" :days="days" :fixedOpenTimeBlocks="fixedOpenTimeBlocks" :timeBlockDataAry="timeBlockDataAry" @lastWeek="lastWeek" @nextWeek="nextWeek"></TimeTable>
    </div>
    <div class="dialog-wrap" v-if="isShowLoopTime">
      <div class="dialog-center">
        <div class="dialog-close" @click="closeDialog">X</div>
        <div class="dialog-content">
          <div class="dialog-main">
            <img src="../assets/img/dialog.png" class="dialog-img">
          <div class="dialog-title">固定开放时间</div>
          <div v-for="(item,index) in coachLoopTimes" :key="index" class="coach-loop-times">
            <div v-for="(list,value) in item" :key="value">
              <div class="startDate">开始时间{{value}}开始</div>
              <div v-for="(week,weekValue) in list" class="week-time" :key="weekValue">
                <span>{{weekValue}}</span>
                <span>{{week}}</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TimeTable from '@/components/TimeTable';
import api from '../api';
import cookie from '@/tool/cookie';

const moment = require('moment');

export default {
  data() {
    const start_date = moment();
    const days = [];
    const startDate = start_date.clone();
    for (let i = 0; i < 7; i++) {
      days[i] = startDate.format('YYYY-MM-DD');
      startDate.add(1, 'd');
    }
    return {
      legend: [{ name: '固定开放', color: '#FFBA92' }, { name: '临时开放', color: '#FFD561' }, { name: '未开放', color: '#EBF0F7' }, { name: '被占用', color: '#C7CFD4' }],
      start_date,
      days,
      startDate: '',
      endDate: '',
      timeBlockDataAry: [],
      timeBlockData: [],
      blockStyle: '',
      isSelectTwo: 0,
      fixedOpenTimeBlocks: null,
      coachLoopTimes: [],
      isShowLoopTime: false,
    };
  },
  created() {
    if (cookie.getCookie('webAuthToken') === '') {
      window.location.href = this.isDev ? 'http://coachwechat.weilaicheng.com/klasses' : 'http://p.coachwechat.kuaipeilian.com/auth/bindPage';
    } else {
      this.getChours();
    }
  },
  components: {
    TimeTable,
  },
  methods: {
    getCoachLoopTimes() {
      api.getCoachLoopTimes().then((res) => {
        if (res.status === 200) {
          this.isShowLoopTime = true;
          this.coachLoopTimes = res.data.data;
        }
      });
    },
    addTime() {
      this.$router.push('/TemporaryTable');
    },
    getChours() {
      GlobalToast.showTip('正在加载中');
      this.startDate = this.days[0];
      this.endDate = this.days[6];
      api.getTimeTableChours({ startDate: this.startDate, endDate: this.endDate }).then((res) => {
        this.timeBlockData = res.data.data.timeBlockDTOS;
        this.fixedOpenTimeBlocks = res.data.data.fixedOpenTimeBlocks;
        this.handleTimeTableData();
      });
    },
    getToday() {
      return moment().day() - 1;
    },
    handleTimeTableData() {
      const todayNum = this.getToday();
      const timeBlock = this.timeBlockData.slice(todayNum * 48).concat(this.timeBlockData.slice(0, todayNum * 48));
      this.timeBlockDataAry = [];
      for (let i = 0; i < 7; i++) {
        this.timeBlockDataAry[i] = timeBlock.slice(i * 48, i * 48 + 48);
      }
    },
    lastWeek() {
      this.start_date.subtract(7, 'd');
      const _d = this.start_date.clone();
      for (let i = 0; i < 7; i++) {
        this.days[i] = _d.format('YYYY-MM-DD');
        _d.add(1, 'd');
      }
      this.getChours();
    },
    nextWeek() {
      this.start_date.add(7, 'd');
      const _d = this.start_date.clone();
      for (let i = 0; i < 7; i++) {
        this.days[i] = _d.format('YYYY-MM-DD');
        _d.add(1, 'd');
      }
      this.getChours();
    },
    closeDialog() {
      this.isShowLoopTime = false;
    },
  },
};
</script>
<style lang="stylus" scoped>
  .mark{
    color #FE5806
    font-size 16px
    font-weight 500
  }
  .detail{
    color #9B9B9D
    font-size 12px
    position absolute
    right 15px
  }
  .add-btn{
    background-color #FFAA00
    color #fff
    font-size 12px
    padding 7px 18px
    display inline-block
    border-radius 13px
    margin-top 18px
  }
  .time-container{
    padding 25px 0
  }
  .dialog-wrap{
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    background-color rgba(0,0,0,.7);
  }
  .dialog-center{
    width 315px
    height 520px
    background-color #fff
    border-radius 15px
    margin 40px auto
    position relative
  }
  .dialog-close{
    color #C7C7C7
    position absolute
    right 10px
    top 10px
  }
  .dialog-content{
    width 100%
    height 100%
  }
  .dialog-main{
    width 100%
    height 100%
    overflow-y scroll
  }
  .dialog-img{
    width 100px
    height 100px
    margin-top 20px
  }
  .dialog-title{
    font-size 18px
    color #353536
    font-weight 500
  }
  .startDate{
    color #FF7C3B
    font-size 14px
    margin-top 20px
  }
  .week-time{
   color #9B9B9D
   font-size 14px
   margin-top 6px
  }
  .coach-loop-times{
    text-align left
    padding 0 26px
  }
  @media screen and (max-width: 370px){
    .container-title{
      .title{
        font-size 14px
      }
    }
    .mark{
      font-size 14px
    }
    .detail{
      color #9B9B9D
      font-size 12px
    }
  }
</style>
