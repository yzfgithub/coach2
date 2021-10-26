const environment = (function () {
  const env = {};
  env.browserType = (function () {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i)) {
      return 'wx'; // 微信
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      return 'ios';
    }
    if (window.navigator.appVersion.match(/android/gi)) {
      return 'android';
    }

    return 'other';
  }());

  env.isWx = env.browserType === 'wx';
  return env;
}());
export default environment;
