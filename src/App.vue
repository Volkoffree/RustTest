<template>
  <div class="app">
    <div class="authorization" v-if="!user.info.user_info.user_id"> 
      
      
      <input type="text" v-model="login">
      <input type="password" v-model="password">
      <button @click="tryAuthorization">RAST IT!</button>
    </div>
    <!-- {{ user }} -->
    <div v-else>

      <user-info></user-info>
      <ul class="container navbar">
          <router-link exact active-class="active" class="navbar-item" to='/news' tag="li">
            <a>Новости</a>
          </router-link>
          <router-link exact active-class="active" class="navbar-item" to='/gallery' tag="li">
            <a>Фотографии</a>
          </router-link>
          <router-link exact active-class="active" class="navbar-item" to='/' tag="li">
            <a>RASTтрения</a>
          </router-link>
          <router-link exact active-class="active" class="navbar-item" to='/services' tag="li">
            <a>Услуги</a>
          </router-link>
          <!-- <select class="navbar-item filters">
            <option class="filters-item" value="#">Мои посты</option>
            <option value="#">Интересующие</option>
            <option value="#">Вся лента</option>
          </select> -->


          <div class="navbar-item filters">
            <button v-on:click="away">{{ findActiveFilter().header }}</button>
            <ul 
              v-if="displayFiltres"
              v-on-clickaway="away"
              v-bind:class="{'active': displayFiltres}"
            >
              <li 
                v-for="filter in filters" :key="filter.id" 
                v-bind:class="{'active': filter.active}" 
                v-on:click="changeActiveFilter(filter)"
              >
                {{ filter.header }}
              </li>

            </ul>
          </div>
      </ul>


      <router-view class="container"></router-view>

    </div>

  </div>
    
</template>

<script>
import Vue from 'vue'

import Wall from './components/wall.vue'
import Smiles from './components/smiles.vue'
import User from './components/user'
import { mixin as clickaway  } from 'vue-clickaway';

export default {
  data () {
    return {
      login: '',
      password: '',
      filters: {
        allposts: {
          header: 'Вся лента',
          active: true,
          run(posts) {
            return posts
          }
        },
        myposts: {
          header: 'Мои посты',
          active: false,
          run(posts, user) {
            let filtred = posts.filter(function(post) {
              return post.owner.user_id == user.user_id
            })

            return filtred
          }
        },
        interesting: {
          header: 'Интересующие',
          active: false,
          run(posts, user) {
            return posts.filter(function(post) {
              return post.infos.is_liked
            })
          }
        },
      },
      displayFiltres: false
    }
  },
  computed: {
    posts () {
      return this.$store.state.posts
    },
    postsFiltred () {
      return this.$store.state.postsFiltred
    },
    user () {
      return this.$store.state.user
    },
    
  },
  mixins: [ clickaway ],
  methods: {

    tryAuthorization () {
      this.resource = this.$resource('authorization/login');
      // var user = {
      //   'login' : 'mara@mail.ru',
      //   'password' : '1234',
      // };
      var user = {
        'login' : this.login,
        'password' : this.password,
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
            posts.data.forEach(post => {
              post.showOption = false;
              post.showCommentsOption = false;
              post.complain = false;
              post.complainComments = false;
              post.showDelete = false;
              post.showDeleteSecond = false;



              post.showComments = false;
              if (!post.infos.is_liked) {
                post.infos.is_liked = false
              }
              if (!post.infos.is_disliked) {
                post.infos.is_disliked = false
              }
              post.editMode = false
              post.saveContent = ''
              this.$store.state.posts.push(post)
            })
            let save = JSON.parse(JSON.stringify(this.$store.state.posts))
            this.$store.state.postsFiltred = save

            ///////////////////////////////////////////////////////////////////////////////////////////
            // не увидел в постах информации о городе автора или не понял где её брать. 
            // Ниже написал фильтр, который будет отсеивать посты не из города пользователя, типо того
            ///////////////////////////////////////////////////////////////////////////////////////////


            // this.$store.state.postsFiltred = save.filter(function(post) {
            //   return this.$store.state.user.info.user_info.city.city_id == post.owner.city.city_id 
            // })
          })
        })
    },
    findActiveFilter () {
      for (let key in this.filters) {
        if (this.filters[key].active) {
          return this.filters[key]
        }
      }
    },
    away() {
      this.displayFiltres = !this.displayFiltres
    },
    changeActiveFilter(filter) {
      this.findActiveFilter().active = false;
      filter.active = true;
      // switch(filter.header) {
      //   case 'Вся лента': 

      // }
      this.$store.state.postsFiltred = filter.run(this.posts, this.user)
      this.away()
      
    }
  },
  components: {
    'user-info': User,
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Tahoma', sans-serif;
}
textarea {
  white-space: pre-wrap;
}
.app {
  padding: 12vw 5vw;
  background-color: #97d6b7;
  /* height: 100vh; */
}
.container {
  padding: 2vw 5vw;
  margin: 0 auto;
  max-width: 1312px;
  background-color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.navbar {
  position: relative;
  margin-top: 1vw;
  padding-top: 0vw;
  padding-bottom: 0vw;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  height: 40px;
  background: url(./images/navbar.svg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.navbar-item {
  list-style: none;
  height: 100%;
  border: none;
  font-size: 17px;


}

.filters {

}

.filters button {
  background: none;
  position: relative;

  border: none;

  height: 100%;
  width: 150px;

  padding-right: 40px;

  font-size: 17px;
  text-align: right;

}
.filters button:hover {
  cursor: pointer;
}
.filters button:focus {
  border: none;
  outline: none;
}
.filters button::after {
  content: '';
  display: block;
  position: absolute;
  top:10px;
  right: 10px;

  width: 15px;
  height: 15px;
  background: url(images/arrowDown.svg);
  background-position: center;
  background-size: cover;
}

.filters ul {

  font-size: 17px;

  position: absolute;
  z-index: 11;
  top: 0;
  right: 0px;

  padding: 15px 50px 10px 50px;

  -webkit-box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.3);
  -moz-box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.3);
  box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.3);
  background-color: #fff;

}
.filters ul li {
  list-style: none;
  margin-bottom: 10px;
  padding-left: 15px;
}
.filters ul .active {
  color: blue;
  border-left: 1px solid blue;
}
.filters ul li:hover {
  cursor: pointer;
  color: blue;
}






.navbar-item:focus {
  outline: none;
}
.navbar-item a {
  color: #000;
  text-decoration: none;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}
.navbar-item a:hover {
  color: #00f;
}

.navbar-item.active a {
  border-bottom: 1px solid #00f;
  color: #00f;
}
.authorization {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.authorization input {
  width: 150px;
  height: 30px;
  margin-bottom: 10px;

}
.authorization button {
  width: 150px;
  height: 30px;
  background-color: rgb(47, 0, 255);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
  border: none;

}



</style>
