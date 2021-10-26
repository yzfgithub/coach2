import {
  Toast,
} from 'cube-ui';

class GlobalToast {
  static toast = null;

  static k_showToast(msg = '', time = 1500, type = 'loading', mask = true) {
    if (this.toast) {
      this.toast.hide();
    }
    this.toast = Toast.$create({
      txt: msg,
      mask,
      time,
      type,
    });
    this.toast.show();
  }

  static showLoading(msg = '') {
    this.k_showToast(msg, 0);
  }

  static showToast(msg = '', time = 1500, mask = true) {
    this.k_showToast(msg, time);
  }

  static hideToast() {
    if (this.toast) {
      this.toast.hide();
    }
    this.toast = null;
  }

  static showTip(msg = '', time = 1500, mask = false) {
    this.k_showToast(msg, time, 'txt', mask);
  }
}

export default GlobalToast;
