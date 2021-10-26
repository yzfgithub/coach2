import environment from '../environment';
import wxShareUtil from './wxShareUtil';
import api from '@/api';

class WxShareController {
  constructor() {
    this.shareData = null;
    // 获取到签名后调用
    this.getConfig();
  }

  // eslint-disable-next-line class-methods-use-this
  getConfig() {
    api.getWxConfig().then((res) => {
      wxShareUtil.setConfig(res.data);
    }).catch(() => {
    });
  }

  updateShareData(data) {
    this.shareData = data;
    if (environment.isWx) {
      wxShareUtil.updateShareData(this.shareData);
    }
  }

  share(data) {
    this.shareData = data;
  }
}
const wxShareController = new WxShareController();
export default wxShareController;
