import Vue from 'vue'
import Vuelidate from 'vuelidate'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import store from './store'
import router from './routes'
import App from './App.vue'


Vue.use(Vuelidate)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.http.options.root = 'https://app.rast.ltd/'

// Vue.http.interceptors.push(request => {
//   request.headers.set('Authorization', App.data().user.token)
// })

new Vue({
  el: '#app',
  data: {
    token: '',
    user: ''
  },
  render: h => h(App),
  router: router,
  store: store,
  http: {
    root: 'https://app.rast.ltd/',
    headers: {
      Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    }
  }
})