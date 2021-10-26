export default {
  mobile: {
    test: /^(1\d{0,10}|)$/,
    sub: /^(1\d{0,10})/,
    check: /^1\d{10}$/,
  },
  password: {
    test: /^([\d\w]{0,16}|)$/,
    sub: /^([\d\w]{0,16})/,
    check: /^[\d\w]{6,16}$/,
  },
};
