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
  },
  created () {
    this.resource = this.$resource('authorization/login');
    var user = {
      'login' : 'mara@mail.ru',
      'password' : '1234',
    };

    this.resource.save({}, user)
    .then(response => response.json())

      .then(userData => {

        for (var key in userData.data) {
          this.$store.state.user[key] = userData.data[key]

        }

        // console.log(this.$store.state.user)
        Vue.http.interceptors.push(request => {
          request.headers.set('Authorization', this.$store.state.user.token)
        })
        this.resource = this.$resource('user/rastreniya/page/1')
        
        this.resource.get().then(response => response.json())
        .then(posts => {
          console.log(posts);
          posts.data.forEach(post => {
            post.showOption = false;
            post.showComments = false;
            if (!post.infos.is_liked) {
              post.infos.is_liked = false
            }
            if (!post.infos.is_disliked) {
              post.infos.is_disliked = false
            }
            this.$store.state.posts.push(post)
          })
        })
      })
  }
})