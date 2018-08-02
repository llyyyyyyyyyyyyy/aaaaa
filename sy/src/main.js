// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/rem'
import './stylesheets/_reset.scss'
import './stylesheets/area.scss'
import 'swiper/dist/css/swiper.min.css'
import 'animate.css'

import 'mint-ui/lib/style.css'
import vuex from 'vuex'
import store from './store/store.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'


Vue.use(vuex)
Vue.use(VueAwesomeSwiper)


//axios
import axios from 'axios'
Vue.prototype.$http =  axios
// Vue.use(Swiper)

Vue.config.productionTip = false

window.host = 'http://shunyi.sinacolour.com/wxcallback';
window.debug = true;
window.tool = {}
window.tool.token = function() {
	let token = localStorage.getItem('sytoken')
	if (!token || token === 'undefined') {
		if (debug) {
			return '6dbdb18664bca765bbb6add8bfad4c27'
		}
		// router.replace({ path: '/author' });
		return false;
	};
	return token;
}

router.beforeEach((to, from, next) => {
	if (!window.debug) {
		if (tool.token()) {
			if (to.path == '/author') {
				console.log(3)
				// 用户使用后退返回到授权页，则默认回到首页
				next('/');
				return false;
			}
		} else {
			if (to.path !== '/author') {
				// tool.cookie.set('beforeLoginUrl', to.fullPath);
				next('/author');
				return false;
			}
		}
		next();
	} else {
		next();
	}
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
