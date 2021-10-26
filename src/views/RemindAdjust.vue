<template>
  <div class="remind-adjust-page pages-ctn">
    <div class="page-container top-container" v-if="!refused">
      <div class="tips">2020年6月20日至2020年6月30日为开放时间微调期，请问您是否要调整时间？</div>
      <div class="bottom-btn">
        <div class="middle-btn default-btn" @click="toAdjustTime">调整</div>
        <div class="middle-btn white-btn" @click="refuseAdjustTime">不调整</div>
      </div>
    </div>
    <div class="page-container top-container" v-else>
      <div class="tips">已选择不调整</div>
    </div>
  </div>
</template>
<script>
import api from '@/api';
import cookie from '@/tool/cookie';

export default {
  data() {
    return {
      refused: false,
    };
  },
  created() {
    if (cookie.getCookie('webAuthToken') === '') {
      window.location.href = this.isDev ? 'http://coachwechat.weilaicheng.com/auth/bindPage' : 'http://p.coachwechat.kuaipeilian.com/auth/bindPage';
    }
  },
  methods: {
    toAdjustTime() {
      api.putCoachSettings({ change_loop_time_status: 2 }).then((res) => {
        this.$router.push('/FixedTable');
      });
    },
    refuseAdjustTime() {
      api.putCoachSettings({ change_loop_time_status: 4 }).then((res) => {
        this.refused = true;
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.remind-adjust-page{
  background-color: #fff;
  height:100%;
  width:100%;
}
  .tips{
    font-size: 16px;
    text-align: left;
    line-height: 22px;
  }
  .bottom-btn{
    display flex
    justify-content space-around
    margin-top 30px
    padding-bottom 50px
  }
</style>
