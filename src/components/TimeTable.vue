<template>
  <div class="time-table">
    <div class="time-table-header">
      <span class="last-week isActive" @click="lastWeek"><上一周</span>
      <span class="next-week isActive" @click="nextWeek">下一周></span>
      <div class="legend-list">
        <span v-for="(item,index) in legend" :key="index" class="legend">
          <span :style="{backgroundColor:item.color}" class="example"></span>
          <span class="legend-name">{{item.name}}</span>
        </span>
      </div>
    </div>
    <div class="days-list">
      <div class="days-item">时间</div>
      <div v-for="(item,index) in days" :key="index" class="time-days">
        <div class="time-date" v-if="!isToday(item)">{{format_date(item)}}</div>
        <div class="week-day"  v-if="!isToday(item)">{{format_week(item)}}</div>
        <div v-if="isToday(item)" class="today">今天</div>
      </div>
    </div>
    <div class="time-block-main">
      <div class="table-list">
        <div class="hour" v-for="(hour,index) in 25" :key="index">
          {{format_hour(hour)}}
            <div class="select-all" v-if="hour!==25&&type==='edit'" @click="selectTwoRow(index)">
              <span v-if="selectRowAry.indexOf(index)===-1">全选</span>
              <span v-if="selectRowAry.indexOf(index)>-1" class="cancel-select">取消</span>
              <div class="two-row">
                <div class="dashed" :class="isSelectTwo&&selectRowAry.indexOf(index)>-1?'cancelDashed':'selectDashed'"></div>
              </div>
            </div>
          </div>
      </div>
          <div class="block-list">
              <div class="time-block" v-for="(block,index) in timeBlockDataAry[0]" :style="blockType(block)" :key="index" @click="selectOne(index,0)">
                <div v-if="block.openType===5 && type !== 'edit'" class="student-name">{{block.studentName}}</div>
              </div>
          </div>
           <div class="block-list">
              <div class="time-block" v-for="(block,index) in timeBlockDataAry[1]" :style="blockType(block)" :key="index" @click="selectOne(index,1)">
                <div v-if="block.openType===5 && type !== 'edit'" class="student-name">{{block.studentName}}</div>
              </div>
          </div>
          <div class="block-list">
              <div class="time-block" v-for="(block,index) in timeBlockDataAry[2]" :style="blockType(block)" :key="index" @click="selectOne(index,2)">
                <div v-if="block.openType===5 && type !== 'edit'" class="student-name">{{block.studentName}}</div>
              </div>
          </div>
           <div class="block-list">
              <div class="time-block" v-for="(block,index) in timeBlockDataAry[3]" :style="blockType(block)" :key="index" @click="selectOne(index,3)">
                <div v-if="block.openType===5 && type !== 'edit'" class="student-name">{{block.studentName}}</div>
              </div>
          </div>
          <div class="block-list">
              <div class="time-block" v-for="(block,index) in timeBlockDataAry[4]" :style="blockType(block)" :key="index" @click="selectOne(index,4)">
                <div v-if="block.openType===5 && type !== 'edit'" class="student-name">{{block.studentName}}</div>
              </div>
          </div>
           <div class="block-list">
              <div class="time-block" v-for="(block,index) in timeBlockDataAry[5]" :style="blockType(block)" :key="index" @click="selectOne(index,5)">
                <div v-if="block.openType===5 && type !== 'edit'" class="student-name">{{block.studentName}}</div>
              </div>
          </div>
           <div class="block-list">
              <div class="time-block" v-for="(block,index) in timeBlockDataAry[6]" :style="blockType(block)" :key="index" @click="selectOne(index,6)">
                <div v-if="block.openType===5 && type !== 'edit'" class="student-name">{{block.studentName}}</div>
              </div>
          </div>
        </div>
  </div>
</template>
<script>
// import timetable from '../tool/timetable.js';
// import api from '../api';

const moment = require('moment');

moment.locale('zh_CN');
export default {
  props: {
    type: {
      type: String,
      default: 'default',
    },
    timeBlockDataAry: [],
    days: [],
    legend: [],
    selectRowAry: {
      type: Array,
      default() {
        return [];
      },
    },
    selectOneAry: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      blockStyle: '',
      isSelectTwo: 0,
      isSelectIndex: null,
      fixedOpenTimeBlocks: null,
    };
  },
  created() {
  },
  methods: {
    format_date(value) {
      return moment(value, 'YYYY-MM-DD').format('MM月DD日');
    },
    format_week(value) {
      return moment(value, 'YYYY-MM-DD').format('dddd');
    },
    isToday(value) {
      let isToday = false;
      value === moment().format('YYYY-MM-DD') ? isToday = true : isToday = false;
      return isToday;
    },
    zero_pad(value) {
      return value < 10 ? `0${value}` : value;
    },
    format_hour(hour) {
      hour -= 1;
      return `${this.zero_pad(Math.floor(hour))}:00`;
    },
    getToday() {
      return moment().day() - 1;
    },
    blockType(block) {
      const img = require('../assets/img/table_1.png');
      const img2 = require('../assets/img/table_2.png');
      const img3 = require('../assets/img/table_3.png');

      const type = block.openType;
      const timeBlock = block.timeBlock;
      // const isHighDemand = true;
      const flag = block.isShowSaturationRateHit;

      if (this.type === 'edit') {
        if (type === 1 || type === 5) {
          return 'background-color:#EBEEF0';
        }
        if (type === 0) {
          if (flag) { // 推荐
            return `backgroundImage:url(${img});`;
          }
          return 'background-color:#F7F9FA';
        }
        if (type === 2) {
          if (flag) {
            return `backgroundImage:url(${img2});`;
          }
          return `backgroundImage:url(${img3});`;
        }
        return '';
      }
      if (type === 0) {
        return 'background-color:#EBF0F7';
      }
      if (type === 1) {
        return 'background-color:#FFBA92';
      }
      if (type === 2) {
        return 'background-color:#FFD561';
      }
      if (type === 5) {
        return 'background-color:#C7CFD4;';
      }
      return '';
    },
    lastWeek() {
      this.$emit('lastWeek');
    },
    nextWeek() {
      this.$emit('nextWeek');
    },
    selectTwoRow(index) {
      if (this.type === 'edit') {
        this.$emit('selectTwoRow', index);
      }
    },
    selectOne(index, aryIndex) {
      if (this.type === 'edit') {
        const openType = this.timeBlockDataAry[aryIndex][index].openType;
        if (openType === 0) {
          this.timeBlockDataAry[aryIndex][index].openType = 2;
          this.selectOneAry.push(this.timeBlockDataAry[aryIndex][index].timeBlock);
        }
        if (openType === 2) {
          this.timeBlockDataAry[aryIndex][index].openType = 0;
        }
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.time-table{
  .time-table-header{
    padding 0 10px
  }
  .last-week, .next-week{
    font-size 11px
    color #DADADA
  }
  .last-week{
    float left
  }
  .next-week{
    float right
  }
  .legend-list{
    display flex
    width 75%
    align-items center
    justify-content space-around
    margin 0 auto
  }
  .legend{
    display flex
    align-items center
    color #C7C7C7
    font-size 10px
    .example{
      display inline-block
      width 12px
      height 12px
      border-radius 2px
      margin-right 4px
    }
    .legend-name{
      vertical-align middle
    }
  }
  .days-list{
    margin-top 15px
    padding-right 10px
    display flex
    color #353536
    justify-content space-between
    border 1px solid #EFF3F5
    box-shadow 0px 3px 8px 0px rgba(243,246,249,0.7)
  }
  .days-item{
    // padding 15px 15px
    font-size 11px
    display flex
    flex-direction column
    justify-content center
    border-right 1px solid #EFF3F5
    color #353536
    width 50px
  }
  .time-days{
    padding 10px 0
    font-size 9px
    display flex
    flex-direction column
    justify-content center
  }
  .time-date{
    color #9B9B9D
  }
  .week-day{
    display inline-block
    font-size 10px
    color #353536
    margin-top 4px
    width 43px
    margin-right 2px
  }
  .today{
    width 45px
    font-size 11px
  }
  .time-block-main{
    display flex
    height 400px
    overflow-y scroll
  }
  .table-list{
    margin-top 8px
    width 50px
    color #353536
    .hour{
      font-size 10px
      display flex
      flex-direction column
      color #C7C7C7
      height 54px
      width 50px
      position relative
    }
    .select-all{
      color #FFAA00
      font-size 8px
      position absolute
      bottom 20px
      right 20px
    }
    .cancel-select{
      color #9B9B9D
    }
    .two-row{
      width 6px
      height 20px
      overflow hidden
      display inline-block
      position absolute
      bottom -6px
      margin-left 4px
      .dashed{
        width 10px
        height 18px
        border-radius 2px
      }
      .selectDashed{
        border 1px #FFAA00 dotted
      }
      .cancelDashed{
        border 1px #9B9B9D dotted
      }
    }
  }
  .block-list{
    margin-top 12px
  }
  .time-block{
    width 43px
    height 25px
    background-color #F3F6F9
    margin-bottom 2px
    margin-right 2px
    border-radius 2px
    display flex
    align-items center
    justify-content center
    overflow hidden
    background-size 100% 100%
  }
  .student-name{
    font-size 10px
    color #ffffff
  }
  .isActive{
    color #FF8E74
    font-size 11px
    margin-top 1px
  }
}
</style>
