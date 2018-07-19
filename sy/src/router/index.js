import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import POIlist from '../components/POIlist.vue'
import POIinfo from '../components/POIinfo.vue'
import maplist from '../components/maplist.vue'
import author from "../author.vue"
import comment from '../components/comments/comments.vue'

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
<<<<<<< HEAD
      path:'/maplist/:id',
      name:'maplist',
      component:maplist,
=======
      path: '/comment/:name/:id',
      name: 'comment',
      component: comment,
      props:true
    },
    {
      path: '/author',
      name: 'author',
      component: author,
>>>>>>> jyx
      props:true
    }
  ]
})
