<template>
    <div>
        <div class="wall">
            <div class="wall-post-add wall-item" v-on-clickaway="hidePostBotPanel">
                <!-- <form > -->
                    <div class="wall-post-add-top" @click="showPostBotPanel = true">
                        <button 
                        class="incognito" 
                        v-bind:class="{ active : newPost.infos.is_incognito}"
                        @click="newPost.infos.is_incognito = !newPost.infos.is_incognito"
                        ></button>
                        <div contenteditable="true" class="content-text">Напиши что-нибудь</div>
                        <label v-if="!showPostBotPanel" for="addphoto"></label>
                    </div>
                    <div v-if="showPostBotPanel" class="wall-post-add-bot">
                        <label for="addphoto"></label>
                        <input id="addphoto" type="file">
                        <button @click="showPostBotPanel = false">Отправить</button>
                    </div>
                <!-- </form> -->
                
            </div>
            <ol class="wall-posts">
                <li class="wall-posts-post wall-item" v-for="post in posts" :key="post.id">
                    <div class="wall-posts-post-owner ">
                        <a 
                            href="#" 
                            class="avatar-mini" 
                            v-bind:style="{ backgroundImage: 'url(' + 'https://app.rast.ltd/' + post.owner.path_to_photo + ')' }"
                        ></a>
                        <div class="info">
                            <h3><a href="#">{{ post.owner.first_name + ' ' + post.owner.last_name }}</a></h3>
                            <h4> {{ calculateData(post.infos.create_at) }}</h4>
                        </div>
                        <div class="settings" >
                            <button class="settings-btn" @click="post.showOption = true" v-if="!post.showOption"></button>
                            <div v-if="post.showOption" v-on-clickaway="hidePostSettings">

                                <div class="settings-menu" v-if="post.owner.user_id == user.user_info.user_id">
                                    <button>Редактировать</button>
                                    <button>Копировать ссылку</button>
                                    <button>Удалить</button>
                                    
                                </div>
                                <div class="settings-menu" v-else>
                                    <button>Пожаловаться</button>
                                    <button>Копировать ссылку</button>
                                    <button>Быть в курсе</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="wall-posts-post-content">
                           
                    <p v-if="post.infos.content">{{ post.infos.content }}</p>
                    <img 
                        v-bind:src="'https://app.rast.ltd/' + post.infos.image" 
                        alt=""
                        v-if="post.infos.image"
                    >
                    </div>
                    <div class="wall-posts-post-footer">
                        <button class="comments" @click="post.showComments = true">
                            <img src="../images/comments.svg" alt="">Ответы ({{ post.comments.total }})
                        </button>
                        <button class="comments-btn"></button>
                        <modal-template v-if="post.showComments" @close="post.showComments = false">
                            <div slot="header">
                                {{ post }}
                                <div class="comments-top">
                                    <img 
                                        class="comments-top-avatar" 
                                        v-bind:src="'https://app.rast.ltd/' + post.owner.path_to_photo" 
                                        alt="avatarpic"
                                    >
                                    <div class="comments-top-owner">
                                        <h3> {{post.owner.first_name + post.owner.last_name}}</h3>
                                    </div>
                                </div>
                                <div class="comments-content"><p>{{post.infos.content}}</p></div>
                            </div>
                            
                        </modal-template>
                        <div class="impression">
                            <button 
                                class="impression-dislike" 
                                :class="{'active': post.infos.is_disliked}" 
                                @click="changeImpressionDislike(post)"
                            >
                            </button>
                            <span>{{ post.dislikes }}</span>
                            <button 
                                class="impression-like" 
                                :class="{'active': post.infos.is_liked}" 
                                @click="changeImpressionLike(post)"
                            >
                            </button>
                            <span>{{ post.likes }}</span>
                        </div>
                    </div>
                    <!-- <p> {{ post }}  </p> -->
                </li>
            </ol>
            
        </div>
    </div>
</template>
<script>
    import { mixin as clickaway  } from 'vue-clickaway'
    import Modal from '../components/modalwindow.vue'


    export default {
        data () {
            return {
                showPostBotPanel: false,
                showModal: false,
                newPost: {
                    infos: {
                        create_at: '',
                        is_incognito: false
                    },
                    owner: {}
                }
            }
        },
        
        mixins: [ clickaway ],
        computed: {
            posts () {
                return this.$store.state.posts
            },
            user () {
                console.log(this.$store.state.user.info.user_info)
                return this.$store.state.user.info
            }
        },
        components: {
            'modal-template': Modal
        },
        methods: {
            hidePostBotPanel () {
                this.showPostBotPanel = false
            },
            hidePostSettings() {
                this.posts.forEach(element => {
                    element.showOption = false
                });
                
            },
            changeImpressionLike(post) {
                if (post.infos.is_disliked !=true) {
                    post.infos.is_liked = !post.infos.is_liked
                } 
            },
            changeImpressionDislike(post) {
                if (post.infos.is_liked !=true) {
                    post.infos.is_disliked = !post.infos.is_disliked
                }
            },
            calculateData (createdAt) {
                let newDate = Date.now()
                createdAt = Date.parse(createdAt)
                let differece = Math.floor((newDate - createdAt) / 1000)
                if (differece < 60) {
                    return ' меньше минуты назад'
                }
                differece = Math.floor(differece / 60)
                if (differece < 60) {
                    return differece + ' минут назад'
                }
                differece = Math.floor(differece / 24)
                if (differece < 24) {
                    return differece + ' часов назад'
                }
                differece = Math.floor(differece / 60)
                if (differece < 30) {
                    return differece + ' дней назад'
                }
                differece = Math.floor(differece / 24)
                if (differece < 12) {
                    return differece + ' месяц назад'
                }


            }
        }
    }
</script>

<style scoped>
.wall {
  padding-top: 1vw;
  width: 100%;
  padding-bottom: 1vw;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
}
.wall-posts {
    padding: 0;
}
.wall-item {
  -webkit-box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
          box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  margin-bottom: 1vw;
  min-height: 20px;
  list-style: none;
}
.wall-post-add-top {
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: top;
    position: relative;
    z-index: 9;

}
.wall-post-add-top label {
    position: absolute;
    right:10px;
    top:15px;
    z-index: 10;
}
.wall-post-add-top .content-text {
    margin-left: 10px;
    padding-top: 5px;
    width: 90%;
    min-height: 15px;
}
.wall-post-add-top .content-text:focus {
    outline: none;
    border: none;
}
.wall-post-add-top .incognito {
    background: url(../images/incognitofalse.svg);
    
    width: 30px;
    height: 30px;

    border: none;

}
.wall-post-add-top .incognito:focus {
    border:none;
    outline: none;
}
.wall-post-add-top .incognito:hover {
    cursor: pointer;
}
.wall-post-add-top .incognito.active {
    background: url(../images/incognitotrue.svg);
}

.wall-post-add-bot {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid rgba(70, 70, 70, 0.1);
}
.wall-post-add label {
    display: block;
    width: 28px;
    height: 20px;
    background-image: url(../images/photo.svg);
    background-size: cover;
    background-repeat: no-repeat;
    margin-right: 10px;
}
.wall-post-add label:hover {
    cursor: pointer;
}
.wall-post-add-bot input {
    display: none;
}
.wall-post-add-bot button {
    background: none;
    color: blue;
    border: none;
}
.wall-post-add-bot button:hover {
    cursor: pointer;
}

.wall-posts-post {
    width: 100%;
}
.wall-posts-post-owner {
    display: flex;
    padding: 1vw;
    position: relative;
}
.wall-posts-post-owner .settings {
    display: block;
    position: absolute;
    top: 20px;
    right: 10px;
}
.wall-posts-post-owner .settings-menu {
    display: flex;
    flex-direction: column;
    background: #fff;
    -webkit-box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    padding: 10px 20px;
}
.wall-posts-post-owner .settings-menu button {
    border: none;
    background: none;
    text-align: left;
    margin-bottom: 5px;
}
.wall-posts-post-owner .settings-btn {
    background: none;
    border: none;
    background-image: url(../images/settings.svg);
    background-repeat: no-repeat;
    background-position: center;

    display: block;
    width: 50px;
    height: 20px;

}
.wall-posts-post-owner .avatar-mini {
    display: inline-block;
    width: 60px;
    height: 60px;
    background-position: center;
    background-size: cover;
    border: 1px solid #aeaeae;
    border-radius: 1000px;
}
.wall-posts-post-owner .info {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    padding-top: 10px;
}
.wall-posts-post-owner .info h3 a {
    color: #000;
    text-decoration: none;
}
.wall-posts-post-content {
    width: 100%;
    max-height:600px;
    padding: 1vw;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.wall-posts-post-content img {
    display: block;
    width: 50%;


    margin: 10px 0;
}

.wall-posts-post-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 1vw;
    padding: 1vw;
    border-top: 1px solid rgba(70, 70, 70, 0.1);
}
.wall-posts-post-footer button {
    background: none;
    border: none;
}
.wall-posts-post-footer .impression {
    display:flex;
    flex-wrap: nowrap;
    justify-content: space-between;
}
.wall-posts-post-footer .impression-like, .wall-posts-post-footer .impression-dislike {
    display: block;
    width: 25px;
    height: 20px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;

    margin: 0 10px;
}
.wall-posts-post-footer .impression-like {
    background-image: url(../images/like.svg)
}
.wall-posts-post-footer .impression-like.active {
    background-image: url(../images/likeColor.svg)
}
.wall-posts-post-footer .impression-dislike {
    background-image: url(../images/dislike.svg)
}
.wall-posts-post-footer .impression-dislike.active {
    background-image: url(../images/dislikeColor.svg)
}
.comments {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 110px;

}
.comments img {
    width: 30px;
    height: 30px;
}
.comments-top {
    display: flex;
}
.comments-top-avatar {
    width: 50px;
    height: 50px;
    border-radius: 100px;

}
</style>