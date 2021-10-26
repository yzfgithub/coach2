<template>
  <div class="page-ctn">
    <div class="page-container time-container">
      <TimeTable  :legend="legend" :days="days" :timeBlockDataAry="timeBlockDataAry"></TimeTable>
    </div>
    <div class="page-container bottom-container">
       <div class="container-title">
          <div class="left" v-if='hasReadyRule'>
            <img src="@/assets/img/time-icon.png" alt="" class="title-icon">
            <span class="title">{{uneffectiveChour.startDate}} &nbsp;生效</span>
          </div>

          <div v-if='hasReadyRule' class="right" @click="goRules"><img src="@/assets/img/question_icon.png" alt="" class="title-icon"> 调整规则</div>
        </div>
        <div>
          <div v-if="!hasReadyRule" class="add-btn" @click="addTime">调整固定开放时间</div>
          <div v-else class="add-btn" @click="showUnuseTime">查看编辑时间段</div>
        </div>
    </div>
  </div>
</template>
<script>
import TimeTable from '@/components/FixTimeTable';
import api from '../api';
import cookie from '@/tool/cookie';

export default {
  data() {
    return {
      legend: [
        { name: '固定开放', color: '#FFBA92', borderColor: '#FFBA92' },
        { name: '未开放', color: '#EBF0F7', borderColor: '#EBF0F7' },
        { name: '被占用', color: '#C7CFD4', borderColor: '#C7CFD4' },
      ],
      timeBlockDataAry: [],
      timeBlockData: [],
      hasReadyRule: false,

      effectiveChour: {},
      uneffectiveChour: {},

    };
  },
  created() {
    if (cookie.getCookie('webAuthToken') === '') {
      window.location.href = this.isDev ? 'http://coachwechat.weilaicheng.com/klasses' : 'http://p.coachwechat.kuaipeilian.com/auth/bindPage';
    } else {
      this.getCoachChourList();
    }
  },
  components: {
    TimeTable,
  },
  methods: {
    getCoachChourList() {
      // GlobalToast.showLoading('加载中');
      api.getCoachChourList().then((res) => {
        if (res.data.status) {
          this.effectiveChour = res.data.effectiveChour ? res.data.effectiveChour : {};
          this.uneffectiveChour = res.data.ineffectiveChourList.length ? res.data.ineffectiveChourList[0] : {};
          this.hasReadyRule = res.data.ineffectiveChourList.length > 0;
          if (this.effectiveChour.id) {
            this.getCoachFixKlassLoopTimes(this.effectiveChour.id);
          } else {
            this.getInitializeChours();
          }
        } else {
          // GlobalToast.hideToast();
          const toast = this.$createToast({
            txt: res.data.errMsg,
            type: 'txt',
            time: 1000,
          });
          toast.show();
        }
      });
    },
    getInitializeChours() {
      api.getInitializeChours().then((res) => {
        // GlobalToast.hideToast();
        if (res.data.status) {
          this.timeBlockData = res.data.timeBlockList;
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
        // GlobalToast.hideToast();
        if (res.data.status) {
          this.timeBlockData = res.data.timeBlockList;
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
    goRules() {
      this.$router.push('/AdjustRule');
    },
    addTime() {
      this.$router.push({ path: '/CreateFixedTable', query: { type: 'add', coachId: this.effectiveChour.coachId || null, coachLoopTimeId: this.effectiveChour.id || null } });
    },
    showUnuseTime() {
      this.$router.push({
        path: '/CreateFixedTable',
        query: {
          type: 'edit', coachId: this.uneffectiveChour.coachId || null, coachLoopTimeId: this.uneffectiveChour.id, startDate: this.uneffectiveChour.startDate,
        },
      });
    },
    handleTimeTableData() {
      const timeBlock = this.timeBlockData;
      this.timeBlockDataAry = [];
      for (let i = 0; i < 7; i++) {
        this.timeBlockDataAry[i] = timeBlock.slice(i * 48, i * 48 + 48);
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
  // height 100vh
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
    .left{
      flex 1
      display flex
      justify-content flex-start
    }
    .right{
      display flex
      align-items center
      width 100px
      font-size 14px
      color #666666
      img {
        width 16px
        height 16px
        margin-right 4px
      }
    }
  }
}
.time-container{
    padding 25px 0
    border-radius 0
    margin-bottom 0.2rem
}
  .add-btn{
    background-color #FFAA00
    color #fff
    font-size 14px
    padding 7px 18px
    display inline-block
    border-radius 13px
    margin-top 18px
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
