<template>
  <div class="page-ctn">
    <div class="page-container" v-if='type === 1'>
        <div class="title">2020年非窗口期时间调整规则</div>
        <div class="desc">
          1、非窗口期内调整时间，陪练老师无免责调整机会，调整后新时间表生效期为N+4天（即3月10日提交的调整后时间表，生效期为3月14日0点）；<br>
          2、非窗口期内陪练老师调整时间，具体惩罚执行规则详见下文；非窗口期调整后的新时间表，各等级陪练老师周核心时段开放总量下限要求详见下文。<br>
          <br>
          <span class="black">1、惩罚规则：</span><br>
          ①生效日期≥当前日期+4天时，则无影响孩子，每次扣款50元；影响到孩子，每次扣款=影响学生数*100元；<br>
          ②生效日期＜当前日期+4天时，则无影响孩子，每次扣款100元；影响到孩子，每次扣款=影响学生数*200元。<br>
          <br>
          <span class="black">2、各等级陪练老师周核心时段开放总量下限要求：</span><br>
          ①启蒙老师≥8小时；初级老师≥9小时；中级老师≥8小时；高级老师≥6小时；<br>
          ②核心时段范围：周一至周日17点-21点、周末9点-12点；<br>
          ③用户上课高峰热度推荐：周一至周日19点-21点＞周一至周日17点-19点＞周末9点-12点。<br>
        </div>
    </div>
    <div class="page-container" v-else>
        <div class="title">2020年2-3月窗口期时间调整通知</div>
        <div class="desc">
          1、2020年2-3月时间调整窗口期：2020年2月20日0点-3月20日24点；<br>
          2、窗口期内，每名陪练老师有且仅有1次免责调整机会，时间调整后新时间表生效期为提交日期4天后，例：图图老师在2月20号在公众号操作了时间段的调整，则新的时间段的生效日期为2月24号0点<br>
          3、窗口期内，若陪练老师时间调整次数超过1次或不能接受新时间表生效期的，具体惩罚执行规则详见下文；<br>
          4、窗口期调整后的新时间表，各等级陪练老师周核心时段开放总量下限要求详见下文；<br>
          5、本次窗口期调整后的时间要稳定到下次时间调整窗口，即2020年暑期（以具体公众号发文为准）。<br>
          <br>
          <span class="black">1、惩罚规则：</span><br>
          ①调整次数＞1次，且接受新时间表生效期时，如无影响孩子，每次扣款50元；影响到孩子，每次扣款=影响学生数*100元；<br>
          ②调整次数＞1次，且不接受新时间表生效期时，如无影响孩子，每次扣款100元；影响到孩子，每次扣款=影响学生数*200元。<br>
          <br>
          <span class="black">2、各等级陪练老师周核心时段开放总量下限要求：</span><br>
          ①启蒙老师≥8小时；初级老师≥9小时；中级老师≥8小时；高级老师≥6小时；<br>
          ②核心时段范围：周一至周日17点-21点、周末9点-12点；<br>
          ③用户上课高峰热度推荐：周一至周日19点-21点＞周一至周日17点-19点＞周末9点-12点。<br>
        </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';

export default {
  data() {
    return {
      type: 1,
    };
  },
  mounted() {
    if (moment().isAfter('2020-02-20 00') && moment().isBefore('2020-03-20 24')) {
      this.type = 2;
    } else {
      this.type = 1;
    }
  },
  components: {

  },
  methods: {

  },
};
</script>
<style lang="stylus" scoped>
  .page-container{
    border-radius 0
    min-height 100vh
    margin 0
    padding: 25px 15px 40px
    .title {
      font-weight 600
      color #353536
      font-size 16px
      vertical-align middle
      text-align left
      padding 5px 0 20px
    }
    .desc {
      font-weight 500
      color #666
      font-size 14px
      vertical-align middle
      text-align left
      line-height 24px
    }
    .black {
      color #353536
      font-weight 550
    }
  }
</style>
