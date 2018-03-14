// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Bread from '@/base/bread.vue'
Vue.component('Bread',Bread);

import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: '',
  },
  actions:{
  	login(context,user){
  		context.commit('login',user);
  	}
  },
  mutations: {
    login (state,user) {
      state.user = user;
    }
  }
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
