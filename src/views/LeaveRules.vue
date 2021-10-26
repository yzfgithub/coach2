<template>
  <div class="leave-rules-pages">
    <div class="leave-rules-main">
      <div class="title">请假规则解释</div>
      <div class="detail">
        <p class="detail-item">一、短假：陪练老师当次请假时长0-3天</p>
        <p>（1）陪练老师在距离课程开始时间24小时之前请假；</p>
        <p>陪练老师请假时间内有课程，陪练老师当月第1次请假，不扣款；当月第2次及第3次，扣除影响课时费的0.5倍；当月第4次及以上，扣除影响课程课时费的1.5倍。</p>
        <p>（2）陪练老师在距离课程开始时间2小时—24小时内请假； </p>
        <p>陪练老师请假时间内有课程，陪练老师当月第1次请假，不扣款；当月第2次及以上，扣除影响课程课时费的1.5倍。</p>
        <p>（3）陪练老师在距离课程开始时间20分钟-2小时内请假（临时请假）；</p>
        <p>陪练老师请假时间内有课程， 扣除陪练老师相应的课时费的2倍。</p>
        <p>（4）陪练老师在距离课程开始时间0-20分钟内请假（紧急请假）；</p>
        <p>陪练老师请假时间内有课程，扣除陪练老师3倍课时费。</p>
        <p class="detail-item">二、长假：陪练老师当次请假时长4-15天</p>
        <p>（1）陪练老师因为特殊情况需要请超过3天以上的假，在距离课程开始时间前3天请假，请假影响到课程，扣除相应的被影响的课时费的0.5倍。</p>
        <p>（2）若陪练老师在距离课程开始时间24小时-3天之内请长假，扣除相应的被影响的课时费的1.5倍；开课前24小时内请长假，24小时内影响课程视为短假，24小时之外课程算为长假。</p>
        <p>（3）陪练老师当月请长假次数≥2次；</p>
        <p>扣除陪练老师相应的课时费的2倍。</p>
        <p class="detail-item">备注：</p>
        <p>（1）若老师一定需要请假，强烈建议老师尽早提出申请，短假提前24小时申请，长假提前3天申请；</p>
        <p>（2）请假越临期，家长端体验越差，惩罚力度也会相应增加；</p>
        <p>（3）老师在课前2小时内提出请假的，会降低老师履约率，影响排课量； </p>
        <p>（4）老师请假扣款受积分和结算等级影响，扣款基础课时按照请假当时的课时费进行结算；</p>
        <p>（5）新请假规则上线之后会立即扣款，请老师谨慎操作。</p>
      </div>
      <div class="bottom-btn">
        <div class="middle-btn default-btn" @click="goback">返回</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  created() {
  },
  components: {
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="stylus" scoped>
  .leave-rules-pages{
    background-color #fff
    padding 30px 15px
    .title{
      color #1E1E1E
      font-size 20px
      margin-bottom 10px
    }
    p{
      text-align left
      font-size 14px
      line-height 20px
      color #9B9B9D
      margin-bottom 5px
    }
    .detail-item{
      color #1E1E1E
      font-size 16px
      margin-bottom 10px
      margin-top 10px
    }
    .bottom-btn{
      margin-top 30px
      margin-bottom 30px
    }
  }
</style>
