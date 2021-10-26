<template>
    <div class="teach-container">
      <div class="edit-title">
        请选择允许排的课程等级
        <span @click="showRule">规则说明</span>
      </div>
      <div class="checkbox">
        <cube-checkbox-group v-model="checkList" :options="options" />
      </div>
      <div class="btn">
          <cube-button @click='submit' :primary="true" style="background:#fa6754;">保存</cube-button>
      </div>
      <div class="tip">
        目前本页面的修改仅针对钢琴，其他乐器请联系教务
      </div>
      <div class="dialog-mask" v-show="isShowRule">
        <div class="mask"></div>
        <div class="container">
          <div class="content">
            <div class="main">
              <div class="box">
                <p>2020年2月25日起，老师可根据个人意愿增加可接受的课程等级类型，获得更多排课机会。</p>
                <p>平台的课程类型分为启蒙、初级、中级、高级四类。</p>
                <p style="padding-bottom: 10px">不同级别老师可选择的级别如下：</p>


                <table border="1" style="margin-bottom: 10px">
                  <tr class="tr-1">
                    <th class="th-1">
                      <span class="th-str-1">可选课程级别</span>
                      <span class="th-str-2">老师级别</span>
                      <div class="line"></div>
                    </th>
                    <th class="th-2">高级</th>
                    <th class="th-2">中级</th>
                    <th class="th-2">低级</th>
                    <th class="th-2">启蒙</th>
                  </tr>
                  <tr class="tr-2">
                    <td>高级</td>
                    <td>必选</td>
                    <td>可选</td>
                    <td>可选</td>
                    <td>可选</td>
                  </tr>
                  <tr class="tr-2">
                    <td>中级</td>
                    <td> </td>
                    <td>必选</td>
                    <td>可选</td>
                    <td>可选</td>
                  </tr>
                  <tr class="tr-2">
                    <td>低级</td>
                    <td> </td>
                    <td> </td>
                    <td>必选</td>
                    <td>可选</td>
                  </tr>
                  <tr class="tr-2">
                    <td>启蒙</td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td>必选</td>
                  </tr>
                </table>

                <p style="padding-bottom: 10px">1、申请排多等级课程</p>

                <p>老师于“微信公众号菜单-个人中心-课表-个人中心-排课等级设置”处可进行勾选，申请生效。生效后，老师将出现在对应的多个级别的老师列表中，并按照所排课程的级别获得课时费。</p>
                <p style="padding-bottom: 10px">例如：高级老师张老师选择了可上高、中、初级课，并排到了一节学生coco的初级课，则coco这节课的课时费为初级课时费。张老师所排的高级课程还按高级课时费计算。</p>

                <p>若老师在申请生效前就已存在较低级的跨级课程，则在申请生效时，已安排的全部低级别跨级课程的课时费都将发生调整，按低级别跨级课程的学生级别计费。</p>
                <p style="padding-bottom: 10px">该操作不可逆，请老师认真思考后再进行选择。</p>

                <p>若老师在申请生效后，出现了超出老师选择范围的新的低级别跨级课程，则按照老师所选最低级别计算课时费。</p>
                <p style="padding-bottom: 10px">例如：高级老师刘老师选择了可上高、中级课，并排到了一节学生小宝的初级课，则小宝这节课的课时费为中级课时费。</p>

                <p style="padding-bottom: 10px">备注：学生级别老师从更新后的快陪练教师端APP课程表中查询。</p>

                <p style="padding-bottom: 10px">2、取消排多等级课程</p>

                <p>老师因个人原因希望取消多等级课程的，于“微信公众号菜单-个人中心-课表-个人中心-排课等级设置”处提交申请，重新提交自己愿意保留的级别即可。</p>
                <p>提交申请时已排的跨级课程仍按照学生等级计算课时费，老师须继续履约。</p>
                <p>提交申请后再排的课程按老师级别计算（系统不会再安排跨级别课程）。</p>
                <p>若老师不愿意接受已排的跨级课程，平台将不得不为学生更换老师，引发家长不满，易产生退费、造成损失。</p>
                <p>因此平台将按如下规则执行：</p>
                <p>1）停止授课预留缓冲期4天以上扣除100元/学生；0-3天扣除200元/学生。</p>
                <p>2）跨级学生不再给予保留，请老师配合平台工作人员将跨级学生调走。</p>
                <p style="padding-bottom: 10px">以上可联系师管操作。</p>

                <p>例如：高级老师A老师选择了可排高级、中级、初级课程，经过1个月后，A老师因为个人原因想要调整为只排高级课程，在这1个月时间内，已经给A老师安排了初级学生c的固定课。则A老师提交取消申请后，初级学生c的固定课需要继续履约，并仍收取初级课时费。这时A老师的操作是无责取消。</p>
              </div>
              <div @click="hideRule" class="btn">我知道了</div>
            </div>
          </div>
        </div>
      </div>
    </div>


</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      checkList: [],
      options: [{
        label: '启蒙',
        value: '0',
        disabled: true,
      }, {
        label: '初级',
        value: '1',
        disabled: true,
      }, {
        label: '中级',
        value: '2',
        disabled: true,
      }, {
        label: '高级',
        value: '3',
        disabled: true,
      }],
      updateTimes: 0,
      isShowRule: false,
    };
  },
  mounted() {
    this.getCurrentGrade();
  },
  methods: {
    getCurrentGrade() {
      api.getCoachPlatoonKlassLeve({}).then((res) => {
        if (res.data.code === 20000) {
          this.options.forEach((i, k) => {
            if (k < res.data.data.coachGrade) {
              i.disabled = false;
            }
          });
          const canGrade = res.data.data.canKlassGrade || [];
          if (res.data.data.canKlassGrade.length > 1) {
            this.checkList = canGrade.map(item => `${item}`);
          } else {
            this.checkList = [`${res.data.data.coachGrade}`];
          }
          this.updateTimes = res.data.data.updateTimes || 0;
        }
      });
    },
    submit() {
      if (this.updateTimes > 0) {
        this.postSubmit();
        return false;
      }
      if (this.checkList.length === 1) {
        this.postSubmit();
        return false;
      }
      this.$createDialog({
        type: 'confirm',
        icon: '',
        title: '',
        content: '第一次确认调整后已排课程将按学生等级作为结算等级（进入最新版教师端app可查询学生级别，如果学生等级高于老师等级，则按老师等级进行结算），该操作不可逆，是否调整？',
        confirmBtn: {
          text: '确定调整',
          active: true,
          disabled: false,
          href: 'javascript:;',
        },
        cancelBtn: {
          text: '取消',
          active: false,
          disabled: false,
          href: 'javascript:;',
        },
        onConfirm: () => {
          this.postSubmit();
        },
        onCancel: () => {
          this.$createToast({
            type: 'warn',
            time: 1000,
            txt: '点击取消按钮',
          }).show();
        },
      }).show();
    },
    postSubmit() {
      const params = {
        coachGradeList: this.checkList.map(item => parseInt(item)),
      };
      api.putCoachPlatoonKlassLeve(params).then((res) => {
        if (res.data.code === 20000) {
          this.$createToast({
            type: 'txt',
            time: 500,
            txt: '保存成功',
          }).show();
          setTimeout(() => {
            window.location.href = this.isDev ? 'http://coachwechat.weilaicheng.com/user/center' : 'http://p.coachwechat.kuaipeilian.com/user/center';
          }, 500);
        }
      });
    },
    hideRule() {
      this.isShowRule = false;
    },
    showRule() {
      this.isShowRule = true;
    },
  },
};
</script>

<style scoped>
    .teach-container{
        width: 100%;
        height: 100vh;
        padding: 10px;
        box-sizing: border-box;
        font-size: 22px;
    }
    .edit-title{
      padding-top: 10px;
      line-height: 44px;
      background: #fff;
      text-align: left;
      padding-left: 20px;
      font-size: 20px;
    }
    .edit-title span{
      font-size: 12px;
      color: red;
      text-decoration: underline;
      cursor: pointer;
    }
    .btn{
        margin-top: 30px;
    }
    .tip{
      font-size: 12px;
      margin-top: 10px;
      color: rgba(56,34,1,0.85);
      line-height: 16px;
    }
    .dialog-mask{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
      /* display: none; */
    }
    .dialog-mask .mask{
      display: block;
      overflow: hidden;
      background-color: #25262d;
      opacity: 0.4;
      pointer-events: auto;
      width: 100%;
      height: 100%;
    }
    .dialog-mask .container{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      transform: translate(100%, 100%);
    }
    .dialog-mask .container .content{
      position: absolute;
      top: -50%;
      transform: translate(-50%, -50%);
      left: -50%;
      width: auto;
      max-width: 100%;
      background-color: #fff;
    }
    .dialog-mask .container .content .main{
      background-color: #fff;
      width: 7.2rem;
      height: 420px;
      padding-top: 20px;
      box-sizing: border-box;
      border-radius: 5px;
    }
    .dialog-mask .container .content .main .box{
      padding: 0 20px;
      box-sizing: border-box;
      height: 340px;
      overflow-y: auto;
    }
    .dialog-mask .container .content .main p{
      text-align: left;
      color: #666;
      font-size: 0.373333rem;
      line-height: 0.586667rem;
    }
    .dialog-mask .container .content .main .btn{
      color:#fc9153;
      position: absolute;
      bottom: 0;
      left: 0;
      height: 60px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    table tr th, table tr td {
      border: 1px solid #ddd;
      font-size: 14px;
      color: #000;
    }
    table .tr-1 {
      height:1.5rem;
    }
    table .tr-2 {
      height: 30px;
      line-height: 30px;
    }
    table .th-1{
      width:2rem;
      position:relative;
    }
    table .th-2{
      width: 1rem;
      line-height: 60px;
    }
    table .th-str-1{
      position:absolute;
      top:0;
      right:-4px;
      transform: scale(0.7);
      width:1.6rem;
    }
    table .th-str-2{
      position:absolute;
      bottom:0;
      left:-4px;
      transform: scale(0.7);
      width:1.6rem;
    }
    table .line{
      position:absolute;
      z-index:100;
      left:-0.25rem;
      top:0.75rem;
      width:2.5rem;
      height:1px;
      background-color:#ddd;
      transform-origin:center;
      transform: rotate3d(1, 1, 1, 50deg);
    }
</style>
