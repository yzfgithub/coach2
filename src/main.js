import Vue from 'vue';
import {
  Style, Select, DatePicker, Toast, TimePicker, SegmentPicker, Dialog, CheckboxGroup, Button, ImagePreview, Popup, Textarea,
} from 'cube-ui';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import '@/assets/app.styl';
import 'amfe-flexible';

Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(SegmentPicker);
Vue.use(ImagePreview);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(CheckboxGroup);
Vue.use(Button);
Vue.use(Popup);
Vue.use(Textarea);

Vue.prototype.isDev = process.env.VUE_APP_ENV === 'dev';
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面meta */
  if (to.meta.content) {
    const head = document.getElementsByTagName('head');
    const meta = document.createElement('meta');
    meta.content = to.meta.content;
    head[0].appendChild(meta);
  }
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});
// 安卓微信禁止用户设置字体大小
(function () {
  function handleFontSize() {
    // 设置网页字体为默认大小
    WeixinJSBridge.invoke('setFontSizeCallback', { fontSize: 0 });
    // 重写设置网页字体大小的事件
    WeixinJSBridge.on('menu:setfont', () => {
      WeixinJSBridge.invoke('setFontSizeCallback', { fontSize: 0 });
    });
  }
  if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
    handleFontSize();
  } else if (document.addEventListener) {
    document.addEventListener('WeixinJSBridgeReady', handleFontSize, false);
  } else if (document.attachEvent) {
    document.attachEvent('WeixinJSBridgeReady', handleFontSize);
    document.attachEvent('onWeixinJSBridgeReady', handleFontSize);
  }
}());
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
