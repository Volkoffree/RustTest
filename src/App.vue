<template>
  <div class="app">
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
</template>

<script>
import Wall from './components/wall.vue'
import Smiles from './components/smiles.vue'
import User from './components/user'
import { mixin as clickaway  } from 'vue-clickaway';

export default {
  data () {
    return {
      filters: {
        allposts: {
          header: 'Вся лента',
          active: true
        },
        myposts: {
          header: 'Мои посты',
          active: false
        },
        interesting: {
          header: 'Интересующие',
          active: false
        },
      },
      displayFiltres: false,
      user: {
        token: 'hello'
      }
    }
  },
  mixins: [ clickaway ],
  methods: {
    findActiveFilter() {
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
.app {
  padding: 12vw 5vw;
  background-color: #97d6b7;
  /* height: 100vh; */
}
.container {
  padding: 2vw 5vw;
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
</style>
