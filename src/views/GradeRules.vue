<template>
  <div class="leave-rules-pages">
    <div class="leave-rules-main">
      <div class="title">老师分级和积分体系</div>
      <div class="date">2020.01</div>
      <p>2020年1月1日开始</p>
      <p>老师的积分及分级体系正式生效</p>
      <div class="detail">
        <div class="title">老师级别</div>
        <p class="detail-item">1）级别说明</p>
        <p>每个月将根据老师的积分排名情况确定老师的级别，以平台当月所有授课老师的积分从高到低排序结果为准：</p>
        <p>级别分为五级（排名占比）：</p>
        <p>青铜（人数占比约为10%上下浮动5%）</p>
        <p>白银（人数占比约为20%上下浮动5%）</p>
        <p>黄金（人数占比约为60%上下浮动5%）</p>
        <p>钻石（人数占比约为10%上下浮动5%）</p>
        <p>未来橙（人数占比约为5%上下浮动2%）</p>
        <p class="detail-item">2）对应级别课时费</p>
        <p>每个级别对应的25分钟课时费如下：</p>
        <img src="@/assets/img/rules01.jpg" alt="" class="rules-img">
        <p>备注：将不再区分核心时段、非核心时段。</p>
        <p class="detail-item">3）定级更新时间</p>
        <p>老师每个月的定级来自上上月21日至上月20日的积分排名，并于每个月1日0点公布在“微信公众号-未来橙教师之家-个人中心-我的等级”上。</p>
        <p>例如：2020年4月老师的定级、课时费，取自2020年2月21日-3月20日的老师积分排名，并于2020年4月1日呈现在微信公众号的个人中心中。</p>
        <p class="detail-item">4）申诉</p>
        <p>每个月21日至月底最后一日为申诉微调期，这段时间老师的等级不再受其他人的影响，只受自己申诉结果的影响。</p>
        <p>例如，2020年3月21日-3月31日，A老师因为产品原因导致上课迟到，经师管核实申诉通过，老师的积分增加，排名增加，并因此晋级成功。同时B老师因此排名下降并掉级，但根据上述原则，此时B老师级别仍保留不降。</p>
        <p class="detail-item">5）新老师入职规则</p>
        <p>新老师入职默认等级为青铜级别，从第一节完课开始算起，经历的第一个完整计分周期（21日至次月20日）开始正式计入排名。在未刷新定级之前都默认为青铜级。</p>
        <p>例如：王老师2月10日入职，并于2月12日完成了第一节课。2月21日开始进入正式的积分排名阶段，2月21日至3月20日产生的积分排名决定了王老师4月的定级、课时费。王老师2月12日至3月31日默认为青铜级，期间的课时费都按青铜级计算。</p>
        <div class="title">积分规则</div>
        <p>每个积分周期（21日至次月20日）老师默认拥有初始分200分。</p>
        <p>积分分为两部分：老师的完课履约部分、用户的评分部分。</p>
        <p>积分加减项规则如下：</p>
        <img src="@/assets/img/rules02.jpg" alt="" class="rules-img">
        <p>2020年1月1日起，老师的积分和排名情况将实时呈现在“微信公众号-未来橙教师之家-个人中心-我的等级”中。</p>
        <p class="detail-item">关于用户评价</p>
        <p>学生端评价以实际家长评分时间为准，不以课程结束时间点为准。在课程结束之后7天之内的评价为有效评价，好评和差评积分会正常计入老师积分，超过7天的评价是不会计入老师的积分，所以老师们要注意上课时及时了解家长的课程要求，主动和家长交流。</p>
        <p class="detail-item">关于申诉规则</p>
        <p>迟到、早退、旷课、紧急请假、临时请假的申诉须在课程结束当天24点前进行申诉提交；</p>
        <p>差评的申诉须在收到差评通知的第二天24点前进行提交。</p>
        <div class="title">计分周期</div>
        <p>2020年1月老师的课时费延续2019年方案不变。</p>
        <p>第一个计分周期为2020年1月1日至1月20日，该周期的积分排名决定了2月老师的定级及课时费。</p>
        <p>第二个计分周期为2020年1月21日至2月20日，该周期的积分排名决定了3月老师的定级及课时费。</p>
        <p>第三个计分周期为2020年2月21日至3月20日，该周期的积分排名决定了4月老师的定级及课时费。</p>
        <p>后续计分周期以此类推。</p>
        <div class="title">红线</div>
        <p>经质检核实老师发生替课、引导学生早退、对学生或家长态度恶劣等行为的，平台保留取消老师晋级资格的权利。</p>
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
    .date{
      font-size 16px
      margin-bottom 10px
    }
    .detail{
      .title{
        color #1E1E1E
        font-size 18px
        margin 20px 0 10px
      }
    }
    p{
      text-align left
      font-size 14px
      line-height 20px
      color #9B9B9D
      margin-bottom 5px
    }
    .detail-item{
      color #fe5806
      font-size 16px
      margin-bottom 10px
      margin-top 10px
    }
    .bottom-btn{
      margin-top 30px
      margin-bottom 30px
    }
    .rules-img{
      width 90%
    }
  }
</style>
