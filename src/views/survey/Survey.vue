<template>
  <div class="survey-wrap">
        <div class="survey-greetings">
            {{content}}
        </div>
        <div class="survey-line"></div>
        <div v-for="(item, key) in questionList" :key="key" class="question-list">
            <a href="javascript:void(0);" :id="`str${key}`"></a>
            <span class="survey-question">{{fmtString(item.question)}}</span>
            <div class="survey-note">{{item.comment}}</div>
            <div class="survey-question-box" :class="[errPosition === key ? 'error-box-color' : '']" v-if="item.optionList.length">
              <div v-for="(v, k) in item.optionList" :key="k">
                <div class="answer-list">
                  <span @click="selectHandle(key,k,v.value,item.type)" class="img"><img v-if="item.selected.includes(k)" src="@/assets/img/success_radio_icon.png" alt=""><img v-else src="@/assets/img/radio_icon.png" alt=""></span> <span class="answer">{{fmtString(v.value)}}</span>
                </div>
                <cube-textarea maxlength=40 v-if="v.value.includes('__')" style="border:1px solid #e0e0e0;height: 70px;margin: 0px 15px 10px 40px;" v-model="v.otherReason"  placeholder="请填写"></cube-textarea>
              </div>
            </div>
            <div v-else style="padding: 0 15px;">
                <cube-textarea maxlength=100 style="border:1px solid #e0e0e0;height: 100px;margin-bottom: 10px;"  v-model="item.otherReason" placeholder="请填写"></cube-textarea>
            </div>
        </div>

        <div @click="submitPost" v-if="questionList.length" class="btn">
            提交
        </div>
  </div>
</template>
<script>
import api from '@/api';

export default {
  data() {
    return {
      questionList: [],
      content: '',
      errPosition: null,
    };
  },
  mounted() {
    this.queryQuestion();
  },
  methods: {
    getUrlParam(param) {
      const reg = new RegExp(`(^|&)${param}=([^&]*)(&|$)`);
      const r = window.location.search.substr(1).match(reg) || window.location.hash.substring((window.location.hash.search(/\?/)) + 1).match(reg);
      if (r != null) {
        return decodeURIComponent(r[2]);
      }
    },
    queryQuestion() {
      const bucket = this.getUrlParam('bucket');
      api.getSurveyQuestion({ bucket }).then((res) => {
        if (res.data.ret) {
          let detail = res.data.data.questionList;
          this.content = res.data.data.content;
          if (!detail.length) {
            this.$router.push({ path: '/surveyOk' });
            return false;
          }
          detail = detail.map((item) => {
            const question = JSON.parse(item.question);
            return Object.assign({}, item, {
              question: question.question,
              optionList: question.optionList.map(val => ({ value: val, otherReason: '' })),
              comment: question.comment,
              otherReason: '',
              currentSelectedOption: [],
              selected: [],
              type: question.type || 1,
            });
          });
          this.questionList = detail;
          console.log(this.questionList);
        }
      });
    },
    fmtString(val) {
      return val.replace(/_/g, '').replace(/：/g, '');
    },
    selectHandle(key, k, str, type) {
      console.log(key, k, str, type);
      // this.questionList[key].selected = k;
      // this.questionList[key].currentSelectedOption = str;
      if (type === 2) {
        // 可以多
        if (this.questionList[key].selected.includes(k)) {
          this.questionList[key].selected = this.questionList[key].selected.filter(index => index !== k);
          this.questionList[key].currentSelectedOption = this.questionList[key].currentSelectedOption.filter(val => val !== str);
        } else {
          this.questionList[key].selected.push(k);
          this.questionList[key].currentSelectedOption.push(str);
        }
      } else {
        this.questionList[key].selected = [k];
        this.questionList[key].currentSelectedOption = [str];
      }
    },
    submitPost() {
      const questionArray = [];
      this.errPosition = null;
      try {
        this.questionList.forEach((item, index) => {
          const idx = index;
          if (item.optionList.length) {
            if (!item.currentSelectedOption.length) {
              const obj = { index, str: `请答完第 ${idx + 1} 道题` };
              throw (obj);
            }
            const str = item.currentSelectedOption.join(';');
            if (str.includes('__')) {
              if (item.optionList[item.selected].otherReason === '') {
                const obj = { index, str: `请完善第 ${idx + 1} 道题的信息后提交` };
                throw (obj);
              }
              questionArray.push({ questionId: item.id, optionItemList: [{ id: str.substring(0, 1), content: str.replace(/_/g, '') + item.optionList[item.selected].otherReason }] });
            } else {
              const ids = [];
              const contents = [];
              for (const obj of item.currentSelectedOption) {
                ids.push(obj.substring(0, 1));
                contents.push(obj);
              }
              questionArray.push({ questionId: item.id, optionItemList: [{ id: ids.join(';'), content: contents.join(';') }] });
            }
          } else {
            if (item.otherReason === '') {
              const obj = { index, str: `请完善第 ${idx + 1} 道题的信息后提交` };
              throw (obj);
            }
            questionArray.push({ questionId: item.id, optionItemList: [{ content: item.otherReason }] });
          }
        });
      } catch (e) {
        console.log(e);
        const toast = this.$createToast({
          txt: e.str,
          type: 'txt',
        });
        toast.show();
        document.querySelector(`#str${e.index}`).scrollIntoView();
        this.errPosition = e.index;
        return false;
      }
      const params = { answerDataList: questionArray };
      api.postSurveyQuestion(params).then((res) => {
        this.$router.push({ path: '/surveyOk' });
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.survey-wrap{
    margin: 5px;
    padding: 30px;
    border-radius: 5px;
    background-color: #fff;
}
.survey-greetings{
    font-size: 16px;
    text-indent: 32px;
    color: #666;
    text-align : left;
}
.survey-line{
    margin: 30px 0px 20px 0px;
    border-top:1px dotted #C0C0C0;
}
.question-list{
  text-align: left;
}
.survey-question{
    font-weight:600;
    font-size:18px;
    &-box{
        border: 1px solid #f6f6f6;
        margin: 20px 0;
    }
}
.survey-note{
    font-size: 16px;
    color: #989898;
    margin: 5px 0;
}
.survey-question-item{
    padding:0 15px;
    border-bottom:1px solid #f6f6f6;
    height: 52px;
    line-height:52px;
    font-size: 16px;
}
.item-supplement{
    height: 70px;
    line-height:27px;
    display:flex;
    align-items:center;
}
.survey-question-item-no{
    padding:0 15px;
    line-height:52px;
    padding-bottom: 20px;
    font-size: 16px;
}
.btn{
    color:#fff;
    background-color:#f59a24;
    height: 52px;
    line-height: 52px;
    text-align: center;
    margin-top: 20px;
}
.radio-label{
     display:flex;
     align-items:center;
}
.error-box-color{
    border-color: #e87070;
}
.survey-question-box{
  padding-left:10px
  .answer-list{
    display: flex;
    align-items center;

  }
  .img img{
    width: 24px;
    height: 24px;
    display inline-block
  }
  .answer{
    padding:0 15px;
    border-bottom:1px solid #f6f6f6;
    line-height:52px;
    font-size: 16px;
  }
}
</style>
