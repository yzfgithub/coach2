<template>
  <div class="time-table">
    <div class="time-table-header">
      <div class="legend-list">
        <div class="legend-type">
            <span v-for="(item,index) in legend" :key="index" class="legend">
                <span :style="{backgroundColor:item.color,borderStyle: index === 3 ? 'dashed': 'solid',borderColor: item.borderColor}" class="example"></span>
                <span class="legend-name">{{item.name}}</span>
            </span>
        </div>
      </div>
    </div>
    <div class="days-list">
      <div class="days-item">时间</div>
      <div v-for="(item,index) in days" :key="index" class="time-days">
        <div class="today">{{item}}</div>
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
        <div class="hour"></div>
      </div>
      <div class="block-list" v-for='(i, k) in 7' :key='k+100'>
          <div class="time-block" v-for="(block,index) in timeBlockDataAry[`${k}`]" :style="blockType(block)" :key="index" @click="selectOne(index,k)" :class="[index % 2 === 0 ? '' : 'even-class',block.isCore ? 'dashed-line' : '']">
            <div v-if="block.isUse" class="student-name">{{block.studentName}}</div>
            <br>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    type: {
      type: String,
      default: 'default',
    },
    timeBlockDataAry: [],
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
      days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      isSelectTwo: 0,
    };
  },
  methods: {
    zero_pad(value) {
      return value < 10 ? `0${value}` : value;
    },
    format_hour(hour) {
      hour -= 1;
      return `${this.zero_pad(Math.floor(hour))}:00`;
    },
    blockType(block) {
      const img = require('../assets/img/table_1.png'); // 未选中 荐
      const img2 = require('../assets/img/table_2.png'); // 选中 荐
      const img3 = require('../assets/img/table_3.png'); // 选中

      const isOpen = block.isOpen;
      const isUse = block.isUse;
      const isShowSaturationRateHit = block.isShowSaturationRateHit;

      if (this.type === 'edit') {
        if (isUse) {
          if (isOpen) {
            return 'background-color: #ffd562;';
          }
          return 'background-color: #F7F9FA;';
        }
        if (isShowSaturationRateHit) { // 推荐的
          if (isOpen) {
            return `backgroundImage: url(${img2});`;
          }
          return `backgroundImage: url(${img});`;
        }
        if (isOpen) {
          return `backgroundImage: url(${img3});`;
        }
        return 'background-color: #F7F9FA;';
      }

      if (isUse) {
        return 'background-color: #C7CFD4;';
      }
      if (isOpen) {
        return 'background-color: #FFBA92;';
      }
      return 'background-color: #EBF0F7;';
    },
    selectTwoRow(index) {
      if (this.type === 'edit') {
        this.$emit('selectTwoRow', index);
      }
    },
    selectOne(index, aryIndex) {
      if (this.type === 'edit') {
        const isOpen = this.timeBlockDataAry[aryIndex][index].isOpen;
        if (isOpen) {
          this.timeBlockDataAry[aryIndex][index].isOpen = false;
          this.selectOneAry.push(this.timeBlockDataAry[aryIndex][index].timeBlock);
        } else {
          this.timeBlockDataAry[aryIndex][index].isOpen = true;
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
  .legend-list{
    display flex
    align-items center
    justify-content center
    margin 0 auto
    .legend-type {
            display flex
            justify-content space-around
          .legend{
            display flex
            align-items center
            color #4c4c4c
            font-size 10px
            font-weight 600
            margin 0 10px
            .example{
            display inline-block
            width 12px
            height 12px
            border-radius 2px
            margin-right 4px
            box-sizing border-box
            border-width 1px
            }
            .legend-name{
            vertical-align middle
            font-weight 600
            color #4c4c4c
            }
        }
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
      height 55px
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
    margin-right 3px
    border-radius 2px
    display flex
    align-items center
    justify-content center
    overflow hidden
    background-size 100% 100%
  }
  .time-block.even-class{
    margin-bottom 3px
  }
  .time-block.dashed-line{
    border 1px dashed #ff9800
    box-sizing border-box
  }
  .student-name{
    font-size 10px
    color #ffffff
  }
}
</style>
