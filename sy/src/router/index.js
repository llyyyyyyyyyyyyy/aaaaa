import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import POIlist from '../components/POIlist.vue'
import POIinfo from '../components/POIinfo.vue'
import maplist from '../components/maplist.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/poilist',
      name: 'POIlist',
      component: POIlist
    },
    {
      path: '/poiinfo/:id',
      name: 'POIinfo',
      component: POIinfo,
      props:true
    },
    {
      path:'/maplist/:id',
      name:'maplist',
      component:maplist,
      props:true
    }
  ]
})
