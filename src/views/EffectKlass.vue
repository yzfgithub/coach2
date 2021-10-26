<template>
  <div class="effect-preview-page pages-ctn">
    <div class="page-container top-container">
      <div class="container-title effect-container-top">
        <div class="effect-title">
            <img src="@/assets/img/warn-icon.png" alt="" class="title-icon">
            <span class="title">修改影响</span>
            <!-- <span v-if="previewData.isExemption" class="desc-1">&nbsp;1次免责调整机会</span> -->
        </div>
        <div>
            <span @click='goRules' class="desc-3"><img src="@/assets/img/question_icon.png" alt="" class="title-icon">扣款规则</span>
        </div>
      </div>
      <div class="effect-preview">
        <div class="info-two">
          <div class="info-item">
            <div class="info-num">{{fmt_price(previewData.expectDeduction)}}元</div>
            <div class="info-name">预计扣款</div>
          </div>
          <div class="info-item">
            <div class="info-num">{{previewData.affectStudentNum}}人</div>
            <div class="info-name">影响学生</div>
          </div>
        </div>
        <div class="remove-tip">
          <span>因调整开放时间，影响到的已排课程将自动取消</span><br>
          <span class="yundi">如果影响到云笛课，目前会由客服帮您人工取消</span>
        </div>
      </div>
    </div>
    <div class="page-container">
      <div class="container-title effect-title">
        <img src="@/assets/img/record-icon.png" alt="" class="title-icon">
        <span class="title">调整后时间</span>
        <span class="desc-2">&nbsp;{{previewData.startDate}}开始生效</span>
      </div>
      <div v-if="effectKlassList.length && resp" class="detail-info">
        <div v-for='(i,k) in effectKlassList' :key='k' class="detail-info-item">
          <div class="week">每{{i.dayOfWeekDesc}}:</div>
          <div class="time"><span v-for='(val,key) in i.timeBlockList' :key='key'>{{val}}</span></div>
        </div>
      </div>
      <div v-if="!effectKlassList.length && resp" class="detail-none">
        <span>暂无开放时间</span>
      </div>
    </div>
    <div class="page-container klass-container">
      <div class="container-title">
        <img src="@/assets/img/detail-icon.png" alt="" class="title-icon">
        <span class="title">影响课程</span>
      </div>
      <div class="influence-course-list">
        <div class="influence-course-item" v-for="(item,index) in previewData.affectKlassList" :key="index">
          <div class="student-name">{{item.startDate}} &nbsp; ({{fmt_week(item.dayOfWeekDesc)}}) &nbsp; {{item.startTime}}开始 &nbsp; {{item.unitDesc}}</div>
          <div class="course-date">
            {{item.studentName}} &nbsp; <span :class="['color_'+item.klassType]">{{fmt_klassType(item.klassType)}}</span>
          </div>
        </div>
      </div>
      <div v-if="!previewData.affectKlassList.length && resp" class="detail-none">
        <span>暂无影响课程</span>
      </div>
    </div>


    <div class="page-container bottom-container">
          <div class="bottom-btn">
            <div @click='cancel' class="middle-btn white-btn">取消</div>
            <div @click='submit' class="middle-btn default-btn">确认修改</div>
          </div>
    </div>
  </div>
</template>

<script>
import meta from '../tool/meta';
import api from '../api';

export default {
  name: 'effect-list',
  data() {
    return {
      previewData: {
        expectDeduction: 0,
        affectStudentNum: 0,
        startDate: '',
        openedChourDTOList: [],
        affectKlassList: [],
        isExemption: false,
      },
      timeBlockParam: {},
      type: 'add',
      coachLoopTimeId: null,
      resp: false,
    };
  },
  computed: {
    effectKlassList() {
      return this.previewData.openedChourDTOList.filter(i => i.timeBlockList.length > 0);
    },
  },
  created() {
    this.type = this.$route.query.type;
    if (this.type === 'add') {
      this.postCoachLoopTimeCheck();
    } else {
      this.coachLoopTimeId = this.$route.query.coachLoopTimeId;
      this.putCoachLoopTimeCheck(this.coachLoopTimeId);
    }
  },
  methods: {
    submit() {
      GlobalToast.showLoading('提交修改');
      if (this.type === 'add') {
        this.postCoachLoopTime();
      } else {
        this.putCoachLoopTime(this.coachLoopTimeId);
      }
    },
    cancel() {
      this.$router.go(-1);
    },
    postCoachLoopTime() {
      api.postCoachLoopTime(this.timeBlockParam).then((res) => {
        GlobalToast.hideToast();
        if (res.data.status) {
          const toast = this.$createToast({
            txt: '操作成功',
            type: 'txt',
            time: 1000,
          });
          toast.show();
          this.$router.push('/FixedTable');
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
    putCoachLoopTime(id) {
      api.putCoachLoopTime(id, this.timeBlockParam).then((res) => {
        GlobalToast.hideToast();
        if (res.data.status) {
          const toast = this.$createToast({
            txt: '操作成功',
            type: 'txt',
            time: 1000,
          });
          toast.show();
          this.$router.push('/FixedTable');
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
    postCoachLoopTimeCheck() {
      const timeBlocks = localStorage.getItem('effectTimeBlock');
      if (timeBlocks) {
        const params = JSON.parse(timeBlocks);
        this.timeBlockParam = params;
        GlobalToast.showTip('正在加载中');
        this.resp = false;
        api.postCoachLoopTimeCheck(params).then((res) => {
          if (res.data.status) {
            const {
              expectDeduction, affectStudentNum, startDate, openedChourDTOList, affectTSRList, affectKlassList, affectYdKlassList, isExemption,
            } = res.data;
            const arr = affectTSRList.map(item => Object.assign({}, item, { klassType: 1 })).concat(affectKlassList).concat(affectYdKlassList);
            const chourArr = openedChourDTOList.map(item => ({
              dayOfWeekDesc: item.dayOfWeekDesc,
              timeBlockList: this.getChourList(item.timeBlockList),
            }));
            this.previewData = {
              expectDeduction, affectStudentNum, startDate, openedChourDTOList: chourArr, affectKlassList: arr, isExemption,
            };
            this.resp = true;
          } else {
            const toast = this.$createToast({
              txt: res.data.errMsg,
              type: 'txt',
              time: 1000,
            });
            toast.show();
          }
        });
      } else {
        const toast = this.$createToast({
          txt: '数据保存错误',
          type: 'txt',
          time: 1000,
        });
        toast.show();
      }
    },
    putCoachLoopTimeCheck(id) {
      const timeBlocks = localStorage.getItem('effectTimeBlock');
      if (timeBlocks) {
        const params = JSON.parse(timeBlocks);
        this.timeBlockParam = params;
        GlobalToast.showTip('正在加载中');
        this.resp = false;
        api.putCoachLoopTimeCheck(id, params).then((res) => {
          if (res.data.status) {
            const {
              expectDeduction, affectStudentNum, startDate, openedChourDTOList, affectTSRList, affectKlassList, isExemption,
            } = res.data;
            const arr = affectTSRList.map(item => Object.assign({}, item, { klassType: 1 })).concat(affectKlassList);
            const chourArr = openedChourDTOList.map(item => ({
              dayOfWeekDesc: item.dayOfWeekDesc,
              timeBlockList: this.getChourList(item.timeBlockList),
            }));
            this.previewData = {
              expectDeduction, affectStudentNum, startDate, openedChourDTOList: chourArr, affectKlassList: arr, isExemption,
            };
            this.resp = true;
          } else {
            const toast = this.$createToast({
              txt: res.data.errMsg,
              type: 'txt',
              time: 1000,
            });
            toast.show();
          }
        });
      } else {
        const toast = this.$createToast({
          txt: '数据保存错误',
          type: 'txt',
          time: 1000,
        });
        toast.show();
      }
    },
    getChourList(arr) {
      return arr.map(item => item.continuousPeriodDesc);
    },
    fmt_week(val) {
      return val.replace(/每/, '');
    },
    fmt_klassType(val) {
      switch (val) {
        case 1:
          return '固定课';
        case 2:
          return '试听课';
        case 3:
          return '临时课';
        case 6:
          return '云笛课';
        default:
          return '';
      }
    },
    fmt_price(val) {
      return (val / 100).toFixed(2);
    },
    goRules() {
      this.$router.push('/AdjustRule');
    },
  },
};
</script>

<style lang="stylus" scoped>
  .pages-ctn{
    position relative
    padding-bottom 80px
  }
  .info-item{
    display inline-block
    width 40%
    .item-num{
      color #353536
      font-size 24px
      margin-bottom 6px
    }
    .item-name{
      color #9B9B9D
      font-size 12px
    }
  }
  .detail-info{
    .detail-info-item{
      text-align left
      color #666
      margin-top 6px
      display flex
      .week{
        width 65px
        font-size 16px
        line-height 24px
      }
      .time{
        flex 1
        display flex
        flex-flow wrap
        span{
          margin 0 15px 0 6px
          word-break break-all
          font-size 14px
          line-height 24px
        }
      }
    }
  }
  .detail-none{
    font-size 16px
    text-align center
    line-height 40px
    font-weight 400
    color #b3afaf
  }
  .influence-course-list{
    .influence-course-item{
      padding: 15px 0
      text-align left
      border-bottom 1px solid #effefe
      .student-name{
        color #666
        font-size 14px
        margin-bottom 10px
      }
      .course-date{
        color #9B9B9D
        font-size 12px
        .color_1{
          color #FF7C3B
        }
        .color_2{
          color #98C700
        }
        .color_3{
          color #FFAA00
        }
        .color_6{
          color #dca2a2
        }
      }
    }
  }
  .effect-preview{
    margin-top 20px
    .info-item{
      .info-num{
        color #FE5806
        margin-bottom 5px
        font-size 24px
        font-weight 500
      }
      .info-name{
        color #9B9B9D
        font-size 12px
        .name{
          vertical-align middle
        }
      }
    }
    .info-two{
      display flex
      justify-content space-around
    }
    .remove-tip{
      color #FE5806
      font-size 12px
      margin-top 14px
      .yundi{
        margin-top: 3px;
        display: inline-block;
      }
    }
  }
  .desc-1 {
      font-size 12px
      color #fe5806
  }
  .desc-2 {
      font-size 12px
      color #ff9800
  }
  .desc-3 {
      display flex
      align-items center
      color #9B9B9D
      font-size 12px
      img {
        width 12px
        height 12px
        margin-right 4px
      }
  }
  .effect-container-top{
      display flex
      justify-content space-between
      align-items baseline
  }
  .effect-title{
      display flex
      align-items baseline
      margin-bottom 16px
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
  .bottom-btn{
    display flex
    justify-content space-between
    .white-btn{
      width 125px
      height 38px
      line-height 38px
    }
    .default-btn{
      width 125px
      height 38px
      line-height 38px
    }
  }
}
</style>
