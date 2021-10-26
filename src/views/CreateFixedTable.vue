<template>
  <div class="page-ctn">
    <div class="page-container time-container">
      <TimeTable  :legend="legend" :days="days" :timeBlockDataAry="timeBlockDataAry" :selectRowAry="selectRowAry" :selectOneAry="selectOneAry" @selectTwoRow='selectTwoRow'  type="edit" ></TimeTable>
    </div>
    <div class="page-container bottom-container">
        <div class="container-title">
            <div class="left">
              <img src="@/assets/img/time-icon.png" alt="" class="title-icon">
              <span class="title">开始生效日期</span>
            </div>

            <div class="right">
              <cube-button class="edit-select" style="background:#ffffff;color: #666;" @click="showStartPicker" v-model="startTime">{{startTime}}<i v-if="type === 'add'" class="cubeic-arrow"></i></cube-button>
            </div>
        </div>
        <div class="comment">
          <div>已选{{coreSelectNum}}小时<span class="tip">(核心时间段需{{coachDetail.minCoreBlockCount}}小时以上)</span></div>
          <span>指定时间段为学生约课高峰期，老师需优先选择</span>
        </div>
        <div class="footer-operate">
          <div @click='prevPage' class="btn return-btn">返回</div>
          <div @click='postData' class="btn submit-btn">提交</div>
        </div>
    </div>
    <cube-popup ref="myPopup" type="my-popup" position="bottom" maskClosable=true>
      <div class="mypop-ctn">
        <div class="title">
          <div @click="closeMyPop" class="cancel">取消</div>
          <div class="center">加课列表</div>
          <div @click="submitMyPop" class="submit">确定</div>
        </div>
      <div class="mypop-list" :style="{height: popLen == 1 ? '140px' : popLen == 2 ? '240px': '350px'}">
        <ul>
          <li v-for="(val,key) in effectAddList.klassList" :key='key'>
            <div class="list-detail">
              <div>{{val.startDate}}&nbsp;&nbsp;{{val.timeBlockPeriod}}</div>
              </div>
            <div class="list-edit">
              <div>{{val.studentName}} <span class="klass-type">临时课-加课</span></div>
              <div class="select">
                <div @click="setAddDeal(key,'klass',true)" class="radio radio-1"><img v-if="val.selected" src="@/assets/img/success_radio_icon.png" alt=""><img v-else src="@/assets/img/radio_icon.png" alt="">正常上课</div>
                <div @click="setAddDeal(key,'klass',false)" class="radio radio-2"><img v-if="val.selected" src="@/assets/img/radio_icon.png" alt=""><img v-else src="@/assets/img/success_radio_icon.png" alt="">取消</div>
              </div>
            </div>
          </li>
          <li v-for="(v,k) in effectAddList.ruleList" :key='k'>
            <div class="list-detail">
              <div>{{v.dayOfWeekDesc}}&nbsp;&nbsp;{{v.startTime}}开始&nbsp;&nbsp;{{v.unitDesc}}</div>
            </div>
            <div class="list-edit">
              <div>{{v.studentName}} <span class="klass-type">固定课-加课</span></div>
              <div class="select">
                <div @click="setAddDeal(k,'rule',true)" class="radio radio-1"><img v-if="v.selected" src="@/assets/img/success_radio_icon.png" alt=""><img v-else src="@/assets/img/radio_icon.png" alt="">正常上课</div>
                <div @click="setAddDeal(k,'rule',false)" class="radio radio-2"><img v-if="v.selected" src="@/assets/img/radio_icon.png" alt=""><img v-else src="@/assets/img/success_radio_icon.png" alt="">取消</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      </div>
    </cube-popup>
  </div>
</template>
<script>
import TimeTable from '@/components/FixTimeTable';
import api from '../api';
import cookie from '@/tool/cookie';
import timeblockGroup from './timeblockGroup.json';

const moment = require('moment');

export default {
  data() {
    return {
      legend: [
        { name: '固定开放', color: '#ffd562', borderColor: '#ffd562' },
        { name: '未开放', color: '#EBF0F7', borderColor: '#EBF0F7' },
        { name: '推荐时段', color: '#7f8cff', borderColor: '#7f8cff' },
        { name: '指定时段', color: 'transparent', borderColor: '#ffd562' },
      ],
      timeBlockDataAry: [],
      timeBlockData: [],
      selectOneAry: [],
      selectRowAry: [],
      sendTimeBlocks: [],

      startTime: '请选择',
      type: 'add',
      coachLoopTimeId: null,
      coachId: null,
      coachDetail: {},
      coreTime: [34, 35, 36, 37, 38, 39, 40, 41, 82, 83, 84, 85, 86, 87, 88, 89, 130, 131, 132, 133, 134, 135, 136, 137, 178, 179, 180, 181, 182, 183, 184, 185, 226, 227, 228, 229, 230, 231, 232, 233, 258, 259, 260, 261, 262, 263, 274, 275, 276, 277, 278, 279, 280, 281, 306, 307, 308, 309, 310, 311, 322, 323, 324, 325, 326, 327, 328, 329],

      popLen: 1,
      radioOptions: [
        {
          label: '正常上课',
          value: '1',
        },
        {
          label: '取消',
          value: '0',
        },
      ],
      effectAddList: {
        klassList: [],
        ruleList: [],
      },
      cancelAdditionRuleIdList: [],
      remainAdditionRuleIdList: [],
      cancelAdditionKlassIdList: [],
      remainAdditionKlassIdList: [],
    };
  },
  created() {
    this.type = this.$route.query.type;
    this.coachId = this.$route.query.coachId;
    GlobalToast.showLoading('加载中');
    if (this.type === 'add') {
      this.coachLoopTimeId = this.$route.query.coachLoopTimeId;
      if (this.coachLoopTimeId) {
        if (moment().isAfter('2020-01-06 00') && moment().isBefore('2020-01-10 24')) {
          this.startTime = '2020-01-14';
          this.showSlot();
        }
        this.getCoachFixKlassLoopTimes(this.coachLoopTimeId);
      } else {
        this.getInitializeChours();
      }
    } else {
      this.startTime = this.$route.query.startDate;
      this.coachLoopTimeId = this.$route.query.coachLoopTimeId;
      this.getCoachFixKlassLoopTimes(this.coachLoopTimeId);
    }
    this.getCoachDetail();
  },
  components: {
    TimeTable,
  },
  computed: {
    coreSelectNum() {
      const midArr = this.timeBlockDataAry;
      const arr = [];
      midArr.map((item) => {
        item.map((val) => {
          if (val.isOpen) {
            if (val.isCore) {
              arr.push(val);
            }
          }
        });
      });
      return arr.length / 2;
    },
  },
  methods: {
    showSlot() {
      this.$createDialog({
        type: 'alert',
        confirmBtn: {
          text: '我知道了',
          active: true,
        },
      }, createElement => [
        createElement('p', {
          class: {
            'my-content': true,
          },
          slot: 'content',
        }, '2020-01-06 ~ 2020-01-10为微调期，有一次无责调整固定开放时间机会，（须确保从1.14开始生效)!'),
      ]).show();
    },
    getCoachDetail() {
      api.getCoachDetail().then((res) => {
        if (res.data.status) {
          const {
            coachId, coachMobile, coachName, grade, minCoreBlockCount,
          } = res.data;
          this.coachDetail = {
            coachId, coachMobile, coachName, grade, minCoreBlockCount,
          };
        }
      });
    },
    getInitializeChours() {
      api.getInitializeChours().then((res) => {
        GlobalToast.hideToast();
        if (moment().isAfter('2020-01-06 00') && moment().isBefore('2020-01-10 24')) {
          this.startTime = '2020-01-14';
          this.showSlot();
        }
        if (res.data.status) {
          this.timeBlockData = res.data.timeBlockList.map((item, key) => {
            if (this.coreTime.includes(key)) {
              return Object.assign({}, item, { isCore: true });
            }
            return item;
          });
          this.handleTimeTableData();
        } else {
          const toast = this.$createToast({
            txt: res.data.errMsg,
            type: 'txt',
            time: 1000,
          });
          toast.show();
        }
      });
    },
    getCoachFixKlassLoopTimes(id) {
      api.getCoachFixKlassLoopTimes(id).then((res) => {
        GlobalToast.hideToast();
        if (res.data.status) {
          const detail = res.data.timeBlockList;
          for (const i in timeblockGroup) {
            let flag = true;
            for (const time of timeblockGroup[i]) {
              if (!detail[time].isOpen) {
                flag = false;
              }
            }
            if (flag) {
              this.selectRowAry.push(parseInt(i));
            }
          }
          this.timeBlockData = detail.map((item, key) => {
            if (this.coreTime.includes(key)) {
              return Object.assign({}, item, { isCore: true });
            }
            return item;
          });
          this.handleTimeTableData();
        } else {
          const toast = this.$createToast({
            txt: res.data.errMsg,
            type: 'txt',
            time: 1000,
          });
          toast.show();
        }
      });
    },
    handleTimeTableData() {
      const timeBlock = this.timeBlockData;
      this.timeBlockDataAry = [];
      for (let i = 0; i < 7; i++) {
        this.timeBlockDataAry[i] = timeBlock.slice(i * 48, i * 48 + 48);
      }
    },
    prevPage() {
      this.$router.go(-1);
    },
    postData() {
      if (this.startTime === '请选择') {
        const toast = this.$createToast({
          txt: '请选择开始时间',
          type: 'txt',
          time: 1000,
        });
        toast.show();
        return false;
      }
      const timeBlocks = [];
      const selectList = [];
      const coreSelectList = [];
      this.timeBlockDataAry.map((item) => {
        item.map((val) => {
          if (val.isOpen) {
            selectList.push(val);
            if (val.isCore) {
              coreSelectList.push(val);
            }
          }
          timeBlocks.push({ timeBlock: val.timeBlock, isOpen: val.isOpen });
        });
      });
      this.sendTimeBlocks = timeBlocks;
      if (!selectList.length) {
        const toast = this.$createToast({
          txt: '请选择开放时间块',
          type: 'txt',
          time: 1000,
        });
        toast.show();
        return false;
      }
      if (coreSelectList.length / 2 < this.coachDetail.minCoreBlockCount) {
        const toast = this.$createToast({
          txt: `核心时间段要求${this.coachDetail.minCoreBlockCount}小时以上`,
          type: 'txt',
          time: 1000,
        });
        toast.show();
        return false;
      }
      const params = {
        coachId: this.coachId,
        startDate: this.startTime,
        timeBlockList: timeBlocks,
      };
      if (this.type === 'add') {
        api.postEffactAddKlassList(params).then((res) => {
          if (res.data.status) {
            const klassList = res.data.klassList.map(item => Object.assign({}, item, {
              selected: true,
            }));
            const ruleList = res.data.tsrList.map(item => Object.assign({}, item, {
              selected: true,
            }));
            if (!klassList.length && !ruleList.length) {
              this.redirectKlassEffect();
            } else {
              this.popLen = klassList.length + ruleList.length;
              this.effectAddList = {
                klassList, ruleList,
              };
              this.$refs.myPopup.show();
            }
          }
        });
      } else {
        api.putEffactAddKlassList(this.coachLoopTimeId, params).then((res) => {
          if (res.data.status) {
            const klassList = res.data.klassList.map(item => Object.assign({}, item, {
              selected: true,
            }));
            const ruleList = res.data.tsrList.map(item => Object.assign({}, item, {
              selected: true,
            }));
            if (!klassList.length && !ruleList.length) {
              this.redirectKlassEffect();
            } else {
              this.popLen = klassList.length + ruleList.length;
              this.effectAddList = {
                klassList, ruleList,
              };
              this.$refs.myPopup.show();
            }
          }
        });
      }
    },
    setAddDeal(key, type, bool) {
      if (type === 'klass') {
        const item = this.effectAddList.klassList[key];
        item.selected = bool;
        this.$set(this.effectAddList.klassList, key, item);
      } else {
        const item = this.effectAddList.ruleList[key];
        item.selected = bool;
        this.$set(this.effectAddList.ruleList, key, item);
      }
    },
    closeMyPop() {
      this.$refs.myPopup.hide();
    },
    submitMyPop() {
      this.cancelAdditionRuleIdList = [];
      this.remainAdditionRuleIdList = [];
      this.cancelAdditionKlassIdList = [];
      this.remainAdditionKlassIdList = [];
      this.effectAddList.ruleList.forEach((item) => {
        if (item.selected) {
          this.remainAdditionRuleIdList.push(item.ruleId);
        } else {
          this.cancelAdditionRuleIdList.push(item.ruleId);
        }
      });
      this.effectAddList.klassList.forEach((item) => {
        if (item.selected) {
          this.remainAdditionKlassIdList.push(item.klassId);
        } else {
          this.cancelAdditionKlassIdList.push(item.klassId);
        }
      });
      this.redirectKlassEffect();
    },
    redirectKlassEffect() {
      const params = {
        startDate: this.startTime,
        timeBlockList: this.sendTimeBlocks,
        cancelAdditionRuleIdList: this.cancelAdditionRuleIdList,
        remainAdditionRuleIdList: this.remainAdditionRuleIdList,
        cancelAdditionKlassIdList: this.cancelAdditionKlassIdList,
        remainAdditionKlassIdList: this.remainAdditionKlassIdList,
      };
      localStorage.setItem('effectTimeBlock', JSON.stringify(params));
      setTimeout(() => {
        this.$router.push({
          path: '/EffectKlass',
          query: {
            type: this.type, coachLoopTimeId: this.coachLoopTimeId,
          },
        });
      }, 200);
    },
    showStartPicker() {
      if (this.type !== 'add') {
        return false;
      }
      const minDate = moment().add(4, 'days').format('YYYY-MM-DD').split('-');
      const maxDate = moment().add(15, 'days').format('YYYY-MM-DD').split('-');
      this.startDateTimePicker = this.$createDatePicker({
        title: '',
        min: new Date(minDate[0], this.dealZero(minDate[1]) - 1, this.dealZero(minDate[2])),
        max: new Date(maxDate[0], this.dealZero(maxDate[1]) - 1, this.dealZero(maxDate[2])),
        onSelect: (date, selectedVal, selectedText) => {
          this.startTime = `${selectedText[0]}-${selectedText[1]}-${selectedText[2]}`;
        },
      });
      this.startDateTimePicker.show();
    },
    dealZero(val) {
      const num = val.replace(/^0+/, '');
      return parseInt(num);
    },
    goRules() {
      this.$router.push('/AdjustRule');
    },
    selectTwoRow(index) {
      const hourIndex = index;
      index === 0 ? index : index *= 2;
      if (this.selectRowAry.indexOf(hourIndex) < 0) {
        this.timeBlockDataAry.map((item) => {
          if (!item[index].isOpen) {
            item[index].isOpen = true;
            this.selectOneAry.push(item[index].timeBlock);
          }
          if (!item[index + 1].isOpen) {
            item[index + 1].isOpen = true;
            this.selectOneAry.push(item[index + 1].timeBlock);
          }
        });
        this.selectRowAry.push(hourIndex);
      } else {
        this.selectRowAry.splice(this.selectRowAry.indexOf(hourIndex), 1);
        this.timeBlockDataAry.map((item) => {
          if (item[index].isOpen) {
            item[index].isOpen = false;
            this.selectOneAry.push(item[index].timeBlock);
          }
          if (item[index + 1].isOpen) {
            item[index + 1].isOpen = false;
            this.selectOneAry.push(item[index + 1].timeBlock);
          }
        });
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.page-ctn{
  display flex
  flex-direction column
  justify-content space-between
  position relative
}
.bottom-container{
  border-radius 15px 15px 0px 0px
  box-shadow 0px -3px 8px 0px rgba(243,246,249,1)
  margin-bottom 0
  position fixed
  bottom 0
  left 0
  width 100%
  box-sizing border-box
  .container-title{
    display flex
    justify-content space-between
    .left{
      flex 1
      display flex
      justify-content flex-start
      .title-icon {
        width 17px
        height 17px
      }
    }
    .right{
      text-align right
      width 120px
      font-size 14px
      color #666666
    }
  }
}
.time-container{
    padding 25px 0
    border-radius 0
    margin-bottom 0.2rem
}
  .comment{
    text-align left
    padding 12px 18px 0;
    div{
      font-weight 500
      color: #353536;
      font-size: 16px;
      vertical-align: middle;
      .tip{
        color #FE5806
      }
    }
    span{
      font-size: 12px;
      vertical-align: middle;
      color #FF7C3B
    }
  }
  .footer-operate{
    display flex
    align-items center
    justify-content space-between
    padding 0 18px;
    .btn{
      color #fff
      font-size 14px
      display inline-block
      border-radius 15px
      margin-top 10px
      height 30px
      width 100px
      display flex
      align-items center
      justify-content center
    }
    .return-btn{
      border 1px solid #DADADA
      color #9B9B9D
    }
    .submit-btn{
      background-color #FFAA00
    }
  }
  .edit-select{
    border none
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
  .mypop-ctn{
    background-color:#fff;
    // min-height: 250px;
    // max-height: 400px;
    padding-bottom: 20px;
    border-radius: 15px 15px 0 0;
    .title{
      display: flex;
      justify-content:space-between;
      font-size: 16px;
      padding: 10px 15px 10px 15px;
      border-bottom: 1px solid #eee;
      .cancel{
        color: #9B9B9D;
        font-weight: 500;
      }
      .center{
        color: #353536;
        font-weight: 500;
      }
      .submit{
        color: #FE5806;
        font-weight: 500;
      }
    }
  }
  .mypop-list{
    overflow-y: auto;
    ul{
      padding: 10px 20px;
      li{
        padding: 8px 0;
        border-bottom: 1px solid #F7FAFC;
      }
    }
  }
  .mypop-list .list-detail{
    color:#666666;
    font-size: 14px;
    line-height: 24px;
    display:flex;
    justify-content:space-between;
    align-items: center;
    font-weight: 500;
  }
  .mypop-list .list-edit{
    color:#9B9B9D;
    font-size: 12px;
    line-height: 24px;
    display:flex;
    justify-content:space-between;
    align-items: center;
    .klass-type{
      color:#FFAA00;
      font-size: 11px;
      font-weight: 400;
    }
    .select{
      display: flex;
      align-items center;
      .radio{
        display: flex;
        align-items center;
      }
      .radio.radio-1{
        width: 70px;
        justify-content: space-between;
        margin-right: 20px;
      }
      .radio.radio-2{
        width: 46px;
        justify-content: space-between;
      }
      img{
        height: 16px;
        width: 16px;
      }
    }
  }
</style>
