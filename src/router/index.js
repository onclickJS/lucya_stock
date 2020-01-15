import Vue from 'vue'
import Router from 'vue-router'
import StockKeywords from '@/components/StockKeywords'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'StockKeywords',
        component: StockKeywords
    }]
})