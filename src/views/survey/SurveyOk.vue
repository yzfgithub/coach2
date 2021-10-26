<template>
  <div class="survey-wrap">
        <div class="img">
          <img src="../../assets/img/invite-sucess.png" alt="">
        </div>
        <div class="tip">
            你的答案已提交，感谢您的参与!
        </div>
  </div>
</template>
<script>
export default {
  data() {
    return {

    };
  },
};
</script>
<style lang="stylus" scoped>
.survey-wrap{
    margin: 5px;
    padding: 30px;
    border-radius: 10px;
    background-color: #fff;
    .img{
        display: flex;
        justify-content: center;
        img{
            display: block;
            height: 220px;
        }
    }
    .tip{
        text-align: center;
        margin-top: 20px;
        font-size: 20px;
        color: #333;
    }
}

</style>
