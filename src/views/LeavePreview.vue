<template>
  <div class="leave-preview-page pages-ctn">
    <div class="page-container top-container">
      <div class="container-title">
        <img src="@/assets/img/warn-icon.png" alt="" class="title-icon">
        <span class="title">请假影响</span>
      </div>
      <div class="leave-preview">
        <div class="info-one">
          <div class="info-item">
            <div class="info-num">{{previewData.expectsDeduction/100}}元</div>
              <div class="info-name">
                <span class="name">预计扣款</span>
                <img src="../assets/img/rules-icon.png" class="rules-icon" @click="showLeaveRules">
              </div>
          </div>
        </div>
        <div class="info-two">
          <div class="info-item">
            <div class="info-num">{{previewData.affectStudentNum}}人</div>
            <div class="info-name">影响学生</div>
          </div>
          <div class="info-item">
            <div class="info-num">{{affectKlassNum}}节</div>
            <div class="info-name">影响课程</div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-container">
      <div class="container-title">
        <img src="@/assets/img/record-icon.png" alt="" class="title-icon">
        <span class="title">请假详情</span>
      </div>
      <div class="detail-info">
        <div class="detail-info-item">
          <span class="detail-info-title">请假理由：</span>
          <span>{{fmtReason(previewData.reason)}}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-title">开始时间：</span>
          <span>{{previewData.startTime}}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-title">结束时间：</span>
          <span>{{previewData.endTime}}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-title">请假天数：</span>
          <span>{{previewData.days}}天，<span>{{fmtType(previewData.type)}}</span></span>
        </div>
      </div>
    </div>
    <div class="page-container">
      <div class="container-title">
        <img src="@/assets/img/detail-icon.png" alt="" class="title-icon">
        <span class="title">影响课程</span>
      </div>
      <div class="influence-course-list">
        <div class="influence-course-item" v-for="(item,index) in previewData.affectKlassList" :key="index">
          <div class="student-name">{{item.studentName}}</div>
          <div class="course-date">
            <span>课程：{{item.startDate}}&nbsp;&nbsp;</span>
            <span>{{item.timeBlockPeriod}}</span>
          </div>
        </div>
        <div class="influence-course-item" v-for="item in previewData.affectYdKlassList" :key="item.klassId">
          <div class="student-name">{{item.studentName || '云笛课'}}</div>
          <div class="course-date">
            <span>课程：{{item.startDate}}&nbsp;&nbsp;</span>
            <span>{{item.timeBlockPeriod}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <div class="middle-btn white-btn" @click="checkLeave">确定</div>
      <div class="middle-btn default-btn" @click="cancelLeave">不请假了</div>
    </div>
  </div>
</template>

<script>
import meta from '../tool/meta';
import api from '../api';

export default {
  name: 'leave-list',
  data() {
    return {
      previewData: {
        expectsDeduction: 0,
        affectStudentNum: 0,
        days: 0,
        reason: 1,
        type: 1,
      },
      affectKlassNum: 0,
      paramsData: {},
      clickFlag: true,
    };
  },
  created() {
    this.getLeavePreview();
  },
  methods: {
    fmtType(type) {
      return meta.leaveType[type];
    },
    fmtReason(reason) {
      return meta.leaveReason[reason];
    },
    getLeavePreview() {
      GlobalToast.showTip('正在加载中');
      this.paramsData = {
        start_time: this.$route.query.start_time, end_time: this.$route.query.end_time, reason: Number(this.$route.query.reason), remark: this.$route.query.remark,
      };
      api.postLeavePreview(this.paramsData).then((res) => {
        if (res.data.code === 20000) {
          this.previewData = res.data.data;
          this.affectKlassNum = this.previewData.affectKlassList.length;
        } else {
          GlobalToast.showTip(res.data.msg);
        }
      });
    },
    checkLeave() {
      if (this.clickFlag) {
        this.clickFlag = false;
        GlobalToast.showToast();
        api.postLeaveSubmit(this.paramsData).then((res) => {
          this.clickFlag = true;
          if (res.data.code === 20000) {
            GlobalToast.showTip('请假成功，可在请假记录中查看');
            this.$router.push({ path: '/LeaveList' });
          } else {
            GlobalToast.showTip(res.data.msg);
          }
        });
      }
    },
    cancelLeave() {
      this.$router.push({ path: '/LeaveList' });
    },
    showLeaveRules() {
      this.$router.push({ path: '/LeaveRules' });
    },
  },
};
</script>

<style lang="stylus" scoped>
  .leave-info{
    display flex
    justify-content space-between
    margin-top 24px
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
      font-size 14px
      color #666
      margin-top 16px
    }
    .detail-info-title{
      color #9B9B9D
      font-size 14px
    }
  }
  .influence-course-list{
    .influence-course-item{
      padding: 15px 0
      text-align left
      border-bottom 1px solid #EFF3F5
      .student-name{
        color #666
        font-size 14px
        margin-bottom 10px
      }
      .course-date{
        color #9B9B9D
        font-size 12px
      }
    }
  }
  .bottom-btn{
    display flex
    justify-content space-around
    margin-top 30px
    padding-bottom 50px
  }
  .leave-preview{
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
    .info-one{
      margin-bottom 12px
      .info-num{
        color #FE5806
        font-size 29px
      }
      .info-name{
        color #9B9B9D
        font-size 13px
      }
    }
    .info-two{
      display flex
      justify-content space-around
    }
  }
  .rules-icon{
    width 14px
    vertical-align middle
    margin-left 4px
  }
</style>
