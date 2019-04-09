<template>
    <div id="user">
        <div class="container user">
            <div class="user-avatar">
              <img v-bind:src="'https://app.rast.ltd/' + user.user_info.path_to_photo" alt="avatarpic">
            </div>
            <div class="user-info">
              <h2 class="user-info-name">{{ user.user_info.first_name + ' ' + user.user_info.last_name }}</h2>
              <p class="user-info-status">{{ user.user_info.status }}</p>
              <div class="user-info-statistic">
                <div class="user-info-statistic_item" id="user-posts"> 
                  <span>{{ user.countNews }}</span>
                  <p>Публикации</p>
                </div>
                <div class="user-info-statistic_item" id="user-subscribers">
                  <span>{{ user.countSubscribers }}</span>
                  <p>Подписчики</p>
                </div>
                <div class="user-info-statistic_item" id="user-subscriptions">
                  <span>{{ user.countSubscriptions }}</span>
                  <p>Подписки</p>
                </div>
              </div>
            </div>
        </div>
    </div>



</template>
<script>

import UserAvatar from './user-avatar.vue'

export default {
    computed: {
            user () {
                console.log(this.$store.state.user.info.user_info)
                return this.$store.state.user.info
            }
        }
}
</script>
<style>
.user-avatar {
  width: 23vw;
  position: relative;
}
.user-avatar img {
  width: 90%;
  max-width: 250px;
  position: absolute;
  top: -9vw;
  left: 0;
  border: 1vw solid #fff;
  border-radius: 100vw;
}
.user-info {
  width: 76vw;
  padding-left: 4vw;
}
.user-info-name {
  font-weight: 300;
}
.user-info-status {
  font-size: 14px;
}
.user-info-statistic {
  margin-top: 2vw;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: distribute;
      justify-content: space-around;
}
.user-info-statistic_item {
  text-align: center;
  font-size: 20px;
}
.user-info-statistic_item:hover {
  cursor: pointer;
}
.user-info-statistic_item span {
  font-size: 30px;
}
</style>