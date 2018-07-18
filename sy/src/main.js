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


//axios
import axios from 'axios'
Vue.prototype.$http = axios
// Vue.use(Swiper)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
