<template>
  <div class="temporary-table">
    <div class="page-container top-container">
      <div class="teacher-info">
        <!-- <div class="teacher-left">
          <img src="" alt="" class="teacher-icon">
         <span class="teacher-name">李某某老师</span>
        </div> -->
        <div class="cancel-btn" @click="returnTable">取消</div>
        <div class="add-btn" @click="updateTimeTable">确认开放</div>
      </div>
    </div>
     <div class="page-container time-container">
      <TimeTable :legend="legend" :days="days" :fixedOpenTimeBlocks="fixedOpenTimeBlocks" :timeBlockDataAry="timeBlockDataAry" :selectRowAry="selectRowAry" :selectOneAry="selectOneAry" @lastWeek="lastWeek" @nextWeek="nextWeek" @selectTwoRow="selectTwoRow" type="edit" ref="timeTable"></TimeTable>
    </div>
  </div>
</template>
<script>
import TimeTable from '@/components/TimeTable';
import api from '../api';

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
      legend: [{ name: '固定开放+被占用', color: '#EBEEF0' }, { name: '未开放', color: '#F7F9FA' }, { name: '临时开放', color: '#FFD561' }],
      start_date,
      days,
      startDate: '',
      endDate: '',
      timeBlockDataAry: [],
      timeBlockData: [],
      blockStyle: '',
      isSelectTwo: 0,
      selectRowAry: [],
      fixedOpenTimeBlocks: null,
      todayNum: null,
      selectOneAry: [],
    };
  },
  created() {
    this.getChours();
  },
  components: {
    TimeTable,
  },
  methods: {
    returnTable() {
      this.$router.push('/TimeTable');
    },
    getChours() {
      this.selectOneAry = [];
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
      this.selectRowAry = [];
      this.todayNum = this.getToday();
      const timeBlock = this.timeBlockData.slice(this.todayNum * 48).concat(this.timeBlockData.slice(0, this.todayNum * 48));
      this.timeBlockDataAry = [];
      for (let i = 0; i < 7; i++) {
        this.timeBlockDataAry[i] = timeBlock.slice(i * 48, i * 48 + 48);
        this.timeBlockDataAry[i].map((item, index) => {
          if (this.selectRowAry.indexOf(Math.floor(index / 2)) < 0) {
            if (item.openType === 2) {
              this.selectRowAry.push(Math.floor(index / 2));
            }
          }
        });
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
    updateTimeTable() {
      const timeBlocks = [];
      this.timeBlockDataAry.map((item) => {
        item.map((items) => {
          if (items.openType === 2) {
            timeBlocks.push(items.timeBlock);
          }
        });
      });
      const paramsData = { startDate: this.startDate, endDate: this.endDate, timeBlocks };
      api.putUpdateCusedCursor(paramsData).then((res) => {
        if (res.status === 200) {
          GlobalToast.showTip('提交成功');
          this.$router.push('/TimeTable');
        }
      });
    },
    selectTwoRow(index) {
      const hourIndex = index;
      index === 0 ? index : index *= 2;
      if (this.selectRowAry.indexOf(hourIndex) < 0) { // 选择
        this.timeBlockDataAry.map((item) => {
          if (item[index].openType === 0) {
            item[index].openType = 2;
            this.selectOneAry.push(item[index].timeBlock);
          }
          if (item[index + 1].openType === 0) {
            item[index + 1].openType = 2;
            this.selectOneAry.push(item[index + 1].timeBlock);
          }
        });
        this.isSelectTwo = 1;
        this.isSelectIndex = index;
        this.selectRowAry.push(hourIndex);
      } else { // 取消
        this.selectRowAry.splice(this.selectRowAry.indexOf(hourIndex), 1);
        this.timeBlockDataAry.map((item) => {
          if (item[index].openType === 2) {
            item[index].openType = 0;
          }
          if (item[index + 1].openType === 2) {
            item[index + 1].openType = 0;
          }
        });
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.teacher-info{
  display flex
  align-items center
  justify-content space-between
  .cancel-btn{
    border 1px solid rgba(218,218,218,1)
    border-radius 25px
    font-size 12px
    padding 7px 18px
    display inline-block
    width 50px
    color #9B9B9D
  }
  .add-btn{
    background-color #FFAA00
    color #fff
    font-size 12px
    padding 7px 18px
    display inline-block
    border-radius 13px
    width 50px
  }
}

  .time-container{
    padding 25px 0
  }

</style>
