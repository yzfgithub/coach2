<template>
  <div class="pages-ctn leave-detail-page">
    <div class="page-container top-container">
      <div class="container-title">
        <img src="@/assets/img/leave-icon.png" alt="" class="title-icon">
        <span class="title">我的请假条</span>
      </div>
       <div class="detail-info">
        <div class="detail-info-item">
          <span class="detail-info-title">请假理由：</span>
          <span>{{fmtReason(data.reason)}}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-title">请假说明：</span>
          <div class="detail-info-wrap">{{data.remark}}</div>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-title">申请时间：</span>
          <span>{{data.application_time}}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-title" >开始时间：</span>
          <span>{{data.start_time}}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-title">结束时间：</span>
          <span>{{data.end_time}}</span>
        </div>
        <div class="detail-info-item">
          <span class="detail-info-title">请假天数：</span>
          <span>{{data.affect_days}}天，<span>{{fmtType(data.type)}}</span></span>
        </div>
       </div>
    </div>
    <div class="page-container">
      <div class="container-title">
        <img src="@/assets/img/warn-icon.png" alt="" class="title-icon">
        <span class="title">请假影响</span>
      </div>
      <div class="detail-info">
        <!-- <div class="detail-info-item">
          <span class="detail-info-title">拒绝原因：</span>
          <div class="detail-info-wrap">拒绝原因：拒绝原因：拒绝原因：拒绝原因：拒绝原因：拒绝原因：拒绝原因：拒绝原因：</div>
        </div> -->
         <div class="detail-info-item">
          <span class="detail-info-title">影响学生：</span>
          <span>{{data.affect_student_num}}人</span>
        </div>
         <div class="detail-info-item">
          <span class="detail-info-title">影响课&nbsp;&nbsp;&nbsp;&nbsp;：</span>
          <span>{{data.affect_klass_num}}节</span>
        </div>
         <div class="detail-info-item">
          <span class="detail-info-title">请假扣款：</span>
          <span class="fine">{{data.expects_deduction/100}}元</span>
        </div>
      </div>
      <!-- <img src="@/assets/img/review.png" alt="" class="leave-status-img"> -->
    </div>
  </div>
</template>

<script>
import meta from '../tool/meta';

export default {
  name: 'leave-list',
  data() {
    return {
      id: '',
      data: {},
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getLeaveInfo();
  },
  methods: {
    fmtType(type) {
      return meta.leaveType[type];
    },
    fmtReason(reason) {
      return meta.leaveReason[reason];
    },
    getLeaveInfo() {
      api.getLeaveInfo({ id: this.id }).then((res) => {
        this.data = res.data.data;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.pages-ctn{
  height 100%
}
  .detail-info{
    .detail-info-item{
      text-align left
      font-size 14px
      color #666
      margin-top 12px
      line-height 21px
    }
    .detail-info-title{
      color #9B9B9D
      font-size 14px
      float left
    }
    .fine{
      color #FE5806
      font-size 16px
      font-weight 500
    }
  }
  .page-container{
    position relative
  }
  .detail-info-wrap{
    display inline-block
    width 265px
  }
  .leave-status-img{
    width 60px
    position absolute
    right 15px
    bottom 27px
  }
</style>
