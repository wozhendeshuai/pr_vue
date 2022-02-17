import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'

import projectRepo from '../views/sys/ProjectRepo.vue'
import projectTeam from '../views/sys/ProjectTeam.vue'
import projectUser from '../views/sys/ProjectUser.vue'
import prDetail from '../views/pr/PRDetail.vue'
import prList from '../views/pr/PRList.vue'
import prModel from '../views/pr/PRModel.vue'
import prReview from '../views/pr/PRReview.vue'
import axios from "../axios";
import store from "../store"
import el from "element-ui/src/locale/lang/el";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/index',
                name: 'Index',
                meta: {
                    title: "首页"
                },
                component: Index
            },
            {
                path: '/userCenter',
                name: 'UserCenter',
                meta: {
                    title: "个人中心"
                },
                component: () => import('@/views/UserCenter.vue')
            },
            {
                path: '/project/repo',
                name: 'projectRepo',
                meta: {
                    title: "项目大盘"
                },
                component: projectRepo
            },
            {
                path: '/project/team',
                name: 'projectTeam',
                meta: {
                    title: "团队管理"
                },
                component: projectTeam
            },
            {
                path: '/project/user',
                name: 'projectUser',
                meta: {
                    title: "用户画像"
                },
                component: projectUser
            },
            {
                path: '/pr/List',
                name: 'prList',
                meta: {
                    title: "PR排序列表"
                },
                component: prList
            },
            {
                path: '/pr/model',
                name: 'prModel',
                meta: {
                    title: "排序模型管理"
                },
                component: prModel
            }, {
                path: '/pr/detail',
                name: 'prDetail',
                meta: {
                    title: "查看PR详情"
                },
                component: prDetail
            }, {
                path: '/pr/review',
                name: 'prReview',
                meta: {
                    title: "评审PR"
                },
                component: prReview
            },
        ]
    },

    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {

    let hasRoute = store.state.menus.hasRoutes

    let token = localStorage.getItem("token")

    if (to.path == '/login') {
        next()

    } else if (!token) {
        next({path: '/login'})


    }
    // else if(token && !hasRoute) {
    // 	axios.get("/sys/menu/nav", {
    // 		headers: {
    // 			Authorization: localStorage.getItem("token")
    // 		}
    // 	}).then(res => {

    // 		console.log(res.data.data)

    // 		// 拿到menuList
    // 		store.commit("setMenuList", res.data.data.nav)

    // 		// 拿到用户权限
    // 		store.commit("setPermList", res.data.data.authoritys)

    // 		console.log(store.state.menus.menuList)

    // 		// 动态绑定路由
    // 		let newRoutes = router.options.routes

    // 		res.data.data.nav.forEach(menu => {
    // 			if (menu.children) {
    // 				menu.children.forEach(e => {

    // 					// 转成路由
    // 					let route = menuToRoute(e)

    // 					// 吧路由添加到路由管理中
    // 					if (route) {
    // 						newRoutes[0].children.push(route)
    // 					}

    // 				})
    // 			}
    // 		})

    // 		console.log("newRoutes")
    // 		console.log(newRoutes)
    // 		router.addRoutes(newRoutes)

    // 		hasRoute = true
    // 		store.commit("changeRouteStatus", hasRoute)
    // 	})
    // }


    next()
})


// 导航转成路由
const menuToRoute = (menu) => {

    if (!menu.component) {
        return null
    }

    let route = {
        name: menu.name,
        path: menu.path,
        meta: {
            icon: menu.icon,
            title: menu.title
        }
    }
    route.component = () => import('@/views/' + menu.component + '.vue')

    return route
}

export default router
