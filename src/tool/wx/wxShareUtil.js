class WxShareUtil {
  constructor() {
    this.isWxReady = false;
    this.config = null;
    this.shareData = null;
    this.shareSuccessCallBack = null;
    this.shareFailCallBack = null;
    this.shareCancelCallBack = null;
  }

  setConfig(config) {
    this.config = config;
    if (!wx) {
      return;
    }
    wx.config({
      debug: false,
      appId: config.appId,
      timestamp: parseInt(config.timestamp),
      nonceStr: config.nonceStr,
      signature: config.signature,
      jsApiList: config.jsApiList,
    });
    wx.error((error) => {
      // alert(`${config.signature} wx error  = ${JSON.stringify(error)}`);
    });
    wx.ready(() => {
      this.wxReady = true;
      wx.checkJsApi({ // 检测一下api是否可用 一般是特殊api的权限问题 可以不写
        jsApiList: config.jsApiList,
        success(res) {
        },
      });
      if (this.shareData) {
        this.setShareDataToWx();
      }
    });
  }

  updateShareData(data) {
    this.shareData = data;
    if (this.isWxReady) {
      this.setShareDataToWx();
    }
  }

  setShareDataToWx() {
    if (!wx) {
      return;
    }
    const wxUtil = this;
    const shareData = {
      title: this.shareData.title, // 分享标题
      desc: this.shareData.desc, // 分享描述
      link: this.shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: this.shareData.imgUrl, // 分享图标
      trigger: (res) => {
        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        // alert('用户点击发送给朋友')
      },
      success: (res) => {
        // if (wxUtil.shareSuccessCallBack) { wxUtil.shareSuccessCallBack(); }
      },
      cancel: (res) => {
        // if (wxUtil.shareCancelCallBack) { wxUtil.shareCancelCallBack(); }
      },
      fail: (err) => {
        // if (wxUtil.shareFailCallBack) { wxUtil.shareFailCallBack(); }
      },
    };

    if (wx.updateAppMessageShareData) {
      wx.updateAppMessageShareData(shareData);
    } else {
      wx.onMenuShareAppMessage(shareData);
    }
    // 分享给朋友圈
    if (wx.updateTimelineShareData) {
      wx.updateTimelineShareData(shareData);
    } else {
      wx.onMenuShareTimeline(shareData);
    }
  }
}

const wxShareUtil = new WxShareUtil();
export default wxShareUtil;
