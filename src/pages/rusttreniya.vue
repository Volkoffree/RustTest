<template>
    <div>
        
        <div class="wall">
            {{ this.$store.state.postsFiltred.run  }}
            <!-- добавление нового поста -->

            <div class="wall-post-add wall-item" v-on-clickaway="hidePostBotPanel">
                <!-- <form > -->
                    <div class="wall-post-add-top" @click="showPostBotPanel = true">

                        <button 
                        class="incognito" 
                        v-bind:class="{ active : newPost.infos.is_incognito}"
                        @click="showIncognito = true"
                        ></button>

                        <modal-template class="incognito-window"  v-if="showIncognito" @close="showIncognito = false" >
                            <div class="header" slot="header">
                                <p>Вы действительно хотите включить режим анонимности?</p>
                            </div>
                            <div slot="body"></div>
                            <div class="footer" slot="footer">
                                <button @click="showIncognito = false; newPost.infos.is_incognito = true">Да</button><button @click="newPost.infos.is_incognito = false;showIncognito = false">Нет</button>
                            </div>
                        </modal-template>

                        <textarea 
                        class="content-text" 
                        v-model="newPost.infos.content" 
                        placeholder="Напиши что-нибудь"
                        v-bind:class="{ active: showPostBotPanel}"
                        ></textarea>
                        
                        <label v-if="!showPostBotPanel" for="addphoto"></label>
                    </div>
                    <img
                            v-show="imageSrc && showPostBotPanel"
                            :src="imageSrc"
                            class="content-thumbnail"
                            alt="">
                    <div v-if="showPostBotPanel" class="wall-post-add-bot">
                        <emoji-template @emoji="insertNewPostContent"></emoji-template>


                        <label for="addphoto"></label>
                        <!-- <input id="addphoto" type="file" @change="sync"> -->
                        <input @change="previewThumbnail" name="thumbnail" type="file" id="addphoto">
                        
                            


                        <!-- <button class="send" @click="showPostBotPanel = false">Отправить</button> -->
                        <button class="send" @click="post">Отправить</button>

                    </div>
                <!-- </form> -->
                
            </div>

            <!-- все посты -->

            <ol class="wall-posts">

                <!-- структура поста -->

                <li class="wall-posts-post wall-item" v-for="(post, index) in posts" :key="index.id">
                    <!-- <a href="/?this.posts[index].showComments=true">123</a>
                    {{ post }} -->
                    <!-- хедер поста -->
                    <div class="wall-posts-post-owner ">
                        <img class="avatar-mini" v-if="post.infos.is_incognito" src="../images/no_image.jpg" alt="">
                        <a 
                            href="#" 
                            class="avatar-mini" 
                            v-bind:style="{ backgroundImage: 'url(' + 'https://app.rast.ltd/' + post.owner.path_to_photo + ')' }"
                            v-else-if="post.owner.path_to_photo"
                        ></a>
                        <a 
                            href="#" 
                            class="avatar-mini" 
                            v-bind:style="{ backgroundImage: 'url(' + 'https://app.rast.ltd/' + post.owner.logotype + ')' }"
                            v-else-if="post.owner.logotype"
                        ></a>
                        <img class="avatar-mini" v-else src="../images/no_image.jpg" alt="">
                        <div class="info">
                            <h3 v-if="post.infos.is_incognito">Аноним</h3>
                            <h3 v-else-if="post.owner.first_name"><a href="#">{{ post.owner.first_name + ' ' + post.owner.last_name }}</a></h3>
                            <h3 v-else><a href="#">{{ post.owner.name }}</a></h3>

                            <h4> {{ calculateData(post.infos.create_at) }}</h4>
                        </div>

                         <!-- действия с постом -->

                        <div class="settings" >
                            <button class="settings-btn" @click="post.showOption = true" v-if="!post.showOption"></button>
                            <div v-if="post.showOption" v-on-clickaway="hidePostSettings">

                                <!-- действия для автора поста -->

                                <div class="settings-menu" v-if="post.owner.user_id == user.user_info.user_id">
                                    <button @click="openEditMode (post, index)">Редактировать</button>
                                    <button @click="post.showOption = false">Копировать ссылку</button>
                                    <button @click="post.showDelete = true">Удалить</button>
                                    <modal-template 
                                    class="delete-window"
                                    v-if="post.showDelete" 
                                    @close="post.showDelete = false"

                                    >
                                            
                                        <div class="complain-header" slot="header">
                                            <p>Вы действительно хотите удалить ваш ответ?</p>
                                        </div>
                                        <div class="delete-body" slot="body">
                                            <button class="delete-btn" @click="postDelete (post, index)">да</button>
                                            <button class="delete-btn" @click="post.showDelete = false">нет</button>

                                        </div>
                                        <div class="delete-window-footer" slot="footer">
                                        </div>


                                    </modal-template>
                                    
                                </div>

                                <!-- дествия с чужим постом -->

                                <div class="settings-menu" v-else>
                                    <button @click="post.complain = true; ">Пожаловаться</button>
                                    <modal-template class="complain" v-if="post.complain" @close="post.complain = false;post.showOption = false">
                                        <div class="complain-header" slot="header">
                                            <h3>Пожаловаться</h3>
                                        </div>
                                        <div class="complain-body" slot="body">
                                            <a href="#">Подозрительная активность</a>
                                            <a href="#">Оскорбление</a>
                                            <a href="#">Призыв к суициду</a>
                                            <a href="#">Неоригинальный конент</a>
                                            <a href="#">Расслка спама</a>
                                        </div>
                                        <div class="complain-footer" slot="footer">
                                            <textarea placeholder="Свой комментарий..."></textarea>
                                        </div>
                                    </modal-template>
                                    <button @click="post.showOption = false">Копировать ссылку</button>
                                    <button @click="post.showOption = false">Быть в курсе</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- контент поста -->

                    <div class="wall-posts-post-content">
                        <p 
                            v-show="!post.editMode"
                            style="white-space: pre-line;"
                            v-if="post.infos.content" 
                            :contenteditable="post.editMode"
                            :class="{'active': post.editMode}"> {{ post.infos.content }} </p>
                        <textarea class="edit-content" v-show="post.editMode" style="resize: none" v-model="post.infos.content"></textarea>
                        <img 
                            v-bind:src="'https://app.rast.ltd/' + post.infos.image" 
                            alt=""
                            v-if="post.infos.image"
                        >
                        <div class="edit-btns">
                            <button v-show="post.editMode" v-on:click="closeEditMoede (post, index)">Отмена</button>
                            <button v-show="post.editMode" v-on:click="sendEditPost (post, index)">Сохранить</button>
                        </div>
                    </div>

                    <!-- нижняя часть поста -->

                    <div class="wall-posts-post-footer">
                        <button class="comments" @click="openComments(post)">
                            <img src="../images/comments.svg" alt="">Ответы ({{ post.comments.total }})
                        </button>

                        <!-- модальное окно комментариев -->

                        <modal-template v-if="post.showComments" @close="post.showComments = false">

                            <!-- верхняя часть окна (автор поста, менюшка настроек - хз как её ещё назвать) -->

                            <div class="comments-window-top" slot="header">
                                <div class="comments-top">
                                    <img 
                                        v-if="post.infos.in_incognito"
                                        class="comments-top-avatar" 
                                        src="../images/no_image.jpg" 
                                    >
                                    <img 
                                        v-else-if="post.owner.path_to_photo"
                                        class="comments-top-avatar" 
                                        v-bind:src="'https://app.rast.ltd/' + post.owner.path_to_photo" 
                                    >
                                    <img 
                                        class="comments-top-avatar" 
                                        v-else-if="post.owner.logotype"
                                        v-bind:src="'https://app.rast.ltd/' + post.owner.logotype" 
                                    >
                                    <img 
                                        v-else
                                        class="comments-top-avatar" 
                                        src="../images/no_image.jpg" 
                                    >
                                    <div class="comments-top-owner">
                                        <h3 v-if="post.infos.is_incognito">Аноним</h3>
                                        <h3 v-else-if="post.owner.first_name"><a href="#">{{ post.owner.first_name + ' ' + post.owner.last_name }}</a></h3>
                                        <h3 v-else-if="post.owner.name"><a href="#">{{ post.owner.name }}</a></h3>
                                        <h3 v-else><a href="">Неизвестно</a></h3>
                                        <h4> {{ calculateData(post.infos.create_at) }}</h4>
                                    </div>

                                    <!-- действия с постом -->

                                    <div class="settings" >
                                        <button class="settings-btn" @click="post.showCommentsOption = true" v-if="!post.showCommentsOption"></button>
                                        <div v-if="post.showCommentsOption" v-on-clickaway="hidePostCommentsSettings">

                                            <!-- действия для автора поста -->

                                            <div class="settings-menu" v-if="post.owner.user_id == user.user_info.user_id">
                                                <button @click="openEditMode (post, index)">Редактировать</button>
                                                <button @click="post.showCommentsOption = false">Копировать ссылку</button>
                                                <button @click="post.showDeleteSecond = true">Удалить</button>
                                                <modal-template 
                                                class="delete-window"
                                                v-if="post.showDeleteSecond" 
                                                @close="post.showDeleteSecond = false"

                                                >
                                                        
                                                    <div class="delete-header" slot="header">
                                                        <p>Вы действительно хотите удалить ваш ответ?</p>
                                                    </div>
                                                    <div class="delete-body" slot="body">
                                                        <button class="delete-btn" @click="postDelete (post, index)">да</button>
                                                        <button class="delete-btn" @click="post.showDeleteSecond = false">нет</button>

                                                    </div>
                                                    <div class="delete-window-footer" slot="footer">
                                                    </div>


                                                </modal-template>
                                    
                                            </div>

                                            <!-- дествия с чужим постом -->

                                            <div class="settings-menu" v-else>
                                                <button @click="post.complainComments = true">Пожаловаться</button>
                                                <modal-template class="complain" v-if="post.complainComments" @close="post.complainComments = false">
                                                    <div class="complain-header" slot="header">
                                                        <h3>Пожаловаться</h3>
                                                    </div>
                                                    <div class="complain-body" slot="body">
                                                        <a href="#">Подозрительная активность</a>
                                                        <a href="#">Оскорбление</a>
                                                        <a href="#">Призыв к суициду</a>
                                                        <a href="#">Неоригинальный конент</a>
                                                        <a href="#">Расслка спама</a>
                                                    </div>
                                                    <div class="complain-footer" slot="footer">
                                                        <textarea placeholder="Свой комментарий..."></textarea>
                                                    </div>
                                                </modal-template>
                                                <button @click="post.showOption = false">Копировать ссылку</button>
                                                <button @click="post.showOption = false">Быть в курсе</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="comments-content">
                                    <p 
                                        v-show="!post.editMode"
                                        style="white-space: pre-line;"
                                        v-if="post.infos.content" 
                                        :contenteditable="post.editMode"
                                        :class="{'active': post.editMode}"> {{ post.infos.content }} </p>
                                    <textarea class="edit-content" v-show="post.editMode" style="resize: none" v-model="post.infos.content"></textarea>
                                    <div class="edit-btns">
                                        <button v-show="post.editMode" v-on:click="closeEditMoede (post, index)">Отмена</button>
                                        <button v-show="post.editMode" v-on:click="sendEditPost (post, index)">Сохранить</button>
                                    </div>
                                </div>
                                <div class="comment-top-info">
                                    <div class="answers">
                                        <button class="comments">
                                            <img src="../images/comments.svg" alt="">Ответы ({{ post.comments.total }})
                                        </button>
                                    </div>
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
                            </div>

                            <div class="comments-window-mid" slot="body">
                                <ul>
                                    <li v-for="(comment, indexComment) in comments" :key="comment.id">
                                        <!-- {{ comment }} -->
                                        <div class="comment-top">
                                            <div class="comment-top-owner">
                                                <img v-bind:src="'https://app.rast.ltd/' + comment.user_info.path_to_photo" class="avatar">
                                                <div class="info">
                                                    <h3> {{ comment.user_info.first_name + comment.user_info.last_name }} </h3>
                                                    <h4> {{ calculateData(comment.info.create_at) }} </h4>
                                                </div>
                                                <span class="date"> {{ dataCreateAt(comment.info.create_at) }} </span>
                                                <button 
                                                    @click="deleteComment(post, comment, indexComment)" 
                                                    v-if="comment.user_info.user_id == user.user_info.user_id"
                                                    class="deleteComment-btn"
                                                ></button>

                                            </div>

                                        </div>
                                        <div class="comment-content">
                                            <p> {{ comment.info.content }} </p>
                                        </div>
                                        <div class="comment-bot">
                                            <button class="comment-bot-btn">ОТВЕТИТЬ</button>
                                        </div>

                                    </li>
                                </ul>
                            </div>

                            <!-- нижняя часть окна (ввод сообщения) -->

                            <div class="comments-window-bot" slot="footer">
                                <img class="avatar" v-bind:src="'https://app.rast.ltd/' + user.user_info.path_to_photo" alt="">
                                <input type="text" placeholder="Написать ответ" v-model="newComment.content">

                                <emoji-template @emoji="insertNewCommentContent"></emoji-template>
                                <button class="send-btn" @click="sendComment(post)"></button>
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
    import Emoji from '../components/Emoji'
    import ImageUploader from '../components/imageUploader'


    export default {
        data () {
            return {
                imageSrc: false,
                showPostBotPanel: false,
                showModal: false,
                showIncognito: false,
                newPost: {
                    infos: {
                        create_at: '',
                        is_incognito: false,
                        content: '',
                        images: ''
                    },
                    owner: {},
                    
                },
                newComment: {
                    content: '',
                    account_id: '',
                    rast_id: '',
                    insert (emoji) {
                        newComment.content += emoji;
                    }
                },


                
                
            }
        },
        
        mixins: [ clickaway ],
        computed: {
            posts () {
                return this.$store.state.postsFiltred
            },
            user () {
                // console.log(this.$store.state.user.info.user_info)
                return this.$store.state.user.info
            },
            comments () {
                return this.$store.state.comments
            }
            

        },
        components: {
            'modal-template': Modal,
            'emoji-template': Emoji,
            'img-uploader-template': ImageUploader
        },
        methods: {
            dataCreateAt (element) {
                let result = element.split(' ')
                return result[0]
            },
            deleteComment(post, comment, index) {
                this.resource = this.$resource('user/rastreniya/response')
                let body = {
                    "response_id" : comment.info.id, //УИДО
                    "action" : "deleteResponses",// действие (в данном случае "deleteResponses")
                    "account_id" : this.$store.state.user.account_id //УИДП
                }
                this.resource.save({}, body).then(
                    response => {
                        console.log('Success! Response: ', response.body);
                        comment.info.content = 'Ответ был удален'
                        post.comments.total--

                    },
                    response => {
                        // error callback
                    }
                )
                console.log(comment)
            },
            sendComment (post) {
                let body = {
                    "rast_id" : post.infos.id, //УИДС
                    "action" : "newResponse", // действие (в данном случае "newResponse")
                    "content" : this.newComment.content, // сообщение
                    "account_id" : this.$store.state.user.account_id // УИДП
                }
                this.resource = this.$resource('user/rastreniya/response')
                this.resource.save({}, body).then(
                    response => {
                        console.log('Success! Response: ', response.body);
                        this.newComment.content = ''
                        this.comments.push(response.body.data)
                        post.comments.total++
                    },
                    response => {
                        // error callback
                    }
                )
                console.log(post.comments.total)
            },
            openEditMode (post, index) {
                post.editMode = true
                post.showOption = false
                post.showCommentsOption = false
                post.saveContent = post.infos.content
            },
            closeEditMoede (post, index) {
                post.editMode = false
                this.posts[index].infos.content = post.saveContent


            },
            sendEditPost (post, index) {
                post.editMode = false
                let body = {
                    "rast_id": post.infos.id,
                    "content": post.infos.content,
                    "account_id" : post.infos.account_id,
                    "is_incognito" : post.infos.is_incognito,
                    "action" : "updateRast" 
                }

                this.resource = this.$resource('user/rastreniya')
                this.resource.update({}, body).then(
                    response => {
                        console.log('Success! Response: ', response.body);
                    },
                    response => {
                        // error callback
                    }
                )
            },
            impressionAction(post, action) {
                let body = {
                    "rast_id": post.infos.id,
                    "action": ''
                }

                if (action === 'like') {
                    body.action = 'likeRast';
                    if (post.infos.is_liked == true) {
                        post.likes++
                    } else {
                        post.likes--
                    };
                } else if (action === 'dislike') {
                    body.action = 'dislikeRast';
                    if (post.infos.is_disliked == true) {
                        post.dislikes++
                    } else {
                        post.dislikes--
                    };
                } else {return}
                this.resource = this.$resource('user/rastreniya/notice')
                this.resource.update({}, body).then(
                    response => {
                        console.log('Success! Response: ', response.body);
                    },
                    response => {
                        // error callback
                    }
                )

            },
            post () {
                if (this.newPost.infos.content != '' || this.newPost.infos.images) {
                    this.resource = this.$resource('user/rastreniya/new')
                   
                    let body = new FormData ()
                    body.append("content", this.newPost.infos.content)
                    body.append("account_id", this.$store.state.user.account_id)
                    body.append("is_incognito", this.newPost.infos.is_incognito)

                    if (this.newPost.infos.images) {
                        body.append("image", this.newPost.infos.images)
                    }
                    this.resource.save({}, body).then(
                        response => {
                            console.log('Success! Response: ', response.body);


                            response.body.data.showOption = false;
                            response.body.data.showCommentsOption = false;
                            response.body.data.complain = false;
                            response.body.data.complainComments = false;
                            response.body.data.showDelete = false;
                            response.body.data.showDeleteSecond = false;
                            response.body.data.showComments = false;
                            if (!response.body.data.infos.is_liked) {
                            response.body.data.infos.is_liked = false
                            }
                            if (!response.body.data.infos.is_disliked) {
                            response.body.data.infos.is_disliked = false
                            }
                            response.body.data.editMode = false
                            response.body.data.saveContent = ''
                            this.posts.unshift(response.body.data)

                            this.newPost.infos.content = ''
                            this.newPost.infos.images = ''
                            this.showPostBotPanel = false
                        },
                        response => {
                            // error callback
                        }
                    )
                }
            },


            postDelete (post, index) {
                let body = {
                    "rast_id" : post.infos.id,
                    "action" : "deleteRast",
                    "account_id" : this.$store.state.user.account_id
                }
                post.showDelete = false
                if (post.showDelete == true) {
                    post.showDelete = false
                }
                if (post.showDeleteSecond == true) {
                    post.showDeleteSecond = false
                    post.showComments = false

                }
                this.resource = this.$resource('user/rastreniya')
                this.resource.update({}, body).then(
                        response => {
                            console.log('Success! Response: ', response.body);
                            this.posts.splice(index, 1)
                        },
                        response => {
                            // error callback
                        }
                    );
                
            },
            CloseDeleteWindow (post) {

            },



            previewThumbnail: function(event) {
                event.preventDefault();
                var input = event.target;
                this.newPost.infos.images = event.target.files[0];
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    var vm = this;

                    reader.onload = function(e) {
                        vm.imageSrc = e.target.result;
                    }

                    reader.readAsDataURL(input.files[0]);
                }
            },
            insertNewPostContent (emoji) {
                // console.log(emoji)
                this.newPost.infos.content += emoji;

            },
            
            insertNewCommentContent (emoji) {
                this.newComment.content += emoji;
            },
            
            openComments (post) {
                this.getComments (post)
                post.showComments = true
            },
            getComments (post) {
                this.resource = this.$resource('user/rastreniya/response')
                let body = {
                    'rast_id' : post.infos.id,
                    'action' : 'getResponses',
                    'page' : 1 
                }
                this.$store.state.comments = []
                this.resource.save({}, body)
                .then(response => response.json())
                .then(comments => {
                    let save = JSON.parse(JSON.stringify(comments.data))
                    this.$store.state.comments = save
                    // console.log(this.$store.state.comments)
                })
                return post.infos.id
            },
            hidePostBotPanel () {
                this.showPostBotPanel = false
            },
            hidePostSettings() {
                this.posts.forEach(element => {
                    element.showOption = false
                });
                
            },
            hidePostCommentsSettings() {
                this.posts.forEach(element => {
                    element.showCommentsOption = false
                });
                
            },
            changeImpressionLike(post) {
                if (post.infos.is_disliked !=true) {
                    post.infos.is_liked = !post.infos.is_liked
                    this.impressionAction(post, 'like')
                } 
            },
            changeImpressionDislike(post) {
                if (post.infos.is_liked !=true) {
                    post.infos.is_disliked = !post.infos.is_disliked
                    this.impressionAction(post, 'dislike')
                }
            },
            calculateData (createdAt) {
                let newDate = Date.now()
                let differece = Math.round((newDate - Date.parse(createdAt)))
                differece = Math.round(differece / 1000)
                if (differece < 60) {
                    return ' меньше минуты назад'
                }
                differece = Math.round(differece / 60)
                if (differece < 60) {
                    return differece + ' минут назад'
                }
                differece = Math.round(differece / 60)

                if (differece < 60) {
                    return differece + ' часов назад'
                }
                differece = Math.round(differece / 24)

                // differece = Math.ceil(differece / 30)
                if (differece < 24) {
                    return differece + ' дней назад'
                }
                differece = Math.round(differece / 30)

                // differece = Math.ceil(differece / 24)
                if (differece < 12) {
                    return differece + ' месяц назад'
                }
                return createdAt

            }
        },
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
    padding: 5px 0 0 0 ;
    width: 90%;
    height: 30px;
    border: none;
    resize: none;
    overflow: auto;
}
.wall-post-add-top .content-text.active {
    height: 100px;
}
.content-thumbnail {
    width: 70px;
    height: 70px;
    margin: 10px;
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

.incognito-window .header {
    text-align: center;
}
.incognito-window .footer {
    display: flex;
    justify-content: space-around;
    height: 60px;
}

.incognito-window .footer button{
    width: 50%;
    border: none;
    background: none;

}
.delete-body {
    display: flex;
    justify-content: space-around;
    height: 60px;
}
.settings-menu .delete-btn{
    width: 50%;
    border: none;
    background: none;
    text-align: center;

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
    position: relative;
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
    margin-left: 10px;
}
.wall-post-add label:hover {
    cursor: pointer;
}
.wall-post-add-bot input {
    display: none;
}
.wall-post-add-bot .send {
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
.settings {
    display: block;
    position: absolute;
    top: 20px;
    right: 10px;
}
.settings-menu {
    display: flex;
    flex-direction: column;
    background: #fff;
    -webkit-box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    padding: 10px 20px;
}
.settings-menu button {
    border: none;
    background: none;
    text-align: left;
    margin-bottom: 5px;
    background: none;

}
.settings-btn {
    border: none;
    background: none;
    background-image: url(../images/settings.svg);
    background-repeat: no-repeat;
    background-position: center;

    display: block;
    width: 50px;
    height: 20px;

}
.wall-posts-post-footer .settings-btn {
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
.wall-posts-post-footer .comments {
    background: none;
    border: none;
}
.wall-posts-post-footer .impression {
    display:flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
}
.wall-posts-post-footer .impression-like, .wall-posts-post-footer .impression-dislike {
    display: block;
    width: 25px;
    height: 20px;
    background: none;
    border: none;
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
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;
    align-items: center

}
.comments-top-avatar {
    width: 60px;
    height: 60px;
    border-radius: 100px;
    margin-right: 10px;
    border: 1px solid #aeaeae;

}
.comments-top-owner a{
    color: #000;
    text-decoration: none;
}
.comment-content {
    padding: 10px 5px;
}
.comment-bot {
    padding: 5px 0 10px 10px;
}
.comment-bot-btn {
    border: none;
    background: none;
}

.complain-header {
    text-align: center;
}
.complain-body {
    display: flex;
    flex-direction: column;
    padding: 0 5px;

}
.complain-body a {
    color: #000;
    text-decoration: none;
    margin-bottom: 10px;

}
.complain-footer {

}
.complain-footer textarea {
    resize: none;
    width: 100%;
    height: 80px;
    padding: 10px;
}
.comments-window-top {

}
.comments-window-mid ul {

}
.comments-window-mid ul li {
    list-style: none;
    padding: 10px 20px 5px 10px;
    -webkit-box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    margin-bottom: 10px;

}
.comments-window-bot {
    display: flex;
    -webkit-box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    align-items: center;
    padding: 5px;

}
.comments-window-bot .avatar {
    width: 30px;
    height: 30px;
    border-radius: 100px;
    margin-right: 10px;
    border: 1px solid #aeaeae;

}
.comments-window-bot input {
    resize: none;
    width: 100%;
    border: none;
    padding: 5px;
}

.deleteComment-btn {
    position: absolute;
    right: 0;
    top: 10px;
    width: 15px;
    height: 15px;
    display: block;
    border: none;
    background: url(../images/cancel.svg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}










.comment-top {
    /* display: flex; */
    position: relative;

}
.comment-top-info {
    display: flex;
    justify-content: space-between;
    margin-top:15px;
    padding-top: 10px;
    border-top: 1px solid rgba(70, 70, 70, 0.1);

}
.comment-top-owner {
    display: flex;
    align-items: center;

}
.comment-top-owner .avatar {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}
.comment-top-owner .date {
    position: absolute;
    right: 30px;
    top: 10px;
}













.send-btn {
    border: none;
    background:none;
    width: 25px;
    height: 25px;
    margin-top: 2px;
    margin-left: 10px;
    margin-right: 5px;
    background-image: url(../images/sendArrow.svg);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;

}
.edit-content {
    width: 100%;
    height: 60px;
    margin-bottom: 5px;
}
.edit-btns {
    display: flex;
    justify-content: flex-end;

}
.edit-btns button {
    border: none;
    background: none;
    margin: 0 0 0 10px;
}
</style>