const { isPro } = require('@/tool/env');

const oss_host = isPro ? '' : 'http://oss.wem';
const base_url = isPro ? 'http://p.coacheilian.com' : 'httpicheng.com';
const avatar_oss_host = isPro
  ? 'https://yuubncs.com/'
  : 'https://yus.com/';
const resumeHost = isPro ? 'httkuian.com' : 'http://peng.com';

export function findIndex(ary, fn) {
  if (ary.findIndex) {
    return ary.findIndex(fn);
  }
  /* istanbul ignore next */
  let index = -1;
  /* istanbul ignore next */
  ary.some(function (item, i, cAry) {
    const ret = fn.call(this, item, i, cAry);
    if (ret) {
      index = i;
      return ret;
    }
  });
  /* istanbul ignore next */
  return index;
}

export function ossUrl(url) {
  return url ? `${oss_host}/${url}` : '';
}
export function baseUrl(url) {
  return url ? `${base_url}/${url}` : '';
}

export function avatar_ossUrl(url) {
  return url ? `${avatar_oss_host}/${url}` : '';
}

export function inputOnBlur() {
  const wechatInfo = window.navigator.userAgent.match(/MicroMessenger\/([\d]+)/i);
  if (!wechatInfo) return;
  const wechatVersion = wechatInfo[1];
  const version = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
  if (+wechatVersion.replace(/\./g, '') >= 674 && +version[1] >= 12) {
    setTimeout(() => {
      window.scrollTo(0, Math.max(document.body.clientHeight, document.documentElement.clientHeight));
    });
  }
}

export function go2TeacherResume(id) {
  window.location.href = `${resumeHost}/coaches/${id}/resume`;
}
