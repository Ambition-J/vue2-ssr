import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home.vue'
Vue.use(VueRouter)


export default ()=>{
    const router = new VueRouter({
        mode:'history',
        routes: [{
            path:'/',
            name: 'Home',
            component: Home
        },{
            path:'/about',
            name: 'About',
            component: ()=> import('@/pages/About.vue')
        },{
            path:'/post',
            name: 'Post',
            component: ()=> import('@/pages/Post.vue')
        },{
            path:'*',
            name: 'error404',
            component: ()=> import('@/pages/404.vue')
        }]
    })
    return router
}