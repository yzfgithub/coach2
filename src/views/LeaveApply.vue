<template>
  <div class="leave-apply-page pages-ctn">
    <div class="page-container">
      <div class="container-title">
        <img src="@/assets/img/warn-icon.png" alt class="title-icon" />
        <span class="title">请认真填写请假条</span>
      </div>
      <div class="edit-info">
        <span class="title">请假原因</span>
        <Select class="leave-reason edit-select" v-model="reason" :options="leaveReasonOptions"></Select>
      </div>
      <div class="edit-info">
        <span class="title">开始时间</span>
        <div
          class="edit-select"
          :class="isSelectedStart?'select-date':'placeholder'"
          @click="showStartPicker"
        >{{startTime}}</div>
      </div>
      <div class="edit-info">
        <span class="title">结束时间</span>
        <div
          class="edit-select"
          :class="isSelectedEnd?'select-date':'placeholder'"
          @click="showEndPicker"
        >{{endTime}}</div>
      </div>
      <div class="edit-info">
        <span class="title">影响课程天数</span>
        <span class="leave-day">{{days}}天</span>
      </div>
    </div>
    <div class="page-container">
      <div class="container-title">
        <img src="@/assets/img/record-icon.png" alt class="title-icon" />
        <span class="title">请假说明</span>
      </div>
      <div class="edit-info">
        <Textarea
          v-model="remark"
          style="width:100%;height:80px"
          maxlength="500"
          :indicator="indicator"
          placeholder="请输入不少于5个字的请假说明"
          autoExpand="true"
        ></Textarea>
      </div>
    </div>
    <div class="page-container">
      <div class="leave-tips">提示：请假将会产生扣款，并会影响家长和学生的满意度，请尽量减少请假时长和频次</div>
      <div class="bottom-btn">
        <div class="big-btn default-btn" @click="nextToPreview">下一步</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Select, Textarea } from 'cube-ui';
import api from '../api';

export default {
  name: 'leave-apply',
  data() {
    return {
      leaveReasonOptions: [
        { value: 1, text: '事假' },
        { value: 2, text: '病假' },
        { value: 3, text: '丧假' },
        { value: 4, text: '其他' },
      ],
      reason: 1,
      startTime: '请选择开始时间',
      endTime: '请选择结束时间',
      startDateTimePicker: '',
      endDateTimePicker: '',
      days: 0,
      remark: '',
      indicator: {
        remain: true,
        negative: true,
      },
      isDisabled: true,
      isSelectedStart: false,
      isSelectedEnd: false,
      selectedValStart: '',
      hour: [],
      minute: [{ value: '00', text: '00' }, { value: '30', text: '30' }],
      paramsData: {},
      previewData: {},
    };
  },
  components: {
    Select,
    Textarea,
  },
  created() {
    this.creatHours();
  },
  methods: {
    creatHours() {
      for (let i = 0; i < 24; i++) {
        const item = i < 10 ? `0${i}` : i;
        this.hour.push({ value: item, text: item });
      }
    },
    showStartPicker() {
      this.startDateTimePicker = this.$createSegmentPicker({
        data: [
          {
            is: 'cube-date-picker',
            title: '请选择开始日期',
            min: new Date(),
            value: new Date(),
            format: {
              month: 'MM',
            },
          },
          {
            is: 'cube-picker',
            title: '请选择开始时间',
            data: [this.hour, this.minute],
          },
        ],
        onSelect: (selectedDates, selectedVals, selectedTexts) => {
          this.selectedValStart = selectedVals[0];
          this.startTime = `${selectedTexts[0][0]}-${selectedTexts[0][1]}-${
            selectedTexts[0][2]
          } ${selectedTexts[1][0]}:${selectedTexts[1][1]}`;
          this.isSelectedStart = true;
        },
      });
      this.startDateTimePicker.show();
    },
    showEndPicker() {
      if (this.isSelectedStart) {
        this.endDateTimePicker = this.$createSegmentPicker({
          data: [
            {
              is: 'cube-date-picker',
              title: '请选择结束日期',
              min: new Date(
                this.selectedValStart[0],
                this.selectedValStart[1] - 1,
                this.selectedValStart[2],
              ),
              value: new Date(),
              format: {
                month: 'MM',
              },
            },
            {
              is: 'cube-picker',
              title: '请选择结束时间',
              data: [this.hour, this.minute],
            },
          ],
          onSelect: (selectedDates, selectedVals, selectedTexts) => {
            this.endTime = `${selectedTexts[0][0]}-${selectedTexts[0][1]}-${
              selectedTexts[0][2]
            } ${selectedTexts[1][0]}:${selectedTexts[1][1]}`;
            this.isSelectedEnd = true;
            this.getLeaveDays();
          },
        });
        this.endDateTimePicker.show();
      } else {
        GlobalToast.showTip('请先选择开始时间');
      }
    },
    getLeaveDays() {
      api
        .postLeaveDay({ start_time: this.startTime, end_time: this.endTime })
        .then((res) => {
          if (res.data.code === 20000) {
            this.days = res.data.data.days;
          }
        });
    },
    nextToPreview() {
      const verify = this.reason && this.startTime && this.endTime && this.remark.length > 4;
      if (verify) {
        GlobalToast.showTip('正在加载中');
        this.paramsData = {
          start_time: this.startTime,
          end_time: this.endTime,
          reason: this.reason,
          remark: this.remark,
        };
        api.postLeavePreview(this.paramsData).then((res) => {
          if (res.data.code === 20000) {
            this.$router.push({
              path: '/LeavePreview',
              query: this.paramsData,
            });
          } else {
            GlobalToast.showTip(res.data.msg);
          }
        });
      } else if (this.remark.length < 5) {
        GlobalToast.showTip('请假说明不少于5个字');
      } else {
        GlobalToast.showTip('请填写全部信息');
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.pages-ctn {
  height: 100%;
}

.leave-apply-page {
  .edit-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #EFF3F5;
    padding: 16px 22px 16px 16px;
    font-size: 14px;

    .title {
      color: #9B9B9D;
      font-size: 14px;
    }

    .edit-select {
      border: none;
    }

    .placeholder {
      color: #C7C7C7;
    }

    .select-date {
      color: #666;
    }

    .leave-day {
      color: #666;
    }
  }
}

.cube-select {
  padding-right: 22px;
  padding: 0 22px 0 0;
}

.cube-select::after {
  border: none;
}

.leave-tips {
  color: #FE5806;
  font-size: 12px;
  text-align: left;
  line-height: 18px;
}

.bottom-btn {
  margin-top: 20px;
}
</style>
<style lang="stylus">
.cube-toast-tip {
  max-height: 100px !important;
}
</style>
