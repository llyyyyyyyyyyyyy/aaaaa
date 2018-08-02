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
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import vuex from 'vuex'
import store from './store/store.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import qs from 'qs'

Vue.use(Mint)
Vue.use(vuex)
Vue.use(VueAwesomeSwiper)


//axios
import axios from 'axios'
Vue.prototype.$http =  axios.create({
  responseType: 'json',
  withCredentials: false,
})
// Vue.use(Swiper)

Vue.config.productionTip = false

window.host = 'http://shunyi.sinacolour.com/wxcallback';
window.debug = false;
window.tool = {}
window.tool.token = function() {
	let token = localStorage.getItem('sytoken')
	if (!token || token === 'undefined') {
		if (debug) {
			return 'e288cdc4355f3704f8efaef76347b3df'
		}
		// router.replace({ path: '/author' });
		return false;
	};
	return token;
}

router.beforeEach((to, from, next) => {
	// tool.title((to.meta && to.meta.title) || '发现·海南')
	if (!window.debug) {
		if (tool.token()) {
			if (to.path == '/author') {
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
