import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

import '@/styles/index.less'
import router from '@/routers/router.js'

Vue.use(ElementUI)
router.beforeEach((to, from, next) => {
  let mytoken = localStorage.getItem('itcast_manager_35_token')
  if (mytoken || to.path === '/login') {
    next()
  } else {
    next({ path: '/login' })
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
