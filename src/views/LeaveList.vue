<template>
  <div class="leave-list-page pages-ctn">
    <div class="page-container top-container">
        <div class="container-title">
          <img src="@/assets/img/time-icon.png" alt="" class="title-icon">
          <span class="date" @click="showDatePicker">{{leaveDate}}</span>
          <img src="@/assets/img/arrow-icon.png" alt="" class="arrow-icon">
          <span class="title">请假数据</span>
        </div>
        <div class="leave-info">
          <div class="info-item">
            <div class="item-num">{{data.long_leave_times}}</div>
            <div class="item-name">长假次数/次</div>
          </div>
          <div class="info-item">
            <div class="item-num">{{data.short_leave_times}}</div>
            <div class="item-name">短假次数/次</div>
          </div>
          <div class="info-item">
            <div class="item-num">{{data.expects_deduction/100}}</div>
            <div class="item-name">请假扣款/元</div>
          </div>
        </div>
        <div class="bottom-btn">
          <div class="small-btn default-btn" @click="applyLeave">申请请假</div>
          <div class="leave-tips">可申请请假的时间段为北京时间10:00-21:00</div>
        </div>
    </div>
    <div class="page-container">
      <div class="container-title">
        <img src="@/assets/img/record-icon.png" alt="" class="title-icon">
        <span class="title">请假记录</span>
      </div>
      <div class="leave-record">
        <div class="leave-record-list">
          <div class="leave-record-item" v-for="(item,index) in data.list" :key="index" @click="viewDetail(item.id)">
            <div class="item-left">
              <div class="leave-record-title">
              <span class="title-item">{{fmtReason(item.reason)}}</span>
              <span class="title-item">{{item.application_time}}申请</span>
              <span class="title-item">{{fmtType(item.type)}}</span>
              </div>
              <div class="leave-record-date">开始时间：{{item.start_time}}</div>
              <div class="leave-record-date">结束时间：{{item.end_time}}</div>
            </div>
            <!-- <div class="leave-record-status">审批拒绝</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import meta from '../tool/meta';

export default {
  name: 'leave-list',
  data() {
    return {
      leaveDate: '',
      datePicker: false,
      data: {
        long_leave_times: 0,
        short_leave_times: 0,
        expects_deduction: 0,
      },
    };
  },
  created() {
    const date = new Date();
    this.leaveDate = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    this.getDate(`${date.getFullYear()}-${month}`);
  },
  methods: {
    fmtType(type) {
      return meta.leaveType[type];
    },
    fmtReason(reason) {
      return meta.leaveReason[reason];
    },
    showDatePicker() {
      if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: '请选择日期',
          value: new Date(),
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
      this.getDate(`${selectedText[0]}-${selectedText[1]}`);
    },
    getDate(month) {
      api.getLeaveMonth({ month }).then((res) => {
        this.data = res.data.data;
      });
    },
    applyLeave() {
      this.$router.push('/LeaveApply');
    },
    viewDetail(id) {
      this.$router.push({ path: '/LeaveDetail', query: { id } });
    },
  },
};
</script>

<style lang="stylus" scoped>
  .leave-list-page {
    background-color #F3F6F9
    padding-bottom 60px
  }
  .leave-info{
      display flex
      justify-content space-between
      margin-top 24px
  }
  .info-item{
      display inline-block
      width 30%
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
  .bottom-btn{
    text-align center
    margin-top 20px
  }
  .leave-tips{
    color #fe5806
    font-size 12px
    margin-top 10px
  }
  .leave-record{
    margin-top 17px
    .leave-record-item{
      display flex
      justify-content space-between
      padding-bottom 18px
      margin-bottom 20px
      border-bottom 1px solid #EFF3F5
    }
    .item-left{
      width 70%
    }
    .leave-record-title{
      color #666
      font-size 14px
      text-align left
      .title-item{
        margin-right 10px
      }
    }
    .leave-record-date{
      color #9B9B9D
      font-size 12px
      margin-top 10px
      text-align left
    }
    .leave-record-status{
      color #FF7C3B
      font-size 12px
    }
  }
</style>
