function setCookie(cname, cvalue) {
  const exdays = 7; // 默认有效时间为7天
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toGMTString()}`;
  const domain = '';
  document.cookie = `${cname}=${cvalue}; ${expires}; ${domain};path=/`;
}

function getCookie(name) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(`${name}=`);
    // 如果document.cookie对象里面有cookie则查找是否有指定的cookie，如果有则返回指定的cookie值，如果没有则返回空字符串
    if (cStart !== -1) {
      cStart = cStart + name.length + 1;
      let cEnd = document.cookie.indexOf(';', cStart);
      if (cEnd === -1) {
        cEnd = document.cookie.length;
      }
      return unescape(document.cookie.substring(cStart, cEnd));
    }
  }
  return '';
}

function clearCookie() {
  const domain = '';
  document.cookie = `webAuthToken=0;expires=${new Date(0).toUTCString() - 10000}; ${domain};path=/`;
  document.cookie = `webAuthToken=0;expires=${new Date(0).toUTCString()}; ${domain};path=/`;
}

export default {
  setCookie, getCookie, clearCookie,
};
