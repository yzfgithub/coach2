import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const SET_USERINFO = 'SET_USERINFO';


const store = new Vuex.Store({
  state: {
    userInfo: {},
  },
  mutations: {
    [SET_USERINFO](state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  actions: {
    fecthUserInfo: ({ commit }) => {
    },
  },
});

export default store;
